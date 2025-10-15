import React, { useState, useCallback, useEffect, useRef } from 'react';
import ImageUpload from '../common/ImageUpload';
import { composeImage, type MultimodalContent, generateMultimodalContent, generateVideo } from '../../services/geminiService';
import { addHistoryItem } from '../../services/historyService';
import Spinner from '../common/Spinner';
import { StarIcon, DownloadIcon, ImageIcon, VideoIcon, WandIcon, AlertTriangleIcon, RefreshCwIcon, XIcon } from '../Icons';
import { getProductReviewImagePrompt, getProductReviewStoryboardPrompt } from '../../services/promptManager';
import { type Language } from '../../types';
import { getTranslations } from '../../services/translations';
import { MODELS } from '../../services/aiConfig';


const vibeOptions = ["Random", "Energetic & Fun", "Cinematic & Epic", "Modern & Clean", "Natural & Organic", "Tech & Futuristic"];
const backgroundVibes = [
    "Random", "Aesthetic Cafe", "Urban Style (Dining)", "Tropical Beach", "Luxury Apartment", "Flower Garden", "Old Building", "Classic Library", 
    "Minimalist Studio", "Rooftop Bar", "Autumn Garden", "Tokyo Street", "Scandinavian Interior", "Magical Forest", "Cyberpunk City", 
    "Bohemian Desert", "Modern Art Gallery", "Sunset Rooftop", "Snowy Mountain Cabin", "Industrial Loft", "Futuristic Lab", 
    "Pastel Dream Sky", "Palace Interior", "Country Kitchen", "Coral Reef", "Paris Street", "Asian Night Market", "Cruise Deck", 
    "Vintage Train Station", "Outdoor Basketball Court", "Professional Kitchen", "Luxury Hotel Lobby", "Rock Concert Stage", 
    "Zen Garden", "Mediterranean Villa Terrace", "Space / Sci-Fi Setting", "Modern Workspace", "Hot Spring Bath", 
    "Fantasy Throne Room", "Skyscraper Peak", "Sports Car Garage", "Botanical Greenhouse", "Ice Rink", "Classic Dance Studio", 
    "Beach Party Night", "Ancient Library", "Mountain Observation Deck", "Modern Dance Studio", "Speakeasy Bar", 
    "Rainforest Trail", "Rice Terrace Field"
];

const lightingOptions = ["Random", "Studio Light", "Dramatic", "Natural Light", "Neon", "Golden Hour", "Soft Daylight"];
const contentTypeOptions = ["Random", "Hard Selling", "Soft Selling", "Storytelling", "Problem/Solution", "ASMR / Sensory", "Unboxing", "Educational", "Testimonial"];
const languages = ["English", "Bahasa Malaysia", "Chinese"];
const styleOptions = ["Random", "Realism", "Photorealistic", "Cinematic", "Anime", "Vintage", "3D Animation", "Watercolor", "Claymation"];
const cameraOptions = ["Random", "Detail / Macro", "Close-Up", "Medium Close-Up", "Medium / Half-Body", "Three-Quarter", "Full Body", "Flatlay", "Wide Shot", "Medium Shot", "Long Shot", "Dutch Angle", "Low Angle", "High Angle", "Overhead Shot"];
const compositionOptions = ["Random", "Rule of Thirds", "Leading Lines", "Symmetry", "Golden Ratio", "Centered", "Asymmetrical"];
const lensTypeOptions = ["Random", "Wide Angle Lens", "Telephoto Lens", "Fisheye Lens", "Macro Lens", "50mm lens", "85mm lens"];
const filmSimOptions = ["Random", "Fujifilm Velvia", "Kodak Portra 400", "Cinematic Kodachrome", "Vintage Polaroid", "Ilford HP5 (B&W)"];


interface VideoGenPreset {
  prompt: string;
  image: { base64: string; mimeType: string; };
}

interface ImageEditPreset {
  base64: string;
  mimeType: string;
}

interface ProductReviewViewProps {
  onReEdit: (preset: ImageEditPreset) => void;
  onCreateVideo: (preset: VideoGenPreset) => void;
  language: Language;
}

