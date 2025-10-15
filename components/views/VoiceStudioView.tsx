import React, { useState, useEffect, useCallback } from 'react';
import { MicIcon, DownloadIcon, AlertTriangleIcon } from '../Icons';
import { generateVoiceOver } from '../../services/geminiService';
import { addHistoryItem } from '../../services/historyService';
import Spinner from '../common/Spinner';
import TwoColumnLayout from '../common/TwoColumnLayout';
import { type Language } from '../../types';
import { getTranslations } from '../../services/translations';


const voiceActors = [
    { id: 'en-US-Standard-C', name: 'USA-C', language: 'English (US)', gender: 'Female' },
    { id: 'en-US-Standard-D', name: 'USA-D', language: 'English (US)', gender: 'Male' },
    { id: 'en-GB-Standard-A', name: 'UK-A', language: 'English (UK)', gender: 'Female' },
    { id: 'en-GB-Standard-B', name: 'UK-B', language: 'English (UK)', gender: 'Male' },
    { id: 'ms-MY-Standard-A', name: 'MY-A', language: 'Malay (Malaysia)', gender: 'Female' },
    { id: 'ms-MY-Standard-B', name: 'MY-B', language: 'Malay (Malaysia)', gender: 'Male' },
    { id: 'ms-MY-Standard-C', name: 'MY-C', language: 'Malay (Malaysia)', gender: 'Female' },
    { id: 'ms-MY-Standard-D', name: 'MY-D', language: 'Malay (Malaysia)', gender: 'Male' },
];

const SESSION_KEY = 'voiceStudioState';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        {children}
    </div>
);

const SliderControl: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  displayValue: string;
  unit: string;
}> = ({ label, value, min, max, step, onChange, displayValue, unit }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label} ({displayValue}{unit})
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
    />
  </div>
);

interface VoiceStudioViewProps {
    language: Language;
}

