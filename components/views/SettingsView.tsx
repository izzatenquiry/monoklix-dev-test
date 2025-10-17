import React, { useState, useEffect, useCallback, useRef } from 'react';
import { type User, type AiLogItem, type Language } from '../../types';
import { updateUserProfile, saveUserApiKey, updateUserWebhookUrl } from '../../services/userService';
import {
    CreditCardIcon, CheckCircleIcon, XIcon, WebhookIcon, EyeIcon, EyeOffIcon, ChatIcon,
    AlertTriangleIcon, DatabaseIcon, TrashIcon, RefreshCwIcon
} from '../Icons';
import Spinner from '../common/Spinner';
import { sendTestUserWebhook } from '../../services/webhookService';
import AdminDashboardView from './AdminDashboardView';
import ETutorialAdminView from './ETutorialAdminView';
import Tabs, { type Tab } from '../common/Tabs';
import ChatInterface from '../common/ChatInterface';
import { getSupportPrompt } from '../../services/promptManager';
import { runApiHealthCheck, type HealthCheckResult } from '../../services/geminiService';
import { getTranslations } from '../../services/translations';
import ApiKeyClaimPanel from '../common/ApiKeyClaimPanel';
import { getFormattedCacheStats, clearVideoCache } from '../../services/videoCacheService';

// Define the types for the tabs in the settings view
type SettingsTabId = 'profile' | 'api' | 'ai-support' | 'content-admin' | 'user-db';

const TABS: Tab<SettingsTabId>[] = [
    { id: 'profile', label: 'User Profile' },
    { id: 'api', label: 'API & Integrations' },
    { id: 'ai-support', label: 'AI Support' },
    { id: 'content-admin', label: 'Admin Content', adminOnly: true },
    { id: 'user-db', label: 'User Database', adminOnly: true },
];

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface SettingsViewProps {
  currentUser: User;
  tempApiKey: string | null;
  onUserUpdate: (user: User) => void;
  aiSupportMessages: Message[];
  isAiSupportLoading: boolean;
  onAiSupportSend: (prompt: string) => Promise<void>;
  language: Language;
}

// --- PANELS ---