const downloadText = (text: string, fileName: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

const triggerImageDownload = (data: string, fileNameBase: string) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${data}`;
    link.download = `${fileNameBase}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const SESSION_KEY = 'productReviewState';

const ProductReviewView: React.FC<ProductReviewViewProps> = ({ onReEdit, onCreateVideo, language }) => {
  const [productImage, setProductImage] = useState<MultimodalContent | null>(null);
  const [faceImage, setFaceImage] = useState<MultimodalContent | null>(null);
  const [productDesc, setProductDesc] = useState('');
  const [selectedVibe, setSelectedVibe] = useState<string>(vibeOptions[0]);
  const [selectedBackgroundVibe, setSelectedBackgroundVibe] = useState<string>(backgroundVibes[0]);
  const [selectedLighting, setSelectedLighting] = useState<string>(lightingOptions[0]);
  const [selectedContentType, setSelectedContentType] = useState<string>(contentTypeOptions[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(languages[1]);
  const [storyboard, setStoryboard] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [storyboardError, setStoryboardError] = useState<string | null>(null);
  const [includeCaptions, setIncludeCaptions] = useState<'Yes' | 'No'>('No');
  const [includeVoiceover, setIncludeVoiceover] = useState<'Yes' | 'No'>('No');

  // State for multi-image generation
  const [parsedScenes, setParsedScenes] = useState<string[]>([]);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [imageLoadingStatus, setImageLoadingStatus] = useState<boolean[]>(Array(4).fill(false));
  const [generatedImages, setGeneratedImages] = useState<(string | null)[]>(Array(4).fill(null));
  const [imageGenerationErrors, setImageGenerationErrors] = useState<(string | null)[]>(Array(4).fill(null));

  // State for integrated video generation
  const [isGeneratingVideos, setIsGeneratingVideos] = useState(false);
  const [videoGenerationStatus, setVideoGenerationStatus] = useState<('idle' | 'loading' | 'success' | 'error')[]>(Array(4).fill('idle'));
  const [generatedVideos, setGeneratedVideos] = useState<(string | null)[]>(Array(4).fill(null));
  const [videoFilenames, setVideoFilenames] = useState<(string | null)[]>(Array(4).fill(null));
  const [videoGenerationErrors, setVideoGenerationErrors] = useState<(string | null)[]>(Array(4).fill(null));
  const isVideoCancelledRef = useRef(false);
  
  const [productImageUploadKey, setProductImageUploadKey] = useState(Date.now());
  const [faceImageUploadKey, setFaceImageUploadKey] = useState(Date.now() + 1);

  // New creative direction states
  const [style, setStyle] = useState('Random');
  const [camera, setCamera] = useState('Random');
  const [composition, setComposition] = useState('Random');
  const [lensType, setLensType] = useState('Random');
  const [filmSim, setFilmSim] = useState('Random');
  const [creativityLevel, setCreativityLevel] = useState(5);
  const [authToken, setAuthToken] = useState('');

  // New video generation settings state
  const [videoModel, setVideoModel] = useState(MODELS.videoGenerationDefault);
  const [videoAspectRatio, setVideoAspectRatio] = useState('9:16');
  const [videoResolution, setVideoResolution] = useState('720p');

  const T = getTranslations(language).productReviewView;

  useEffect(() => {
    try {
        const savedToken = sessionStorage.getItem('veoAuthToken');
        if (savedToken) setAuthToken(savedToken);
        const savedState = sessionStorage.getItem(SESSION_KEY);
        if (savedState) {
            const state = JSON.parse(savedState);
            if (state.productDesc) setProductDesc(state.productDesc);
            if (state.selectedVibe) setSelectedVibe(state.selectedVibe);
            if (state.selectedBackgroundVibe) setSelectedBackgroundVibe(state.selectedBackgroundVibe);
            if (state.selectedLighting) setSelectedLighting(state.selectedLighting);
            if (state.selectedContentType) setSelectedContentType(state.selectedContentType);
            if (state.selectedLanguage) setSelectedLanguage(state.selectedLanguage);
            if (state.storyboard) setStoryboard(state.storyboard);
            if (state.includeCaptions) setIncludeCaptions(state.includeCaptions);
            if (state.includeVoiceover) setIncludeVoiceover(state.includeVoiceover);
            if (state.parsedScenes) setParsedScenes(state.parsedScenes);
            if (state.style) setStyle(state.style);
            if (state.camera) setCamera(state.camera);
            if (state.composition) setComposition(state.composition);
            if (state.lensType) setLensType(state.lensType);
            if (state.filmSim) setFilmSim(state.filmSim);
            if (state.creativityLevel) setCreativityLevel(state.creativityLevel);
        }
    } catch (e) { console.error("Failed to load state from session storage", e); }
  }, []);

  useEffect(() => {
    try {
        const stateToSave = { 
            productDesc, selectedVibe, selectedBackgroundVibe, selectedLighting,
            selectedContentType, selectedLanguage, storyboard, includeCaptions, includeVoiceover,
            parsedScenes, 
            style, camera, composition, lensType, filmSim, creativityLevel,
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(stateToSave));
    } catch (e) { console.error("Failed to save state to session storage", e); }
  }, [
    productDesc, selectedVibe, selectedBackgroundVibe, selectedLighting,
    selectedContentType, selectedLanguage, storyboard, includeCaptions, includeVoiceover,
    parsedScenes, style, camera, composition, lensType, filmSim, creativityLevel
  ]);

  useEffect(() => {
    return () => {
        generatedVideos.forEach(url => {
            if (url && url.startsWith('blob:')) {
                URL.revokeObjectURL(url);
            }
        });
    };
  }, [generatedVideos]);

  const handleProductImageUpload = useCallback((base64: string, mimeType: string) => {
    setProductImage({ base64, mimeType });
  }, []);

  const handleFaceImageUpload = useCallback((base64: string, mimeType: string) => {
    setFaceImage({ base64, mimeType });
  }, []);

  const handleGenerate = async () => {
    if (!productImage || !faceImage || !productDesc) {
      setStoryboardError("A product image, face image, and product description are all required.");
      return;
    }
    setIsLoading(true);
    setStoryboardError(null);
    setStoryboard(null);
    setParsedScenes([]);
    setGeneratedImages(Array(4).fill(null));
    setImageGenerationErrors(Array(4).fill(null));
    setGeneratedVideos(Array(4).fill(null));
    setVideoFilenames(Array(4).fill(null));
    setVideoGenerationStatus(Array(4).fill('idle'));
    setVideoGenerationErrors(Array(4).fill(null));

    const prompt = getProductReviewStoryboardPrompt({
      productDesc,
      selectedLanguage,
      selectedVibe,
      selectedBackgroundVibe,
      selectedContentType,
      includeCaptions,
      includeVoiceover
    });

    try {
      const imagesPayload: MultimodalContent[] = [productImage, faceImage];
      const result = await generateMultimodalContent(prompt, imagesPayload);
      setStoryboard(result);

      const scenes = [];
      const sceneMatches = result.matchAll(/\*\*Scene \d+:\*\*\s*([\s\S]*?)(?=\*\*Scene \d+:|$)/g);
      for (const match of sceneMatches) {
          scenes.push(match[1].trim());
      }
      const finalScenes = scenes.slice(0, 4);
      setParsedScenes(finalScenes);

      await addHistoryItem({
        type: 'Storyboard',
        prompt: `Product Review: ${productDesc.substring(0, 50)}... (Lang: ${selectedLanguage})`,
        result: result,
      });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      console.error("Generation failed:", e);
      setStoryboardError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateImages = async () => {
    if (parsedScenes.length === 0 || !productImage || !faceImage) {
      setStoryboardError("A storyboard must be generated first before creating images.");
      return;
    }

    setIsGeneratingImages(true);
    setImageGenerationErrors(Array(4).fill(null));
    const loadingStates = Array(4).fill(false);
    setGeneratedImages(Array(4).fill(null));

    for (let i = 0; i < Math.min(parsedScenes.length, 4); i++) {
        loadingStates[i] = true;
        setImageLoadingStatus([...loadingStates]);
        
        try {
            const scenePrompt = getProductReviewImagePrompt({
                productDesc,
                sceneDescription: parsedScenes[i],
                selectedVibe,
                selectedBackgroundVibe,
                selectedLighting,
                style,
                camera,
                composition,
                lensType,
                filmSim,
                creativityLevel,
            });
            
            const result = await composeImage(
                scenePrompt,
                [productImage, faceImage]
            );

            if (result.imageBase64) {
                const newImageBase64 = result.imageBase64;
                setGeneratedImages(prev => {
                    const newImages = [...prev];
                    newImages[i] = newImageBase64;
                    return newImages;
                });
                
                await addHistoryItem({
                    type: 'Image',
                    prompt: `Product Review Scene Image ${i + 1}: ${parsedScenes[i].substring(0, 50)}...`,
                    result: newImageBase64
                });
            } else {
                 throw new Error("The AI did not return an image for this scene. Try rephrasing your inputs.");
            }

        } catch (e) {
            console.error(`Error generating image for scene ${i + 1}:`, e);
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setImageGenerationErrors(prev => {
                const newErrors = [...prev];
                newErrors[i] = errorMessage;
                return newErrors;
            });
        } finally {
            loadingStates[i] = false;
            setImageLoadingStatus([...loadingStates]);
        }
        
        if (i < Math.min(parsedScenes.length, 4) - 1) {
            await new Promise(resolve => setTimeout(resolve, 500)); 
        }
    }
    
    setIsGeneratingImages(false);
  };

  const handleRetryScene = async (index: number) => {
    if (!productImage || !faceImage || !parsedScenes[index]) return;

    setImageLoadingStatus(prev => {
        const newStatus = [...prev];
        newStatus[index] = true;
        return newStatus;
    });
    setImageGenerationErrors(prev => {
        const newErrors = [...prev];
        newErrors[index] = null;
        return newErrors;
    });

    try {
        const scenePrompt = getProductReviewImagePrompt({
            productDesc,
            sceneDescription: parsedScenes[index],
            selectedVibe,
            selectedBackgroundVibe,
            selectedLighting,
            style,
            camera,
            composition,
            lensType,
            filmSim,
            creativityLevel,
        });
        
        const result = await composeImage(
            scenePrompt,
            [productImage, faceImage]
        );

        if (result.imageBase64) {
            const newImageBase64 = result.imageBase64;
            setGeneratedImages(prev => {
                const newImages = [...prev];
                newImages[index] = newImageBase64;
                return newImages;
            });
            
            await addHistoryItem({
                type: 'Image',
                prompt: `Product Review Scene Image ${index + 1}: ${parsedScenes[index].substring(0, 50)}...`,
                result: newImageBase64
            });
        } else {
             throw new Error("The AI did not return an image for this scene. Try rephrasing your inputs.");
        }

    } catch (e) {
        console.error(`Error retrying image for scene ${index + 1}:`, e);
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        setImageGenerationErrors(prev => {
            const newErrors = [...prev];
            newErrors[index] = errorMessage;
            return newErrors;
        });
    } finally {
        setImageLoadingStatus(prev => {
            const newStatus = [...prev];
            newStatus[index] = false;
            return newStatus;
        });
    }
  };

const runVideoGeneration = async (index: number) => {
    setVideoGenerationStatus(prev => { const next = [...prev]; next[index] = 'loading'; return next; });
    setVideoGenerationErrors(prev => { const next = [...prev]; next[index] = null; return next; });

    try {
      if (!generatedImages[index] || !parsedScenes[index]) {
        throw new Error("Missing image or prompt for this scene.");
      }
      
      if (videoModel.includes('veo-3.0')) {
        const savedAuthToken = sessionStorage.getItem('veoAuthToken') || authToken;
        if (!savedAuthToken || !savedAuthToken.trim()) {
          throw new Error("Veo Auth Token is missing. Please set it via the Key icon in the header.");
        }
        if (!authToken && savedAuthToken) {
          setAuthToken(savedAuthToken);
        }
      }
      
      const imagePayload = { 
        imageBytes: generatedImages[index]!, 
        mimeType: 'image/png' 
      };
      
      const videoPrompt = parsedScenes[index];
      const tokenToUse = authToken || sessionStorage.getItem('veoAuthToken') || '';
      
      const videoFile = await generateVideo(
        videoPrompt,
        videoModel,
        videoAspectRatio,
        videoResolution,
        "",
        imagePayload,
        tokenToUse
      );
      
      if (!((videoFile as unknown) instanceof Blob)) {
        throw new Error('generateVideo did not return a valid File/Blob object');
      }

      // --- AUTO-DOWNLOAD ---
      const downloadUrl_auto = URL.createObjectURL(videoFile);
      const a_auto = document.createElement('a');
      a_auto.style.display = 'none';
      a_auto.href = downloadUrl_auto;
      a_auto.download = videoFile.name || `monoklix-scene-video-${Date.now()}.mp4`;
      document.body.appendChild(a_auto);
      a_auto.click();
      document.body.removeChild(a_auto);
      URL.revokeObjectURL(downloadUrl_auto);
      // --- END AUTO-DOWNLOAD ---
      
      const url = URL.createObjectURL(videoFile);
      
      if (!url || !url.startsWith('blob:')) {
        if (url) URL.revokeObjectURL(url);
        throw new Error('Failed to create valid blob URL from video file.');
      }
      
      setGeneratedVideos(prev => {
        const next = [...prev];
        if(next[index] && next[index]!.startsWith('blob:')) {
          URL.revokeObjectURL(next[index]!);
        }
        next[index] = url;
        return next;
      });
      
      setVideoFilenames(prev => {
        const next = [...prev];
        next[index] = videoFile.name;
        return next;
      });
      
      setVideoGenerationStatus(prev => { 
        const next = [...prev]; 
        next[index] = 'success'; 
        return next; 
      });
      
      await addHistoryItem({ 
        type: 'Video', 
        prompt: `Storyboard Scene ${index + 1}: ${videoPrompt}`, 
        result: videoFile 
      });
      
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      console.error(`❌ Scene ${index + 1} video generation failed:`, errorMessage);
      
      setVideoGenerationStatus(prev => { 
        const next = [...prev]; 
        next[index] = 'error'; 
        return next; 
      });
      
      setVideoGenerationErrors(prev => { 
        const next = [...prev]; 
        next[index] = errorMessage; 
        return next; 
      });
    }
};

  const handleCreateVideos = async () => {
    setIsGeneratingVideos(true);
    isVideoCancelledRef.current = false;
    setVideoGenerationStatus(Array(parsedScenes.length).fill('idle'));
    setGeneratedVideos(Array(parsedScenes.length).fill(null));
    setVideoFilenames(Array(parsedScenes.length).fill(null));
    setVideoGenerationErrors(Array(parsedScenes.length).fill(null));

    for (let i = 0; i < parsedScenes.length; i++) {
        if (isVideoCancelledRef.current) {
            setVideoGenerationStatus(prev => {
                const next = [...prev];
                for (let j = i; j < next.length; j++) {
                    next[j] = 'idle';
                }
                return next;
            });
            break;
        }
        await runVideoGeneration(i);
        if (i < parsedScenes.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    setIsGeneratingVideos(false);
  };

  const handleStopVideoGeneration = () => {
    isVideoCancelledRef.current = true;
    setIsGeneratingVideos(false);
  };

  const handleRetryVideoScene = (index: number) => {
      runVideoGeneration(index);
  };

  const handleReset = useCallback(() => {
    setProductImage(null);
    setFaceImage(null);
    setProductDesc('');
    setSelectedVibe(vibeOptions[0]);
    setSelectedBackgroundVibe(backgroundVibes[0]);
    setSelectedLighting(lightingOptions[0]);
    setSelectedContentType(contentTypeOptions[0]);
    setSelectedLanguage(languages[1]);
    setIncludeCaptions('No');
    setIncludeVoiceover('No');
    
    setStoryboard(null);
    setParsedScenes([]);
    setStoryboardError(null);

    setGeneratedImages(Array(4).fill(null));
    setImageGenerationErrors(Array(4).fill(null));
    setGeneratedVideos(Array(4).fill(null));
    setVideoFilenames(Array(4).fill(null));
    setVideoGenerationStatus(Array(4).fill('idle'));
    setVideoGenerationErrors(Array(4).fill(null));

    setProductImageUploadKey(Date.now());
    setFaceImageUploadKey(Date.now() + 1);

    setStyle('Random');
    setCamera('Random');
    setComposition('Random');
    setLensType('Random');
    setFilmSim('Random');
    setCreativityLevel(5);
    
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  const leftPanel = (
    <>
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{T.title}</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">{T.subtitle}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">{T.uploadAssets}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ImageUpload key={productImageUploadKey} id="product-review-product-upload" onImageUpload={handleProductImageUpload} title={T.productPhoto} />
          <ImageUpload key={faceImageUploadKey} id="product-review-face-upload" onImageUpload={handleFaceImageUpload} title={T.facePhoto} />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">{T.productDescription}</h2>
        <textarea
          value={productDesc}
          onChange={(e) => setProductDesc(e.target.value)}
          placeholder={T.productDescriptionPlaceholder}
          rows={4}
          className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:outline-none transition"
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">{T.creativeOptions}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="review-vibe-select" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{T.vibe}</label>
                <select
                    id="review-vibe-select"
                    value={selectedVibe}
                    onChange={(e) => setSelectedVibe(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:outline-none transition"
                >
                    {vibeOptions.map(vibe => <option key={vibe} value={vibe}>{vibe}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="review-background-vibe-select" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{T.backgroundVibe}</label>
                <select
                    id="review-background-vibe-select"
                    value={selectedBackgroundVibe}
                    onChange={(e) => setSelectedBackgroundVibe(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:outline-none transition"
                >
                    {backgroundVibes.map(vibe => <option key={vibe} value={vibe}>{vibe}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="review-content-type-select" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{T.contentType}</label>
                <select
                    id="review-content-type-select"
                    value={selectedContentType}
                    onChange={(e) => setSelectedContentType(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:outline-none transition"
                >
                    {contentTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="review-language-select" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{T.outputLanguage}</label>
                <select
                    id="review-language-select"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:outline-none transition"
                >
                    {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                </select>
            </div>
             <div>
                <label htmlFor="review-captions-select" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{T.captions}</label>
                <select
                    id="review-captions-select"
                    value={includeCaptions}
                    onChange={(e) => setIncludeCaptions(e.target.value as 'Yes' | 'No')}
                    className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:outline-none transition"
                >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                </select>
            </div>
            <div>
                <label htmlFor="review-voiceover-select" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{T.voiceover}</label>
                <select
                    id="review-voiceover-select"
                    value={includeVoiceover}
                    onChange={(e) => setIncludeVoiceover(e.target.value as 'Yes' | 'No')}
                    className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:outline-none transition"
                >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                </select>
            </div>
        </div>
      </div>

      <div className="pt-4 mt-auto flex gap-4">
        <button
          onClick={handleGenerate}
          disabled={isLoading || isGeneratingImages || isGeneratingVideos}
          className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isLoading ? <Spinner /> : T.generateStoryboardButton}
        </button>
        <button
          onClick={handleReset}
          disabled={isLoading || isGeneratingImages || isGeneratingVideos}
          className="flex-shrink-0 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-semibold py-3 px-4 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors disabled:opacity-50"
        >
          {T.resetButton}
        </button>
      </div>
      {storyboardError && !isGeneratingImages && <p className="text-red-500 dark:text-red-400 mt-2 text-center">{storyboardError}</p>}
    </>
  );

 return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Left Panel: Controls */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
        {leftPanel}
      </div>

      {/* Right Panel: Re-structured for clean separation and independent scrolling */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm flex flex-col gap-6 h-full overflow-hidden">
        
        {/* Storyboard Output Section */}
        <div className="flex flex-col flex-shrink-0">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{T.outputTitle}</h2>
                {storyboard && !isLoading && (
                    <button 
                        onClick={() => downloadText(storyboard, `monoklix-review-storyboard-${Date.now()}.txt`)} 
                        className="flex items-center gap-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold py-1.5 px-3 rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                    >
                        <DownloadIcon className="w-4 h-4"/> {T.downloadText}
                    </button>
                )}
            </div>
            <div className="bg-neutral-100 dark:bg-neutral-800/50 rounded-md p-4 relative max-h-[40vh] min-h-[200px] overflow-y-auto custom-scrollbar">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 absolute inset-0">
                        <Spinner />
                        <p className="text-neutral-500 dark:text-neutral-400">{T.loadingStoryboard}</p>
                    </div>
                ) : storyboardError ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 absolute inset-0 text-center text-red-500 dark:text-red-400 p-4">
                        <AlertTriangleIcon className="w-10 h-10 mx-auto mb-2" />
                        <p className="font-semibold">Storyboard Failed</p>
                        <p className="text-xs mt-1 max-w-sm mx-auto">{storyboardError}</p>
                        <button onClick={handleGenerate} className="mt-4 flex items-center justify-center gap-2 bg-primary-600 text-white font-semibold py-1.5 px-3 rounded-lg hover:bg-primary-700 transition-colors text-sm">
                            <RefreshCwIcon className="w-4 h-4" /> Try Again
                        </button>
                    </div>
                ) : storyboard ? (
                    <div className="prose dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap w-full">
                        {storyboard}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full absolute inset-0 text-center text-neutral-500 dark:text-neutral-600">
                        <div>
                            <StarIcon className="w-16 h-16 mx-auto" />
                            <p>{T.outputPlaceholder}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-y-auto custom-scrollbar pr-2">
            {parsedScenes.length > 0 && (
              <div className="flex-shrink-0 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">{T.creativeDirectionForImages}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div><label className="block text-xs font-medium mb-1">{T.artisticStyle}</label><select value={style} onChange={e => setStyle(e.target.value)} className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">{styleOptions.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                      <div><label className="block text-xs font-medium mb-1">{T.lighting}</label><select value={selectedLighting} onChange={e => setSelectedLighting(e.target.value)} className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">{lightingOptions.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                      <div><label className="block text-xs font-medium mb-1">{T.cameraShot}</label><select value={camera} onChange={e => setCamera(e.target.value)} className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">{cameraOptions.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                      <div><label className="block text-xs font-medium mb-1">{T.composition}</label><select value={composition} onChange={e => setComposition(e.target.value)} className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">{compositionOptions.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                      <div><label className="block text-xs font-medium mb-1">{T.lensType}</label><select value={lensType} onChange={e => setLensType(e.target.value)} className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">{lensTypeOptions.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                      <div><label className="block text-xs font-medium mb-1">{T.filmSim}</label><select value={filmSim} onChange={e => setFilmSim(e.target.value)} className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">{filmSimOptions.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                  </div>
                   <div className="mt-4">
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{`${T.creativityLevel} (${creativityLevel})`}</label>
                      <input type="range" min="0" max="10" step="1" value={creativityLevel} onChange={(e) => setCreativityLevel(Number(e.target.value))} className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-primary-500" />
                  </div>
              </div>
            )}
            <div className="flex justify-center flex-shrink-0">
                <button
                    onClick={handleCreateImages}
                    disabled={parsedScenes.length === 0 || isLoading || isGeneratingImages || isGeneratingVideos}
                    className="flex items-center justify-center gap-2 bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGeneratingImages ? <Spinner/> : <ImageIcon className="w-5 h-5" />}
                    {isGeneratingImages ? T.generatingImagesButton : T.createImagesButton}
                </button>
            </div>
            
            {(isGeneratingImages || generatedImages.some(v => v !== null) || imageGenerationErrors.some(e => e !== null)) && (
              <div className="flex-shrink-0">
                <h3 className="text-xl font-bold mb-4">{isGeneratingImages ? T.generatingSceneImages : T.generatedImages}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="aspect-[9/16] bg-neutral-200 dark:bg-neutral-800 rounded-lg flex items-center justify-center flex-col text-neutral-500 relative group overflow-hidden">
                      {imageLoadingStatus[index] ? (
                        <><Spinner /><p className="text-xs mt-2">{T.scene} {index + 1}</p></>
                      ) : generatedImages[index] ? (
                        <>
                          <img src={`data:image/png;base64,${generatedImages[index]!}`} alt={`${T.scene} ${index + 1}`} className="w-full h-full object-cover" />
                           <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                <button onClick={() => onReEdit({ base64: generatedImages[index]!, mimeType: 'image/png' })} title="Re-edit this image" className="flex items-center justify-center w-8 h-8 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors">
                                    <WandIcon className="w-4 h-4" />
                                </button>
                                <button onClick={() => onCreateVideo({ prompt: parsedScenes[index], image: { base64: generatedImages[index]!, mimeType: 'image/png' } })} title="Create Video from this image" className="flex items-center justify-center w-8 h-8 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors">
                                    <VideoIcon className="w-4 h-4" />
                                </button>
                                <button onClick={() => triggerImageDownload(generatedImages[index]!, `scene-image-${index + 1}`)} title="Download Image" className="flex items-center justify-center w-8 h-8 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors">
                                    <DownloadIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </>
                      ) : imageGenerationErrors[index] ? (
                        <div className="p-2 text-center text-red-500 dark:text-red-400">
                           <AlertTriangleIcon className="w-6 h-6 mx-auto mb-2" />
                           <p className="text-xs font-semibold mb-2">Failed</p>
                           <button onClick={() => handleRetryScene(index)} className="flex items-center gap-1.5 text-xs bg-primary-600 text-white font-semibold py-1 px-2 rounded-md hover:bg-primary-700 transition-colors">
                               <RefreshCwIcon className="w-3 h-3"/> Retry
                           </button>
                        </div>
                      ) : (
                        <div className="text-center text-xs p-2">
                           <p className="font-semibold">{T.scene} {index + 1}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {imageGenerationErrors.some(e => e !== null) && <p className="text-red-500 dark:text-red-400 mt-4 text-center text-sm">Some scenes failed to generate. You can retry them individually.</p>}
                
                {generatedImages.every(img => img !== null) && (
                  <div className="mt-6 flex-shrink-0">
                      <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg mb-4 text-left">
                          <h3 className="text-lg font-semibold mb-4">{T.videoGenerationSettings}</h3>
                          <div className={`grid grid-cols-1 ${videoModel.includes('veo-3.0') ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
                              <div>
                                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{T.aiModel}</label>
                                  <select value={videoModel} onChange={(e) => setVideoModel(e.target.value)} className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">
                                      {MODELS.videoGenerationOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                  </select>
                              </div>
                              <div>
                                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{T.aspectRatio}</label>
                                  <select value={videoAspectRatio} onChange={(e) => setVideoAspectRatio(e.target.value)} className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">
                                      {["9:16", "16:9", "1:1", "4:3", "3:4"].map(ar => <option key={ar} value={ar}>{ar}</option>)}
                                  </select>
                              </div>
                              {videoModel.includes('veo-3.0') && (
                                  <div>
                                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{T.resolution}</label>
                                      <select value={videoResolution} onChange={(e) => setVideoResolution(e.target.value)} className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">
                                          {["720p", "1080p"].map(res => <option key={res} value={res}>{res}</option>)}
                                      </select>
                                  </div>
                              )}
                          </div>
                      </div>
                      <div className="flex justify-center items-center gap-4">
                        <button onClick={handleCreateVideos} disabled={isGeneratingVideos} className="flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors shadow-lg disabled:opacity-50">
                            {isGeneratingVideos ? <Spinner /> : <VideoIcon className="w-5 h-5" />}
                            {isGeneratingVideos ? "Generating..." : T.createBatchVideoButton}
                        </button>
                        {isGeneratingVideos && (
                            <button onClick={handleStopVideoGeneration} className="flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors shadow-lg">
                                <XIcon className="w-5 h-5" /> Stop
                            </button>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">{T.createBatchVideoButtonHelp}</p>
                  </div>
                )}
              </div>
            )}
             {(isGeneratingVideos || generatedVideos.some(v => v !== null) || videoGenerationErrors.some(e => e !== null)) && (
                <div className="flex-shrink-0">
                    <h3 className="text-xl font-bold mb-4">{T.generatedVideosTitle}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={`video-${index}`} className="aspect-[9/16] bg-neutral-200 dark:bg-neutral-800 rounded-lg flex items-center justify-center flex-col text-neutral-500 relative overflow-hidden group">
                                {videoGenerationStatus[index] === 'loading' ? (
                                    <>
                                        <Spinner />
                                        <p className="text-xs mt-2">Generating Scene {index + 1}...</p>
                                    </>
                                ) : videoGenerationStatus[index] === 'success' && generatedVideos[index] ? (
                                    <>
                                        <video 
                                            key={generatedVideos[index]!}
                                            src={generatedVideos[index]!} 
                                            controls 
                                            className="w-full h-full object-cover"
                                            preload="metadata"
                                        />
                                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
											<a
												href={generatedVideos[index]!}
												download={videoFilenames[index] || `scene-${index + 1}-video.mp4`}
												className="flex items-center justify-center w-8 h-8 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
												title="Download Video"
											>
												<DownloadIcon className="w-4 h-4" />
											</a>
										</div>
                                    </>
                                ) : videoGenerationStatus[index] === 'error' ? (
                                    <div className="p-2 text-center text-red-500 dark:text-red-400">
                                        <AlertTriangleIcon className="w-6 h-6 mx-auto mb-2" />
                                        <p className="text-xs font-semibold mb-2">Failed</p>
                                        <button onClick={() => handleRetryVideoScene(index)} className="flex items-center gap-1.5 text-xs bg-primary-600 text-white font-semibold py-1 px-2 rounded-md hover:bg-primary-700 transition-colors">
                                            <RefreshCwIcon className="w-3 h-3"/> Retry
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-xs font-semibold">Scene {index + 1}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviewView;
