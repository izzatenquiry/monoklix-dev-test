import React, { useState, useEffect, useCallback } from 'react';
import { type View, type User, type Language, type BatchProcessorPreset } from './types';
import Sidebar from './components/Sidebar';
import AiTextSuiteView from './components/views/AiTextSuiteView';
import AiImageSuiteView from './components/views/AiImageSuiteView';
import AiVideoSuiteView from './components/views/AiVideoSuiteView';
import ECourseView from './components/views/ECourseView';
import SettingsView from './components/views/SettingsView';
import LoginPage from './LoginPage';
import GalleryView from './components/views/GalleryView';
import WelcomeAnimation from './components/WelcomeAnimation';
import LibraryView from './components/views/LibraryView';
import { MenuIcon, LogoIcon, XIcon, SunIcon, MoonIcon, KeyIcon, CheckCircleIcon, AlertTriangleIcon, PartyPopperIcon } from './components/Icons';
// FIX: Moved `getAvailableApiKeys` import from `geminiService` to `userService` to fix an incorrect import path.
import { signOutUser, logActivity, getVeoAuthToken, getAvailableApiKeys } from './services/userService';
import { setActiveApiKeys, createChatSession, streamChatResponse, isImageModelHealthy } from './services/geminiService';
import Spinner from './components/common/Spinner';
import { loadData, saveData } from './services/indexedDBService';
import { type Chat } from '@google/genai';
import { getSupportPrompt } from './services/promptManager';
import { triggerUserWebhook } from './services/webhookService';
import GetStartedView from './components/views/GetStartedView';
import { getTranslations } from './services/translations';
import AiPromptLibrarySuiteView from './components/views/AiPromptLibrarySuiteView';
import SocialPostStudioView from './components/views/SocialPostStudioView';
import eventBus from './services/eventBus';
import ApiKeyModal from './components/ApiKeyModal';


interface VideoGenPreset {
  prompt: string;
  image: { base64: string; mimeType: string; };
}

interface ImageEditPreset {
  base64: string;
  mimeType: string;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const LanguageSwitcher: React.FC<{ language: Language; setLanguage: (lang: Language) => void }> = ({ language, setLanguage }) => (
    <div className="flex items-center bg-neutral-200 dark:bg-neutral-800 p-1 rounded-full">
        <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${language === 'en' ? 'bg-white dark:bg-neutral-900 text-primary-600 dark:text-primary-400' : 'text-neutral-600 dark:text-neutral-300'}`}
        >
            EN
        </button>
        <button
            onClick={() => setLanguage('ms')}
            className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${language === 'ms' ? 'bg-white dark:bg-neutral-900 text-primary-600 dark:text-primary-400' : 'text-neutral-600 dark:text-neutral-300'}`}
        >
            MS
        </button>
    </div>
);

const ThemeSwitcher: React.FC<{ theme: string; setTheme: (theme: string) => void }> = ({ theme, setTheme }) => (
    <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        aria-label="Toggle theme"
    >
        {theme === 'light' ? (
            <MoonIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
        ) : (
            <SunIcon className="w-5 h-5 text-yellow-500" />
        )}
    </button>
);

