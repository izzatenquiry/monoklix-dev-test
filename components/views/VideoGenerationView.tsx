import React, { useState, useCallback, useEffect } from 'react';
import { generateVideo } from '../../services/geminiService';
import { addHistoryItem } from '../../services/historyService';
import Spinner from '../common/Spinner';
import { DownloadIcon, TrashIcon, StarIcon, AlertTriangleIcon, RefreshCwIcon } from '../Icons';
import TwoColumnLayout from '../common/TwoColumnLayout';
import ImageUpload from '../common/ImageUpload';
import { MODELS } from '../../services/aiConfig';
import { type Language } from '../../types';
import { getTranslations } from '../../services/translations';


interface ImageData {
  base64: string;
  mimeType: string;
}

interface VideoGenPreset {
  prompt: string;
  image: { base64: string; mimeType: string; };
}

interface VideoGenerationViewProps {
  preset: VideoGenPreset | null;
  clearPreset: () => void;
  language: Language;
}

const aspectRatios = ["9:16", "1:1", "16:9", "4:3", "3:4"];
const cameraMotions = ["Random", "Pan", "Zoom In", "Zoom Out", "Tilt", "Crane", "Dolly", "Aerial"];
const styles = ["Random", "Photorealistic", "Cinematic", "Anime", "Vintage", "Claymation", "Watercolor", "3D Animation", "Soft Daylight Studio", "Pastel Clean", "High-Key White", "Low-Key Moody", "Color Block", "Gradient Backdrop", "Paper Curl Backdrop", "Beige Seamless", "Shadow Play / Hard Light", "Marble Tabletop", "Pastel Soft"];
const backgroundVibes = [ "Random", "Coffee Shop Aesthetic", "Urban Night", "Tropical Beach", "Luxury Apartment", "Flower Garden", "Old Building", "Classic Library", "Minimalist Studio", "Rooftop Bar", "Autumn Garden", "Tokyo Street", "Scandinavian Interior", "Magical Forest", "Cyberpunk City", "Bohemian Desert", "Modern Art Gallery", "Sunset Rooftop", "Snowy Mountain Cabin", "Industrial Loft", "Futuristic Lab", "Pastel Dream Sky", "Palace Interior", "Country Kitchen", "Coral Reef", "Paris Street", "Asian Night Market", "Cruise Deck", "Vintage Train Station", "Outdoor Basketball Court", "Professional Kitchen", "Luxury Hotel Lobby", "Rock Concert Stage", "Zen Garden", "Mediterranean Villa Terrace", "Space / Sci-Fi Setting", "Modern Workspace", "Hot Spring Bath", "Fantasy Throne Room", "Skyscraper Peak", "Sports Car Garage", "Botanical Greenhouse", "Ice Rink", "Classic Dance Studio", "Beach Party Night", "Ancient Library", "Mountain Observation Deck", "Modern Dance Studio", "Speakeasy Bar", "Rainforest Trail", "Rice Terrace Field" ];
const resolutions = ["720p", "1080p"];

const SESSION_KEY = 'videoGenerationState';

const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div><h2 className="text-lg font-semibold mb-2">{title}</h2>{children}</div>
);