const ProfilePanel: React.FC<Pick<SettingsViewProps, 'currentUser' | 'onUserUpdate'>> = ({ currentUser, onUserUpdate }) => {
    const [fullName, setFullName] = useState(currentUser.fullName || currentUser.username);
    const [email, setEmail] = useState(currentUser.email);
    const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error' | 'loading'; message: string }>({ type: 'idle', message: '' });
    const statusTimeoutRef = useRef<number | null>(null);

     useEffect(() => {
        return () => {
            if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
        };
    }, []);

    const getAccountStatus = (user: User): { text: string; colorClass: string } => {
        switch (user.status) {
            case 'admin': return { text: 'Admin (Lifetime)', colorClass: 'text-green-500' };
            case 'lifetime': return { text: 'Active (Lifetime)', colorClass: 'text-green-500' };
            case 'subscription': return { text: 'Active (Subscription)', colorClass: 'text-green-500' };
            case 'trial': return { text: 'Trial', colorClass: 'text-yellow-500' };
            case 'inactive': return { text: 'Inactive', colorClass: 'text-red-500' };
            case 'pending_payment': return { text: 'Pending Payment', colorClass: 'text-yellow-500' };
            default: return { text: 'Unknown', colorClass: 'text-neutral-500' };
        }
    };

    const handleSave = async () => {
        if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
        setStatus({ type: 'loading', message: 'Saving profile...' });
        const result = await updateUserProfile(currentUser.id, { fullName, email });
        if (result.success === false) {
            setStatus({ type: 'error', message: `Failed: ${result.message}` });
        } else {
            onUserUpdate(result.user);
            setStatus({ type: 'success', message: 'Profile updated successfully!' });
        }
        statusTimeoutRef.current = window.setTimeout(() => setStatus({ type: 'idle', message: '' }), 4000);
    };

    const accountStatus = getAccountStatus(currentUser);
    let expiryInfo = null;
    if (currentUser.status === 'subscription' && currentUser.createdAt) {
        const oneYearInMillis = 365 * 24 * 60 * 60 * 1000;
        const registrationDate = new Date(currentUser.createdAt);
        const expiryDate = new Date(registrationDate.getTime() + oneYearInMillis);
        expiryInfo = `Expires on: ${expiryDate.toLocaleDateString()}`;
    }


    return (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">User Profile</h2>
            <div className="mb-6 p-4 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Account Status: <span className={`font-bold ${accountStatus.colorClass}`}>{accountStatus.text}</span></p>
                {expiryInfo && <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">{expiryInfo}</p>}
            </div>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Full Name</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={status.type === 'loading'} className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-2 focus:ring-2 focus:ring-primary-500 focus:outline-none transition disabled:opacity-50" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Email Address</label>
                    <input type="email" value={email} readOnly disabled className="w-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-2 cursor-not-allowed" />
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={handleSave} disabled={status.type === 'loading'} className="bg-primary-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-primary-700 transition-colors w-48 flex justify-center disabled:opacity-50">
                        {status.type === 'loading' ? <Spinner /> : 'Save Changes'}
                    </button>
                    {status.type !== 'idle' && (
                        <div className={`flex items-center gap-3 text-sm ${status.type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                            {status.type === 'success' && <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />}
                            {status.type === 'error' && <XIcon className="w-5 h-5 flex-shrink-0" />}
                            <span>{status.message}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const CacheManagerPanel: React.FC = () => {
  const [stats, setStats] = useState<{
    size: string;
    count: number;
    percentage: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const formattedStats = await getFormattedCacheStats();
      setStats(formattedStats);
    } catch (error) {
      console.error('Failed to load cache stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleClearCache = async () => {
    if (!confirm('Are you sure you want to clear the entire video cache? This cannot be undone.')) {
      return;
    }

    setIsClearing(true);
    try {
      await clearVideoCache();
      await loadStats();
      alert('Video cache cleared successfully!');
    } catch (error) {
      console.error('Failed to clear cache:', error);
      alert('Failed to clear cache. Please try again.');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <DatabaseIcon className="w-8 h-8 text-primary-500" />
          <div>
            <h2 className="text-xl font-semibold">Video Cache Manager</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Manage your locally cached videos
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        ) : stats ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Storage Used</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{stats.size}</p>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Videos Cached</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{stats.count}</p>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                <span>Cache Usage</span>
                <span>{stats.percentage}%</span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    stats.percentage > 90 ? 'bg-red-500' : stats.percentage > 70 ? 'bg-yellow-500' : 'bg-primary-500'
                  }`}
                  style={{ width: `${Math.min(stats.percentage, 100)}%` }}
                />
              </div>
              {stats.percentage > 90 && (
                <p className="text-xs text-red-500 mt-2">⚠️ Cache is almost full. Older videos will be automatically removed.</p>
              )}
            </div>

            {/* Information */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                How Video Caching Works
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Videos are stored locally in your browser</li>
                <li>• Maximum cache size: 500 MB</li>
                <li>• Maximum videos: 50</li>
                <li>• Oldest videos are automatically removed when limit is reached</li>
                <li>• Videos persist even after closing the browser</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button onClick={loadStats} disabled={isLoading} className="flex items-center justify-center gap-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-semibold py-2 px-4 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors disabled:opacity-50">
                <RefreshCwIcon className="w-4 h-4" /> Refresh Stats
              </button>
              <button onClick={handleClearCache} disabled={isClearing || stats.count === 0} className="flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {isClearing ? (<><Spinner /> Clearing...</>) : (<><TrashIcon className="w-4 h-4" /> Clear All Cache</>)}
              </button>
            </div>

            {/* Tips */}
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
              <h3 className="font-semibold mb-2">💡 Tips</h3>
              <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                <li>• Clear cache if videos are not loading properly</li>
                <li>• Old videos are automatically removed to save space</li>
                <li>• Cache is shared across all tabs of this website</li>
                <li>• Incognito mode does not persist cache</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-500">Failed to load cache statistics</div>
        )}
      </div>
  );
};

interface ApiIntegrationsPanelProps {
  currentUser: User;
  activeApiKey: string | null;
  onUserUpdate: (user: User) => void;
  language: Language;
}

const ApiIntegrationsPanel: React.FC<ApiIntegrationsPanelProps> = ({ currentUser, activeApiKey, onUserUpdate, language }) => {
    const [apiKey, setApiKey] = useState('');
    const [isKeyVisible, setIsKeyVisible] = useState(false);
    const [apiKeyStatus, setApiKeyStatus] = useState<{ type: 'idle' | 'success' | 'error' | 'loading'; message: string }>({ type: 'idle', message: '' });
    
    const [webhookUrl, setWebhookUrl] = useState(currentUser.webhookUrl || '');
    const [webhookStatus, setWebhookStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });

    const [isCheckingHealth, setIsCheckingHealth] = useState(false);
    const [healthCheckResults, setHealthCheckResults] = useState<HealthCheckResult[] | null>(null);
    const [veoToken, setVeoToken] = useState<string | null>(null);
    const [veoTokenCreatedAt, setVeoTokenCreatedAt] = useState<string | null>(null);

    useEffect(() => {
        const token = sessionStorage.getItem('veoAuthToken');
        const createdAt = sessionStorage.getItem('veoAuthTokenCreatedAt');
        setVeoToken(token);
        setVeoTokenCreatedAt(createdAt);
    }, []);
    

    const handleSaveApiKey = async () => {
        setApiKeyStatus({ type: 'loading', message: 'Saving API Key...' });
        const result = await saveUserApiKey(currentUser.id, apiKey);
        if (result.success === false) {
            setApiKeyStatus({ type: 'error', message: result.message });
        } else {
            setApiKeyStatus({ type: 'success', message: 'API Key successfully saved.' });
            onUserUpdate(result.user);
            setApiKey('');
        }
        setTimeout(() => setApiKeyStatus({ type: 'idle', message: '' }), 4000);
    };

    const handleSaveWebhook = async () => {
        setWebhookStatus({ type: 'loading', message: 'Saving...' });
        try {
            const urlToSave = webhookUrl.trim();
            if (urlToSave) new URL(urlToSave);
            const result = await updateUserWebhookUrl(currentUser.id, urlToSave || null);
            if (result.success === false) {
                setWebhookStatus({ type: 'error', message: result.message });
            } else {
                onUserUpdate(result.user);
                setWebhookStatus({ type: 'success', message: 'Webhook URL saved!' });
            }
        } catch (_) {
            setWebhookStatus({ type: 'error', message: 'Invalid URL format.' });
        }
        setTimeout(() => setWebhookStatus({ type: 'idle', message: '' }), 3000);
    };
    
    const handleTestWebhook = async () => {
        if (!currentUser.webhookUrl) return;
        setWebhookStatus({ type: 'loading', message: 'Sending test...' });
        const result = await sendTestUserWebhook();
        setWebhookStatus({ type: result.success ? 'success' : 'error', message: result.message });
        setTimeout(() => setWebhookStatus({ type: 'idle', message: '' }), 5000);
    };

    const handleHealthCheck = async () => {
        setIsCheckingHealth(true);
        setHealthCheckResults(null);
        try {
            const veo3AuthToken = sessionStorage.getItem('veoAuthToken') || undefined;
            const results = await runApiHealthCheck({
                textKey: activeApiKey || undefined,
                veo3AuthToken
            });
            setHealthCheckResults(results);
        } catch (error: any) {
            setHealthCheckResults([{ service: 'Health Check Runner', model: 'N/A', status: 'error', message: error.message }]);
        } finally {
            setIsCheckingHealth(false);
        }
    };

    const getStatusClasses = (status: HealthCheckResult['status']) => {
        switch (status) {
            case 'operational': return { border: 'border-green-500', icon: <CheckCircleIcon className="w-5 h-5 text-green-500"/>, text: 'text-green-700 dark:text-green-300' };
            case 'error': return { border: 'border-red-500', icon: <XIcon className="w-5 h-5 text-red-500"/>, text: 'text-red-700 dark:text-red-300' };
            case 'degraded': return { border: 'border-yellow-500', icon: <AlertTriangleIcon className="w-5 h-5 text-yellow-500"/>, text: 'text-yellow-700 dark:text-yellow-300' };
            default: return { border: 'border-neutral-500', icon: null, text: '' };
        }
    };
    
    const locale = language === 'ms' ? 'ms-MY' : 'en-US';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm space-y-8">
                <div>
                    <h2 className="text-xl font-semibold mb-2">Google Gemini API Key (Text & Image)</h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4" dangerouslySetInnerHTML={{ __html:
                        'This key is used for all text and image generation.'
                    }} />
                    {currentUser.apiKey && <p className="text-sm text-green-600 dark:text-green-400 mb-4 p-2 bg-green-500/10 rounded-md">Active Key: ...{currentUser.apiKey.slice(-4)}</p>}
                    <div className="flex items-center gap-2">
                        <div className="relative flex-grow">
                            <input type={isKeyVisible ? 'text' : 'password'} value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Enter new API Key to update" className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors disabled:opacity-50" disabled={apiKeyStatus.type === 'loading'} />
                            <button type="button" onClick={() => setIsKeyVisible(!isKeyVisible)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-500 hover:text-neutral-700" aria-label={isKeyVisible ? 'Hide' : 'Show'}>
                                {isKeyVisible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>
                        <button onClick={handleSaveApiKey} disabled={apiKeyStatus.type === 'loading'} className="bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-700 w-24 flex justify-center disabled:opacity-50">
                            {apiKeyStatus.type === 'loading' ? <Spinner /> : 'Save'}
                        </button>
                    </div>
                    {apiKeyStatus.type !== 'idle' && <p className={`text-sm mt-2 ${apiKeyStatus.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>{apiKeyStatus.message}</p>}
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8">
                     <div className="border-2 border-indigo-400 dark:border-indigo-600 rounded-lg p-4 bg-indigo-50 dark:bg-indigo-900/30">
                        <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
                            Veo 3.0 Authorization Token
                        </h3>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-3">
                            This special token is required <strong>only for Veo 3.0 models</strong>. To get your token:
                        </p>
                        <ol className="list-decimal list-inside text-xs text-indigo-600 dark:text-indigo-400 space-y-1 mb-4">
                            <li>Go to <a href="https://labs.google.com" target="_blank" rel="noopener noreferrer" className="font-semibold underline">labs.google.com</a> and sign in.</li>
                            <li>Open Developer Tools (F12 or Ctrl+Shift+I).</li>
                            <li>Go to `Application` &gt; `Storage` &gt; `Cookies`.</li>
                            <li>Find the cookie named `__SESSION` and copy its entire "Cookie Value".</li>
                        </ol>
                        {veoToken ? (
                            <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-md flex items-center gap-2 border border-green-200 dark:border-green-800">
                                <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                                    {veoTokenCreatedAt
                                        ? `Authorization Token is configured. Created: ${new Date(veoTokenCreatedAt).toLocaleString(locale)}`
                                        : 'Authorization Token is configured and ready.'}
                                </p>
                            </div>
                        ) : (
                            <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-md flex items-center gap-2 border border-yellow-200 dark:border-yellow-800">
                                <AlertTriangleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                                <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                                    Authorization Token not found. Veo 3.0 models will fail.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <CheckCircleIcon className="w-6 h-6"/> API Health Check
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 my-4">
                        Run a comprehensive check on all integrated AI services to ensure they are configured correctly and operational. This will make small API calls to each service.
                    </p>
                    <button 
                        onClick={handleHealthCheck} 
                        disabled={isCheckingHealth}
                        className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 w-64 flex justify-center disabled:opacity-50"
                    >
                        {isCheckingHealth ? <Spinner /> : 'Run Full System Check'}
                    </button>

                    {isCheckingHealth && <p className="text-sm mt-4 text-neutral-500">Running checks... this may take up to a minute.</p>}

                    {healthCheckResults && (
                        <div className="mt-6 space-y-3">
                            {healthCheckResults.map((result, index) => {
                                const { border, icon, text } = getStatusClasses(result.status);
                                const statusText = result.status === 'error' 
                                    ? 'Not Available' 
                                    : result.status.charAt(0).toUpperCase() + result.status.slice(1);

                                return (
                                    <div key={index} className={`p-3 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg border-l-4 ${border} animate-zoomIn`}>
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <p className="font-semibold text-neutral-800 dark:text-white">{result.service}</p>
                                                <p className="text-xs font-mono text-neutral-500 break-all">{result.model}</p>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {icon}
                                                <span className={`font-semibold text-sm ${text}`}>{statusText}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 whitespace-pre-wrap">{result.message}</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                
                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8">
                    <h2 className="text-xl font-semibold flex items-center gap-2"><WebhookIcon className="w-6 h-6"/> Personal Webhook</h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 my-4">Automatically send generated content to an external URL (e.g., n8n).</p>
                    <input id="user-webhook-url" type="text" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://your-n8n-url.com/webhook/..." className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-2 focus:ring-2 focus:ring-primary-500" />
                    <div className="flex items-center gap-2 mt-4">
                        <button onClick={handleSaveWebhook} disabled={webhookStatus.type === 'loading'} className="bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-700 w-24 flex justify-center">
                            {webhookStatus.type === 'loading' && webhookStatus.message.includes('Saving') ? <Spinner /> : 'Save'}
                        </button>
                        <button onClick={handleTestWebhook} disabled={!currentUser.webhookUrl || webhookStatus.type === 'loading'} className="bg-neutral-200 dark:bg-neutral-700 font-semibold py-2 px-4 rounded-lg hover:bg-neutral-300 disabled:opacity-50 w-40 flex justify-center">
                            {webhookStatus.type === 'loading' && webhookStatus.message.includes('Sending') ? <Spinner /> : 'Test Webhook'}
                        </button>
                    </div>
                    {webhookStatus.message && <p className={`text-sm mt-2 ${webhookStatus.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>{webhookStatus.message}</p>}
                </div>
            </div>
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm">
                <ApiKeyClaimPanel currentUser={currentUser} language={language} />
            </div>
        </div>
    );
};

const AiSupportPanel: React.FC<{
    messages: Message[];
    isLoading: boolean;
    onSendMessage: (prompt: string) => Promise<void>;
}> = ({ messages, isLoading, onSendMessage }) => {
    const systemInstruction = getSupportPrompt();
  
    return (
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2"><ChatIcon className="w-6 h-6"/>AI Support</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              Have a question or need help? Ask here.
          </p>
          <div className="h-[60vh] flex flex-col">
              <ChatInterface
                  systemInstruction={systemInstruction}
                  placeholder="How can I help you today?"
                  messages={messages}
                  isLoading={isLoading}
                  onSendMessage={onSendMessage}
              />
          </div>
      </div>
    );
};

// --- MAIN VIEW ---

const SettingsView: React.FC<SettingsViewProps> = (props) => {
    const [activeTab, setActiveTab] = useState<SettingsTabId>('profile');
    const { currentUser, tempApiKey, language } = props;

    const renderActiveTabContent = () => {
        switch (activeTab) {
            case 'profile': 
                return (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        <ProfilePanel {...props} />
                        <CacheManagerPanel />
                    </div>
                );
            case 'api': 
                const activeApiKey = currentUser.apiKey || tempApiKey;
                return <ApiIntegrationsPanel 
                            currentUser={currentUser} 
                            activeApiKey={activeApiKey} 
                            onUserUpdate={props.onUserUpdate} 
                            language={language} 
                        />;
            case 'ai-support': return <AiSupportPanel 
                messages={props.aiSupportMessages}
                isLoading={props.isAiSupportLoading}
                onSendMessage={props.onAiSupportSend}
            />;
            case 'content-admin': return <ETutorialAdminView />;
            case 'user-db': return <AdminDashboardView />;
            default: return <ProfilePanel {...props} />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold sm:text-3xl">Settings</h1>
            <div className="flex justify-center">
                <Tabs 
                    tabs={TABS}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isAdmin={currentUser.role === 'admin'}
                />
            </div>
            <div className="mt-6">
                {renderActiveTabContent()}
            </div>
        </div>
    );
};

export default SettingsView;
