import { GoogleGenAI, Chat, GenerateContentResponse, Modality, PersonGeneration } from "@google/genai";
import { addLogEntry } from './aiLogService';
import { triggerUserWebhook } from './webhookService';
import { MODELS } from './aiConfig';
import { handleApiError } from "./errorHandler";
import { generateVideoWithVeo3, checkVideoStatus, uploadImageForVeo3 } from './veo3Service';


// This will hold the key for the current user session. It is set by App.tsx.
let activeTextApiKey: string | null = null;

/**
 * A centralized helper to get the appropriate API key or token for any AI service.
 * It prioritizes the user's Gemini API key and falls back to the Veo Auth Token if the primary key is not set.
 * @returns {string | null} The key/token to use, or null if neither is available.
 */
const getApiKeyForService = (): string | null => {
    let keyToUse = activeTextApiKey;
    if (!keyToUse) {
        console.warn("Gemini API key not found. Attempting to fall back to Veo Auth Token for all services.");
        keyToUse = sessionStorage.getItem('veoAuthToken');
    }
    return keyToUse;
};

// Smart proxy URL that works for both production and local development
const getProxyBaseUrl = (): string => {
  const isProduction = window.location.hostname !== 'localhost' && 
                       window.location.hostname !== '127.0.0.1';

  if (isProduction) {
    // Production proxy server
    return 'https://s2.monoklix.com';
  } else {
    // Local development proxy server
    return 'http://localhost:3001';
  }
};

/**
 * Sets the active API keys for the current session.
 * @param {object} keys - An object containing the textKey.
 */
export const setActiveApiKeys = (keys: { textKey: string | null }): void => {
    activeTextApiKey = keys.textKey;
};

const getAiInstance = () => {
    const keyToUse = getApiKeyForService();

    if (!keyToUse) {
        // If both are missing, throw the error.
        throw new Error(`API Key or Auth Token is not set. Please configure your key in Settings.`);
    }

    return new GoogleGenAI({ apiKey: keyToUse });
};

export interface MultimodalContent {
    base64: string;
    mimeType: string;
}

/**
 * Creates a new chat session with a given system instruction.
 * @param {string} systemInstruction - The system instruction for the chat model.
 * @returns {Chat} A new chat instance.
 */
export const createChatSession = (systemInstruction: string): Chat => {
  const ai = getAiInstance();
  return ai.chats.create({
    model: MODELS.text,
    config: {
      systemInstruction: systemInstruction,
      thinkingConfig: { thinkingBudget: 0 },
    },
  });
};

/**
 * Sends a message in a chat session and returns the streaming response.
 * @param {Chat} chat - The chat instance.
 * @param {string} prompt - The user's prompt.
 * @returns {Promise<AsyncGenerator<GenerateContentResponse>>} The streaming response from the model.
 */
export const streamChatResponse = async (chat: Chat, prompt: string) => {
    try {
        const stream = await chat.sendMessageStream({ message: prompt });
        // Note: Logging for streaming is complex. We'll log the initial prompt.
        // A more advanced implementation could aggregate chunks, but for now this is sufficient.
        addLogEntry({
            model: `${MODELS.text} (stream)`,
            prompt,
            output: 'Streaming response started...',
            tokenCount: 0, // Token count is not available until the end of the stream
            status: 'Success'
        });
        return stream;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        addLogEntry({
            model: `${MODELS.text} (stream)`,
            prompt,
            output: `Error: ${errorMessage}`,
            tokenCount: 0,
            status: 'Error',
            error: errorMessage
        });
        handleApiError(error);
        throw error;
    }
};

/**
 * Generates images based on a text prompt.
 * @param {string} prompt - The text prompt for image generation.
 * @param {string} aspectRatio - The desired aspect ratio.
 * @param {number} numberOfImages - The number of images to generate.
 * @param {string} [negativePrompt] - A prompt of what not to include.
 * @param {boolean} [highDynamicRange] - Whether to generate in HDR.
 * @returns {Promise<string[]>} An array of base64 encoded image strings.
 */
