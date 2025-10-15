/**
 * Centralized configuration for AI models.
 * This separates model names from the application logic, making it easier
 * to update or swap models in the future without changing service code.
 */
export const MODELS = {
  text: 'gemini-2.5-flash',
  imageGeneration: 'imagen-4.0-generate-001',
  imageEdit: 'gemini-2.5-flash-image',
  videoGenerationDefault: 'veo-2.0-generate-001',
  videoGenerationOptions: [
    { id: 'veo-3.0-generate-001', label: 'Veo 3 (Highest Quality)' },
    { id: 'veo-3.0-fast-generate-001', label: 'Veo 3 (Fast)' },
    { id: 'veo-2.0-generate-001', label: 'Veo 2' },
  ],
};

/**
 * Default Veo 3.0 Authentication Token.
 * This is the central location to manually update the token.
 * It's used as a fallback if no token is found in the user's session.
 */
export const VEO_3_AUTH_TOKEN = 'ya29.a0AQQ_BDQ_4m4FJ8CaG114M_Ac7WZtZ3qlMhoj8GHo1FOquiWgkmK1c53AfCoJfAHTW9JmNmPxvivB-XE1MndmVYn8A19HjKKuguESPHel7q-4qdgSex5TcWZtJ4eXBUBgs7YaoMRMy_xZ1-43oDU6VQhGc2vDuB7r4fdjDcOszqmSPN_Jyt7Ux84qhnMHD5DVTclTaGmmXzS8jPng6ihIEyW3ARcGvffcfbvo8f3_g1xCw32USs1pbJ0IbAdaYS89SH-qQIoPrXYbiU8l0wxt-k_1EU1feFLPu79xcoFfrjGc0oZt8a9Gh_GnniNVnN0Bb0np2L688WU5PeG1pLLCjPPZbO94rhTwdNrUnT7b_PQaCgYKAe0SARcSFQHGX2MiJtT8eyz-kyMn2CtmE4UH8Q0370';
