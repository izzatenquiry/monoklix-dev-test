import React, { useState, useEffect, useRef } from 'react';
import { getHistory } from '../../services/historyService';
import { type HistoryItem, type Language } from '../../types';
import Spinner from '../common/Spinner';
import { FilmIcon, DownloadIcon, CheckCircleIcon } from '../Icons';
import TwoColumnLayout from '../common/TwoColumnLayout';
import { getTranslations } from '../../services/translations';

// FFmpeg is loaded via a script tag, so we can declare it on the window
declare global {
    interface Window {
        FFmpeg: any;
        FFmpegUtil: any;
    }
}

type EngineStatus = 'idle' | 'loading' | 'ready' | 'error';

const VideoCombinerView: React.FC<{ language: Language }> = ({ language }) => {
    const T = getTranslations(language).videoCombinerView;
    const [allVideos, setAllVideos] = useState<HistoryItem[]>([]);
    const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
    const [isCombining, setIsCombining] = useState(false);
    const [progressMessage, setProgressMessage] = useState('');
    const [outputUrl, setOutputUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const ffmpegRef = useRef<any>(null);
    const [blobUrls, setBlobUrls] = useState<Map<string, string>>(new Map());
    const [engineStatus, setEngineStatus] = useState<EngineStatus>('idle');

    // Proactively load FFmpeg on component mount
    useEffect(() => {
        const loadFfmpeg = async () => {
            if (ffmpegRef.current || engineStatus === 'loading' || engineStatus === 'ready') return;

            setEngineStatus('loading');
            setError(null);

            try {
                if (!window.FFmpeg || !window.FFmpegUtil) {
                     await new Promise<void>((resolve, reject) => {
                        let attempts = 0;
                        const interval = setInterval(() => {
                            if (window.FFmpeg && window.FFmpegUtil) {
                                clearInterval(interval);
                                resolve();
                            }
                            attempts++;
                            if (attempts > 20) { // ~5 seconds timeout
                                clearInterval(interval);
                                reject(new Error("The FFmpeg library failed to load from the network. Please check your internet connection and refresh."));
                            }
                        }, 250);
                    });
                }
                
                const ffmpeg = window.FFmpeg.createFFmpeg({
                    log: true,
                    corePath: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js",
                });

                ffmpeg.setLogger(({ message }: { message: string }) => {
                    console.log(message);
                    if (isCombining && (message.includes('Input') || message.includes('Output') || message.includes('size='))) {
                        setProgressMessage(message);
                    }
                });

                await ffmpeg.load();
                ffmpegRef.current = ffmpeg;
                setEngineStatus('ready');
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred while initializing the video engine.";
                setError(errorMessage);
                setEngineStatus('error');
            }
        };

        loadFfmpeg();
    }, [engineStatus, isCombining]);

    // Fetch videos from history
    useEffect(() => {
        const fetchVideos = async () => {
            const history = await getHistory();
            const videoItems = history.filter(item => item.type === 'Video');
            setAllVideos(videoItems);

            const newUrls = new Map<string, string>();
            videoItems.forEach(item => {
                if (item.result instanceof Blob) {
                    const url = URL.createObjectURL(item.result);
                    newUrls.set(item.id, url);
                }
            });
            setBlobUrls(newUrls);
        };
        fetchVideos();

        return () => {
            blobUrls.forEach(url => URL.revokeObjectURL(url));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Cleanup output URL
    useEffect(() => {
        return () => {
            if (outputUrl) {
                URL.revokeObjectURL(outputUrl);
            }
        };
    }, [outputUrl]);

    const toggleVideoSelection = (id: string) => {
        setSelectedVideos(prev => {
            if (prev.includes(id)) {
                return prev.filter(vidId => vidId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleCombine = async () => {
        if (selectedVideos.length < 2) {
            setError("Please select at least two videos to combine.");
            return;
        }

        setIsCombining(true);
        setError(null);
        setProgressMessage(T.loading);
        if (outputUrl) URL.revokeObjectURL(outputUrl);
        setOutputUrl(null);

        try {
            const ffmpeg = ffmpegRef.current;
            if (!ffmpeg) {
                throw new Error("FFmpeg instance is not available.");
            }

            const selectedVideoItems = allVideos.filter(v => selectedVideos.includes(v.id));
            let fileListContent = '';

            for (let i = 0; i < selectedVideoItems.length; i++) {
                const videoItem = selectedVideoItems[i];
                if (videoItem.result instanceof Blob) {
                    const fileName = `input${i}.mp4`;
                    setProgressMessage(T.loadingVideo.replace('{current}', String(i + 1)).replace('{total}', String(selectedVideos.length)));
                    await ffmpeg.FS('writeFile', fileName, await window.FFmpegUtil.fetchFile(videoItem.result));
                    fileListContent += `file '${fileName}'\n`;
                }
            }
            
            setProgressMessage(T.creatingFileList);
            await ffmpeg.FS('writeFile', 'filelist.txt', fileListContent);

            setProgressMessage(T.combiningVideos);
            await ffmpeg.run('-f', 'concat', '-safe', '0', '-i', 'filelist.txt', '-c', 'copy', 'output.mp4');

            setProgressMessage(T.finishing);
            const data = ffmpeg.FS('readFile', 'output.mp4');
            const blob = new Blob([data.buffer], { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            setOutputUrl(url);

        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred during video processing.";
            setError(errorMessage);
        } finally {
            setIsCombining(false);
            setProgressMessage('');
        }
    };

    const isButtonDisabled = isCombining || selectedVideos.length < 2 || engineStatus !== 'ready';
    
    let buttonText = T.combineButton.replace('{count}', String(selectedVideos.length));
    if (engineStatus === 'loading') buttonText = T.initializing;
    if (engineStatus === 'error') buttonText = T.engineError;
    if (isCombining) buttonText = T.combining;


    const leftPanel = (
        <>
            <div>
                <h1 className="text-2xl font-bold sm:text-3xl">{T.title}</h1>
                <p className="text-neutral-500 dark:text-neutral-400 mt-1">{T.subtitle}</p>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                <h2 className="text-lg font-semibold">{T.selectVideos} ({selectedVideos.length} {T.selected})</h2>
                {allVideos.length === 0 ? (
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm">{T.noVideos}</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {allVideos.map(video => (
                            <button
                                key={video.id}
                                onClick={() => toggleVideoSelection(video.id)}
                                className={`relative aspect-video rounded-md overflow-hidden transition-all duration-200 ${selectedVideos.includes(video.id) ? 'ring-4 ring-primary-500' : 'ring-2 ring-transparent hover:ring-primary-300'}`}
                            >
                                <video src={blobUrls.get(video.id)} className="w-full h-full object-cover" muted loop playsInline />
                                {selectedVideos.includes(video.id) && (
                                    <div className="absolute inset-0 bg-primary-500/50 flex items-center justify-center">
                                        <CheckCircleIcon className="w-8 h-8 text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="pt-4 mt-auto">
                <button
                    onClick={handleCombine}
                    disabled={isButtonDisabled}
                    className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {(isCombining || engineStatus === 'loading') && <Spinner />}
                    {buttonText}
                </button>
            </div>
        </>
    );

    const rightPanel = (
        <>
            {isCombining && (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                    <Spinner />
                    <p className="mt-4 text-neutral-500 dark:text-neutral-400 font-semibold">{T.loading}</p>
                    <p className="mt-2 text-xs text-neutral-400 dark:text-neutral-500 whitespace-pre-wrap">{progressMessage}</p>
                </div>
            )}
            {error && !isCombining && (
                <div className="text-center text-red-500 dark:text-red-400">
                    <p className="font-semibold">{T.error}</p>
                    <p className="text-sm mt-2">{error}</p>
                </div>
            )}
            {!isCombining && outputUrl && (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                    <video src={outputUrl} controls autoPlay className="max-h-full max-w-full rounded-md" />
                    <a
                        href={outputUrl}
                        download={`monoklix-combined-video-${Date.now()}.mp4`}
                        className="flex items-center gap-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-semibold py-2 px-4 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                    >
                        <DownloadIcon className="w-4 h-4" /> {T.downloadCombined}
                    </a>
                </div>
            )}
            {!isCombining && !outputUrl && !error && (
                <div className="text-center text-neutral-500 dark:text-neutral-600">
                    <FilmIcon className="w-16 h-16 mx-auto" />
                    <p>{T.outputPlaceholder}</p>
                </div>
            )}
        </>
    );

    return <TwoColumnLayout leftPanel={leftPanel} rightPanel={rightPanel} />;
};

export default VideoCombinerView;