import React, { useState, useEffect } from 'react';
import { type Language, type User } from '../../types';
import { getTranslations } from '../../services/translations';
import {
    KeyIcon, CheckCircleIcon, XIcon, AlertTriangleIcon, SparklesIcon
} from '../Icons';
import Spinner from './Spinner';
import { getAvailableApiKeys, claimApiKey, type AvailableApiKey } from '../../services/userService';
import { runApiHealthCheck, type HealthCheckResult } from '../../services/geminiService';
import eventBus from '../../services/eventBus';


interface ApiKeyClaimPanelProps {
  language: Language;
  currentUser: User;
  onClaimSuccess?: () => void;
}

const servicesToCheck = [
    { label: 'Text', model: 'gemini-2.5-flash' },
    { label: 'Image Gen', model: 'imagen-4.0-generate-001' },
    { label: 'Image Edit', model: 'gemini-2.5-flash-image' }
];

const ApiKeyClaimPanel: React.FC<ApiKeyClaimPanelProps> = ({ language, currentUser, onClaimSuccess }) => {
    const T = getTranslations(language).apiGeneratorView;
    
    const [isLoading, setIsLoading] = useState(false);
    const [availableKeys, setAvailableKeys] = useState<AvailableApiKey[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [copiedKeyId, setCopiedKeyId] = useState<number | null>(null);
    const [healthCheckResults, setHealthCheckResults] = useState<Map<number, HealthCheckResult[] | null>>(new Map());
    const [checkingKeyId, setCheckingKeyId] = useState<number | null>(null);
    const [autoSelectStatus, setAutoSelectStatus] = useState<'idle' | 'loading' | 'success' | 'failed'>('idle');

    useEffect(() => {
        const handleRefreshComplete = ({ success }: { success: boolean }) => {
            setAutoSelectStatus(success ? 'success' : 'failed');
            if (success && onClaimSuccess) {
                onClaimSuccess();
            }
            setTimeout(() => setAutoSelectStatus('idle'), 4000); // Reset after 4 seconds
        };

        eventBus.on('manualApiKeyRefreshComplete', handleRefreshComplete);
        return () => {
            eventBus.remove('manualApiKeyRefreshComplete', handleRefreshComplete);
        };
    }, [onClaimSuccess]);

    const handleFetchKeys = async () => {
        setIsLoading(true);
        setError(null);
        setAvailableKeys([]);
        setStatusMessage(null);
        setHealthCheckResults(new Map());
        try {
            const keys = await getAvailableApiKeys();
            setAvailableKeys(keys);
            if (keys.length === 0) {
                setStatusMessage(T.noKeys);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(T.fetchError.replace('{error}', message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleClaimKey = async (key: AvailableApiKey) => {
        setIsLoading(true);
        setError(null);
        setStatusMessage(null);

        const claimResult = await claimApiKey(key.id, currentUser.id, currentUser.username);
        if (!claimResult.success) {
            setError(T.claimError.replace('{error}', claimResult.message || 'Unknown error'));
            setIsLoading(false);
            return;
        }
        
        // Dispatch event to notify the app of the new temporary key
        eventBus.dispatch('tempKeyClaimed', key.apiKey);
        
        setCopiedKeyId(key.id);
        setStatusMessage(T.successMessage);
        
        setAvailableKeys([]);
        setIsLoading(false);
        
        if (onClaimSuccess) {
            onClaimSuccess();
        }

        setTimeout(() => setCopiedKeyId(null), 3000);
    };

    const handleHealthCheck = async (key: AvailableApiKey) => {
        setCheckingKeyId(key.id);
        setHealthCheckResults(prev => new Map(prev).set(key.id, null));
        try {
            const results = await runApiHealthCheck({ textKey: key.apiKey });
            setHealthCheckResults(prev => new Map(prev).set(key.id, results));
        } catch (error: any) {
            const errorResult: HealthCheckResult = { service: 'Health Check', model: 'N/A', status: 'error', message: error.message };
            setHealthCheckResults(prev => new Map(prev).set(key.id, [errorResult]));
        } finally {
            setCheckingKeyId(null);
        }
    };
    
    const handleAutoSelect = () => {
        setAutoSelectStatus('loading');
        setError(null);
        setStatusMessage(null);
        setAvailableKeys([]); // Clear the list view
        eventBus.dispatch('manualApiKeyRefresh');
    };

    const getStatusUi = (status?: HealthCheckResult['status']) => {
        switch (status) {
            case 'operational': return { icon: <CheckCircleIcon className="w-4 h-4 text-green-500"/>, text: 'text-green-700 dark:text-green-300' };
            case 'error': return { icon: <XIcon className="w-4 h-4 text-red-500"/>, text: 'text-red-700 dark:text-red-300' };
            case 'degraded': return { icon: <AlertTriangleIcon className="w-4 h-4 text-yellow-500"/>, text: 'text-yellow-700 dark:text-yellow-300' };
            default: return { icon: <XIcon className="w-4 h-4 text-red-500"/>, text: 'text-red-700 dark:text-red-300' };
        }
    };

    return (
        <div>
            <div className="flex flex-col items-center text-center">
                <KeyIcon className="w-12 h-12 text-primary-500 mb-3"/>
                <h2 className="text-xl font-bold">{T.requestNewKey}</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 max-w-md">
                    {T.modalSubtitle}
                </p>
                
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button 
                        onClick={handleAutoSelect} 
                        disabled={isLoading || autoSelectStatus === 'loading'}
                        className="w-60 flex items-center justify-center gap-2 bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                        {autoSelectStatus === 'loading' ? <Spinner/> : <SparklesIcon className="w-5 h-5"/>}
                        {T.autoSelectButton}
                    </button>
                     <button 
                        onClick={handleFetchKeys} 
                        disabled={isLoading || autoSelectStatus === 'loading'}
                        className="w-60 flex items-center justify-center gap-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold py-3 px-6 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors disabled:opacity-50"
                    >
                        {isLoading && availableKeys.length === 0 ? <Spinner/> : T.showListButton}
                    </button>
                </div>

                {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
                {statusMessage && <p className="mt-4 text-green-600 text-sm">{statusMessage}</p>}
                {autoSelectStatus === 'success' && <p className="mt-4 text-green-600 text-sm">{T.autoSelectSuccess}</p>}
                {autoSelectStatus === 'failed' && <p className="mt-4 text-red-500 text-sm">{T.autoSelectFailed}</p>}
            </div>

            {availableKeys.length > 0 && !isLoading && (
                <div className="mt-6 border-t border-neutral-200 dark:border-neutral-700 pt-6">
                    <h3 className="font-semibold text-center mb-4">{T.availableKeysTitle}</h3>
                    <div className="space-y-3">
                        {availableKeys.map(key => {
                            const results = healthCheckResults.get(key.id);
                            return (
                                <div key={key.id} className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-3 transition-shadow hover:shadow-md">
                                    <div className="flex items-center justify-between gap-4 flex-wrap">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-mono text-sm text-neutral-700 dark:text-neutral-300">
                                                {key.apiKey.substring(0, 8)}...{key.apiKey.slice(-4)}
                                            </p>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-500">
                                                Created: {new Date(key.createdAt).toLocaleString(language === 'ms' ? 'ms-MY' : 'en-US')}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <button 
                                                onClick={() => handleHealthCheck(key)} 
                                                disabled={checkingKeyId === key.id}
                                                className="w-28 flex justify-center text-xs font-semibold py-1.5 px-3 rounded-full bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors disabled:opacity-50"
                                            >
                                                {checkingKeyId === key.id ? <Spinner /> : 'Health Check'}
                                            </button>
                                            <button 
                                                onClick={() => handleClaimKey(key)}
                                                className="w-28 text-xs font-semibold py-1.5 px-3 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                                            >
                                                {copiedKeyId === key.id ? 'Claimed!' : 'Claim'}
                                            </button>
                                        </div>
                                    </div>
                                    {results === null ? <div className="flex justify-center pt-4"><Spinner/></div> : results && (
                                        <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700 space-y-2 animate-zoomIn">
                                            {servicesToCheck.map(service => {
                                                const result = results.find(r => r.model.includes(service.model));
                                                const status = result ? result.status : 'error';
                                                const { icon, text } = getStatusUi(status);
                                                const statusText = status === 'error'
                                                    ? 'Not Available'
                                                    : status.charAt(0).toUpperCase() + status.slice(1);
                                                return (
                                                    <div key={service.label} className="flex justify-between items-center text-xs p-1 bg-neutral-50 dark:bg-neutral-800/50 rounded">
                                                        <span className="font-medium text-neutral-600 dark:text-neutral-300">{service.label}</span>
                                                        <span className={`flex items-center gap-1 font-semibold ${text}`}>{icon} {statusText}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApiKeyClaimPanel;