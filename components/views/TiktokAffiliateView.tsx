import React, { useState, useCallback, useEffect } from 'react';
import ImageUpload from '../common/ImageUpload';
import { composeImage, type MultimodalContent } from '../../services/geminiService';
import { addHistoryItem } from '../../services/historyService';
import Spinner from '../common/Spinner';
import { TikTokIcon, DownloadIcon, UserIcon, WandIcon, VideoIcon, AlertTriangleIcon, RefreshCwIcon } from '../Icons';
import TwoColumnLayout from '../common/TwoColumnLayout';
import { getTiktokAffiliatePrompt } from '../../services/promptManager';
import { type Language } from '../../types';
import { getTranslations } from '../../services/translations';


const CreativeButton: React.FC<{
  label: string;
  isSelected: boolean;
  onClick: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}> = ({ label, isSelected, onClick, icon: Icon, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center gap-3 p-3 rounded-lg border text-left transition-all duration-200 w-full
      ${isSelected && !disabled
        ? 'border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-400'
        : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100/50 dark:hover:bg-neutral-700/50 hover:border-neutral-400 dark:hover:border-neutral-500'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
    <span className="font-semibold text-sm flex-1 text-center">{label}</span>
  </button>
);

interface VideoGenPreset {
  prompt: string;
  image: { base64: string; mimeType: string; };
}

interface ImageEditPreset {
  base64: string;
  mimeType: string;
}

interface TiktokAffiliateViewProps {
  onReEdit: (preset: ImageEditPreset) => void;
  onCreateVideo: (preset: VideoGenPreset) => void;
  language: Language;
}

const modelFaceOptions = ["Random", "Malaysia", "Vietnam", "England", "USA", "Arab", "Russia", "Japan", "Korea", "Thailand"];
const lightingOptions = ["Random", "Soft Daylight", "Golden Hour", "Hard Light", "Window Backlight", "Warm Lamp Glow", "Mixed Light", "Studio Light", "Dramatic", "Natural Light", "Neon", "Backlight", "Rim Lighting"];
const cameraOptions = ["Random", "Detail / Macro", "Close-Up", "Medium Close-Up", "Medium / Half-Body", "Three-Quarter", "Full Body", "Flatlay", "Wide Shot", "Medium Shot", "Long Shot", "Dutch Angle", "Low Angle", "High Angle", "Overhead Shot"];
const poseOptions = ["Random", "Professional Model Pose", "Standing Relaxed", "Sitting on Chair Edge", "Walking Slowly", "Leaning on Wall", "Half-Body Rotation"];
const vibeOptions = [ "Random", "Studio", "Bedroom", "Bathroom / Vanity", "Living Room", "Kitchen / Dining", "Workspace / Study", "Entryway / Laundry", "Urban Clean", "Coffee Shop Aesthetic", "Urban Night", "Tropical Beach", "Luxury Apartment", "Flower Garden", "Old Building", "Classic Library", "Minimalist Studio", "Rooftop Bar", "Autumn Garden", "Tokyo Street", "Scandinavian Interior", "Magical Forest", "Cyberpunk City", "Bohemian Desert", "Modern Art Gallery", "Sunset Rooftop", "Snowy Mountain Cabin", "Industrial Loft", "Futuristic Lab", "Pastel Dream Sky", "Palace Interior", "Country Kitchen", "Coral Reef", "Paris Street", "Asian Night Market", "Cruise Deck", "Vintage Train Station", "Outdoor Basketball Court", "Professional Kitchen", "Luxury Hotel Lobby", "Rock Concert Stage", "Zen Garden", "Mediterranean Villa Terrace", "Space / Sci-Fi Setting", "Modern Workspace", "Hot Spring Bath", "Fantasy Throne Room", "Skyscraper Peak", "Sports Car Garage", "Botanical Greenhouse", "Ice Rink", "Classic Dance Studio", "Beach Party Night", "Ancient Library", "Mountain Observation Deck", "Modern Dance Studio", "Speakeasy Bar", "Rainforest Trail", "Rice Terrace Field" ];
const styleOptions = ["Random", "Realism", "Photorealistic", "Cinematic", "Anime", "Vintage", "3D Animation", "Watercolor", "Claymation"];
const compositionOptions = ["Random", "Rule of Thirds", "Leading Lines", "Symmetry", "Golden Ratio", "Centered", "Asymmetrical"];
const lensTypeOptions = ["Random", "Wide Angle Lens", "Telephoto Lens", "Fisheye Lens", "Macro Lens", "50mm lens", "85mm lens"];
const filmSimOptions = ["Random", "Fujifilm Velvia", "Kodak Portra 400", "Cinematic Kodachrome", "Vintage Polaroid", "Ilford HP5 (B&W)"];

const SESSION_KEY = 'tiktokAffiliateState';

type ImageSlot = string | { error: string } | null;

const SelectControl: React.FC<{
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: (string|number)[];
  disabled?: boolean;
}> = ({ id, value, onChange, options, disabled }) => (
    <select 
        id={id} 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-3 text-neutral-800 dark:text-neutral-300 focus:ring-2 focus:ring-primary-500 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
);

const triggerDownload = (data: string, fileNameBase: string) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${data}`;
    link.download = `${fileNameBase}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const TiktokAffiliateView: React.FC<TiktokAffiliateViewProps> = ({ onReEdit, onCreateVideo, language }) => {
    const [productImage, setProductImage] = useState<MultimodalContent | null>(null);
    const [faceImage, setFaceImage] = useState<MultimodalContent | null>(null);
    const [images, setImages] = useState<ImageSlot[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const [gender, setGender] = useState('Female');
    const [modelFace, setModelFace] = useState('Random');
    const [lighting, setLighting] = useState('Random');
    const [camera, setCamera] = useState('Random');
    const [pose, setPose] = useState('Random');
    const [vibe, setVibe] = useState('Random');
    const [style, setStyle] = useState('Random');
    const [composition, setComposition] = useState('Random');
    const [lensType, setLensType] = useState('Random');
    const [filmSim, setFilmSim] = useState('Random');
    const [creativityLevel, setCreativityLevel] = useState(5);
    const [customPrompt, setCustomPrompt] = useState('');
    const [numberOfImages, setNumberOfImages] = useState(1);
    const [productImageUploadKey, setProductImageUploadKey] = useState(Date.now());
    const [faceImageUploadKey, setFaceImageUploadKey] = useState(Date.now() + 1);
    const [progress, setProgress] = useState(0);
    
    const T = getTranslations(language).tiktokAffiliateView;
    const commonT = getTranslations(language);

    useEffect(() => {
        try {
            const savedState = sessionStorage.getItem(SESSION_KEY);
            if (savedState) {
                const state = JSON.parse(savedState);
                // Do not load image data
                // if (state.productImage) setProductImage(state.productImage);
                // if (state.faceImage) setFaceImage(state.faceImage);
                // if (state.images) setImages(state.images);
                if (state.gender) setGender(state.gender);
                if (state.modelFace) setModelFace(state.modelFace);
                if (state.lighting) setLighting(state.lighting);
                if (state.camera) setCamera(state.camera);
                if (state.pose) setPose(state.pose);
                if (state.vibe) setVibe(state.vibe);
                if (state.style) setStyle(state.style);
                if (state.composition) setComposition(state.composition);
                if (state.lensType) setLensType(state.lensType);
                if (state.filmSim) setFilmSim(state.filmSim);
                if (state.creativityLevel) setCreativityLevel(state.creativityLevel);
                if (state.customPrompt) setCustomPrompt(state.customPrompt);
                if (state.numberOfImages) setNumberOfImages(state.numberOfImages);
            }
        } catch (e) { console.error("Failed to load state from session storage", e); }
    }, []);

    useEffect(() => {
        try {
            const stateToSave = {
                gender, modelFace, lighting, camera, pose,
                vibe, style, composition, lensType, filmSim, creativityLevel, customPrompt, numberOfImages
            };
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(stateToSave));
        } catch (e) { console.error("Failed to save state to session storage", e); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        gender, modelFace, lighting, camera, pose,
        vibe, style, composition, lensType, filmSim, creativityLevel, customPrompt, numberOfImages
    ]);

    const generateOneImage = useCallback(async (index: number) => {
        if (!productImage) return;

        setImages(prev => {
            const newImages = [...prev];
            newImages[index] = null;
            return newImages;
        });
    
        const prompt = getTiktokAffiliatePrompt({ gender, modelFace, lighting, camera, pose, vibe, creativityLevel, customPrompt, hasFaceImage: !!faceImage, style, composition, lensType, filmSim });
        const imagesToCompose: MultimodalContent[] = [productImage];
        if (faceImage) {
            imagesToCompose.push(faceImage);
        }

        try {
            const result = await composeImage(prompt, imagesToCompose);
            if (!result.imageBase64) {
                throw new Error("The AI did not return an image. Please try a different prompt.");
            }
            
            await addHistoryItem({ type: 'Image', prompt: `TikTok Affiliate: Vibe - ${vibe}, Model - ${gender}`, result: result.imageBase64 });
    
            setImages(prev => {
                const newImages = [...prev];
                newImages[index] = result.imageBase64!;
                return newImages;
            });
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setImages(prev => {
                const newImages = [...prev];
                newImages[index] = { error: errorMessage };
                return newImages;
            });
        }
    }, [productImage, faceImage, gender, modelFace, lighting, camera, pose, vibe, creativityLevel, customPrompt, style, composition, lensType, filmSim]);
    
    const handleGenerate = useCallback(async () => {
        if (!productImage) {
            setError("Please upload a product image first.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setImages(Array(numberOfImages).fill(null));
        setSelectedImageIndex(0);

        for (let i = 0; i < numberOfImages; i++) {
            setProgress(i + 1);
            await generateOneImage(i);
        }

        setIsLoading(false);
        setProgress(0);
    }, [numberOfImages, productImage, generateOneImage]);
    
    const handleRetry = useCallback(async (index: number) => {
        setImages(prev => {
            const newImages = [...prev];
            newImages[index] = null;
            return newImages;
        });
        await generateOneImage(index);
    }, [generateOneImage]);
    
    const handleReset = useCallback(() => {
        setProductImage(null);
        setFaceImage(null);
        setImages([]);
        setError(null);
        setGender('Female');
        setModelFace('Random');
        setLighting('Random');
        setCamera('Random');
        setPose('Random');
        setVibe('Random');
        setStyle('Random');
        setComposition('Random');
        setLensType('Random');
        setFilmSim('Random');
        setCreativityLevel(5);
        setCustomPrompt('');
        setNumberOfImages(1);
        setProductImageUploadKey(Date.now());
        setFaceImageUploadKey(Date.now() + 1);
        setProgress(0);
        sessionStorage.removeItem(SESSION_KEY);
    }, []);

    const leftPanel = (
      <>
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{T.title}</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">{T.subtitle}</p>
          </div>
          
          <Section title={T.assetAndModel}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ImageUpload key={productImageUploadKey} id="tiktok-product-upload" onImageUpload={(base64, mimeType) => setProductImage({base64, mimeType})} title={T.productPhoto} description={T.productPhotoDesc}/>
                  <ImageUpload key={faceImageUploadKey} id="tiktok-face-upload" onImageUpload={(base64, mimeType) => setFaceImage({base64, mimeType})} title={T.facePhoto} description={T.facePhotoDesc}/>
              </div>
          </Section>

          <Section title={T.customPrompt}>
              <textarea id="custom-prompt-model" value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} placeholder={T.customPromptPlaceholder} rows={3} className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-3 text-sm text-neutral-800 dark:text-neutral-300 focus:ring-2 focus:ring-primary-500 focus:outline-none transition" />
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{T.customPromptHelp}</p>
          </Section>
          
          <Section title={T.creativeDirection}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className={`block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 transition-colors ${!!faceImage ? 'text-gray-400 dark:text-gray-500' : ''}`}>{T.gender}</label>
                    <div className="grid grid-cols-2 gap-3">
                        <CreativeButton label={T.female} isSelected={gender === 'Female'} onClick={() => setGender('Female')} icon={UserIcon} disabled={!!faceImage} />
                        <CreativeButton label={T.male} isSelected={gender === 'Male'} onClick={() => setGender('Male')} icon={UserIcon} disabled={!!faceImage} />
                    </div>
                </div>
                <div>
                    <label htmlFor="model-face-select" className={`block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 transition-colors ${!!faceImage ? 'text-gray-400 dark:text-gray-500' : ''}`}>{T.modelFace}</label>
                    <SelectControl id="model-face-select" value={modelFace} onChange={setModelFace} options={modelFaceOptions} disabled={!!faceImage} />
                </div>
                <div><label htmlFor="style-select" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{T.artisticStyle}</label><SelectControl id="style-select" value={style} onChange={setStyle} options={styleOptions} /></div>
                <div><label htmlFor="lighting-select" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{T.lighting}</label><SelectControl id="lighting-select" value={lighting} onChange={setLighting} options={lightingOptions} /></div>
                <div><label htmlFor="camera-select" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{T.cameraShot}</label><SelectControl id="camera-select" value={camera} onChange={setCamera} options={cameraOptions} /></div>
                <div><label htmlFor="pose-select" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{T.bodyPose}</label><SelectControl id="pose-select" value={pose} onChange={setPose} options={poseOptions} /></div>
                <div><label htmlFor="vibe-select" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{T.vibe}</label><SelectControl id="vibe-select" value={vibe} onChange={setVibe} options={vibeOptions} /></div>
                <div><label htmlFor="composition-select" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{T.composition}</label><SelectControl id="composition-select" value={composition} onChange={setComposition} options={compositionOptions} /></div>
                <div><label htmlFor="lens-select" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{T.lensType}</label><SelectControl id="lens-select" value={lensType} onChange={setLensType} options={lensTypeOptions} /></div>
                <div><label htmlFor="film-select" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{T.filmSim}</label><SelectControl id="film-select" value={filmSim} onChange={setFilmSim} options={filmSimOptions} /></div>
            </div>
          </Section>
          
          <Section title={T.aiSettings}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                    <label htmlFor="creativity-slider" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{`${T.creativityLevel} (${creativityLevel})`}</label>
                    <input id="creativity-slider" type="range" min="0" max="10" step="1" value={creativityLevel} onChange={(e) => setCreativityLevel(Number(e.target.value))} className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-primary-500" />
                </div>
                <div><label htmlFor="num-images-select" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{T.numberOfImages}</label><SelectControl id="num-images-select" value={String(numberOfImages)} onChange={(val) => setNumberOfImages(Number(val))} options={[1, 2, 3, 4, 5]} /></div>
            </div>
          </Section>

           <div className="pt-4 mt-auto">
                <div className="flex gap-4">
                    <button onClick={handleGenerate} disabled={isLoading} className="w-full mt-2 flex items-center justify-center gap-2 bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                        {isLoading ? <Spinner /> : T.generateButton}
                    </button>
                    <button
                        onClick={handleReset}
                        disabled={isLoading}
                        className="flex-shrink-0 mt-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-semibold py-3 px-4 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors disabled:opacity-50"
                    >
                        {T.resetButton}
                    </button>
                </div>
                {error && !isLoading && <p className="text-red-500 dark:text-red-400 mt-2 text-center">{error}</p>}
          </div>
      </>
    );

    const ActionButtons: React.FC<{ imageBase64: string; mimeType: string }> = ({ imageBase64, mimeType }) => (
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button onClick={() => onReEdit({ base64: imageBase64, mimeType })} title="Re-edit this image" className="flex items-center justify-center w-8 h-8 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"><WandIcon className="w-4 h-4" /></button>
            <button onClick={() => onCreateVideo({ prompt: getTiktokAffiliatePrompt({ gender, modelFace, lighting, camera, pose, vibe, creativityLevel, customPrompt, style, composition, lensType, filmSim, hasFaceImage: !!faceImage }), image: { base64: imageBase64, mimeType } })} title="Create Video from this image" className="flex items-center justify-center w-8 h-8 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"><VideoIcon className="w-4 h-4" /></button>
            <button onClick={() => triggerDownload(imageBase64, 'monoklix-model-photo')} title="Download Image" className="flex items-center justify-center w-8 h-8 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"><DownloadIcon className="w-4 h-4" /></button>
        </div>
    );
    
    const rightPanel = (
      <>
          {images.length > 0 ? (
               <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-2">
                <div className="flex-1 flex items-center justify-center min-h-0 w-full relative group">
                    {(() => {
                        const selectedImage = images[selectedImageIndex];
                        if (typeof selectedImage === 'string') {
                            return (
                                <>
                                    <img src={`data:image/png;base64,${selectedImage}`} alt={`Generated image ${selectedImageIndex + 1}`} className="rounded-md max-h-full max-w-full object-contain" />
                                    <ActionButtons imageBase64={selectedImage} mimeType="image/png" />
                                </>
                            );
                        } else if (selectedImage && typeof selectedImage === 'object') {
                            return (
                                <div className="text-center text-red-500 dark:text-red-400 p-4">
                                    <AlertTriangleIcon className="w-12 h-12 mx-auto mb-4" />
                                    <p className="font-semibold">Generation Failed</p>
                                    <p className="text-sm mt-2 max-w-md mx-auto">{selectedImage.error}</p>
                                    <button
                                        onClick={() => handleRetry(selectedImageIndex)}
                                        className="mt-6 flex items-center justify-center gap-2 bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                                    >
                                        <RefreshCwIcon className="w-4 h-4" />
                                        Try Again
                                    </button>
                                </div>
                            );
                        }
                        return (
                            <div className="flex flex-col items-center justify-center h-full gap-2">
                                <Spinner />
                                {isLoading && numberOfImages > 1 && (
                                    <p className="text-sm text-neutral-500">
                                        {`${commonT.generating} (${progress}/${numberOfImages})`}
                                    </p>
                                )}
                            </div>
                        );
                    })()}
                </div>
                {images.length > 1 && (
                  <div className="flex-shrink-0 w-full flex justify-center">
                    <div className="flex gap-2 overflow-x-auto p-2">
                      {images.map((img, index) => (
                        <button key={index} onClick={() => setSelectedImageIndex(index)} className={`w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden flex-shrink-0 transition-all duration-200 flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 ${selectedImageIndex === index ? 'ring-4 ring-primary-500' : 'ring-2 ring-transparent hover:ring-primary-300'}`}>
                           {typeof img === 'string' ? (
                                <img src={`data:image/png;base64,${img}`} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                            ) : img && typeof img === 'object' ? (
                                <AlertTriangleIcon className="w-6 h-6 text-red-500" />
                            ) : (
                                <Spinner />
                            )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
          ) : isLoading ? (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                    <Spinner />
                    <p className="text-sm text-neutral-500">
                        {`${commonT.generating}${numberOfImages > 1 ? ` (1/${numberOfImages})` : ''}`}
                    </p>
                </div>
           ) : (
              <div className="text-center text-neutral-500 dark:text-neutral-600"><TikTokIcon className="w-16 h-16 mx-auto" /><p>{T.outputPlaceholder}</p></div>
          )}
      </>
    );

    return <TwoColumnLayout leftPanel={leftPanel} rightPanel={rightPanel} />;
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div><h2 className="text-lg font-semibold mb-2">{title}</h2>{children}</div>
);

export default TiktokAffiliateView;