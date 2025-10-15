import { Language } from '../types';

export const translations = {
  en: {
    // App.tsx
    apiKeyRequiredTitle: 'API Key Required',
    apiKeyRequiredBody: 'To use AI features, please provide your own Gemini API Key on the Settings page.',
    subscriptionExpiredTitle: 'Subscription Expired',
    subscriptionExpiredBody: 'Your one-year subscription has ended. Please contact support to renew your access.',
    
    // ApiKeyClaimModal.tsx
    apiKeyClaimModal: {
      title: 'API Key Error Detected',
      body: 'It seems your current API key has an issue. You can claim a new, temporary API key below to continue your work immediately.',
    },

    // LoginPage.tsx
    loginPage: {
      title: 'Welcome Back',
      subtitle: 'Enter your email to log in.',
      emailPlaceholder: 'Email Address',
      loginButton: 'Log In',
      noAccount: 'No account?',
      registerButton: 'Register & Pay to Get Access',
    },
    
    // WelcomeAnimation.tsx
    welcome: 'Welcome Back!',

    // Sidebar.tsx
    sidebar: {
      home: 'Home',
      homeDesc: 'Welcome & Updates',
      getStarted: 'Get Started',
      aiContentIdea: 'AI Content Idea',
      aiImage: 'AI Image',
      aiVideo: 'AI Video & Voice',
      promptLibrary: 'Prompt Library',
      imageGallery: 'Gallery',
      socialPostStudio: 'Social Post Studio',
      settings: 'Settings',
      cacheManager: 'Cache Manager',
      logout: 'Log Out',
      aiAgent: 'AI Agent',
    },
    
    // Tabs
    tabs: {
        // AI Text Suite
        staffMonoklix: 'Staff MONOklix',
        contentIdeas: 'Content Ideas',
        marketingCopy: 'Marketing Copy',
        storyline: 'Storyline',
        // AI Image Suite
        imageGeneration: 'Image Generation',
        productPhotos: 'Product Photos',
        modelPhotos: 'Model Photos',
        enhancer: 'Enhancer',
        bgRemover: 'BG Remover',
        // AI Video Suite
        videoGeneration: 'Video Generation',
        videoStoryboard: 'Video Storyboard',
        videoCombiner: 'Video Combiner',
        voiceStudio: 'Voice Studio',
        batchProcessor: 'Batch Processor',
        // Gallery
        images: 'Images',
        videos: 'Videos',
        history: 'History',
        // Settings
        profile: 'User Profile',
        api: 'API & Integrations',
        log: 'API Log',
        aiSupport: 'AI Support',
        contentAdmin: 'Admin Content',
        userDb: 'User Database',
        // New Prompt Library Suite Tabs
        nanoBanana: 'Nano-Banana',
        viralMy: 'Viral MY',
    },

    // GetStartedView.tsx
    getStartedPage: {
      mainTitle: 'MONOklix.com User Guide',
      mainSubtitle: 'Welcome! This guide will help you understand every available feature.',
      
      chapter1: {
        title: 'Chapter 1: Getting Started & Initial Setup',
        sub1_1_title: '1.1. How to Log In',
        sub1_1_p1: 'This application uses a passwordless login system.',
        sub1_1_ol: [
          'Open the application.',
          'Enter the email address you registered with during payment.',
          'Click the Log In button. You will be taken directly into the platform. Your session will be saved, so you don\'t need to log in every time.'
        ],
        sub1_2_title: '1.2. API Key Setup (Two Options)',
        sub1_2_p1: 'After logging in, you MUST set up a Google Gemini API Key. Without an API Key, all AI features will not function. You have two options:',
        sub1_2_option1_title: 'Option A: Bring Your Own Key (Recommended)',
        sub1_2_option1_p1: 'This is the best method for unlimited and stable access.',
        sub1_2_option1_ol: [
          'In the left menu (Sidebar), click on **Settings**.',
          'Select the **API & Integrations** tab.',
          'Go to the Google AI Studio website to get your API Key for free.',
          'Copy the API Key and paste it into the "Google Gemini API Key" field.',
          'Click the **Save** button.'
        ],
        sub1_2_option1_video_title: 'Video Guide: How to Get Your Own API Key',
        sub1_2_option2_title: 'Option B: Claim a Temporary Key (Fallback)',
        sub1_2_option2_p1: 'If you don\'t have your own key or if your key is having issues (e.g., quota exceeded), you can claim a temporary key provided by the platform.',
        sub1_2_option2_ol: [
            'This option usually appears automatically in a pop-up modal when an API error occurs.',
            'You can also access it manually by going to **Settings > API & Integrations** and finding the "Request a New API Key" panel.',
            'Click **Request Available Keys** to see a list of temporary keys.',
            'Click **Claim** on any available key. It will be automatically applied to your account.',
            '**Note:** These keys are shared and have a daily claim limit for non-admin users. They are intended for temporary use.'
        ],
        sub1_2_p2: 'Only after setting up an API Key (using either option) can you start using all the AI tools.'
      },
      
      chapter2: {
        title: 'Chapter 2: Home Page (e-Tutorial)',
        p1: 'This is the first page you will see after logging in. It contains:',
        ul: [
          'Platform Updates & Status: Latest information on system status and important announcements.',
          'Getting Started Tutorial: The main video guide to start using the platform.',
          'Video Tutorials: A collection of other videos explaining specific features.'
        ]
      },

      chapter3: {
        title: 'Chapter 3: ETHICS OF USING FACES',
        p1: 'When using features like `Model Photos` or uploading reference images containing faces, please adhere to the following ethical and safety guidelines to ensure responsible use.',
        
        canDoTitle: 'CAN DO:',
        canDo: [
            'Use photos of your own face or models you have hired and obtained consent from.',
            'Use this feature to create authentic-looking UGC content for your products.',
            'Be creative with prompts to place your AI model in various settings and styles.'
        ],

        dontTitle: 'DO NOT:',
        dont: [
            'Upload photos of people you find on social media, celebrities, or anyone else without their permission.',
            'Attempt to generate misleading, harmful, or inappropriate content.'
        ],

        conclusion: 'By following these guidelines, you can safely and effectively use the power of AI to generate images and videos featuring people.',
        
        safetyFilterTitle: 'Important Note on Safety Filters:',
        safetyFilterP1: 'Google has a very strict AI safety filtering system to prevent misuse.',
        safetyFilterUl: [
          '**Output May Be Missing:** If you use a facial image (especially a real face) and find that no image is generated (empty output), it has likely been blocked by this safety filter.',
          '**How to Overcome:** If this happens, don\'t worry. Try modifying your request. You can:',
        ],
        safetyFilterOl: [
            'Change the Prompt: Use more general and safe wording.',
            'Change the Reference Image: Use a different facial photo.',
            'Adjust Settings: Change creative settings like `Vibe` or `Pose` to produce variations that might be more acceptable to the AI system.'
        ],
        safetyFilterConclusion: 'Understanding this will help you get more consistent results when working with images involving people.'
      },

      chapter4: {
          title: 'Chapter 4: AI Content Idea Suite (Ideas & Text)',
          p1: 'This suite is designed to help you generate ideas and marketing text.',
          sub4_1_title: '4.1. Staff MONOklix',
          sub4_1_p1: 'Choose an AI "staff member" who is an expert in a specific field to assist you.',
          sub4_1_p2: 'How to Use: Select a staff member (e.g., Wan for Customer Persona), enter the required input (e.g., "premixed coffee product"), choose a language, and click Generate.',
          sub4_2_title: '4.2. Content Ideas',
          sub4_2_p1: 'Generate relevant content ideas on current topics using Google Search.',
          sub4_2_p2: 'How to Use: Enter your topic (e.g., "sustainable fashion"), choose a language, and the AI will provide 5 content ideas with titles and descriptions.',
          sub4_3_title: '4.3. Marketing Copy',
          sub4_3_p1: 'Write captivating sales copy.',
          sub4_3_p2: 'How to Use: Fill in product details, target audience, keywords, and select a writing tone. The AI will generate complete marketing text.',
          sub4_4_title: '4.4. Storyline',
          sub4_4_p1: 'Generate a concept and a brief script for a video ad.',
          sub4_4_p2: 'How to Use: Upload a product image, write a product description, choose a "vibe" and content type. The AI will produce a complete scene with visuals and text.'
      },

      chapter5: {
          title: 'Chapter 5: AI Image Suite (Images)',
          p1: 'Everything related to image generation and editing is here.',
          sub5_1_title: '5.1. Image Generation',
          sub5_1_p1: 'The main tool for creating images from text or editing existing images.',
          sub5_1_ul: [
              '**Text-to-Image:** Leave the "Reference Images" section empty. Write your prompt (e.g., "an astronaut on the moon, cinematic"), select an aspect ratio, and click Generate.',
              '**Image-to-Image (Editing):** Upload 1-5 reference images. Write editing instructions in the prompt field (e.g., "add a hat to the person").'
          ],
          sub5_2_title: '5.2. Product Photos',
          sub5_2_p1: 'Place your product in a professional background.',
          sub5_2_p2: 'How to Use: Upload your product image (preferably with a blank/white background). Choose the "vibe" or background you want. The AI will realistically merge your product into that setting.',
          sub5_3_title: '5.3. Model Photos',
          sub5_3_p1: 'Create model photos (UGC style) with your product.',
          sub5_3_p2: 'How to Use:',
          sub5_3_ol: [
              'Upload the product photo.',
              '(Optional) Upload a face photo as a reference. If not, the AI will generate a new face based on the "Model\'s Face" selection.',
              'Choose the gender and other creative settings. The AI will produce an image of a model using or showcasing your product.'
          ],
          sub5_4_title: '5.4. Enhancer',
          sub5_4_p1: 'Improve image quality.',
          sub5_4_p2: 'How to Use: Upload an image. Choose either Upscale Quality (improves resolution & sharpness) or Enhance Colors (boosts colors).',
          sub5_5_title: '5.5. BG Remover',
          sub5_5_p1: 'Automatically remove the image background.',
          sub5_5_p2: 'How to Use: Upload an image, and click Remove Background. The result is an image with a transparent background.'
      },

      chapter6: {
          title: 'Chapter 6: AI Video & Voice Suite (Video & Voice)',
          p1: 'The suite for creating video and audio content.',
          sub6_1_title: '6.1. Video Generation',
          sub6_1_p1: 'Generate short video clips from text or images.',
          sub6_1_p2: 'How to Use: Write a prompt describing the subject and action (e.g., "a golden retriever puppy, chasing a red ball in a park"). You can also upload a reference image to animate. Select an AI model, aspect ratio, and other settings.',
          sub6_1_p3: 'Note: Video generation may take a few minutes.',
          sub6_2_title: '6.2. Video Storyboard',
          sub6_2_p1: 'An advanced tool for planning product review videos.',
          sub6_2_p2: '2-Step Process:',
          sub6_2_ol: [
              '**Generate Storyboard:** Upload a product image and a model\'s face photo. Fill in the product description and choose creative settings. Click Generate Storyboard. The AI will produce a 4-scene script.',
              '**Create Images:** After the storyboard is ready, click the Create 4 Images button. The AI will generate one image for each scene in the storyboard.'
          ],
          sub6_3_title: '6.3. Batch Processor (Admin Only)',
          sub6_3_p1: 'Generate multiple videos in a single run from a list of prompts.',
          sub6_3_p2: 'How to Use: Create a text file (.txt) with one video prompt on each line. Upload the file, configure your video settings (model, aspect ratio), and click Start Processing. The system will generate a video for each prompt sequentially.',
          sub6_4_title: '6.4. Video Combiner (Admin Only)',
          sub6_4_p1: 'Combine multiple video clips into one.',
          sub6_4_p2: 'How to Use: Select the videos you have generated (from your Gallery). Click the Combine Videos button. This process happens entirely in your browser.',
          sub6_5_title: '6.5. Voice Studio',
          sub6_5_p1: 'Convert text to speech.',
          sub6_5_p2: 'How to Use: Write your script. Choose a Voice Actor, adjust the speed, pitch, and volume. Click Generate Voice Over to produce an MP3 audio file.',
      },
      
      chapter7: {
        title: 'Chapter 7: Social Post Studio',
        p1: 'This is a centralized hub for creating and organizing your social media content before sending it to an automation tool like n8n or Zapier.',
        sub7_1_title: '7.1. How to Use',
        sub7_1_p1: 'Follow these steps to build your post:',
        sub7_1_ol: [
            '**Write Content:** Write your caption directly in the "Text Content" box, or click "Generate with AI" to use one of the AI agents to write it for you.',
            '**Add Hashtags:** Enter your hashtags in the dedicated field.',
            '**Add Media:** Click "Add from Gallery" to select a video or up to 4 images you\'ve already generated. Alternatively, click "Upload from Desktop" to add new files.',
            '**Add Details (Optional):** You can add a Call-to-Action, an external link, and set a schedule date/time.',
            '**Preview:** See a live preview of your post on the right side.',
            '**Send:** When ready, click "Send to Webhook". This will send all the post data (text, media, schedule info) to the URL you configured in your settings.'
        ],
        sub7_1_p2: 'Note: To use this feature, you must first set up your Personal Webhook URL in **Settings > API & Integrations**.'
      },

      chapter8: {
          title: 'Chapter 8: Your Assets & Inspiration',
          sub8_1_title: '8.1. Gallery & API Log',
          sub8_1_p1: 'The Gallery is where all content (images, videos, audio, text) you generate is automatically saved. You can review, download, or reuse your assets here. For example, click the "Re-edit" icon on an image to take it to `Image Generation` or click the "Create Video" icon to send it to `Video Generation`.',
          sub8_1_p2: 'The API Log tab within the Gallery shows a detailed record of every API call you have made, which is useful for checking usage and troubleshooting.',
          sub8_2_title: '8.2. Prompt Library',
          sub8_2_p1: 'This is an inspiration hub with two sections:',
          sub8_2_ul: [
              '**Nano-Banana:** A collection of advanced and creative use cases for the `gemini-2.5-flash-image` model, sourced from the official "Awesome Nano Banana" library.',
              '**Viral MY:** A curated list of trending and viral prompts specifically for the Malaysian market, managed by the admin.'
          ],
          sub8_2_p2: 'How to Use: Browse the collections. If you find a prompt you like, click **Use this Prompt** to send it directly to `Image Generation`.'
      },

      chapter9: {
          title: 'Chapter 9: Settings & Advanced Features',
          sub9_1_title: '9.1. User Profile',
          sub9_1_p1: 'Update your name and switch the theme between Light and Dark mode.',
          sub9_2_title: '9.2. API & Integrations',
          sub9_2_ul: [
              '**API Key:** The place to manage your personal Google Gemini API Key.',
              '**Veo 3.0 Auth Token:** Instructions on how to get the special authorization token required **only for Veo 3.0 models**.',
              '**API Health Check:** Run a comprehensive check on all integrated AI services to ensure your API key is configured correctly and operational.',
              '**Personal Webhook:** (For advanced users) Enter a webhook URL (e.g., from n8n or Zapier) to automatically send your generated content to an external service for custom automations.',
              '**Claim Temporary Key:** If your key isn\'t working, use this panel to request and claim a temporary, rate-limited key to continue working.'
          ],
          sub9_3_title: '9.3. AI Support',
          sub9_3_p1: 'A chat space with our AI support agent for any questions or assistance.'
      },
      
      chapter10: {
        title: 'Chapter 10: Troubleshooting & Error Codes',
        p1: 'Sometimes, you may encounter error messages when using the AI features. The table below explains the most common errors, their causes, and how to solve them.',
        table: [
          {
            code: '`400` <br/> (Bad Request)',
            problem: '**Invalid Request.** This is the most common error and is usually caused by: <br/><br/> 1. **Safety Policy Violation:** Your text or image prompt contains elements blocked by Google\'s safety filters (e.g., violent, sensitive content). <br/><br/> 2. **Incorrect Prompt or Parameters:** Your prompt structure may be confusing to the AI, or the settings you\'ve chosen are not supported. <br/><br/> 3. **No Output Generated:** The AI successfully processed the request but failed to produce any output, often due to internal safety blocks.',
            solution: '1. **Modify Prompt:** Make your instructions more general and safe. Avoid words that could be misinterpreted. <br/><br/> 2. **Change Reference Image:** If using an image, try a different, more neutral one. <br/><br/> 3. **Simplify Request:** Reduce complex instructions in a single prompt.'
          },
          {
            code: '`401` / `403` <br/> (Unauthorized)',
            problem: '**API Key Authentication Issue.** This error occurs when your API Key cannot be used, due to: <br/><br/> 1. **Invalid or Incorrect API Key:** The key you entered in **Settings > API & Integrations** is wrong. <br/><br/> 2. **API Not Enabled:** Your key is correct, but the required API (e.g., Cloud Text-to-Speech API) is not enabled in your Google Cloud project.',
            solution: '1. **Verify Your Key:** Go to **Settings > API & Integrations** and paste your key again. Ensure there are no extra spaces. <br/><br/> 2. **Claim a Temporary Key:** Use the key claim feature in Settings or the pop-up modal to get a working key immediately. <br/><br/> 3. **Enable APIs:** Visit your Google Cloud Console and make sure all necessary APIs (Gemini, Text-to-Speech, etc.) are enabled for your project.'
          },
          {
            code: '`429` <br/> (Too Many Requests)',
            problem: '**Quota Exceeded.** You have made too many API requests in a short period. Free tier or temporary API keys have strict rate limits.',
            solution: '1. **Wait:** The simplest solution is to wait for a minute before trying again. <br/><br/> 2. **Claim a New Temporary Key:** If you are using a temporary key, you may have exhausted its quota. Try claiming a new one. <br/><br/> 3. **Use Your Own Key:** Personal API keys often have higher limits. Consider setting one up.'
          },
          {
            code: '`500` / `503` <br/> (Server Error)',
            problem: '**Internal Server Error.** This indicates a temporary problem on Google\'s side. It is not an issue with your request or API key.',
            solution: '1. **Wait and Retry:** Wait for a few moments and try your request again. These issues are usually resolved quickly. <br/><br/> 2. **Check Status Page:** You can check the official Google Cloud Status Dashboard to see if there are any reported outages.'
          },
          {
            code: '`Network Error` / `Failed to Fetch`',
            problem: '**Connection Problem.** The application could not reach Google\'s servers. This is almost always a local network issue.',
            solution: '1. **Check Internet Connection:** Ensure you are connected to the internet. <br/><br/> 2. **Check for Blockers:** Disable any VPNs, firewalls, or ad-blockers that might be interfering with the connection. <br/><br/> 3. **Refresh the Application:** A simple refresh can often resolve temporary network glitches.'
          },
        ]
      },

      chapter11: {
        title: 'Chapter 11: Billing, Credits, and Usage',
        p1: 'This application operates on a "Bring Your Own Key" (BYOK) model. This means you are responsible for any costs associated with your Google Gemini API Key usage.',
        p2: 'Fortunately, Google offers a generous free tier that is sufficient for most users for experimentation and light usage.',
        sub11_1_title: '11.1. Understanding the Free Tier',
        sub11_1_p1: 'The Google Gemini free tier provides a certain number of free API calls per minute and per day. The limits are subject to change by Google, but generally cover:',
        sub11_1_ul: [
          '**Gemini Pro (Text):** Thousands of requests per day.',
          '**Imagen (Image Generation):** A limited number of free image generations.',
          '**Veo (Video Generation):** Video generation is a premium service and may incur costs immediately.',
          '**Text-to-Speech:** A significant number of free characters per month.'
        ],
        sub11_2_title: '11.2. How to Monitor Your Usage and Billing',
        sub11_2_ul: [
          '1. Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" class="text-primary-600 dark:text-primary-400 hover:underline">Google Cloud Console</a>.',
          '2. Ensure you are in the correct project associated with your API Key.',
          '3. Navigate to the **Billing** section to view your current costs and set up budgets.',
          '4. Navigate to the **APIs & Services > Dashboard** to see detailed usage metrics for each API (e.g., `Generative Language API`, `Cloud Text-to-Speech API`).'
        ],
        sub11_3_title: '11.3. Estimated Costs (Beyond Free Tier)',
        sub11_3_p1: 'Costs are determined by Google and can change. The table below provides a general estimate. For the most accurate and up-to-date pricing, always refer to the official Google Cloud pricing pages.',
        tableHeaders: {
          category: 'Category',
          model: 'Model/Service',
          cost: 'Estimated Cost (per unit)',
        },
        table: [
          { category: 'Text Input', model: 'gemini-2.5-flash', cost: '~$0.0001 per 1,000 characters' },
          { category: 'Text Output', model: 'gemini-2.5-flash', cost: '~$0.0002 per 1,000 characters' },
          { category: 'Image Generation', model: 'imagen-4.0', cost: '~$0.02 per image' },
          { category: 'Video Generation', model: 'veo-2.0', cost: '~$0.002 per second of video' },
          { category: 'Voice Generation', model: 'Google Cloud TTS', cost: '~$0.000016 per character' },
        ],
        sub11_4_title: '11.4. Getting Help',
        sub11_4_ul: [
          'If you have questions about your billing, it\'s best to contact Google Cloud Support directly through your Cloud Console.',
          'For questions about how the application uses the API, you can use the built-in AI Support chat.'
        ],
        sub11_4_p2: 'You can also ask our `AI Support` for help understanding your usage patterns.'
      },

      chapter12: {
        title: 'Thank you for using MONOklix.com! We hope you create amazing things.'
      }

    },
    
    // Standardized Messages
    generating: 'Generating...',
    videoTakesTime: 'This may take a few minutes. Please be patient.',

    // ... other translations
    libraryView: {
        copied: 'Copied!',
        copy: 'Copy',
    },

    promptViralMyView: {
        title: 'Prompt Viral MY',
        subtitle: 'A library of trending and viral prompts specifically for the Malaysian market.'
    },

    staffMonoklixView: {
        title: 'Staff MONOklix',
        subtitle: 'Choose an AI agent to help you with a specific marketing task.',
        inputFor: 'Input for',
        outputLanguage: 'Output Language',
        generateButton: 'Generate',
        resetButton: 'Reset',
        download: 'Download',
        outputPlaceholder: 'Your generated content will appear here.'
    },

    contentIdeasView: {
        title: 'Content Ideas',
        subtitle: 'Generate trendy and relevant content ideas for any topic using real-time search.',
        topicLabel: 'What is your topic?',
        topicPlaceholder: 'e.g., "healthy breakfast recipes for busy people"',
        outputLanguage: 'Output Language',
        generateButton: 'Generate Ideas',
        resetButton: 'Reset',
        loading: 'Generating ideas...',
        outputPlaceholder: 'Your content ideas will appear here.'
    },

    marketingCopyView: {
        title: 'Marketing Copy Generator',
        subtitle: 'Create persuasive and engaging copy for your products or services.',
        productDetailsLabel: 'Product/Service Details',
        productDetailsPlaceholder: 'Describe what you are selling, its features, and main benefits.',
        targetAudienceLabel: 'Target Audience (Optional)',
        targetAudiencePlaceholder: 'e.g., "Young professionals, students, parents"',
        keywordsLabel: 'Keywords to Include (Optional)',
        keywordsPlaceholder: 'e.g., "eco-friendly, special offer, limited time"',
        toneLabel: 'Tone of Voice',
        outputLanguage: 'Output Language',
        generateButton: 'Generate Copy',
        resetButton: 'Reset',
        loading: 'Writing your copy...',
        outputPlaceholder: 'Your generated marketing copy will appear here.'
    },

    productAdView: {
        title: 'Video Ad Storyline',
        subtitle: 'Upload a product photo and get a short, punchy video ad concept.',
        uploadProduct: 'Upload Product Photo',
        productDescription: 'Product Description',
        productDescriptionPlaceholder: 'e.g., "Sambal Bilis Garing. Extra spicy, extra crunchy. Made from premium ingredients. Perfect with rice."',
        creativeDirection: 'Creative Direction',
        vibe: 'Vibe',
        lighting: 'Lighting',
        contentType: 'Content Type',
        outputLanguage: 'Output Language',
        generateButton: 'Generate Storyline',
        resetButton: 'Reset',
        loading: 'Generating storyline...',
        outputPlaceholder: 'Your generated storyline will appear here.'
    },

    imageGenerationView: {
        title: 'AI Image Generation',
        titleEdit: 'AI Image Editing',
        subtitle: 'Create stunning images from text or edit your existing photos.',
        subtitleEdit: 'Describe the changes you want to make to the uploaded image.',
        refImagesLabel: 'Reference Images (for editing)',
        upload: 'Upload',
        editingModeNotice: '<strong>Editing Mode:</strong> Your prompt should describe the changes you want to make.',
        refImagesHelp: 'Upload 1-5 images to edit or use as a style reference.',
        promptLabel: 'Prompt',
        promptPlaceholder: 'e.g., "a majestic lion in a futuristic city, cinematic lighting, hyperrealistic"',
        promptPlaceholderEdit: 'e.g., "add a birthday hat to the person", "change the background to a beach"',
        advancedEditor: 'Advanced Prompt Builder',
        advancedEditorHelp: 'Quickly add professional photography terms to your prompt.',
        style: 'Style',
        lighting: 'Lighting',
        cameraAngle: 'Camera Angle',
        composition: 'Composition',
        lensType: 'Lens Type',
        filmSim: 'Film Sim',
        aspectRatio: 'Aspect Ratio',
        numberOfImages: 'Number of Images',
        advancedSettings: 'Advanced Settings',
        negativePrompt: 'Negative Prompt (what to avoid)',
        negativePromptPlaceholder: 'e.g., "text, watermarks, ugly, blurry"',
        hdr: 'High Dynamic Range',
        applyEditButton: 'Apply Edit',
        generateButton: 'Generate',
        resetButton: 'Reset',
        outputPlaceholder: 'Your masterpiece will appear here.',
        reEdit: 'Re-edit Image',
        createVideo: 'Create Video from Image',
        download: 'Download Image',
        scene: 'Scene'
    },

    productPhotoView: {
        title: 'AI Product Photos',
        subtitle: 'Place your product in a stunning, professional setting.',
        uploadProduct: 'Upload Product Photo',
        uploadTitle: 'Upload a clean product photo (PNG with transparent background is best)',
        customPrompt: 'Custom Prompt (Optional)',
        customPromptPlaceholder: 'For full control, write your own detailed prompt here. This will override the settings below.',
        customPromptHelp: 'If you use this, the settings below will be ignored.',
        creativeDirection: 'Creative Direction',
        backgroundVibe: 'Background / Vibe',
        artisticStyle: 'Artistic Style',
        lighting: 'Lighting',
        cameraShot: 'Camera Shot',
        composition: 'Composition',
        lensType: 'Lens Type',
        filmSim: 'Film Simulation',
        visualEffect: 'Visual Effect',
        aiSettings: 'AI Settings',
        creativityLevel: 'Creativity Level',
        numberOfImages: 'Number of Images',
        generateButton: 'Generate Photo',
        resetButton: 'Reset',
        outputPlaceholder: 'Your professional product photo will appear here.'
    },

    tiktokAffiliateView: {
        title: 'AI Model Photos',
        subtitle: 'Create UGC-style photos of models with your product.',
        assetAndModel: 'Assets & Model',
        productPhoto: 'Product Photo',
        productPhotoDesc: 'Upload a clean product photo.',
        facePhoto: 'Face Photo (Optional)',
        facePhotoDesc: 'Upload a face for the AI to use. If empty, a new face will be generated.',
        customPrompt: 'Custom Prompt (Optional)',
        customPromptPlaceholder: 'For full control, write your own detailed prompt here. This will override the settings below.',
        customPromptHelp: 'If you use this, the settings below will be ignored.',
        creativeDirection: 'Creative Direction',
        gender: 'Model\'s Gender',
        female: 'Female',
        male: 'Male',
        modelFace: 'Model\'s Face',
        artisticStyle: 'Artistic Style',
        lighting: 'Lighting',
        cameraShot: 'Camera Shot',
        bodyPose: 'Body Pose',
        vibe: 'Background / Vibe',
        composition: 'Composition',
        lensType: 'Lens Type',
        filmSim: 'Film Simulation',
        aiSettings: 'AI Settings',
        creativityLevel: 'Creativity Level',
        numberOfImages: 'Number of Images',
        generateButton: 'Generate Photo',
        resetButton: 'Reset',
        outputPlaceholder: 'Your model photo will appear here.'
    },

    backgroundRemoverView: {
        title: 'Background Remover',
        subtitle: 'Automatically remove the background from any image.',
        uploadTitle: 'Upload an image to remove its background',
        removeButton: 'Remove Background',
        resetButton: 'Reset',
        loading: 'Removing background...',
        original: 'Original',
        result: 'Result',
        outputPlaceholder: 'Your image with a transparent background will appear here.'
    },

    imageEnhancerView: {
        title: 'Image Enhancer',
        subtitle: 'Improve the quality or colors of your images with one click.',
        uploadTitle: 'Upload an image to enhance',
        upscaleButton: 'Upscale Quality',
        colorsButton: 'Enhance Colors',
        enhanceButton: 'Enhance Image',
        resetButton: 'Reset',
        loading: 'Enhancing image...',
        original: 'Original',
        enhanced: 'Enhanced',
        outputPlaceholder: 'Your enhanced image will appear here.'
    },

    videoGenerationView: {
        title: 'AI Video Generation',
        subtitle: 'Create short video clips from text prompts and images.',
        modelFormat: 'Model & Format',
        aiModel: 'AI Model',
        aspectRatio: 'Aspect Ratio',
        resolution: 'Resolution',
        subjectContext: 'Subject / Context',
        subjectContextPlaceholder: 'e.g., "a handsome man in his 20s", "a bottle of chili sauce"',
        action: 'Action / Motion',
        actionPlaceholder: 'e.g., "smiling at the camera", "standing on a table"',
        creativeDirection: 'Creative Direction',
        style: 'Style',
        cameraMotion: 'Camera Motion',
        backgroundVibe: 'Background / Vibe',
        ambiance: 'Ambiance / Mood',
        ambiancePlaceholder: 'e.g., "cozy morning light", "dramatic, cinematic mood"',
        negativePrompt: 'Negative Prompt',
        negativePromptPlaceholder: 'e.g., "blurry, ugly, watermark"',
        dialogue: 'Dialogue (On-Screen Text)',
        dialoguePlaceholder: 'Text to be displayed as captions in the video.',
        dialogueAudio: 'Dialogue (Spoken Audio)',
        dialogueAudioPlaceholder: 'Dialogue to be spoken by the AI. Currently supports Bahasa Melayu only.',
        dialogueAudioNote: '<strong>Note:</strong> Spoken audio is only available for the <strong>Veo 3</strong> model.',
        refImage: 'Reference Image (Optional)',
        uploadImage: 'Upload an image to animate',
        refImageNote: 'The AI will try to use this image as the starting point for the video.',
        generateButton: 'Generate Video',
        resetButton: 'Reset',
        error: 'An Error Occurred',
        outputPlaceholder: 'Your generated video will appear here.'
    },

    productReviewView: {
        title: 'Video Storyboard Generator',
        subtitle: 'Automatically plan and generate a complete product review video.',
        uploadAssets: 'Upload Assets',
        productPhoto: 'Product Photo',
        facePhoto: 'Face Photo of Reviewer',
        productDescription: 'Product Description',
        productDescriptionPlaceholder: 'Describe your product, its benefits, and who it\'s for.',
        creativeOptions: 'Creative Options',
        vibe: 'Overall Vibe',
        backgroundVibe: 'Background Vibe',
        lighting: 'Lighting Style',
        contentType: 'Content Type',
        outputLanguage: 'Output Language',
        captions: 'Include On-Screen Captions?',
        voiceover: 'Include Voiceover Script?',
        generateStoryboardButton: 'Generate Storyboard',
        resetButton: 'Reset',
        outputTitle: 'Generated Storyboard',
        downloadText: 'Download Text',
        loadingStoryboard: 'Generating your storyboard...',
        outputPlaceholder: 'Your 4-scene storyboard will appear here.',
        createImagesButton: 'Create 4 Scene Images',
        generatingImagesButton: 'Generating Images...',
        generatingSceneImages: 'Generating Scene Images...',
        generatedImages: 'Generated Scene Images',
        scene: 'Scene',
        createBatchVideoButton: 'Create 4 Videos',
        createBatchVideoButtonHelp: 'This will generate one video for each scene. This process may take several minutes.',
        generatedVideosTitle: 'Generated Scene Videos',
        creativeDirectionForImages: 'Creative Direction for Images',
        artisticStyle: 'Artistic Style',
        cameraShot: 'Camera Shot',
        composition: 'Composition',
        lensType: 'Lens Type',
        filmSim: 'Film Simulation',
        creativityLevel: 'Creativity Level',
        videoGenerationSettings: 'Video Generation Settings',
        aiModel: 'AI Model',
        aspectRatio: 'Aspect Ratio',
        resolution: 'Resolution',
    },

    videoCombinerView: {
        title: 'Video Combiner',
        subtitle: 'Select and combine multiple video clips into a single video.',
        selectVideos: 'Select Videos from Your Gallery',
        selected: 'selected',
        noVideos: 'You have not generated any videos yet. Go to the Video Generation tab to create some.',
        combineButton: 'Combine {count} Videos',
        initializing: 'Initializing Engine...',
        engineError: 'Engine Failed to Load',
        combining: 'Combining...',
        loading: 'Processing...',
        loadingVideo: 'Loading video {current} of {total}...',
        creatingFileList: 'Creating file list...',
        combiningVideos: 'Combining videos...',
        finishing: 'Finishing up...',
        error: 'An Error Occurred',
        downloadCombined: 'Download Combined Video',
        outputPlaceholder: 'Your combined video will appear here.'
    },
    
    voiceStudioView: {
        title: 'Voice Studio',
        subtitle: 'Convert your text script into a professional voice-over.',
        writeScript: 'Write Your Script',
        scriptPlaceholder: 'Type or paste your script here...',
        characters: 'characters',
        selectVoice: 'Select a Voice Actor',
        advancedSettings: 'Advanced Settings',
        speed: 'Speed',
        pitch: 'Pitch',
        volume: 'Volume',
        generateButton: 'Generate Voice-Over',
        resetButton: 'Reset',
        loading: 'Generating audio...',
        apiErrorTitle: 'API Access Required',
        apiErrorBody: 'This feature uses the Google Cloud Text-to-Speech API, which needs to be enabled in your Google Cloud project.',
        apiErrorButton: 'Enable API Now',
        apiErrorHelp: 'After enabling, it may take a few minutes to become active.',
        genericError: 'An error occurred during generation.',
        downloadAudio: 'Download Audio (MP3)',
        outputPlaceholder: 'Your generated audio will appear here.'
    },
    batchProcessorView: {
        title: 'Batch Video Processor',
        subtitle: 'Generate multiple videos from a list of prompts in a single run.',
        uploadPrompts: 'Upload a .txt file with one prompt per line',
        promptsLoaded: '{count} prompts loaded from {fileName}.',
        noPrompts: 'Upload a text file or add prompts from the Storyboard tab to begin.',
        clearPrompts: 'Clear all prompts',
        videoSettings: 'Video Settings',
        aiModel: 'AI Model',
        aspectRatio: 'Aspect Ratio',
        resolution: 'Resolution',
        startProcessing: 'Start Processing',
        stopProcessing: 'Stop Processing',
        logsAndProgress: 'Logs & Progress',
        textPrompts: 'Text Prompts',
        generatedVideos: 'Generated Videos',
        failedTasks: 'Failed Tasks',
        activityLogs: 'Activity Logs',
        initialLog: 'Ready to process your batch. Upload your prompts.',
        processStarting: 'Starting batch process for {count} prompts...',
        processingPrompt: 'Processing {current}/{total}: "{prompt}"',
        videoSuccess: 'Successfully generated video for: "{prompt}"',
        videoError: 'Error generating video for "{prompt}": {error}',
        processCancelled: 'Process cancelled by user.',
        processComplete: 'Batch processing complete.',
    },

    apiGeneratorView: {
        title: 'API Key Generator',
        subtitle: 'For admin use only. Generate temporary Gemini API keys for users.',
        requestNewKey: 'Request a New API Key',
        description: 'This free API is for Text, Image Generation, and Image Edit only. For VEO videos, please use your own API key obtained from Google AI Studio.',
        requestButton: 'Request Available Keys',
        fetchError: 'Failed to fetch keys: {error}',
        applyError: 'Failed to apply key: {error}',
        claimError: 'Failed to claim key: {error}',
        noKeys: 'No new keys are available at the moment. Please try again later.',
        noActiveKeys: 'No new, active keys are available at the moment. Please try again later.',
        successMessage: 'Key successfully applied to your account and copied to clipboard!',
        availableKeysTitle: 'Available Keys',
    },

    eCourseView: {
        title: 'Welcome',
        subtitle: 'Learn how to maximize your use of the MONOklix.com AI platform.',
        platformUpdatesTitle: 'Platform Updates',
        allSystemsOperational: 'All Systems Operational',
        degradedPerformance: 'Degraded Performance',
        majorOutage: 'Major Outage',
        lastUpdated: 'Last Updated',
        latestAnnouncements: 'Latest Announcements',
        postedOn: 'Posted on',
        gettingStartedTitle: 'Hello',
        videoTutorials: 'More Video Tutorials'
    },
    
    socialPostStudioView: {
        title: 'Social Post Studio',
        subtitle: 'Create, schedule, and send your social media content to your favorite automation tool.',
        textContentLabel: 'Text Content',
        textContentPlaceholder: 'Write your caption here, or use the AI writer!',
        generateWithAi: 'Generate with AI',
        hashtagsLabel: 'Hashtags',
        mediaLabel: 'Media (1 Video or up to 4 Images)',
        noMedia: 'No media selected.',
        addMediaButton: 'Add from Gallery',
        uploadFromDesktop: 'Upload from Desktop',
        ctaLabel: 'Call to Action (Optional)',
        ctaPlaceholder: 'e.g., "Shop Now", "Learn More"',
        linkLabel: 'Link (Optional)',
        linkPlaceholder: 'https://example.com/product',
        scheduleLabel: 'Schedule (Optional)',
        previewTitle: 'Live Preview',
        sendButton: 'Send to Webhook',
        sending: 'Sending...',
        sendSuccess: 'Post successfully sent to your webhook!',
        sendError: 'Failed to send post.',
        noWebhookTitle: 'Webhook Not Configured',
        noWebhookBody: 'To use the Social Post Studio, please set up your webhook URL in the "API & Integrations" tab in Settings.',
        // Media Selection Modal
        modalTitle: 'Select Media from Gallery',
        modalSelectionRule: 'You can select 1 video OR up to 4 images.',
        modalImagesTab: 'Images',
        modalVideosTab: 'Videos',
        modalConfirm: 'Confirm Selection',
        // AI Writer Modal
        aiWriterModalTitle: 'AI Writer',
        selectAgent: 'Select AI Agent',
        agents: {
            najwa: { name: 'Najwa' },
            julia: { name: 'Julia' },
            musa: { name: 'Musa' },
        },
        outputLanguage: 'Output Language',
        agentDescription: 'Describe your post topic',
        agentInputPlaceholder: 'e.g., "A post about our new coffee product, highlighting its rich aroma and special discount."',
        generate: 'Generate Text',
        generating: 'Generating...',
        generatedCaption: 'Generated Caption',
        generatedHashtags: 'Generated Hashtags',
        generatedCta: 'Generated Call-to-Action',
        close: 'Close',
        useText: 'Use This Text',
    },

  },
  ms: {
    // App.tsx
    apiKeyRequiredTitle: 'Kunci API Diperlukan',
    apiKeyRequiredBody: 'Untuk menggunakan ciri AI, sila berikan Kunci API Gemini anda sendiri di halaman Tetapan.',
    subscriptionExpiredTitle: 'Langganan Telah Tamat',
    subscriptionExpiredBody: 'Langganan satu tahun anda telah berakhir. Sila hubungi sokongan untuk memperbaharui akses anda.',

    // ApiKeyClaimModal.tsx
    apiKeyClaimModal: {
      title: 'Ralat Kunci API Dikesan',
      body: 'Nampaknya kunci API semasa anda mempunyai isu. Anda boleh menuntut kunci API sementara yang baharu di bawah untuk meneruskan kerja anda dengan segera.',
    },
    
    // LoginPage.tsx
    loginPage: {
      title: 'Selamat Kembali',
      subtitle: 'Masukkan e-mel anda untuk log masuk.',
      emailPlaceholder: 'Alamat E-mel',
      loginButton: 'Log Masuk',
      noAccount: 'Tiada akaun?',
      registerButton: 'Daftar & Bayar untuk Dapatkan Akses',
    },
    
    // WelcomeAnimation.tsx
    welcome: 'Selamat Kembali!',

    // Sidebar.tsx
    sidebar: {
      home: 'Utama',
      homeDesc: 'Selamat Datang & Kemas Kini',
      getStarted: 'Mula Di Sini',
      aiContentIdea: 'Idea Kandungan AI',
      aiImage: 'Imej AI',
      aiVideo: 'Video & Suara AI',
      promptLibrary: 'Koleksi Prompt',
      imageGallery: 'Galeri',
      socialPostStudio: 'Social Post Studio',
      settings: 'Tetapan',
      cacheManager: 'Pengurus Cache',
      logout: 'Log Keluar',
      aiAgent: 'Ejen AI',
    },

    // Tabs
    tabs: {
        staffMonoklix: 'Staf MONOklix',
        contentIdeas: 'Idea Kandungan',
        marketingCopy: 'Teks Pemasaran',
        storyline: 'Jalan Cerita',
        imageGeneration: 'Penjana Imej',
        productPhotos: 'Gambar Produk',
        modelPhotos: 'Gambar Model',
        enhancer: 'Penambahbaik',
        bgRemover: 'Pembuang Latar',
        videoGeneration: 'Penjana Video',
        videoStoryboard: 'Papan Cerita Video',
        videoCombiner: 'Penggabung Video',
        voiceStudio: 'Studio Suara',
        batchProcessor: 'Pemproses Berkelompok',
        images: 'Imej',
        videos: 'Video',
        history: 'Sejarah',
        profile: 'Profil Pengguna',
        api: 'API & Integrasi',
        log: 'Log API',
        aiSupport: 'Sokongan AI',
        contentAdmin: 'Admin Kandungan',
        userDb: 'Pangkalan Data Pengguna',
        // New Prompt Library Suite Tabs
        nanoBanana: 'Nano-Banana',
        viralMy: 'Viral MY',
    },

    getStartedPage: {
      mainTitle: 'Panduan Pengguna MONOklix.com',
      mainSubtitle: 'Selamat datang! Panduan ini akan membantu anda memahami setiap ciri yang tersedia.',
      
      chapter1: {
        title: 'Bab 1: Permulaan & Penyediaan Awal',
        sub1_1_title: '1.1. Cara Log Masuk',
        sub1_1_p1: 'Aplikasi ini menggunakan sistem log masuk tanpa kata laluan.',
        sub1_1_ol: [
          'Buka aplikasi.',
          'Masukkan alamat e-mel yang anda daftarkan semasa pembayaran.',
          'Klik butang Log Masuk. Anda akan terus dibawa ke dalam platform. Sesi anda akan disimpan, jadi anda tidak perlu log masuk setiap kali.'
        ],
        sub1_2_title: '1.2. Penyediaan Kunci API (Dua Pilihan)',
        sub1_2_p1: 'Selepas log masuk, anda WAJIB menyediakan Kunci API Google Gemini. Tanpa Kunci API, semua ciri AI tidak akan berfungsi. Anda mempunyai dua pilihan:',
        sub1_2_option1_title: 'Pilihan A: Guna Kunci Sendiri (Disyorkan)',
        sub1_2_option1_p1: 'Ini adalah kaedah terbaik untuk akses tanpa had dan stabil.',
        sub1_2_option1_ol: [
            'Di menu kiri (Sidebar), klik pada **Tetapan**.',
            'Pilih tab **API & Integrasi**.',
            'Pergi ke laman web Google AI Studio untuk mendapatkan Kunci API anda secara percuma.',
            'Salin Kunci API dan tampalkannya ke dalam medan "Kunci API Google Gemini".',
            'Klik butang **Simpan**.'
        ],
        sub1_2_option1_video_title: 'Panduan Video: Cara Mendapatkan Kunci API Anda Sendiri',
        sub1_2_option2_title: 'Pilihan B: Tuntut Kunci Sementara (Sandaran)',
        sub1_2_option2_p1: 'Jika anda tidak mempunyai kunci sendiri atau jika kunci anda menghadapi masalah (cth., kuota melebihi had), anda boleh menuntut kunci sementara yang disediakan oleh platform.',
        sub1_2_option2_ol: [
            'Pilihan ini biasanya muncul secara automatik dalam tetingkap pop-up apabila ralat API berlaku.',
            'Anda juga boleh mengaksesnya secara manual dengan pergi ke **Tetapan > API & Integrasi** dan cari panel "Minta Kunci API Baru".',
            'Klik **Minta Kunci Tersedia** untuk melihat senarai kunci sementara.',
            'Klik **Tuntut** pada mana-mana kunci yang tersedia. Ia akan digunakan pada akaun anda secara automatik.',
            '**Nota:** Kunci ini dikongsi dan mempunyai had tuntutan harian untuk pengguna biasa. Ia bertujuan untuk penggunaan sementara.'
        ],
        sub1_2_p2: 'Hanya selepas menyediakan Kunci API (menggunakan mana-mana pilihan) barulah anda boleh mula menggunakan semua alatan AI.'
      },
      
      chapter2: {
        title: 'Bab 2: Halaman Utama (e-Tutorial)',
        p1: 'Ini adalah halaman pertama yang akan anda lihat selepas log masuk. Ia mengandungi:',
        ul: [
          '**Kemas Kini & Status Platform:** Maklumat terkini tentang status sistem dan pengumuman penting.',
          '**Tutorial Permulaan:** Video panduan utama untuk mula menggunakan platform.',
          '**Tutorial Video:** Koleksi video lain yang menerangkan ciri-ciri khusus.'
        ]
      },

      chapter3: {
        title: 'Bab 3: ETIKA PENGGUNAAN WAJAH',
        p1: 'Apabila menggunakan ciri seperti `Gambar Model` atau memuat naik imej rujukan yang mengandungi wajah, sila patuhi garis panduan etika dan keselamatan berikut untuk memastikan penggunaan yang bertanggungjawab.',
        
        canDoTitle: 'BOLEH DILAKUKAN:',
        canDo: [
            'Gunakan gambar wajah anda sendiri atau model yang telah anda upah dan dapatkan persetujuan daripadanya.',
            'Gunakan ciri ini untuk mencipta kandungan UGC yang kelihatan tulen untuk produk anda.',
            'Jadilah kreatif dengan prompt untuk meletakkan model AI anda dalam pelbagai latar belakang dan gaya.'
        ],

        dontTitle: 'JANGAN:',
        dont: [
            'Memuat naik gambar orang yang anda temui di media sosial, selebriti, atau sesiapa sahaja tanpa kebenaran mereka.',
            'Cuba untuk menjana kandungan yang mengelirukan, berbahaya, atau tidak sesuai.'
        ],

        conclusion: 'Dengan mengikuti garis panduan ini, anda boleh menggunakan kuasa AI dengan selamat dan berkesan untuk menjana imej dan video yang menampilkan orang.',
        
        safetyFilterTitle: 'Nota Penting Mengenai Penapis Keselamatan:',
        safetyFilterP1: 'Google mempunyai sistem penapisan keselamatan AI yang sangat ketat untuk mengelakkan penyalahgunaan.',
        safetyFilterUl: [
          '**Output Mungkin Tiada:** Jika anda menggunakan imej wajah (terutamanya wajah sebenar) dan mendapati tiada imej yang dijana (output kosong), kemungkinan besar ia telah disekat oleh penapis keselamatan ini.',
          '**Cara Mengatasi:** Jika ini berlaku, jangan risau. Cuba ubah permintaan anda. Anda boleh:',
        ],
        safetyFilterOl: [
            'Ubah Prompt: Gunakan perkataan yang lebih umum dan selamat.',
            'Ubah Imej Rujukan: Gunakan gambar wajah yang berbeza.',
            'Laraskan Tetapan: Tukar tetapan kreatif seperti `Vibe` atau `Pose` untuk menghasilkan variasi yang mungkin lebih diterima oleh sistem AI.'
        ],
        safetyFilterConclusion: 'Memahami perkara ini akan membantu anda mendapatkan hasil yang lebih konsisten apabila bekerja dengan imej yang melibatkan orang.'
      },

      chapter4: {
          title: 'Bab 4: Suite Idea Kandungan AI (Idea & Teks)',
          p1: 'Suite ini direka untuk membantu anda menjana idea dan teks pemasaran.',
          sub4_1_title: '4.1. Staf MONOklix',
          sub4_1_p1: 'Pilih "staf" AI yang merupakan pakar dalam bidang tertentu untuk membantu anda.',
          sub4_1_p2: 'Cara Guna: Pilih seorang staf (cth: Wan untuk Persona Pelanggan), masukkan input yang diperlukan (cth: "produk kopi pracampur"), pilih bahasa, dan klik Jana.',
          sub4_2_title: '4.2. Idea Kandungan',
          sub4_2_p1: 'Jana idea kandungan yang relevan dengan topik semasa menggunakan Carian Google.',
          sub4_2_p2: 'Cara Guna: Masukkan topik anda (cth: "fesyen lestari"), pilih bahasa, dan AI akan memberikan 5 idea kandungan dengan tajuk dan penerangan.',
          sub4_3_title: '4.3. Teks Pemasaran',
          sub4_3_p1: 'Tulis teks jualan yang memikat.',
          sub4_3_p2: 'Cara Guna: Isi butiran produk, sasaran audiens, kata kunci, dan pilih nada penulisan. AI akan menjana teks pemasaran yang lengkap.',
          sub4_4_title: '4.4. Jalan Cerita',
          sub4_4_p1: 'Jana konsep dan skrip ringkas untuk iklan video.',
          sub4_4_p2: 'Cara Guna: Muat naik imej produk, tulis penerangan produk, pilih "vibe" dan jenis kandungan. AI akan menghasilkan satu babak lengkap dengan visual dan teks.'
      },

      chapter5: {
          title: 'Bab 5: Suite Imej AI (Imej)',
          p1: 'Semua yang berkaitan dengan penjanaan dan penyuntingan imej ada di sini.',
          sub5_1_title: '5.1. Penjana Imej',
          sub5_1_p1: 'Alat utama untuk mencipta imej daripada teks atau menyunting gambar sedia ada.',
          sub5_1_ul: [
              '**Teks-ke-Imej:** Biarkan bahagian "Imej Rujukan" kosong. Tulis prompt anda (cth: "seorang angkasawan di bulan, pencahayaan sinematik, hiperrealistik"), pilih nisbah aspek, dan klik Jana.',
              '**Imej-ke-Imej (Menyunting):** Muat naik 1-5 imej rujukan. Tulis arahan suntingan dalam medan prompt (cth: "tambah topi hari jadi pada orang itu").'
          ],
          sub5_2_title: '5.2. Gambar Produk',
          sub5_2_p1: 'Letakkan produk anda dalam latar belakang yang profesional.',
          sub5_2_p2: 'Cara Guna: Muat naik imej produk anda (sebaiknya dengan latar belakang kosong/putih). Pilih "vibe" atau latar belakang yang anda inginkan. AI akan menggabungkan produk anda secara realistik ke dalam latar tersebut.',
          sub5_3_title: '5.3. Gambar Model',
          sub5_3_p1: 'Cipta gambar model (gaya UGC) dengan produk anda.',
          sub5_3_p2: 'Cara Guna:',
          sub5_3_ol: [
              'Muat naik gambar produk.',
              '(Pilihan) Muat naik gambar wajah sebagai rujukan. Jika tidak, AI akan menjana wajah baru berdasarkan pilihan "Wajah Model".',
              'Pilih jantina dan tetapan kreatif lain. AI akan menghasilkan imej model yang menggunakan atau mempamerkan produk anda.'
          ],
          sub5_4_title: '5.4. Penambahbaik',
          sub5_4_p1: 'Meningkatkan kualiti imej.',
          sub5_4_p2: 'Cara Guna: Muat naik imej. Pilih sama ada Tingkatkan Kualiti (menambah baik resolusi & ketajaman) atau Tingkatkan Warna (menyerlahkan warna).',
          sub5_5_title: '5.5. Pembuang Latar',
          sub5_5_p1: 'Buang latar belakang imej secara automatik.',
          sub5_5_p2: 'Cara Guna: Muat naik imej, dan klik Buang Latar Belakang. Hasilnya ialah imej dengan latar belakang telus.'
      },

      chapter6: {
          title: 'Bab 6: Suite Video & Suara AI (Video & Suara)',
          p1: 'Suite untuk mencipta kandungan video dan audio.',
          sub6_1_title: '6.1. Penjana Video',
          sub6_1_p1: 'Jana klip video pendek daripada teks atau imej.',
          sub6_1_p2: 'Cara Guna: Tulis prompt yang menerangkan subjek dan aksi (cth: "seekor anak anjing golden retriever, mengejar bola merah di taman"). Anda juga boleh memuat naik imej rujukan untuk dianimasikan. Pilih model AI, nisbah aspek, dan tetapan lain.',
          sub6_1_p3: 'Nota: Penjanaan video mungkin mengambil masa beberapa minit.',
          sub6_2_title: '6.2. Papan Cerita Video',
          sub6_2_p1: 'Alat canggih untuk merancang video ulasan produk.',
          sub6_2_p2: 'Proses 2-Langkah:',
          sub6_2_ol: [
              '**Jana Papan Cerita:** Muat naik imej produk dan gambar wajah model. Isi penerangan produk dan pilih tetapan kreatif. Klik Jana Papan Cerita. AI akan menghasilkan skrip 4-babak.',
              '**Cipta Imej:** Selepas papan cerita siap, klik butang Cipta 4 Imej. AI akan menjana satu imej untuk setiap babak dalam papan cerita.'
          ],
          sub6_3_title: '6.3. Pemproses Berkelompok (Admin Sahaja)',
          sub6_3_p1: 'Jana beberapa video dalam satu proses daripada senarai prompt.',
          sub6_3_p2: 'Cara Guna: Cipta fail teks (.txt) dengan satu prompt video pada setiap baris. Muat naik fail tersebut, konfigurasikan tetapan video anda (model, nisbah aspek), dan klik Mula Memproses. Sistem akan menjana video untuk setiap prompt secara berurutan.',
          sub6_4_title: '6.4. Penggabung Video (Admin Sahaja)',
          sub6_4_p1: 'Gabungkan beberapa klip video menjadi satu.',
          sub6_4_p2: 'Cara Guna: Pilih video yang telah anda jana (dari Galeri anda). Klik butang Gabung Video. Proses ini berlaku sepenuhnya dalam pelayar anda.',
          sub6_5_title: '6.5. Studio Suara',
          sub6_5_p1: 'Tukar teks kepada ucapan.',
          sub6_5_p2: 'Cara Guna: Tulis skrip anda. Pilih Pelakon Suara, laraskan kelajuan, nada, dan kelantangan. Klik Jana Suara Latar untuk menghasilkan fail audio MP3.',
      },
      
      chapter7: {
        title: 'Bab 7: Social Post Studio',
        p1: 'Ini ialah pusat sehenti untuk mencipta dan menyusun kandungan media sosial anda sebelum menghantarnya ke alat automasi seperti n8n atau Zapier.',
        sub7_1_title: '7.1. Cara Penggunaan',
        sub7_1_p1: 'Ikuti langkah-langkah ini untuk membina pos anda:',
        sub7_1_ol: [
            '**Tulis Kandungan:** Tulis kapsyen anda terus di kotak "Kandungan Teks", atau klik "Jana dengan AI" untuk menggunakan salah seorang ejen AI untuk menulisnya untuk anda.',
            '**Tambah Hashtag:** Masukkan hashtag anda dalam medan yang disediakan.',
            '**Tambah Media:** Klik "Tambah dari Galeri" untuk memilih video atau sehingga 4 imej yang telah anda jana. Sebagai alternatif, klik "Muat Naik dari Desktop" untuk menambah fail baru.',
            '**Tambah Butiran (Pilihan):** Anda boleh menambah Seruan Tindak, pautan luaran, dan menetapkan tarikh/masa jadual.',
            '**Pratonton:** Lihat pratonton langsung pos anda di sebelah kanan.',
            '**Hantar:** Apabila siap, klik "Hantar ke Webhook". Ini akan menghantar semua data pos (teks, media, maklumat jadual) ke URL yang telah anda konfigurasikan dalam tetapan anda.'
        ],
        sub7_1_p2: 'Nota: Untuk menggunakan ciri ini, anda mesti menyediakan URL Webhook Peribadi anda terlebih dahulu di **Tetapan > API & Integrasi**.'
      },

      chapter8: {
          title: 'Bab 8: Aset & Inspirasi Anda',
          sub8_1_title: '8.1. Galeri & Log API',
          sub8_1_p1: 'Galeri ialah tempat semua kandungan (imej, video, audio, teks) yang anda jana disimpan secara automatik. Anda boleh menyemak, memuat turun atau menggunakan semula aset anda di sini. Contohnya, klik ikon "Sunting Semula" pada imej untuk membawanya ke `Penjana Imej` atau klik ikon "Cipta Video" untuk menghantarnya ke `Penjana Video`.',
          sub8_1_p2: 'Tab Log API di dalam Galeri menunjukkan rekod terperinci setiap panggilan API yang telah anda buat, yang berguna untuk memeriksa penggunaan dan menyelesaikan masalah.',
          sub8_2_title: '8.2. Koleksi Prompt',
          sub8_2_p1: 'Ini ialah hab inspirasi dengan dua bahagian:',
          sub8_2_ul: [
              '**Nano-Banana:** Koleksi kes penggunaan lanjutan dan kreatif untuk model `gemini-2.5-flash-image`, yang bersumber daripada pustaka rasmi "Awesome Nano Banana".',
              '**Viral MY:** Senarai susun atur prompt yang sedang tren dan viral khusus untuk pasaran Malaysia, yang diuruskan oleh admin.'
          ],
          sub8_2_p2: 'Cara Guna: Semak imbas koleksi. Jika anda menemui prompt yang anda suka, klik **Guna Prompt Ini** untuk menghantarnya terus ke `Penjana Imej`.'
      },

      chapter9: {
          title: 'Bab 9: Tetapan & Ciri Lanjutan',
          sub9_1_title: '9.1. Profil Pengguna',
          sub9_1_p1: 'Kemas kini nama anda dan tukar tema antara mod Terang dan Gelap.',
          sub9_2_title: '9.2. API & Integrasi',
          sub9_2_ul: [
              '**Kunci API:** Tempat untuk mengurus Kunci API Google Gemini peribadi anda.',
              '**Token Auth Veo 3.0:** Arahan tentang cara mendapatkan token kebenaran khas yang diperlukan **hanya untuk model Veo 3.0**.',
              '**Pemeriksaan Kesihatan API:** Jalankan pemeriksaan menyeluruh pada semua perkhidmatan AI yang disepadukan untuk memastikan kunci API anda dikonfigurasikan dengan betul dan beroperasi.',
              '**Webhook Peribadi:** (Untuk pengguna lanjutan) Masukkan URL webhook (cth., dari n8n atau Zapier) untuk menghantar kandungan yang anda jana secara automatik ke perkhidmatan luaran untuk automasi tersuai.',
              '**Tuntut Kunci Sementara:** Jika kunci anda tidak berfungsi, gunakan panel ini untuk meminta dan menuntut kunci sementara dengan had kadar untuk terus bekerja.'
          ],
          sub9_3_title: '9.3. Sokongan AI',
          sub9_3_p1: 'Ruang sembang dengan ejen sokongan AI kami untuk sebarang pertanyaan atau bantuan.'
      },
      
      chapter10: {
        title: 'Bab 10: Penyelesaian Masalah & Kod Ralat',
        p1: 'Kadangkala, anda mungkin menghadapi mesej ralat semasa menggunakan ciri AI. Jadual di bawah menerangkan ralat yang paling biasa, puncanya, dan cara menyelesaikannya.',
        table: [
          {
            code: '`400` <br/> (Bad Request)',
            problem: '**Permintaan Tidak Sah.** Ini adalah ralat yang paling biasa dan biasanya disebabkan oleh: <br/><br/> 1. **Pelanggaran Dasar Keselamatan:** Prompt teks atau imej anda mengandungi elemen yang disekat oleh penapis keselamatan Google (cth: kandungan ganas, sensitif). <br/><br/> 2. **Prompt atau Parameter Salah:** Struktur prompt anda mungkin mengelirukan AI, atau tetapan yang anda pilih tidak disokong. <br/><br/> 3. **Tiada Output Dihasilkan:** AI berjaya memproses permintaan tetapi gagal menghasilkan sebarang output, selalunya disebabkan oleh sekatan keselamatan dalaman.',
            solution: '1. **Ubah Suai Prompt:** Jadikan arahan anda lebih umum dan selamat. Elakkan perkataan yang boleh disalah tafsir. <br/><br/> 2. **Tukar Imej Rujukan:** Jika menggunakan imej, cuba imej lain yang lebih neutral. <br/><br/> 3. **Permudahkan Permintaan:** Kurangkan arahan yang kompleks dalam satu prompt.'
          },
          {
            code: '`401` / `403` <br/> (Unauthorized)',
            problem: '**Isu Pengesahan Kunci API.** Ralat ini berlaku apabila Kunci API anda tidak dapat digunakan, disebabkan oleh: <br/><br/> 1. **Kunci API Tidak Sah atau Salah:** Kunci yang anda masukkan dalam **Tetapan > API & Integrasi** adalah salah. <br/><br/> 2. **API Tidak Diaktifkan:** Kunci anda betul, tetapi API yang diperlukan (cth: Cloud Text-to-Speech API) tidak diaktifkan dalam projek Google Cloud anda.',
            solution: '1. **Sahkan Kunci Anda:** Pergi ke **Tetapan > API & Integrasi** dan tampal kunci anda sekali lagi. Pastikan tiada ruang tambahan. <br/><br/> 2. **Tuntut Kunci Sementara:** Gunakan ciri tuntutan kunci di Tetapan atau modal pop-up untuk mendapatkan kunci yang berfungsi serta-merta. <br/><br/> 3. **Aktifkan API:** Lawati Google Cloud Console anda dan pastikan semua API yang diperlukan (Gemini, Text-to-Speech, dll.) diaktifkan untuk projek anda.'
          },
          {
            code: '`429` <br/> (Too Many Requests)',
            problem: '**Kuota Melebihi Had.** Anda telah membuat terlalu banyak permintaan API dalam tempoh yang singkat. Kunci API peringkat percuma atau sementara mempunyai had kadar yang ketat.',
            solution: '1. **Tunggu:** Penyelesaian paling mudah ialah menunggu seminit sebelum mencuba lagi. <br/><br/> 2. **Tuntut Kunci Sementara Baru:** Jika anda menggunakan kunci sementara, anda mungkin telah kehabisan kuotanya. Cuba tuntut yang baru. <br/><br/> 3. **Gunakan Kunci Anda Sendiri:** Kunci API peribadi selalunya mempunyai had yang lebih tinggi. Pertimbangkan untuk menyediakannya.'
          },
          {
            code: '`500` / `503` <br/> (Server Error)',
            problem: '**Ralat Pelayan Dalaman.** Ini menunjukkan masalah sementara di pihak Google. Ia bukan isu dengan permintaan atau kunci API anda.',
            solution: '1. **Tunggu dan Cuba Semula:** Tunggu sebentar dan cuba permintaan anda sekali lagi. Isu-isu ini biasanya diselesaikan dengan cepat. <br/><br/> 2. **Periksa Halaman Status:** Anda boleh menyemak Papan Pemuka Status Google Cloud rasmi untuk melihat sama ada terdapat sebarang gangguan yang dilaporkan.'
          },
          {
            code: '`Network Error` / `Failed to Fetch`',
            problem: '**Masalah Sambungan.** Aplikasi tidak dapat mencapai pelayan Google. Ini hampir selalu merupakan isu rangkaian tempatan.',
            solution: '1. **Periksa Sambungan Internet:** Pastikan anda disambungkan ke internet. <br/><br/> 2. **Periksa Penghalang:** Lumpuhkan sebarang VPN, tembok api, atau penyekat iklan yang mungkin mengganggu sambungan. <br/><br/> 3. **Segarkan Semula Aplikasi:** Penyegaran semula yang mudah selalunya boleh menyelesaikan gangguan rangkaian sementara.'
          },
        ]
      },

      chapter11: {
        title: 'Bab 11: Pengebilan, Kredit, dan Penggunaan',
        p1: 'Aplikasi ini beroperasi pada model "Bawa Kunci Anda Sendiri" (BYOK). Ini bermakna anda bertanggungjawab untuk sebarang kos yang berkaitan dengan penggunaan Kunci API Google Gemini anda.',
        p2: 'Mujurlah, Google menawarkan peringkat percuma yang murah hati yang mencukupi untuk kebanyakan pengguna bagi tujuan percubaan dan penggunaan ringan.',
        sub11_1_title: '11.1. Memahami Peringkat Percuma',
        sub11_1_p1: 'Peringkat percuma Google Gemini menyediakan sejumlah panggilan API percuma setiap minit dan setiap hari. Had ini tertakluk kepada perubahan oleh Google, tetapi secara amnya meliputi:',
        sub11_1_ul: [
          '**Gemini Pro (Teks):** Beribu-ribu permintaan setiap hari.',
          '**Imagen (Penjanaan Imej):** Sebilangan terhad penjanaan imej percuma.',
          '**Veo (Penjanaan Video):** Penjanaan video adalah perkhidmatan premium dan mungkin dikenakan kos serta-merta.',
          '**Text-to-Speech:** Sebilangan besar aksara percuma setiap bulan.'
        ],
        sub11_2_title: '11.2. Cara Memantau Penggunaan dan Pengebilan Anda',
        sub11_2_ul: [
          '1. Pergi ke <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" class="text-primary-600 dark:text-primary-400 hover:underline">Google Cloud Console</a>.',
          '2. Pastikan anda berada dalam projek yang betul yang dikaitkan dengan Kunci API anda.',
          '3. Navigasi ke bahagian **Pengebilan** untuk melihat kos semasa anda dan menyediakan belanjawan.',
          '4. Navigasi ke **API & Perkhidmatan > Papan Pemuka** untuk melihat metrik penggunaan terperinci bagi setiap API (cth: `Generative Language API`, `Cloud Text-to-Speech API`).'
        ],
        sub11_3_title: '11.3. Anggaran Kos (Melebihi Peringkat Percuma)',
        sub11_3_p1: 'Kos ditentukan oleh Google dan boleh berubah. Jadual di bawah memberikan anggaran umum. Untuk harga yang paling tepat dan terkini, sentiasa rujuk halaman harga rasmi Google Cloud.',
        tableHeaders: {
          category: 'Kategori',
          model: 'Model/Perkhidmatan',
          cost: 'Anggaran Kos (per unit)',
        },
        table: [
          { category: 'Input Teks', model: 'gemini-2.5-flash', cost: '~$0.0001 per 1,000 aksara' },
          { category: 'Output Teks', model: 'gemini-2.5-flash', cost: '~$0.0002 per 1,000 aksara' },
          { category: 'Penjanaan Imej', model: 'imagen-4.0', cost: '~$0.02 per imej' },
          { category: 'Penjanaan Video', model: 'veo-2.0', cost: '~$0.002 per saat video' },
          { category: 'Penjanaan Suara', model: 'Google Cloud TTS', cost: '~$0.000016 per aksara' },
        ],
        sub11_4_title: '11.4. Mendapatkan Bantuan',
        sub11_4_ul: [
          'Jika anda mempunyai soalan tentang pengebilan anda, adalah lebih baik untuk menghubungi Sokongan Google Cloud secara terus melalui Cloud Console anda.',
          'Untuk soalan tentang cara aplikasi menggunakan API, anda boleh menggunakan sembang Sokongan AI terbina dalam.'
        ],
        sub11_4_p2: 'Anda juga boleh bertanya kepada `Sokongan AI` kami untuk membantu memahami corak penggunaan anda.'
      },

      chapter12: {
        title: 'Terima kasih kerana menggunakan MONOklix.com! Kami harap anda mencipta perkara yang menakjubkan.'
      }
    },
    
    // Standardized Messages
    generating: 'Menjana...',
    videoTakesTime: 'Ini mungkin mengambil masa beberapa minit. Sila bersabar.',

    libraryView: {
        copied: 'Disalin!',
        copy: 'Salin',
    },

    promptViralMyView: {
        title: 'Prompt Viral MY',
        subtitle: 'Perpustakaan prompt yang sedang tren dan viral khusus untuk pasaran Malaysia.'
    },

    staffMonoklixView: {
        title: 'Staf MONOklix',
        subtitle: 'Pilih ejen AI untuk membantu anda dengan tugas pemasaran tertentu.',
        inputFor: 'Input untuk',
        outputLanguage: 'Bahasa Output',
        generateButton: 'Jana',
        resetButton: 'Set Semula',
        download: 'Muat Turun',
        outputPlaceholder: 'Kandungan yang anda jana akan muncul di sini.'
    },

    contentIdeasView: {
        title: 'Idea Kandungan',
        subtitle: 'Jana idea kandungan yang relevan dan terkini untuk sebarang topik menggunakan carian masa nyata.',
        topicLabel: 'Apakah topik anda?',
        topicPlaceholder: 'cth., "resepi sarapan sihat untuk orang sibuk"',
        outputLanguage: 'Bahasa Output',
        generateButton: 'Jana Idea',
        resetButton: 'Set Semula',
        loading: 'Menjana idea...',
        outputPlaceholder: 'Idea kandungan anda akan muncul di sini.'
    },

    marketingCopyView: {
        title: 'Penjana Teks Pemasaran',
        subtitle: 'Cipta teks yang meyakinkan dan menarik untuk produk atau perkhidmatan anda.',
        productDetailsLabel: 'Butiran Produk/Perkhidmatan',
        productDetailsPlaceholder: 'Terangkan apa yang anda jual, ciri-cirinya, dan faedah utamanya.',
        targetAudienceLabel: 'Sasaran Audiens (Pilihan)',
        targetAudiencePlaceholder: 'cth., "Profesional muda, pelajar, ibu bapa"',
        keywordsLabel: 'Kata Kunci untuk Disertakan (Pilihan)',
        keywordsPlaceholder: 'cth., "mesra alam, tawaran istimewa, masa terhad"',
        toneLabel: 'Nada Suara',
        outputLanguage: 'Bahasa Output',
        generateButton: 'Jana Teks',
        resetButton: 'Set Semula',
        loading: 'Menulis teks anda...',
        outputPlaceholder: 'Teks pemasaran yang dijana akan muncul di sini.'
    },
    
    productAdView: {
        title: 'Jalan Cerita Iklan Video',
        subtitle: 'Muat naik gambar produk dan dapatkan konsep iklan video yang ringkas dan padat.',
        uploadProduct: 'Muat Naik Gambar Produk',
        productDescription: 'Penerangan Produk',
        productDescriptionPlaceholder: 'cth., "Sambal Bilis Garing. Ekstra pedas, ekstra rangup. Diperbuat daripada bahan premium. Sesuai dengan nasi."',
        creativeDirection: 'Arahan Kreatif',
        vibe: 'Suasana',
        lighting: 'Pencahayaan',
        contentType: 'Jenis Kandungan',
        outputLanguage: 'Bahasa Output',
        generateButton: 'Jana Jalan Cerita',
        resetButton: 'Set Semula',
        loading: 'Menjana jalan cerita...',
        outputPlaceholder: 'Jalan cerita yang dijana akan muncul di sini.'
    },

    imageGenerationView: {
        title: 'Penjana Imej AI',
        titleEdit: 'Penyunting Imej AI',
        subtitle: 'Cipta imej yang menakjubkan daripada teks atau sunting foto sedia ada anda.',
        subtitleEdit: 'Terangkan perubahan yang anda ingin lakukan pada imej yang dimuat naik.',
        refImagesLabel: 'Imej Rujukan (untuk penyuntingan)',
        upload: 'Muat Naik',
        editingModeNotice: '<strong>Mod Suntingan:</strong> Prompt anda harus menerangkan perubahan yang anda ingin lakukan.',
        refImagesHelp: 'Muat naik 1-5 imej untuk disunting atau digunakan sebagai rujukan gaya.',
        promptLabel: 'Prompt',
        promptPlaceholder: 'cth., "seekor singa megah di bandar futuristik, pencahayaan sinematik, hiperrealistik"',
        promptPlaceholderEdit: 'cth., "tambah topi hari jadi pada orang itu", "tukar latar belakang kepada pantai"',
        advancedEditor: 'Pembina Prompt Lanjutan',
        advancedEditorHelp: 'Tambah istilah fotografi profesional ke dalam prompt anda dengan cepat.',
        style: 'Gaya',
        lighting: 'Pencahayaan',
        cameraAngle: 'Sudut Kamera',
        composition: 'Komposisi',
        lensType: 'Jenis Lensa',
        filmSim: 'Simulasi Filem',
        aspectRatio: 'Nisbah Aspek',
        numberOfImages: 'Bilangan Imej',
        advancedSettings: 'Tetapan Lanjutan',
        negativePrompt: 'Prompt Negatif (apa yang perlu dielakkan)',
        negativePromptPlaceholder: 'cth., "teks, tera air, hodoh, kabur"',
        hdr: 'Julat Dinamik Tinggi',
        applyEditButton: 'Guna Suntingan',
        generateButton: 'Jana',
        resetButton: 'Set Semula',
        outputPlaceholder: 'Karya agung anda akan muncul di sini.',
        reEdit: 'Sunting Semula Imej',
        createVideo: 'Cipta Video dari Imej',
        download: 'Muat Turun Imej',
        scene: 'Babak'
    },

    productPhotoView: {
        title: 'Gambar Produk AI',
        subtitle: 'Letakkan produk anda dalam suasana yang menakjubkan dan profesional.',
        uploadProduct: 'Muat Naik Gambar Produk',
        uploadTitle: 'Muat naik gambar produk yang bersih (PNG dengan latar belakang telus adalah terbaik)',
        customPrompt: 'Prompt Tersuai (Pilihan)',
        customPromptPlaceholder: 'Untuk kawalan penuh, tulis prompt terperinci anda sendiri di sini. Ini akan mengatasi tetapan di bawah.',
        customPromptHelp: 'Jika anda menggunakan ini, tetapan di bawah akan diabaikan.',
        creativeDirection: 'Arahan Kreatif',
        backgroundVibe: 'Latar Belakang / Suasana',
        artisticStyle: 'Gaya Artistik',
        lighting: 'Pencahayaan',
        cameraShot: 'Shot Kamera',
        composition: 'Komposisi',
        lensType: 'Jenis Lensa',
        filmSim: 'Simulasi Filem',
        visualEffect: 'Kesan Visual',
        aiSettings: 'Tetapan AI',
        creativityLevel: 'Tahap Kreativiti',
        numberOfImages: 'Bilangan Imej',
        generateButton: 'Jana Gambar',
        resetButton: 'Set Semula',
        outputPlaceholder: 'Gambar produk profesional anda akan muncul di sini.'
    },

    tiktokAffiliateView: {
        title: 'Gambar Model AI',
        subtitle: 'Cipta gambar gaya UGC model dengan produk anda.',
        assetAndModel: 'Aset & Model',
        productPhoto: 'Gambar Produk',
        productPhotoDesc: 'Muat naik gambar produk yang bersih.',
        facePhoto: 'Gambar Wajah (Pilihan)',
        facePhotoDesc: 'Muat naik wajah untuk digunakan oleh AI. Jika kosong, wajah baru akan dijana.',
        customPrompt: 'Prompt Tersuai (Pilihan)',
        customPromptPlaceholder: 'Untuk kawalan penuh, tulis prompt terperinci anda sendiri di sini. Ini akan mengatasi tetapan di bawah.',
        customPromptHelp: 'Jika anda menggunakan ini, tetapan di bawah akan diabaikan.',
        creativeDirection: 'Arahan Kreatif',
        gender: 'Jantina Model',
        female: 'Perempuan',
        male: 'Lelaki',
        modelFace: 'Wajah Model',
        artisticStyle: 'Gaya Artistik',
        lighting: 'Pencahayaan',
        cameraShot: 'Shot Kamera',
        bodyPose: 'Pose Badan',
        vibe: 'Latar Belakang / Suasana',
        composition: 'Komposisi',
        lensType: 'Jenis Lensa',
        filmSim: 'Simulasi Filem',
        aiSettings: 'Tetapan AI',
        creativityLevel: 'Tahap Kreativiti',
        numberOfImages: 'Bilangan Imej',
        generateButton: 'Jana Gambar',
        resetButton: 'Set Semula',
        outputPlaceholder: 'Gambar model anda akan muncul di sini.'
    },

    backgroundRemoverView: {
        title: 'Pembuang Latar Belakang',
        subtitle: 'Buang latar belakang dari mana-mana imej secara automatik.',
        uploadTitle: 'Muat naik imej untuk membuang latar belakangnya',
        removeButton: 'Buang Latar Belakang',
        resetButton: 'Set Semula',
        loading: 'Membuang latar belakang...',
        original: 'Asal',
        result: 'Hasil',
        outputPlaceholder: 'Imej anda dengan latar belakang telus akan muncul di sini.'
    },

    imageEnhancerView: {
        title: 'Penambahbaik Imej',
        subtitle: 'Tingkatkan kualiti atau warna imej anda dengan satu klik.',
        uploadTitle: 'Muat naik imej untuk ditingkatkan',
        upscaleButton: 'Tingkatkan Kualiti',
        colorsButton: 'Tingkatkan Warna',
        enhanceButton: 'Tingkatkan Imej',
        resetButton: 'Set Semula',
        loading: 'Meningkatkan imej...',
        original: 'Asal',
        enhanced: 'Ditingkatkan',
        outputPlaceholder: 'Imej anda yang telah ditingkatkan akan muncul di sini.'
    },

    videoGenerationView: {
        title: 'Penjana Video AI',
        subtitle: 'Cipta klip video pendek daripada prompt teks dan imej.',
        modelFormat: 'Model & Format',
        aiModel: 'Model AI',
        aspectRatio: 'Nisbah Aspek',
        resolution: 'Resolusi',
        subjectContext: 'Subjek / Konteks',
        subjectContextPlaceholder: 'cth., "seorang lelaki kacak berumur 20-an", "sebotol sos cili"',
        action: 'Aksi / Gerakan',
        actionPlaceholder: 'cth., "tersenyum ke arah kamera", "berdiri di atas meja"',
        creativeDirection: 'Arahan Kreatif',
        style: 'Gaya',
        cameraMotion: 'Gerakan Kamera',
        backgroundVibe: 'Suasana Latar Belakang',
        ambiance: 'Suasana / Mood',
        ambiancePlaceholder: 'cth., "cahaya pagi yang selesa", "mood sinematik yang dramatik"',
        negativePrompt: 'Prompt Negatif',
        negativePromptPlaceholder: 'cth., "kabur, hodoh, tera air"',
        dialogue: 'Dialog (Teks Pada Skrin)',
        dialoguePlaceholder: 'Teks untuk dipaparkan sebagai kapsyen dalam video.',
        dialogueAudio: 'Dialog (Audio Lisan)',
        dialogueAudioPlaceholder: 'Dialog untuk dituturkan oleh AI. Kini menyokong Bahasa Melayu sahaja.',
        dialogueAudioNote: '<strong>Nota:</strong> Audio lisan hanya tersedia untuk model <strong>Veo 3</strong>.',
        refImage: 'Imej Rujukan (Pilihan)',
        uploadImage: 'Muat naik imej untuk dianimasikan',
        refImageNote: 'AI akan cuba menggunakan imej ini sebagai titik permulaan untuk video.',
        generateButton: 'Jana Video',
        resetButton: 'Set Semula',
        error: 'Berlaku Ralat',
        outputPlaceholder: 'Video yang anda jana akan muncul di sini.'
    },

    productReviewView: {
        title: 'Penjana Papan Cerita Video',
        subtitle: 'Rancang dan jana video ulasan produk yang lengkap secara automatik.',
        uploadAssets: 'Muat Naik Aset',
        productPhoto: 'Gambar Produk',
        facePhoto: 'Gambar Wajah Pengulas',
        productDescription: 'Penerangan Produk',
        productDescriptionPlaceholder: 'Terangkan produk anda, faedahnya, dan untuk siapa ia.',
        creativeOptions: 'Pilihan Kreatif',
        vibe: 'Suasana Keseluruhan',
        backgroundVibe: 'Suasana Latar Belakang',
        lighting: 'Gaya Pencahayaan',
        contentType: 'Jenis Kandungan',
        outputLanguage: 'Bahasa Output',
        captions: 'Sertakan Kapsyen Pada Skrin?',
        voiceover: 'Sertakan Skrip Suara Latar?',
        generateStoryboardButton: 'Jana Papan Cerita',
        resetButton: 'Set Semula',
        outputTitle: 'Papan Cerita Dijana',
        downloadText: 'Muat Turun Teks',
        loadingStoryboard: 'Menjana papan cerita anda...',
        outputPlaceholder: 'Papan cerita 4-babak anda akan muncul di sini.',
        createImagesButton: 'Cipta 4 Imej Babak',
        generatingImagesButton: 'Menjana Imej...',
        generatingSceneImages: 'Menjana Imej Babak...',
        generatedImages: 'Imej Babak Dijana',
        scene: 'Babak',
        createBatchVideoButton: 'Cipta 4 Video',
        createBatchVideoButtonHelp: 'Ini akan menjana satu video untuk setiap babak. Proses ini mungkin mengambil masa beberapa minit.',
        generatedVideosTitle: 'Video Babak Dijana',
        creativeDirectionForImages: 'Arahan Kreatif untuk Imej',
        artisticStyle: 'Gaya Artistik',
        cameraShot: 'Shot Kamera',
        composition: 'Komposisi',
        lensType: 'Jenis Lensa',
        filmSim: 'Simulasi Filem',
        creativityLevel: 'Tahap Kreativiti',
        videoGenerationSettings: 'Tetapan Penjanaan Video',
        aiModel: 'Model AI',
        aspectRatio: 'Nisbah Aspek',
        resolution: 'Resolusi',
    },

    videoCombinerView: {
        title: 'Penggabung Video',
        subtitle: 'Pilih dan gabungkan beberapa klip video menjadi satu video.',
        selectVideos: 'Pilih Video dari Galeri Anda',
        selected: 'dipilih',
        noVideos: 'Anda belum menjana sebarang video lagi. Pergi ke tab Penjanaan Video untuk mencipta beberapa video.',
        combineButton: 'Gabung {count} Video',
        initializing: 'Memulakan Enjin...',
        engineError: 'Enjin Gagal Dimuatkan',
        combining: 'Menggabungkan...',
        loading: 'Memproses...',
        loadingVideo: 'Memuatkan video {current} dari {total}...',
        creatingFileList: 'Mencipta senarai fail...',
        combiningVideos: 'Menggabungkan video...',
        finishing: 'Menyelesaikan...',
        error: 'Berlaku Ralat',
        downloadCombined: 'Muat Turun Video Gabungan',
        outputPlaceholder: 'Video gabungan anda akan muncul di sini.'
    },
    
    voiceStudioView: {
        title: 'Studio Suara',
        subtitle: 'Tukar skrip teks anda kepada suara latar profesional.',
        writeScript: 'Tulis Skrip Anda',
        scriptPlaceholder: 'Taip atau tampal skrip anda di sini...',
        characters: 'aksara',
        selectVoice: 'Pilih Pelakon Suara',
        advancedSettings: 'Tetapan Lanjutan',
        speed: 'Kelajuan',
        pitch: 'Nada',
        volume: 'Kelantangan',
        generateButton: 'Jana Suara Latar',
        resetButton: 'Set Semula',
        loading: 'Menjana audio...',
        apiErrorTitle: 'Akses API Diperlukan',
        apiErrorBody: 'Ciri ini menggunakan API Teks-ke-Ucapan Google Cloud, yang perlu diaktifkan dalam projek Google Cloud anda.',
        apiErrorButton: 'Aktifkan API Sekarang',
        apiErrorHelp: 'Selepas pengaktifan, ia mungkin mengambil masa beberapa minit untuk menjadi aktif.',
        genericError: 'Berlaku ralat semasa penjanaan.',
        downloadAudio: 'Muat Turun Audio (MP3)',
        outputPlaceholder: 'Audio yang anda jana akan muncul di sini.'
    },
    batchProcessorView: {
        title: 'Pemproses Video Berkelompok',
        subtitle: 'Jana beberapa video daripada senarai prompt dalam satu proses.',
        uploadPrompts: 'Muat naik fail .txt dengan satu prompt setiap baris',
        promptsLoaded: '{count} prompt dimuatkan daripada {fileName}.',
        noPrompts: 'Muat naik fail teks atau tambah prompt dari tab Papan Cerita untuk bermula.',
        clearPrompts: 'Kosongkan semua prompt',
        videoSettings: 'Tetapan Video',
        aiModel: 'Model AI',
        aspectRatio: 'Nisbah Aspek',
        resolution: 'Resolusi',
        startProcessing: 'Mula Memproses',
        stopProcessing: 'Hentikan Proses',
        logsAndProgress: 'Log & Kemajuan',
        textPrompts: 'Prompt Teks',
        generatedVideos: 'Video Dijana',
        failedTasks: 'Tugas Gagal',
        activityLogs: 'Log Aktiviti',
        initialLog: 'Sedia untuk memproses kelompok anda. Muat naik prompt anda.',
        processStarting: 'Memulakan proses kelompok untuk {count} prompt...',
        processingPrompt: 'Memproses {current}/{total}: "{prompt}"',
        videoSuccess: 'Berjaya menjana video untuk: "{prompt}"',
        videoError: 'Ralat menjana video untuk "{prompt}": {error}',
        processCancelled: 'Proses dibatalkan oleh pengguna.',
        processComplete: 'Pemprosesan kelompok selesai.',
    },

    apiGeneratorView: {
        title: 'Penjana Kunci API',
        subtitle: 'Untuk kegunaan admin sahaja. Jana kunci API Gemini sementara untuk pengguna.',
        requestNewKey: 'Minta Kunci API Baru',
        description: 'API percuma ini hanya untuk Teks, Penjanaan Imej, dan Suntingan Imej. Untuk video VEO, sila gunakan kunci API anda sendiri yang diperoleh dari Google AI Studio.',
        requestButton: 'Minta Kunci Tersedia',
        fetchError: 'Gagal mendapatkan kunci: {error}',
        applyError: 'Gagal menggunakan kunci: {error}',
        claimError: 'Gagal menuntut kunci: {error}',
        noKeys: 'Tiada kunci baru yang tersedia pada masa ini. Sila cuba lagi nanti.',
        noActiveKeys: 'Tiada kunci baru yang aktif tersedia pada masa ini. Sila cuba lagi nanti.',
        successMessage: 'Kunci berjaya digunakan pada akaun anda dan disalin ke papan keratan!',
        availableKeysTitle: 'Kunci Tersedia',
    },

    eCourseView: {
        title: 'Selamat Datang',
        subtitle: 'Ketahui cara memaksimumkan penggunaan platform AI MONOklix.com anda.',
        platformUpdatesTitle: 'Kemas Kini Platform',
        allSystemsOperational: 'Semua Sistem Beroperasi',
        degradedPerformance: 'Prestasi Menurun',
        majorOutage: 'Gangguan Besar',
        lastUpdated: 'Kemas Kini Terakhir',
        latestAnnouncements: 'Pengumuman Terkini',
        postedOn: 'Dihantar pada',
        gettingStartedTitle: 'Bermula',
        videoTutorials: 'Lagi Tutorial Video'
    },
    
    socialPostStudioView: {
        title: 'Studio Pos Sosial',
        subtitle: 'Cipta, jadualkan, dan hantar kandungan media sosial anda ke alat automasi kegemaran anda.',
        textContentLabel: 'Kandungan Teks',
        textContentPlaceholder: 'Tulis kapsyen anda di sini, atau gunakan penulis AI!',
        generateWithAi: 'Jana dengan AI',
        hashtagsLabel: 'Hashtag',
        mediaLabel: 'Media (1 Video atau sehingga 4 Imej)',
        noMedia: 'Tiada media dipilih.',
        addMediaButton: 'Tambah dari Galeri',
        uploadFromDesktop: 'Muat Naik dari Desktop',
        ctaLabel: 'Seruan Tindak (Pilihan)',
        ctaPlaceholder: 'cth., "Beli Sekarang", "Ketahui Lebih Lanjut"',
        linkLabel: 'Pautan (Pilihan)',
        linkPlaceholder: 'https://example.com/product',
        scheduleLabel: 'Jadual (Pilihan)',
        previewTitle: 'Pratonton Langsung',
        sendButton: 'Hantar ke Webhook',
        sending: 'Menghantar...',
        sendSuccess: 'Pos berjaya dihantar ke webhook anda!',
        sendError: 'Gagal menghantar pos.',
        noWebhookTitle: 'Webhook Tidak Dikonfigurasi',
        noWebhookBody: 'Untuk menggunakan Studio Pos Sosial, sila sediakan URL webhook anda di tab "API & Integrasi" dalam Tetapan.',
        // Media Selection Modal
        modalTitle: 'Pilih Media dari Galeri',
        modalSelectionRule: 'Anda boleh memilih 1 video ATAU sehingga 4 imej.',
        modalImagesTab: 'Imej',
        modalVideosTab: 'Video',
        modalConfirm: 'Sahkan Pilihan',
        // AI Writer Modal
        aiWriterModalTitle: 'Penulis AI',
        selectAgent: 'Pilih Ejen AI',
        agents: {
            najwa: { name: 'Najwa' },
            julia: { name: 'Julia' },
            musa: { name: 'Musa' },
        },
        outputLanguage: 'Bahasa Output',
        agentDescription: 'Terangkan topik pos anda',
        agentInputPlaceholder: 'cth., "Pos mengenai produk kopi baharu kami, menonjolkan aroma yang kaya dan diskaun istimewa."',
        generate: 'Jana Teks',
        generating: 'Menjana...',
        generatedCaption: 'Kapsyen Dijana',
        generatedHashtags: 'Hashtag Dijana',
        generatedCta: 'Seruan Tindak Dijana',
        close: 'Tutup',
        useText: 'Guna Teks Ini',
    },
    
  }
};

// FIX: Added 'getTranslations' function to be exported.
export const getTranslations = (language: Language) => translations[language];