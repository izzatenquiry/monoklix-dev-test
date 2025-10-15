import { supabase } from './supabaseClient';
import { type HistoryItem } from '../types';

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                // result is "data:mime/type;base64,the_base_64_string"
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            } else {
                reject(new Error("Failed to read blob as a base64 string."));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export type WebhookPayload = {
    type: 'text' | 'image' | 'video' | 'audio';
    prompt: string;
    result: string; // Base64 for media, text for text
    mimeType?: string;
    timestamp: number;
    userId: string;
};

export type SocialPostWebhookPayload = {
    type: 'social_post';
    caption: string;
    hashtags: string;
    cta: string;
    link: string;
    schedule_date: string; // ISO 8601 format
    media: {
        type: 'image' | 'video';
        data: string; // Base64
        mimeType: string;
        fileName: string;
    }[];
    timestamp: number;
    userId: string;
};

const getCurrentUserFromSession = (): { id: string } | null => {
    try {
        const savedUserJson = localStorage.getItem('currentUser');
        if (savedUserJson) {
            const user = JSON.parse(savedUserJson);
            if (user && user.id) {
                return user;
            }
        }
    } catch (error) {
        console.error("Failed to parse user from localStorage for webhook.", error);
    }
    return null;
}

export const triggerUserWebhook = async (
    data: Omit<WebhookPayload, 'timestamp' | 'userId' | 'result' | 'mimeType'> & { result: string | Blob, mimeType?: string }
) => {
    const user = getCurrentUserFromSession();
    if (!user?.id) {
        console.error("User not authenticated, cannot trigger webhook.");
        return;
    }
    
    const { data: profile, error } = await supabase
        .from('users')
        .select('webhook_url')
        .eq('id', user.id)
        .single();
    
    // FIX: `profile` is now correctly typed, so `profile.webhook_url` is accessible.
    if (error || !profile || !profile.webhook_url) {
        // No webhook configured, fail silently
        return;
    }

    // FIX: `profile.webhook_url` is accessible due to correct typing.
    const webhookUrl = profile.webhook_url;
    let resultData: string;
    let finalMimeType: string | undefined = data.mimeType;

    if (data.result instanceof Blob) {
        resultData = await blobToBase64(data.result);
        finalMimeType = data.result.type;
    } else {
        resultData = data.result;
        if (data.type === 'text' && !finalMimeType) finalMimeType = 'text/plain';
    }

    const payload: WebhookPayload = {
        type: data.type,
        prompt: data.prompt,
        result: resultData,
        mimeType: finalMimeType,
        timestamp: Date.now(),
        userId: user.id,
    };

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            // FIX: Add 'no-cors' to prevent CORS errors on cross-origin webhook calls.
            mode: 'no-cors' 
        });
    } catch (e) {
        console.error('Failed to trigger user webhook:', e);
    }
};

export const sendSocialPostToWebhook = async (
    caption: string,
    hashtags: string,
    cta: string,
    link: string,
    scheduleDate: string,
    mediaItems: HistoryItem[]
): Promise<{ success: boolean; message: string }> => {
    const user = getCurrentUserFromSession();
    if (!user?.id) {
        return { success: false, message: "User not authenticated." };
    }

    const { data: profile, error } = await supabase
        .from('users')
        .select('webhook_url')
        .eq('id', user.id)
        .single();

    if (error || !profile || !profile.webhook_url) {
        return { success: false, message: "No webhook URL is configured. Please set it in Settings." };
    }
    const webhookUrl = profile.webhook_url;

    const mediaPayload = await Promise.all(mediaItems.map(async (item) => {
        let data: string;
        let mimeType: string;
        let type: 'image' | 'video' = 'image';
        let fileName: string;

        // Handle data and mimeType first
        if (item.result instanceof Blob) {
            data = await blobToBase64(item.result);
            mimeType = item.result.type;
        } else {
            data = item.result as string;
            mimeType = 'image/png';
        }

        // Determine type and fileName
        if (item.type === 'Video') {
            type = 'video';
            // If it was a manual upload, use the original filename from the prompt
            if (item.id.startsWith('manual-')) {
                fileName = item.prompt;
            } else {
                fileName = `video_${item.id}.mp4`;
            }
        } else { // Image or Canvas
            type = 'image';
            // If it was a manual upload, use the original filename from the prompt
            if (item.id.startsWith('manual-')) {
                fileName = item.prompt;
            } else {
                fileName = `image_${item.id}.png`;
            }
        }
        
        return { type, data, mimeType, fileName };
    }));

    const payload: SocialPostWebhookPayload = {
        type: 'social_post',
        caption: caption,
        hashtags: hashtags,
        cta: cta,
        link: link,
        schedule_date: scheduleDate ? new Date(scheduleDate).toISOString() : '',
        media: mediaPayload,
        timestamp: Date.now(),
        userId: user.id,
    };

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            // FIX: Add 'no-cors' to prevent CORS errors on cross-origin webhook calls.
            mode: 'no-cors' 
        });
        // With 'no-cors', we can't check the response status. We assume success if the request doesn't throw.
        return { success: true, message: "Post data sent to webhook successfully." };
    } catch (e) {
        console.error("Failed to send social post to webhook:", e);
        return { success: false, message: "Could not send request to webhook URL. Check console for details." };
    }
};

export const sendTestUserWebhook = async (): Promise<{ success: boolean; message: string }> => {
    const user = getCurrentUserFromSession();
    if (!user?.id) {
        return { success: false, message: "You are not logged in." };
    }

    const { data: profile, error } = await supabase
        .from('users')
        .select('webhook_url')
        .eq('id', user.id)
        .single();
    
    // FIX: `profile` is now correctly typed, so `profile.webhook_url` is accessible.
    if (error || !profile || !profile.webhook_url) {
        return { success: false, message: "No webhook URL is saved for your account." };
    }

    // FIX: `profile.webhook_url` is accessible due to correct typing.
    const webhookUrl = profile.webhook_url;
    const testPayload = {
        type: 'test',
        message: 'This is a test message from MONOKlix.com',
        timestamp: Date.now(),
        userId: user.id,
    };

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testPayload),
            // FIX: Add 'no-cors' to prevent CORS errors on cross-origin webhook calls.
            mode: 'no-cors' 
        });
        
        // FIX: With 'no-cors', the response is opaque, so we can't check its status.
        // We assume the request was sent successfully if no error was thrown.
        return { success: true, message: `Test payload sent. Please check your webhook service to confirm receipt. (Note: Due to browser security, we cannot confirm the server's response).` };
        
    } catch (e) {
        console.error("Webhook test failed:", e);
        return { success: false, message: 'Test failed. Could not send request. Check console for details.' };
    }
};