export const generateImages = async (
    prompt: string, 
    aspectRatio: string, 
    numberOfImages: number,
    negativePrompt?: string,
    highDynamicRange?: boolean
): Promise<string[]> => {
    const model = MODELS.imageGeneration;
    try {
        const ai = getAiInstance();
        const response = await ai.models.generateImages({
            model,
            prompt,
            config: {
            numberOfImages,
            aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
            outputMimeType: 'image/png',
            ...(negativePrompt && { negativePrompt }),
            ...(highDynamicRange !== undefined && { highDynamicRange }),
            },
        });
        addLogEntry({
            model,
            prompt,
            output: `${response.generatedImages.length} image(s) generated.`,
            tokenCount: 0, // Not provided by this API endpoint
            status: 'Success',
            mediaOutput: response.generatedImages.length > 0 ? response.generatedImages[0].image.imageBytes : undefined
        });

        const images = response.generatedImages.map(img => img.image.imageBytes);
        images.forEach(imgBase64 => {
            triggerUserWebhook({ type: 'image', prompt, result: imgBase64, mimeType: 'image/png' });
        });
        return images;

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        addLogEntry({ model, prompt, output: `Error: ${errorMessage}`, tokenCount: 0, status: 'Error', error: errorMessage });
        handleApiError(error);
        throw error;
    }
};

/**
 * Generates a video from a text prompt and an optional image using either the Veo3 service or the standard Gemini SDK.
 * @param {string} prompt - The text prompt for video generation.
 * @param {string} model - The video generation model to use.
 * @param {string} aspectRatio - The desired aspect ratio.
 * @param {string} resolution - The resolution (used by Veo3).
 * @param {string} negativePrompt - A negative prompt.
 * @param {{ imageBytes: string; mimeType: string }} [image] - Optional image data.
 * @param {string} authToken - The Bearer token for Veo3 API authentication.
 * @returns {Promise<File>} The file object of the generated video, which includes the filename.
 */