const VideoGenerationView: React.FC<VideoGenerationViewProps> = ({ preset, clearPreset, language }) => {
  const [subjectContext, setSubjectContext] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [ambiance, setAmbiance] = useState('');
  const [cameraMotion, setCameraMotion] = useState('Random');
  const [style, setStyle] = useState('Random');
  const [action, setAction] = useState('');
  const [dialogue, setDialogue] = useState('');
  const [dialogueAudio, setDialogueAudio] = useState('');
  const [backgroundVibe, setBackgroundVibe] = useState('Random');
  
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoFilename, setVideoFilename] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [referenceImage, setReferenceImage] = useState<ImageData | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [model, setModel] = useState(MODELS.videoGenerationDefault);
  const [resolution, setResolution] = useState("720p");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [imageUploadKey, setImageUploadKey] = useState(Date.now());

  const T = getTranslations(language).videoGenerationView;
  const commonT = getTranslations(language);
  const isVeo3 = model.includes('veo-3.0');

  const allStates = {
    subjectContext, negativePrompt, ambiance, cameraMotion, style, action, dialogue,
    dialogueAudio, backgroundVibe, referenceImage, previewUrl, model, resolution, aspectRatio
  };

  useEffect(() => {
    try {
        const savedState = sessionStorage.getItem(SESSION_KEY);
        if (savedState) {
            const state = JSON.parse(savedState);
            Object.keys(state).forEach(key => {
                if (key === 'subjectContext') setSubjectContext(state[key]);
                if (key === 'negativePrompt') setNegativePrompt(state[key]);
                if (key === 'ambiance') setAmbiance(state[key]);
                if (key === 'cameraMotion') setCameraMotion(state[key]);
                if (key === 'style') setStyle(state[key]);
                if (key === 'action') setAction(state[key]);
                if (key === 'dialogue') setDialogue(state[key]);
                if (key === 'dialogueAudio') setDialogueAudio(state[key]);
                if (key === 'backgroundVibe') setBackgroundVibe(state[key]);
                if (key === 'referenceImage') setReferenceImage(state[key]);
                if (key === 'previewUrl') setPreviewUrl(state[key]);
                if (key === 'model') setModel(state[key]);
                if (key === 'resolution') setResolution(state[key]);
                if (key === 'aspectRatio') setAspectRatio(state[key]);
            });
        }
    } catch (e) { console.error("Failed to load state from session storage", e); }
  }, []);
  
  useEffect(() => {
    try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(allStates));
    } catch (e) { console.error("Failed to save state to session storage", e); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    subjectContext, negativePrompt, ambiance, cameraMotion, style, action, dialogue,
    dialogueAudio, backgroundVibe, referenceImage, previewUrl, model, resolution, aspectRatio
  ]);

  const loadingMessages = [
    "Warming up the AI director...",
    "Scouting for digital locations...",
    "Casting virtual actors...",
    "Adjusting camera and lighting...",
    "Action! Rendering scenes...",
    "This can take a few minutes. Please be patient.",
    "The AI is working hard on your masterpiece...",
    "Adding the final cinematic touches...",
    "Almost ready for the premiere...",
  ];

  useEffect(() => {
      let interval: ReturnType<typeof setInterval> | null = null;
      if (isLoading) {
        interval = setInterval(() => {
          setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length);
        }, 3000);
      }
      return () => {
        if (interval) clearInterval(interval);
      };
  }, [isLoading, loadingMessages.length]);

  useEffect(() => {
      if (preset) {
          setSubjectContext(preset.prompt);
          setReferenceImage(preset.image);
          setPreviewUrl(`data:${preset.image.mimeType};base64,${preset.image.base64}`);
          clearPreset();
          window.scrollTo(0, 0);
      }
  }, [preset, clearPreset]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
      return () => {
          if (videoUrl) {
              URL.revokeObjectURL(videoUrl);
          }
      };
  }, [videoUrl]);

  const handleImageUpload = useCallback((base64: string, mimeType: string, file: File) => {
      setReferenceImage({ base64, mimeType });
      const reader = new FileReader();
      reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
  }, []);

  const handleGenerate = useCallback(async () => {
      if (!subjectContext.trim() && !action.trim() && !referenceImage) {
          setError("Please provide a subject or an action, or upload a reference image.");
          return;
      }
      
      const savedAuthToken = sessionStorage.getItem('veoAuthToken') || '';
      if (isVeo3 && !savedAuthToken.trim()) {
        setError("Veo Auth Token is required for this model. Please set it using the Key icon in the header.");
        return;
      }

      setIsLoading(true);
      setError(null);
      
      // Cleanup old video URL
      if (videoUrl) {
        console.log('🗑️ Revoking old video URL');
        URL.revokeObjectURL(videoUrl);
      }
      
      // CRITICAL: Reset states BEFORE generation
      setVideoUrl(null);
      setVideoFilename(null);

      const promptParts = [
        subjectContext,
        action,
        ambiance,
        (style !== 'Random') && `Artistic style: ${style}`,
        (cameraMotion !== 'Random') && `Camera motion: ${cameraMotion}`,
        (backgroundVibe !== 'Random') && `Background or setting: ${backgroundVibe}`,
      ].filter(Boolean);
  
      let fullPrompt = promptParts.join('. ');
      
      if (referenceImage) {
        const faceFidelityInstruction = "CRITICAL INSTRUCTION: The main subject in the video must be a photorealistic and highly accurate representation of the person in the provided reference image. Preserve their facial features and identity exactly.";
        fullPrompt = `${faceFidelityInstruction}. ${fullPrompt}`;
      }
  
      if (dialogue.trim()) {
          fullPrompt += `. The video should display the following text as on-screen captions: "${dialogue.trim()}"`;
      }

      if (dialogueAudio.trim() && isVeo3) {
          fullPrompt += `. The video should include the following spoken dialogue in Bahasa Melayu Malaysia: "${dialogueAudio.trim()}"`;
      }

      console.log('🎬 ===== VIDEO GENERATION VIEW =====');
      console.log('Model:', model);
      console.log('Aspect Ratio:', aspectRatio);
      console.log('Resolution:', resolution);
      console.log('Prompt:', fullPrompt.substring(0, 100) + '...');
      console.log('====================================');

      try {
          const image = referenceImage ? { imageBytes: referenceImage.base64, mimeType: referenceImage.mimeType } : undefined;
          
          const videoFile = await generateVideo(fullPrompt, model, aspectRatio, resolution, negativePrompt, image, savedAuthToken);
          
          console.log('📦 Video File received:', {
            name: videoFile.name,
            size: videoFile.size,
            type: videoFile.type,
            isFile: videoFile instanceof File,
            isBlob: videoFile instanceof Blob
          });
          
          if (!((videoFile as unknown) instanceof Blob)) {
            throw new Error('generateVideo did not return a valid File/Blob object');
          }
          
          const url = URL.createObjectURL(videoFile);
          
          console.log('🔗 Blob URL created:', url);
          
          if (!url || !url.startsWith('blob:')) {
            if (url) URL.revokeObjectURL(url);
            throw new Error('Failed to create valid blob URL from video file.');
          }

          // Set state and let React handle rendering declaratively.
          // The `key` prop on the <video> element will ensure it re-mounts and loads the new source.
          setVideoUrl(url);
          setVideoFilename(videoFile.name);
          console.log('✅ Video URL set in state. React will now render the video.');
          
          console.log('====================================\n');
          
          await addHistoryItem({
              type: 'Video',
              prompt: `Video: ${fullPrompt}`,
              result: videoFile,
          });
          
      } catch (e) {
          const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
          console.error('❌ Video generation failed:', errorMessage);
          console.error('Full error:', e);
          console.error('====================================\n');
          setError(errorMessage);
      } finally {
          setIsLoading(false);
      }
  }, [subjectContext, action, ambiance, style, cameraMotion, backgroundVibe, dialogue, dialogueAudio, isVeo3, referenceImage, model, aspectRatio, resolution, negativePrompt, videoUrl]);

  const removeReferenceImage = () => {
      setReferenceImage(null);
      setPreviewUrl(null);
      setImageUploadKey(Date.now());
  };

  const handleReset = useCallback(() => {
    setSubjectContext('');
    setNegativePrompt('');
    setAmbiance('');
    setCameraMotion('Random');
    setStyle('Random');
    setAction('');
    setDialogue('');
    setDialogueAudio('');
    setBackgroundVibe('Random');
    
    if (videoUrl) {
      console.log('🗑️ Revoking video URL on reset');
      URL.revokeObjectURL(videoUrl);
    }
    
    setVideoUrl(null);
    setVideoFilename(null);
    setError(null);
    setReferenceImage(null);
    setPreviewUrl(null);
    setModel(MODELS.videoGenerationDefault);
    setResolution("720p");
    setAspectRatio("9:16");
    setImageUploadKey(Date.now());
    sessionStorage.removeItem(SESSION_KEY);
  }, [videoUrl]);

  const leftPanel = (
    <>
        <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{T.title}</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">{T.subtitle}</p>
        </div>

        <Section title={T.modelFormat}>
            <div className={`grid grid-cols-1 ${isVeo3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-4`}>
                <div className={isVeo3 ? 'sm:col-span-1' : 'sm:col-span-1'}>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{T.aiModel}</label>
                    <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:outline-none transition">
                        {MODELS.videoGenerationOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                    </select>
                </div>
                <div className={isVeo3 ? 'sm:col-span-1' : 'sm:col-span-1'}>
                     <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{T.aspectRatio}</label>
                     <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:outline-none transition">
                        {aspectRatios.map(ar => <option key={ar} value={ar}>{ar}</option>)}
                    </select>
                </div>
                {isVeo3 && (
                    <div className="sm:col-span-1">
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{T.resolution}</label>
                        <select value={resolution} onChange={(e) => setResolution(e.target.value)} className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:outline-none transition">
                            {resolutions.map(res => <option key={res} value={res}>{res}</option>)}
                        </select>
                    </div>
                )}
            </div>
        </Section>
        
        <Section title={T.subjectContext}>
            <textarea value={subjectContext} onChange={e => setSubjectContext(e.target.value)} placeholder={T.subjectContextPlaceholder} rows={2} className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:outline-none transition" />
        </Section>
        
        <Section title={T.action}>
            <textarea value={action} onChange={e => setAction(e.target.value)} placeholder={T.actionPlaceholder} rows={2} className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:outline-none transition" />
        </Section>

        <Section title={T.creativeDirection}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">{T.style}</label><select value={style} onChange={e => setStyle(e.target.value)} className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:outline-none">{styles.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                <div><label className="block text-sm font-medium mb-1">{T.cameraMotion}</label><select value={cameraMotion} onChange={e => setCameraMotion(e.target.value)} className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:outline-none">{cameraMotions.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
                 <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">{T.backgroundVibe}</label><select value={backgroundVibe} onChange={e => setBackgroundVibe(e.target.value)} className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:outline-none">{backgroundVibes.map(v => <option key={v} value={v}>{v}</option>)}</select></div>
                <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">{T.ambiance}</label><textarea value={ambiance} onChange={e => setAmbiance(e.target.value)} placeholder={T.ambiancePlaceholder} rows={1} className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:outline-none" /></div>
                <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">{T.negativePrompt}</label><textarea value={negativePrompt} onChange={e => setNegativePrompt(e.target.value)} placeholder={T.negativePromptPlaceholder} rows={1} className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:outline-none" /></div>
            </div>
        </Section>

        <Section title={T.dialogue}>
            <textarea value={dialogue} onChange={e => setDialogue(e.target.value)} placeholder={T.dialoguePlaceholder} rows={2} className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:outline-none transition" />
        </Section>

        <Section title={T.dialogueAudio}>
            <div className={`relative ${!isVeo3 ? 'opacity-50' : ''}`}>
                <textarea
                    value={dialogueAudio}
                    onChange={e => setDialogueAudio(e.target.value)}
                    placeholder={T.dialogueAudioPlaceholder}
                    rows={2}
                    className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:outline-none transition disabled:cursor-not-allowed"
                    disabled={!isVeo3}
                />
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 p-2 bg-neutral-100 dark:bg-neutral-800/50 rounded-md" dangerouslySetInnerHTML={{ __html: T.dialogueAudioNote }}/>
        </Section>

        <Section title={T.refImage}>
            {previewUrl ? (
                 <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                    <img src={previewUrl} alt="Reference Preview" className="w-full h-full object-contain bg-neutral-100 dark:bg-neutral-800" />
                    <button onClick={removeReferenceImage} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <ImageUpload id="video-ref-upload" key={imageUploadKey} onImageUpload={handleImageUpload} title={T.uploadImage}/>
            )}
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 p-2 bg-neutral-100 dark:bg-neutral-800/50 rounded-md">
                {T.refImageNote}
            </p>
        </Section>
        
        <div className="pt-4 mt-auto">
            <div className="flex gap-4">
                <button onClick={handleGenerate} disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? <Spinner /> : T.generateButton}
                </button>
                <button
                    onClick={handleReset}
                    disabled={isLoading}
                    className="flex-shrink-0 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-semibold py-3 px-4 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors disabled:opacity-50"
                >
                    {T.resetButton}
                </button>
            </div>
             {error && <p className="text-red-500 dark:text-red-400 mt-2 text-center">{error}</p>}
        </div>
    </>
  );

  const rightPanel = (
      <>
          {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                  <Spinner />
                  <p className="mt-4 text-neutral-500 dark:text-neutral-400">{commonT.generating}</p>
                  <p className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">{loadingMessages[loadingMessageIndex]}</p>
              </div>
          ) : error ? (
               <div className="text-center text-red-500 dark:text-red-400 p-4">
                   <AlertTriangleIcon className="w-12 h-12 mx-auto mb-4" />
                   <p className="font-semibold">{T.error}</p>
                   <p className="text-sm mt-2 max-w-md mx-auto">{error}</p>
                   <button
                       onClick={handleGenerate}
                       className="mt-6 flex items-center justify-center gap-2 bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors mx-auto"
                   >
                       <RefreshCwIcon className="w-4 h-4" />
                       Try Again
                   </button>
              </div>
          ) : videoUrl ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                  {console.log('🎥 Rendering video player, URL:', videoUrl)}
                  
                  <video 
                      key={videoUrl}
                      data-video-player="true"
                      src={videoUrl} 
                      controls 
                      autoPlay 
                      preload="auto"
                      playsInline
                      muted
                      className="max-h-full max-w-full rounded-md"
                      style={{ maxWidth: '100%', maxHeight: '80vh', display: 'block' }}
                      onError={(e) => {
                          console.error('❌ Video player error:', e);
                          console.error('Video URL:', videoUrl);
                          const videoEl = e.target as HTMLVideoElement;
                          console.error('Error details:', videoEl.error);
                          console.error('Network state:', videoEl.networkState);
                          console.error('Ready state:', videoEl.readyState);
                      }}
                      onLoadStart={() => {
                          console.log('🔄 Video load started');
                      }}
                      onLoadedMetadata={(e) => {
                          console.log('✅ Video metadata loaded');
                          const videoEl = e.target as HTMLVideoElement;
                          console.log('Duration:', videoEl.duration);
                          console.log('Video dimensions:', videoEl.videoWidth, 'x', videoEl.videoHeight);
                      }}
                      onCanPlay={() => {
                          console.log('✅ Video can play');
                      }}
                      onCanPlayThrough={() => {
                          console.log('✅ Video can play through');
                      }}
                      onLoadedData={() => {
                          console.log('✅ Video data loaded');
                      }}
                      onPlaying={() => {
                          console.log('▶️ Video is playing');
                      }}
                      onWaiting={() => {
                          console.log('⏳ Video is waiting/buffering');
                      }}
                      onSuspend={() => {
                          console.log('⏸️ Video loading suspended');
                      }}
                      onStalled={() => {
                          console.log('⚠️ Video loading stalled');
                      }}
                  >
                      Your browser does not support the video tag.
                  </video>
                  
                  <a 
                      href={videoUrl} 
                      download={videoFilename || `monoklix-video-${Date.now()}.mp4`} 
                      className="flex items-center gap-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-semibold py-2 px-4 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                      onClick={() => {
                          console.log('📥 Download clicked');
                          console.log('Filename:', videoFilename);
                          console.log('URL:', videoUrl);
                      }}
                  >
                      <DownloadIcon className="w-4 h-4" /> Download Video
                  </a>
              </div>
          ) : (
              <div className="text-center text-neutral-500 dark:text-neutral-600">
                  <StarIcon className="w-16 h-16 mx-auto" />
                  <p>{T.outputPlaceholder}</p>
              </div>
          )}
      </>
  );

  return <TwoColumnLayout leftPanel={leftPanel} rightPanel={rightPanel} />;
};

export default VideoGenerationView;