const VoiceStudioView: React.FC<VoiceStudioViewProps> = ({ language }) => {
    const T = getTranslations(language).voiceStudioView;
    const [script, setScript] = useState('');
    const [selectedActor, setSelectedActor] = useState(voiceActors[0].id);
    const [speed, setSpeed] = useState(1.0);
    const [pitch, setPitch] = useState(0.0);
    const [volume, setVolume] = useState(0.0);
    const [isLoading, setIsLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [apiError, setApiError] = useState<{type: 'permission' | 'generic', message: string} | null>(null);

    const allStates = { script, selectedActor, speed, pitch, volume };

    useEffect(() => {
        try {
            const savedState = sessionStorage.getItem(SESSION_KEY);
            if (savedState) {
                const state = JSON.parse(savedState);
                if (state.script) setScript(state.script);
                if (state.selectedActor) setSelectedActor(state.selectedActor);
                if (state.speed) setSpeed(state.speed);
                if (state.pitch) setPitch(state.pitch);
                if (state.volume) setVolume(state.volume);
            }
        } catch (e) { console.error("Failed to load state from session storage", e); }
    }, []);

    useEffect(() => {
        try {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(allStates));
        } catch (e) { console.error("Failed to save state to session storage", e); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [script, selectedActor, speed, pitch, volume]);


    const groupedActors = voiceActors.reduce((acc, actor) => {
        const groupKey = `${actor.language} - ${actor.gender}`;
        (acc[groupKey] = acc[groupKey] || []).push(actor);
        return acc;
    }, {} as Record<string, typeof voiceActors>);

    // Cleanup object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
        if (audioUrl && audioUrl.startsWith('blob:')) {
            URL.revokeObjectURL(audioUrl);
        }
        };
    }, [audioUrl]);

    const handleGenerate = async () => {
        if (!script.trim()) {
            setApiError({type: 'generic', message: "A script is required to generate a voice-over."});
            return;
        }
        setIsLoading(true);
        setApiError(null);
        setAudioUrl(null);

        try {
            const resultBlob = await generateVoiceOver(script, selectedActor, speed, pitch, volume);
            
            const resultUrl = URL.createObjectURL(resultBlob);
            setAudioUrl(resultUrl);

            await addHistoryItem({
                type: 'Audio',
                prompt: `Voice Studio (${selectedActor}): ${script.substring(0, 50)}...`,
                result: resultBlob // Save the Blob itself for persistence
            });
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            console.error("Generation failed:", e);
            if (errorMessage.includes('Cloud Text-to-Speech API') && (errorMessage.includes('blocked') || errorMessage.includes('enabled'))) {
                setApiError({type: 'permission', message: "This feature requires special API access."});
            } else {
                setApiError({type: 'generic', message: errorMessage});
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (!audioUrl) return;
        const link = document.createElement('a');
        link.href = audioUrl;
        link.download = `monoklix-audio-${Date.now()}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    // FIX: Imported `useCallback` to resolve the "Cannot find name 'useCallback'" error.
    const handleReset = useCallback(() => {
        setScript('');
        setSelectedActor(voiceActors[0].id);
        setSpeed(1.0);
        setPitch(0.0);
        setVolume(0.0);
        setAudioUrl(null);
        setApiError(null);
        sessionStorage.removeItem(SESSION_KEY);
    }, []);

    const leftPanel = (
        <>
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">{T.title}</h1>
              <p className="text-neutral-500 dark:text-neutral-400 mt-1">{T.subtitle}</p>
            </div>
            
            <Section title={T.writeScript}>
                <div className="relative h-48">
                    <textarea
                        value={script}
                        onChange={(e) => setScript(e.target.value)}
                        placeholder={T.scriptPlaceholder}
                        className="w-full h-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 resize-none focus:ring-2 focus:ring-primary-500 focus:outline-none transition"
                    />
                    <span className="absolute bottom-3 right-3 text-xs text-gray-500">{script.length} {T.characters}</span>
                </div>
            </Section>
            
            <Section title={T.selectVoice}>
                <select
                    value={selectedActor}
                    onChange={(e) => setSelectedActor(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:outline-none transition"
                >
                    {Object.entries(groupedActors).map(([group, actors]) => (
                        <optgroup key={group} label={group}>
                            {actors.map(actor => (
                                <option key={actor.id} value={actor.id}>
                                    {actor.name}
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </select>
            </Section>
            
            <Section title={T.advancedSettings}>
                <div className="space-y-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                    <SliderControl
                      label={T.speed}
                      value={speed}
                      min={0.5} max={2.0} step={0.01}
                      onChange={(e) => setSpeed(parseFloat(e.target.value))}
                      displayValue={speed.toFixed(2)}
                      unit="x"
                    />
                    <SliderControl
                      label={T.pitch}
                      value={pitch}
                      min={-20} max={20} step={0.1}
                      onChange={(e) => setPitch(parseFloat(e.target.value))}
                      displayValue={pitch.toFixed(1)}
                      unit=""
                    />
                    <SliderControl
                      label={T.volume}
                      value={volume}
                      min={-96} max={16} step={0.1}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      displayValue={volume.toFixed(1)}
                      unit="dB"
                    />
                </div>
            </Section>

            <div className="pt-4 mt-auto">
                <div className="flex gap-4">
                    <button
                      onClick={handleGenerate}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Spinner/> : T.generateButton}
                    </button>
                    <button
                      onClick={handleReset}
                      disabled={isLoading}
                      className="flex-shrink-0 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-semibold py-3 px-4 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors disabled:opacity-50"
                    >
                      {T.resetButton}
                    </button>
                </div>
            </div>
        </>
    );

    const rightPanel = (
        <>
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                   <Spinner />
                   <p className="text-neutral-500 dark:text-neutral-400">{T.loading}</p>
                </div>
            ) : apiError?.type === 'permission' ? (
                <div className="text-center text-yellow-800 dark:text-yellow-200 bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-lg border border-yellow-300 dark:border-yellow-700 w-full max-w-md mx-auto">
                    <AlertTriangleIcon className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                    <h3 className="font-bold text-lg">{T.apiErrorTitle}</h3>
                    <p className="mt-2 text-sm" dangerouslySetInnerHTML={{ __html: T.apiErrorBody }}/>
                    <a href="https://console.cloud.google.com/apis/library/texttospeech.googleapis.com" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors text-sm">
                        {T.apiErrorButton}
                    </a>
                    <p className="mt-3 text-xs text-yellow-600 dark:text-yellow-400">{T.apiErrorHelp}</p>
                </div>
            ) : apiError?.type === 'generic' ? (
                <div className="text-center text-red-500 dark:text-red-400">
                     <p className="font-semibold">{T.genericError}</p>
                     <p className="text-sm mt-2">{apiError.message}</p>
                </div>
            ) : audioUrl ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                    <div className="w-full max-w-md space-y-4">
                        <audio controls src={audioUrl} className="w-full">
                            Your browser does not support the audio element.
                        </audio>
                        <button 
                            onClick={handleDownload}
                            className="w-full flex items-center justify-center gap-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-semibold py-2 px-3 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                        >
                            <DownloadIcon className="w-4 h-4"/> {T.downloadAudio}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center text-neutral-500 dark:text-neutral-600">
                    <MicIcon className="w-16 h-16 mx-auto" />
                    <p className="mt-2">{T.outputPlaceholder}</p>
                </div>
            )}
        </>
    );

    return <TwoColumnLayout leftPanel={leftPanel} rightPanel={rightPanel} />;
};

export default VoiceStudioView;