export const generateVideo = async (
    prompt: string,
    model: string,
    aspectRatio: string,
    resolution: string,
    negativePrompt: string, // Not directly used by Veo 2.0 SDK call
    image: { imageBytes: string, mimeType: string } | undefined,
    authToken: string
): Promise<File> => {

    if (model.includes('veo-3.0')) {
        // --- VEO 3.0 LOGIC (via proxy) ---
        if (!authToken) {
            throw new Error("Veo Auth Token is required for Veo 3.0 models. Please set it using the Key icon in the header.");
        }

        try {
            const veo3AspectRatio = (ar: string): 'landscape' | 'portrait' => {
                if (ar === '9:16' || ar === '3:4') return 'portrait';
                return 'landscape';
            };
            const aspectRatioForVeo3 = veo3AspectRatio(aspectRatio);

            let imageMediaId: string | undefined = undefined;
            if (image) {
                addLogEntry({ model, prompt: "Uploading reference image...", output: "In progress...", tokenCount: 0, status: "Success" });
                imageMediaId = await uploadImageForVeo3(image.imageBytes, image.mimeType, aspectRatioForVeo3, authToken);
            }

            const useStandardModel = !model.includes('fast');
            
            addLogEntry({ model, prompt, output: "Starting video generation via proxy...", tokenCount: 0, status: "Success" });
            const initialOperations = await generateVideoWithVeo3({
                prompt,
                imageMediaId,
                config: { authToken, aspectRatio: aspectRatioForVeo3, useStandardModel },
            });

            if (!initialOperations || initialOperations.length === 0) {
                throw new Error("Video generation failed to start. The API did not return any operations.");
            }

            let finalOperations: any[] = initialOperations;
            let finalUrl: string | null = null;
            const POLL_INTERVAL = 10000;

            // Poll until a URL is found or an error occurs. No fixed timeout, relies on user cancellation.
            while (!finalUrl) {
                await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
                addLogEntry({ model, prompt, output: `Checking video status...`, tokenCount: 0, status: "Success" });

                const statusResponse = await checkVideoStatus(finalOperations, authToken);
                if (!statusResponse?.operations || statusResponse.operations.length === 0) {
                    console.warn('⚠️ Empty status response, retrying...');
                    continue;
                }

                finalOperations = statusResponse.operations;
                const opStatus = finalOperations[0];
                
                const isCompleted = opStatus.done === true || ['MEDIA_GENERATION_STATUS_COMPLETED', 'MEDIA_GENERATION_STATUS_SUCCESS', 'MEDIA_GENERATION_STATUS_SUCCESSFUL'].includes(opStatus.status);

                if (isCompleted) {
                    finalUrl = opStatus.operation?.metadata?.video?.fifeUrl
                               || opStatus.metadata?.video?.fifeUrl
                               || opStatus.result?.generatedVideo?.[0]?.fifeUrl
                               || opStatus.result?.generatedVideos?.[0]?.fifeUrl
                               || opStatus.video?.fifeUrl
                               || opStatus.fifeUrl;
                    
                    console.log('🎯 Video URL extracted:', finalUrl);
                    
                    if (!finalUrl) {
                        console.error('Operation finished but no video URL was returned. Full operation object:', JSON.stringify(opStatus, null, 2));
                        throw new Error("Video generation finished without an error, but no output was produced. This may happen if your request was blocked by safety policies. Please try modifying your prompt or using a different image.");
                    }
                } else if (opStatus.error) {
                    throw new Error(`Video generation failed: ${opStatus.error.message || opStatus.error.code || 'Unknown error'}`);
                } else if (opStatus.status === 'MEDIA_GENERATION_STATUS_FAILED') {
                    console.error('❌ Video generation failed with status FAILED. Full operation object:', JSON.stringify(opStatus, null, 2));
                    throw new Error("Video generation failed on the server. This often happens if your request was blocked by safety policies. Please try modifying your prompt or using a different image.");
                }
            }

            addLogEntry({ model, prompt, output: "Downloading generated video...", tokenCount: 0, status: "Success" });
            const proxyDownloadUrl = `${getProxyBaseUrl()}/api/veo/download-video?url=${encodeURIComponent(finalUrl)}`;
            const response = await fetch(proxyDownloadUrl);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Video download failed (HTTP ${response.status}): ${errorText}. The URL may have expired or the proxy server is not running.`);
            }

            let filename = `monoklix-veo3-video-${Date.now()}.mp4`;
            const disposition = response.headers.get('Content-Disposition');
            if (disposition) {
                const match = disposition.match(/filename="?([^"]+)"?/);
                if (match && match[1]) {
                    filename = match[1];
                }
            }

            const blob = await response.blob();
            const videoFile = new File([blob], filename, { type: 'video/mp4' });

            addLogEntry({ model, prompt, output: '1 video generated successfully.', tokenCount: 0, status: 'Success', mediaOutput: videoFile });
            triggerUserWebhook({ type: 'video', prompt, result: videoFile });
            return videoFile;

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            addLogEntry({ model, prompt, output: `Error: ${errorMessage}`, tokenCount: 0, status: 'Error', error: errorMessage });
            handleApiError(error);
            throw error;
        }
    } else {
        // --- VEO 2.0 LOGIC (and other future non-proxy models) ---
        try {
            const ai = getAiInstance(); // Uses fallback logic
            const keyUsed = getApiKeyForService();
            if (!keyUsed) { throw new Error("API Key or Auth Token is not set for video generation."); }

            addLogEntry({ model, prompt, output: "Starting video generation...", tokenCount: 0, status: "Success" });
            
            const imagePayload = image ? { imageBytes: image.imageBytes, mimeType: image.mimeType } : undefined;

            let operation = await ai.models.generateVideos({
                model,
                prompt,
                image: imagePayload,
                config: { numberOfVideos: 1 }
            });

            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                addLogEntry({ model, prompt, output: `Checking video status...`, tokenCount: 0, status: "Success" });
                operation = await ai.operations.getVideosOperation({ operation });
            }

            if ((operation as any).error) {
                const opError = (operation as any).error;
                throw new Error(opError.message || 'Video generation failed in operation.');
            }
            
            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (!downloadLink) {
                 throw new Error("Video generation finished without an error, but no output was produced. This may happen if your request was blocked by safety policies. Please try modifying your prompt or using a different image.");
            }

            addLogEntry({ model, prompt, output: "Downloading generated video...", tokenCount: 0, status: "Success" });
            
            const response = await fetch(`${downloadLink}&key=${keyUsed}`);

            if (!response.ok) {
                 throw new Error(`Video download failed with HTTP status: ${response.status}.`);
            }
            const blob = await response.blob();
            const filename = `monoklix-veo2-video-${Date.now()}.mp4`;
            const videoFile = new File([blob], filename, { type: 'video/mp4' });

            addLogEntry({ model, prompt, output: '1 video generated successfully.', tokenCount: 0, status: 'Success', mediaOutput: videoFile });
            triggerUserWebhook({ type: 'video', prompt, result: videoFile });
            return videoFile;
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            addLogEntry({ model, prompt, output: `Error: ${errorMessage}`, tokenCount: 0, status: 'Error', error: errorMessage });
            handleApiError(error);
            throw error;
        }
    }
};


/**
 * Generates text content from a prompt and one or more images.
 * @param {string} prompt - The text prompt.
 * @param {MultimodalContent[]} images - An array of image objects.
 * @returns {Promise<string>} The text response from the model.
 */
export const generateMultimodalContent = async (prompt: string, images: MultimodalContent[]): Promise<string> => {
    const model = MODELS.text;
    try {
        const ai = getAiInstance();
        const textPart = { text: prompt };
        const imageParts = images.map(image => ({
            inlineData: {
                mimeType: image.mimeType,
                data: image.base64,
            },
        }));

        const response = await ai.models.generateContent({
            model,
            contents: { parts: [...imageParts, textPart] },
            config: {
                thinkingConfig: { thinkingBudget: 0 },
            }
        });
        
        const textOutput = response.text ?? '';

        addLogEntry({
            model,
            prompt: `${prompt} [${images.length} image(s)]`,
            output: textOutput,
            tokenCount: response.usageMetadata?.totalTokenCount ?? 0,
            status: 'Success'
        });
        triggerUserWebhook({ type: 'text', prompt, result: textOutput });
        return textOutput;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        addLogEntry({ model, prompt: `${prompt} [${images.length} image(s)]`, output: `Error: ${errorMessage}`, tokenCount: 0, status: 'Error', error: errorMessage });
        handleApiError(error);
        throw error;
    }
};

/**
 * Edits or composes an image based on a text prompt and one or more source images.
 * @param {string} prompt - The editing instruction.
 * @param {MultimodalContent[]} images - The base64 encoded images to use.
 * @returns {Promise<{text?: string, imageBase64?: string}>} An object containing the text response and/or the edited image.
 */
export const composeImage = async (prompt: string, images: MultimodalContent[]): Promise<{text?: string, imageBase64?: string}> => {
    const model = MODELS.imageEdit;
    const webhookPrompt = `${prompt} [${images.length} image(s)]`;
    try {
        const ai = getAiInstance();
        const textPart = { text: prompt };
        const imageParts = images.map(image => ({
            inlineData: {
                data: image.base64,
                mimeType: image.mimeType,
            },
        }));

        const response = await ai.models.generateContent({
            model,
            contents: {
                parts: [...imageParts, textPart ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const result: { text?: string; imageBase64?: string } = {};

        if (response.candidates && response.candidates.length > 0 && response.candidates[0].content && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.text) {
                    result.text = part.text;
                } else if (part.inlineData) {
                    result.imageBase64 = part.inlineData.data;
                }
            }
        }
        
        addLogEntry({
            model,
            prompt: webhookPrompt,
            output: result.imageBase64 ? '1 image generated.' : (result.text || 'No output.'),
            tokenCount: response.usageMetadata?.totalTokenCount ?? 0,
            status: 'Success',
            mediaOutput: result.imageBase64
        });

        if (result.imageBase64) {
            triggerUserWebhook({ type: 'image', prompt: webhookPrompt, result: result.imageBase64, mimeType: 'image/png' });
        }
        if (result.text) {
             triggerUserWebhook({ type: 'text', prompt: webhookPrompt, result: result.text });
        }
        return result;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        addLogEntry({ model, prompt: webhookPrompt, output: `Error: ${errorMessage}`, tokenCount: 0, status: 'Error', error: errorMessage });
        handleApiError(error);
        throw error;
    }
};

/**
 * Generates text content from a text-only prompt.
 * @param {string} prompt - The text prompt.
 * @returns {Promise<string>} The text response from the model.
 */
export const generateText = async (prompt: string): Promise<string> => {
    const model = MODELS.text;
    try {
        const ai = getAiInstance();
        const response = await ai.models.generateContent({
            model,
            contents: { parts: [{ text: prompt }] },
            config: {
                thinkingConfig: { thinkingBudget: 0 },
            }
        });
        
        const textOutput = response.text ?? '';

        addLogEntry({
            model,
            prompt,
            output: textOutput,
            tokenCount: response.usageMetadata?.totalTokenCount ?? 0,
            status: 'Success'
        });
        triggerUserWebhook({ type: 'text', prompt, result: textOutput });
        return textOutput;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        addLogEntry({ model, prompt, output: `Error: ${errorMessage}`, tokenCount: 0, status: 'Error', error: errorMessage });
        handleApiError(error);
        throw error;
    }
};

/**
 * Generates text content with Google Search grounding for up-to-date information.
 * @param {string} prompt - The text prompt.
 * @returns {Promise<GenerateContentResponse>} The full response object from the model, including grounding metadata.
 */
export const generateContentWithGoogleSearch = async (prompt: string): Promise<GenerateContentResponse> => {
    const model = MODELS.text;
    try {
        const ai = getAiInstance();
        const response = await ai.models.generateContent({
            model,
            contents: { parts: [{ text: prompt }] },
            config: {
                tools: [{ googleSearch: {} }],
                thinkingConfig: { thinkingBudget: 0 },
            },
        });

        const textOutput = response.text ?? '';

        addLogEntry({
            model,
            prompt,
            output: textOutput,
            tokenCount: response.usageMetadata?.totalTokenCount ?? 0,
            status: 'Success'
        });
        triggerUserWebhook({ type: 'text', prompt, result: textOutput });
        return response; // Return the whole object
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        addLogEntry({ model, prompt, output: `Error: ${errorMessage}`, tokenCount: 0, status: 'Error', error: errorMessage });
        handleApiError(error);
        throw error;
    }
};

const base64ToBlob = async (base64: string, contentType: string = 'audio/mpeg'): Promise<Blob> => {
    const response = await fetch(`data:${contentType};base64,${base64}`);
    return response.blob();
};

/**
 * Generates a voice-over from a text script using Google Cloud's Text-to-Speech API.
 * @param {string} script - The text to convert to speech.
 * @param {string} actorId - The ID of the voice actor (e.g., 'en-US-Standard-A').
 * @param {number} speed - The speaking speed (0.25 to 4.0).
 * @param {number} pitch - The speaking pitch (-20.0 to 20.0).
 * @param {number} volume - The output volume in dB (-96.0 to 16.0).
 * @returns {Promise<Blob>} A blob containing the generated audio file.
 */
export const generateVoiceOver = async (
    script: string,
    actorId: string,
    speed: number,
    pitch: number,
    volume: number
): Promise<Blob> => {
    const model = 'Google Cloud TTS';
    const webhookPrompt = `Voice: ${actorId}, Script: ${script.substring(0, 100)}...`;
    
    const keyToUse = getApiKeyForService();
    if (!keyToUse) {
        throw new Error("API Key or Auth Token is not set. Please configure your key in Settings.");
    }

    try {
        const languageCode = actorId.split('-').slice(0, 2).join('-');

        const requestBody = {
            input: { text: script },
            voice: { languageCode: languageCode, name: actorId },
            audioConfig: {
                audioEncoding: 'MP3',
                speakingRate: speed,
                pitch: pitch,
                volumeGainDb: volume,
            },
        };

        const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${keyToUse}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error?.message || `HTTP error! status: ${response.status}`;
            const helpfulMessage = `${errorMessage}. Please ensure the "Cloud Text-to-Speech API" is enabled for your API key in your Google Cloud project.`;
            throw new Error(helpfulMessage);
        }

        const data = await response.json();

        if (!data.audioContent) {
            throw new Error("API response did not contain audio content.");
        }

        const audioBlob = await base64ToBlob(data.audioContent, 'audio/mpeg');
        
        addLogEntry({
            model,
            prompt: webhookPrompt,
            output: '1 audio file generated.',
            tokenCount: 0, // Not applicable
            status: 'Success',
            mediaOutput: audioBlob
        });
        
        triggerUserWebhook({ type: 'audio', prompt: webhookPrompt, result: audioBlob });
        return audioBlob;

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        addLogEntry({
            model,
            prompt: webhookPrompt,
            output: `Error: ${errorMessage}`,
            tokenCount: 0,
            status: 'Error',
            error: errorMessage
        });
        handleApiError(error);
        throw error;
    }
};

/**
 * Runs a minimal, non-blocking health check on an API key for critical services.
 * @param {string} apiKeyToCheck - The API key to test.
 * @returns {Promise<{ image: boolean; veo3: boolean; }>} A promise that resolves to the status of image and VEO 3 models.
 */
export const runMinimalHealthCheck = async (apiKeyToCheck: string): Promise<{ image: boolean; veo3: boolean; }> => {
    if (!apiKeyToCheck) {
        return { image: false, veo3: false };
    }

    const ai = new GoogleGenAI({ apiKey: apiKeyToCheck });

    // A tiny, valid transparent PNG for image model checks
    const tinyPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

    const imageCheckPromise = ai.models.generateContent({
        model: MODELS.imageEdit,
        contents: { parts: [{ inlineData: { data: tinyPngBase64, mimeType: 'image/png' } }, { text: 'test' }] },
        config: { responseModalities: [Modality.TEXT] }, // Only need a successful call, not an image back.
    });

    const veo3CheckPromise = ai.models.generateVideos({ 
        model: 'veo-3.0-generate-001', 
        prompt: 'test', 
        config: { numberOfVideos: 1 } 
    });

    const [imageResult, veo3Result] = await Promise.allSettled([imageCheckPromise, veo3CheckPromise]);
    
    // Log failures for debugging without throwing
    if (imageResult.status === 'rejected') console.debug(`Minimal health check failed for image:`, (imageResult.reason as Error).message);
    if (veo3Result.status === 'rejected') console.debug(`Minimal health check failed for VEO 3:`, (veo3Result.reason as Error).message);

    const isImageOk = imageResult.status === 'fulfilled';
    // A fulfilled promise for generateVideos returns an Operation.
    // If the operation has an `error` property immediately, it's a failure.
    // This handles cases where the promise resolves but the operation is invalid from the start.
    const isVeo3Ok = veo3Result.status === 'fulfilled' && !(veo3Result.value as any).error;

    return {
        image: isImageOk,
        veo3: isVeo3Ok,
    };
};


// --- ADMIN API HEALTH CHECK ---

export interface HealthCheckResult {
    service: string;
    model: string;
    status: 'operational' | 'error' | 'degraded';
    message: string;
}

const getShortErrorMessage = (e: any): string => {
    let message = e.message || String(e);
    try {
        // If the message is a JSON string, parse it and get the core message.
        const errorObj = JSON.parse(message);
        if (errorObj?.error?.message) {
            message = errorObj.error.message;
        } else if (errorObj?.message) {
            message = errorObj.message;
        }
    } catch (parseError) {
        // Not a JSON string, proceed with the original message.
    }

    // Return the first line of the potentially cleaned message.
    const firstLine = message.split('\n')[0];
    if (firstLine.startsWith('[GoogleGenerativeAI Error]: ')) {
        return firstLine.replace('[GoogleGenerativeAI Error]: ', '');
    }
    
    return firstLine;
};

export const runApiHealthCheck = async (keys: { textKey?: string, veo3AuthToken?: string }): Promise<HealthCheckResult[]> => {
    const { textKey, veo3AuthToken } = keys;

    if (!textKey) {
        throw new Error("An API Key is required for a health check.");
    }

    const ai = new GoogleGenAI({ apiKey: textKey });
    const results: HealthCheckResult[] = [];

    // 1. Text Generation
    try {
        await ai.models.generateContent({ model: MODELS.text, contents: 'test', config: { maxOutputTokens: 2, thinkingConfig: { thinkingBudget: 1 } } });
        results.push({ service: 'Text Generation', model: MODELS.text, status: 'operational', message: 'OK' });
    } catch (e: any) {
        results.push({ service: 'Text Generation', model: MODELS.text, status: 'error', message: getShortErrorMessage(e) });
    }

    // 2. Image Generation
    try {
        await ai.models.generateImages({ model: MODELS.imageGeneration, prompt: 'test', config: { numberOfImages: 1, aspectRatio: '1:1' } });
        results.push({ service: 'Image Generation', model: MODELS.imageGeneration, status: 'operational', message: 'OK' });
    } catch (e: any) {
        results.push({ service: 'Image Generation', model: MODELS.imageGeneration, status: 'error', message: getShortErrorMessage(e) });
    }
    
    // 3. Image Editing
    const tinyPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    try {
        await ai.models.generateContent({
            model: MODELS.imageEdit,
            contents: { parts: [{ inlineData: { data: tinyPngBase64, mimeType: 'image/png' } }, { text: 'test' }] },
            config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
        });
        results.push({ service: 'Image Editing', model: MODELS.imageEdit, status: 'operational', message: 'OK' });
    } catch (e: any) {
        results.push({ service: 'Image Editing', model: MODELS.imageEdit, status: 'error', message: getShortErrorMessage(e) });
    }

    // 4. Video Generation (all models)
    for (const videoModel of MODELS.videoGenerationOptions) {
        if (videoModel.id.startsWith('veo-3.0')) {
            if (!veo3AuthToken) {
                results.push({ service: 'Video Generation', model: videoModel.id, status: 'degraded', message: 'Health check skipped. Requires Auth Token in the Key modal.' });
                continue;
            }
            try {
                const initialOperations = await generateVideoWithVeo3({
                    prompt: 'test',
                    config: {
                        authToken: veo3AuthToken,
                        aspectRatio: 'landscape',
                        useStandardModel: !videoModel.id.includes('fast'),
                    },
                });
                if (!initialOperations || initialOperations.length === 0 || (initialOperations[0] as any).error) {
                    throw new Error((initialOperations[0] as any)?.error?.message || 'Initial request failed without specific error.');
                }
                results.push({ service: 'Video Generation', model: videoModel.id, status: 'operational', message: 'Initial request successful.' });
            } catch (e: any) {
                results.push({ service: 'Video Generation', model: videoModel.id, status: 'error', message: getShortErrorMessage(e) });
            }
            continue;
        }

        try {
            const operation = await ai.models.generateVideos({ model: videoModel.id, prompt: 'test', config: { numberOfVideos: 1 } });
            if ((operation as any).error) {
                 throw new Error((operation as any).error.message || 'Initial request failed.');
            }
            results.push({ service: 'Video Generation', model: videoModel.id, status: 'operational', message: 'Initial request successful.' });
        } catch (e: any) {
            results.push({ service: 'Video Generation', model: videoModel.id, status: 'error', message: getShortErrorMessage(e) });
        }
    }

    // 5. Text-to-Speech
    if (textKey) {
        try {
            const ttsResponse = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${textKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    input: { text: 'test' },
                    voice: { languageCode: 'en-US', name: 'en-US-Standard-C' },
                    audioConfig: { audioEncoding: 'MP3' },
                }),
            });
            if (!ttsResponse.ok) {
                const errorData = await ttsResponse.json();
                throw new Error(errorData.error?.message || `HTTP error! status: ${ttsResponse.status}`);
            }
            const data = await ttsResponse.json();
            if (!data.audioContent) {
                throw new Error("API responded successfully but did not return audio content.");
            }
            results.push({ service: 'Text-to-Speech', model: 'Google Cloud TTS', status: 'operational', message: 'OK' });
        } catch (e: any) {
            const errorMessage = getShortErrorMessage(e);
            const helpfulMessage = `${errorMessage}. Please ensure the "Cloud Text-to-Speech API" is enabled for your API key in your Google Cloud project.`;
            results.push({ service: 'Text-to-Speech', model: 'Google Cloud TTS', status: 'error', message: helpfulMessage });
        }
    }

    return results;
};