const AutoFixBanner: React.FC<{ status: 'in-progress' | 'success' | 'failed'; onClose: () => void }> = ({ status, onClose }) => {
  const content = {
    'in-progress': {
      icon: <Spinner />,
      message: 'API key error detected. Attempting to automatically find a new key...',
      bg: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200',
    },
    success: {
      icon: <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />,
      message: 'Connection restored! A new, healthy API key has been applied automatically.',
      bg: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200',
    },
    failed: {
      icon: <AlertTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />,
      message: 'Auto-repair failed. No healthy API keys found. Please claim one manually.',
      bg: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200',
    },
  }[status];

  return (
    <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-4 animate-zoomIn ${content.bg}`}>
      {content.icon}
      <p className="text-sm font-semibold">{content.message}</p>
      <button onClick={onClose} className="p-1 rounded-full hover:bg-black/10">
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

const OnboardingNotification: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-4 animate-zoomIn bg-sky-100 dark:bg-sky-900/50 text-sky-800 dark:text-sky-200">
    <PartyPopperIcon className="w-6 h-6 text-sky-600 dark:text-sky-400" />
    <p className="text-sm font-semibold">
      We've automatically assigned a temporary API key to get you started!
    </p>
    <button onClick={onClose} className="p-1 rounded-full hover:bg-black/10">
      <XIcon className="w-4 h-4" />
    </button>
  </div>
);


const App: React.FC = () => {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tempApiKey, setTempApiKey] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<View>('home');
  const [theme, setTheme] = useState('light'); // Default to light, load async
  const [language, setLanguage] = useState<Language>('en');
  const [videoGenPreset, setVideoGenPreset] = useState<VideoGenPreset | null>(null);
  const [imageToReEdit, setImageToReEdit] = useState<ImageEditPreset | null>(null);
  const [imageGenPresetPrompt, setImageGenPresetPrompt] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isShowingWelcome, setIsShowingWelcome] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [autoClaimStatus, setAutoClaimStatus] = useState<'idle' | 'in-progress' | 'success' | 'failed'>('idle');
  const [showOnboardingNotification, setShowOnboardingNotification] = useState(false);


  const T = getTranslations(language);

  // --- AI Support Chat State ---
  const [aiSupportMessages, setAiSupportMessages] = useState<Message[]>([]);
  const [aiSupportChat, setAiSupportChat] = useState<Chat | null>(null);
  const [isAiSupportLoading, setIsAiSupportLoading] = useState(false);

  useEffect(() => {
    const fetchAndSetToken = async () => {
      const tokenData = await getVeoAuthToken();
      if (tokenData) {
        sessionStorage.setItem('veoAuthToken', tokenData.token);
        sessionStorage.setItem('veoAuthTokenCreatedAt', tokenData.createdAt);
        console.log("VEO Auth Token and timestamp loaded from Supabase and set in session storage.");
      } else {
        console.warn("Could not fetch VEO Auth Token from Supabase.");
      }
    };
    fetchAndSetToken();
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
        const savedTheme = await loadData<string>('theme');
        if (savedTheme) setTheme(savedTheme);

        const savedLang = localStorage.getItem('language') as Language;
        if (savedLang) setLanguage(savedLang);
    };
    loadSettings();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    saveData('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);


  // Effect to listen for temporary key claims from anywhere in the app
  useEffect(() => {
    const handler = (key: string) => {
      setTempApiKey(key);
    };
    eventBus.on('tempKeyClaimed', handler);
    return () => {
      eventBus.remove('tempKeyClaimed', handler);
    };
  }, []);

  // Consolidated effect to manage the active API key and initialize dependent services.
  useEffect(() => {
    const keyToUse = currentUser?.apiKey || tempApiKey;
    setActiveApiKeys({ textKey: keyToUse });

    if (keyToUse) {
      const systemInstruction = getSupportPrompt();
      const session = createChatSession(systemInstruction);
      setAiSupportChat(session);
    } else {
      setAiSupportChat(null);
      setAiSupportMessages([]);
    }
  }, [currentUser, tempApiKey]);
  
  // Effect to check for an active session in localStorage on initial load.
  useEffect(() => {
    try {
        const savedUserJson = localStorage.getItem('currentUser');
        if (savedUserJson) {
            const user = JSON.parse(savedUserJson);
            setCurrentUser(user);
        }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('currentUser');
    }
    setSessionChecked(true);
  }, []);

  useEffect(() => {
    if (justLoggedIn) {
        setIsShowingWelcome(true);
        setJustLoggedIn(false); // Reset the flag
    }
  }, [justLoggedIn]);
  
  // Effect to handle manual API key modal opening
  useEffect(() => {
    const handler = () => setIsApiKeyModalOpen(true);
    eventBus.on('showApiKeyClaimModal', handler);
    return () => eventBus.remove('showApiKeyClaimModal', handler);
  }, []);
  
  const handleUserUpdate = useCallback((updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    // If user saves their own key, the temporary one is no longer needed for this session.
    if (updatedUser.apiKey) {
        setTempApiKey(null);
    }
  }, []);

  const findAndSetSharedKey = useCallback(async () => {
    try {
        const availableKeys = await getAvailableApiKeys();
        if (availableKeys.length === 0) throw new Error('No keys available.');

        // Keys are sorted newest first from the service
        for (const key of availableKeys) {
            console.log(`Checking shared key: ...${key.apiKey.slice(-4)}`);
            const isHealthy = await isImageModelHealthy(key.apiKey);
            if (isHealthy) {
                console.log(`Found healthy shared key: ...${key.apiKey.slice(-4)}`);
                setTempApiKey(key.apiKey);
                return true; // Success
            }
        }
        throw new Error('No healthy shared keys found among available ones.');
    } catch (error) {
        console.error('Failed to find and set a shared key:', error);
        return false; // Failure
    }
  }, []);

  // Effect for automatic API key recovery
  useEffect(() => {
    const handleAutoClaim = async () => {
      if (!currentUser) return;
      setAutoClaimStatus('in-progress');
      
      const success = await findAndSetSharedKey();
      setAutoClaimStatus(success ? 'success' : 'failed');

      if (!success) {
        // Fallback to manual modal if auto-claim fails
        setTimeout(() => eventBus.dispatch('showApiKeyClaimModal'), 1000);
      }
    };
    
    eventBus.on('initiateAutoApiKeyClaim', handleAutoClaim);
    return () => {
      eventBus.remove('initiateAutoApiKeyClaim', handleAutoClaim);
    };
  }, [currentUser, findAndSetSharedKey]);

  // Effect for manual API key refresh from the claim panel
  useEffect(() => {
    const handleManualRefresh = async () => {
      const success = await findAndSetSharedKey();
      eventBus.dispatch('manualApiKeyRefreshComplete', { success });
    };
    
    eventBus.on('manualApiKeyRefresh', handleManualRefresh);
    return () => {
      eventBus.remove('manualApiKeyRefresh', handleManualRefresh);
    };
  }, [findAndSetSharedKey]);


  const handleLoginSuccess = (user: User) => {
    handleUserUpdate(user);
    setJustLoggedIn(true);
    logActivity('login');

    // If user logs in without their own key, find a shared one for the session.
    if (!user.apiKey) {
      console.log("User has no personal key. Finding a shared key for the session.");
      findAndSetSharedKey().then(success => {
        if (success) {
          setShowOnboardingNotification(true);
          console.log("Successfully set a shared API key for the new user session.");
        } else {
          console.warn("No available shared API keys to assign for new user session.");
        }
      });
    }
  };

  const handleLogout = async () => {
    await signOutUser();
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setTempApiKey(null);
    setActiveView('home');
  };
  
  const handleAiSupportSend = useCallback(async (prompt: string) => {
    if (!prompt.trim() || !aiSupportChat || isAiSupportLoading) return;

    const userMessage: Message = { role: 'user', text: prompt };
    setAiSupportMessages((prev) => [...prev, userMessage]);
    setIsAiSupportLoading(true);

    try {
        const stream = await streamChatResponse(aiSupportChat, prompt);
        let modelResponse = '';
        setAiSupportMessages((prev) => [...prev, { role: 'model', text: '...' }]);
        
        for await (const chunk of stream) {
            modelResponse += chunk.text;
            setAiSupportMessages((prev) => {
                const newMessages = [...prev];
                if(newMessages.length > 0) {
                    newMessages[newMessages.length - 1].text = modelResponse;
                }
                return newMessages;
            });
        }
        triggerUserWebhook({ type: 'text', prompt, result: modelResponse });
    } catch (error) {
        console.error('Error sending support message:', error);
        const errorMessageText = error instanceof Error ? error.message : 'An unknown error occurred.';
        const errorMessage: Message = { role: 'model', text: `Sorry, an error occurred: ${errorMessageText}` };
        setAiSupportMessages((prev) => {
            const newMessages = [...prev];
            if (newMessages.length > 0 && newMessages[newMessages.length-1].role === 'model') {
                newMessages[newMessages.length - 1] = errorMessage;
            } else {
                newMessages.push(errorMessage);
            }
            return newMessages;
        });
    } finally {
        setIsAiSupportLoading(false);
    }
  }, [aiSupportChat, isAiSupportLoading]);

  const handleCreateVideoFromImage = (preset: VideoGenPreset) => {
    setVideoGenPreset(preset);
    setActiveView('ai-video-suite');
  };

  const handleReEditImage = (preset: ImageEditPreset) => {
    setImageToReEdit(preset);
    setActiveView('ai-image-suite');
  };

  const handleUsePromptInGenerator = (prompt: string) => {
    setImageGenPresetPrompt(prompt);
    setActiveView('ai-image-suite');
  };

  const renderView = () => {
    const commonProps = { language };
    switch (activeView) {
      case 'home':
        return <ECourseView {...commonProps} />;
      case 'get-started':
        return <GetStartedView {...commonProps} />;
      case 'ai-text-suite':
        return <AiTextSuiteView {...commonProps} currentUser={currentUser!} />;
      case 'ai-image-suite':
        return <AiImageSuiteView 
                  {...commonProps}
                  onCreateVideo={handleCreateVideoFromImage} 
                  onReEdit={handleReEditImage}
                  imageToReEdit={imageToReEdit}
                  clearReEdit={() => setImageToReEdit(null)}
                  presetPrompt={imageGenPresetPrompt}
                  clearPresetPrompt={() => setImageGenPresetPrompt(null)}
                />;
      case 'ai-video-suite':
        return <AiVideoSuiteView 
                  {...commonProps}
                  currentUser={currentUser!}
                  preset={videoGenPreset} 
                  clearPreset={() => setVideoGenPreset(null)}
                  onCreateVideo={handleCreateVideoFromImage}
                  onReEdit={handleReEditImage}
                />;
      case 'ai-prompt-library-suite':
          return <AiPromptLibrarySuiteView {...commonProps} onUsePrompt={handleUsePromptInGenerator} />;
      case 'social-post-studio':
          return <SocialPostStudioView {...commonProps} currentUser={currentUser!} />;
      case 'gallery':
        return <GalleryView {...commonProps} onCreateVideo={handleCreateVideoFromImage} onReEdit={handleReEditImage} />;
      case 'settings':
          return <SettingsView 
                    {...commonProps}
                    currentUser={currentUser!} 
                    tempApiKey={tempApiKey}
                    onUserUpdate={handleUserUpdate} 
                    aiSupportMessages={aiSupportMessages}
                    isAiSupportLoading={isAiSupportLoading}
                    onAiSupportSend={handleAiSupportSend}
                 />;
      default:
        return <ECourseView {...commonProps}/>;
    }
  };
  
  if (!sessionChecked) {
      return (
          <div className="flex items-center justify-center min-h-screen bg-neutral-100 dark:bg-neutral-900">
              <Spinner />
          </div>
      );
  }

  if (isShowingWelcome) {
    return <WelcomeAnimation onAnimationEnd={() => {
        setIsShowingWelcome(false);
        setActiveView('home');
    }} language={language} />;
  }
  
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} language={language} />;
  }

  // --- Access Control Logic ---
  const activeApiKey = currentUser.apiKey || tempApiKey;
  let isBlocked = false;
  let blockMessage = { title: T.apiKeyRequiredTitle, body: T.apiKeyRequiredBody };
  const aiPoweredViews: View[] = ['ai-text-suite', 'ai-image-suite', 'ai-video-suite', 'social-post-studio'];

  if (aiPoweredViews.includes(activeView)) {
      if (!activeApiKey) {
          isBlocked = true;
      } 
      else if (currentUser.status === 'subscription') {
          const oneYearInMillis = 365 * 24 * 60 * 60 * 1000;
          const registrationDate = new Date(currentUser.createdAt).getTime();
          const expiryDate = registrationDate + oneYearInMillis;

          if (Date.now() > expiryDate) {
              isBlocked = true;
              blockMessage = {
                  title: T.subscriptionExpiredTitle,
                  body: T.subscriptionExpiredBody
              };
          }
      }
  }

  const PageContent = isBlocked ? (
    <div className="flex items-center justify-center h-full p-4">
      <div className="text-center p-8 sm:p-12 max-w-lg bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/50">
          <XIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-neutral-800 dark:text-white sm:text-2xl">{blockMessage.title}</h2>
        <p className="mt-2 text-neutral-600 dark:text-neutral-300">{blockMessage.body}</p>
      </div>
    </div>
  ) : renderView();

  return (
    <div className="flex h-screen bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 font-sans">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onLogout={handleLogout} 
        currentUser={currentUser}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        language={language}
      />
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="flex items-center justify-between p-2 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 lg:hidden" aria-label="Open menu">
              <MenuIcon className="w-6 h-6" />
            </button>
             <LogoIcon className="w-28 text-neutral-800 dark:text-neutral-200" />
          </div>
          <div className="flex items-center gap-2 pr-2">
              <button
                onClick={() => setIsApiKeyModalOpen(true)}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Request an API key"
              >
                <KeyIcon className={`w-5 h-5 transition-colors ${activeApiKey ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`} />
              </button>
              <ThemeSwitcher theme={theme} setTheme={setTheme} />
              <LanguageSwitcher language={language} setLanguage={setLanguage} />
          </div>
        </header>
        <div className="flex-1 p-4 md:p-8">
          {PageContent}
        </div>
      </main>

      {autoClaimStatus !== 'idle' && (
        <AutoFixBanner
          status={autoClaimStatus}
          onClose={() => setAutoClaimStatus('idle')}
        />
      )}

      {showOnboardingNotification && (
        <OnboardingNotification onClose={() => setShowOnboardingNotification(false)} />
      )}

      <ApiKeyModal
          isOpen={isApiKeyModalOpen}
          onClose={() => setIsApiKeyModalOpen(false)}
          currentUser={currentUser}
          onUserUpdate={handleUserUpdate}
          language={language}
      />
    </div>
  );
};

export default App;
