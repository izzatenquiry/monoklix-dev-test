import eventBus from './eventBus';

/**
 * Handles API errors, re-throwing them with user-friendly messages and suggestions for the UI to catch.
 * This function is centralized to be reused across different AI service calls.
 * @param {unknown} error - The error caught from the API call.
 */
export const handleApiError = (error: unknown): void => {
    console.error("Original API Error:", error);
    let message: string;

    if (error instanceof Error) {
        message = error.message;
    } else {
        message = String(error);
    }
    
    // The Gemini SDK and other services throw descriptive errors that include codes.
    // We parse them to provide user-friendly suggestions.
    
    const lowerCaseMessage = message.toLowerCase();
    let suggestion = '';

    const isApiKeyError = 
        lowerCaseMessage.includes('403') || 
        lowerCaseMessage.includes('401') || 
        lowerCaseMessage.includes('permission denied') ||
        lowerCaseMessage.includes('api key not valid');

    if (isApiKeyError) {
        // Instead of showing the modal directly, trigger an auto-claim attempt first.
        eventBus.dispatch('initiateAutoApiKeyClaim');
    }

    // Don't add a redundant suggestion if the original error is already helpful.
    const hasExistingSuggestion = 
        lowerCaseMessage.includes('please ensure') || 
        lowerCaseMessage.includes('please try');

    if (!hasExistingSuggestion) {
        if (isApiKeyError) {
            suggestion = 'Suggestion: Your API Key seems to be invalid or lacks permissions. Please check your key in Settings or claim a new one.';
        } else if (lowerCaseMessage.includes('400') || lowerCaseMessage.includes('bad request')) {
            suggestion = 'Suggestion: Your prompt or image may have been blocked by safety filters. Please try rephrasing your request or using a different image.';
        } else if (lowerCaseMessage.includes('429') || lowerCaseMessage.includes('resource exhausted')) {
            suggestion = 'Suggestion: You\'ve sent too many requests in a short time. Please wait for a minute before trying again.';
        } else if (lowerCaseMessage.includes('500') || lowerCaseMessage.includes('503')) {
            suggestion = 'Suggestion: There was a temporary issue on Google\'s side. Please try again in a few moments.';
        }
    }

    // Handle generic network failure separately for a cleaner message.
    if (lowerCaseMessage.includes('failed to fetch')) {
        message = 'Network error. Please check your internet connection and try again.';
        suggestion = ''; // Overwrite any other suggestion for this specific case.
    }
    
    // We will show a simplified main message but append the suggestion for guidance.
    let userFriendlyMessage = message.split('\n')[0]; // Take the first line of the error.
    
    // For specific, common errors, let's create even cleaner messages.
    if (lowerCaseMessage.includes('429') || lowerCaseMessage.includes('resource exhausted')) {
        userFriendlyMessage = 'You have exceeded your current usage quota.';
    } else if (lowerCaseMessage.includes('api key not valid')) {
        userFriendlyMessage = 'Your API Key is not valid.';
    }

    const finalMessage = suggestion ? `${userFriendlyMessage}\n\n${suggestion}` : userFriendlyMessage;

    // Re-throw a new error with a message that's safe to display to the user.
    throw new Error(finalMessage);
};