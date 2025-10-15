import React, { useState, useEffect } from 'react';
import VideoGenerationView from './VideoGenerationView';
import VideoCombinerView from './VideoCombinerView';
import VoiceStudioView from './VoiceStudioView';
import ProductReviewView from './ProductReviewView';
import Tabs, { type Tab } from '../common/Tabs';
import { type Language, type BatchProcessorPreset, type User } from '../../types';
import { getTranslations } from '../../services/translations';
import BatchProcessorView from './BatchProcessorView';


type TabId = 'generation' | 'storyboard' | 'batch' | 'combiner' | 'voice';

interface VideoGenPreset {
  prompt: string;
  image: { base64: string; mimeType: string; };
}

interface ImageEditPreset {
  base64: string;
  mimeType: string;
}

interface AiVideoSuiteViewProps {
  preset: VideoGenPreset | null;
  clearPreset: () => void;
  onReEdit: (preset: ImageEditPreset) => void;
  onCreateVideo: (preset: VideoGenPreset) => void;
  language: Language;
  currentUser: User;
}

const AiVideoSuiteView: React.FC<AiVideoSuiteViewProps> = ({ preset, clearPreset, onReEdit, onCreateVideo, language, currentUser }) => {
    const [activeTab, setActiveTab] = useState<TabId>('generation');
    const T = getTranslations(language).tabs;

    useEffect(() => {
        if (preset) {
            setActiveTab('generation');
        }
    }, [preset]);
    
    useEffect(() => {
        if (currentUser.role !== 'admin' && (activeTab === 'batch' || activeTab === 'combiner')) {
            setActiveTab('generation');
        }
    }, [currentUser.role, activeTab]);

    const tabs: Tab<TabId>[] = [
        { id: 'generation', label: T.videoGeneration },
        { id: 'storyboard', label: T.videoStoryboard },
        { id: 'batch', label: T.batchProcessor, adminOnly: true },
        { id: 'combiner', label: T.videoCombiner, adminOnly: true },
        { id: 'voice', label: T.voiceStudio }
    ];

    const renderActiveTabContent = () => {
        const commonProps = { language };
        switch (activeTab) {
            case 'generation':
                return <VideoGenerationView {...commonProps} preset={preset} clearPreset={clearPreset} />;
            case 'storyboard':
                return <ProductReviewView {...commonProps} onReEdit={onReEdit} onCreateVideo={onCreateVideo} />;
            case 'batch':
                return <BatchProcessorView {...commonProps} preset={null} clearPreset={() => {}} />;
            case 'combiner':
                return <VideoCombinerView {...commonProps} />;
            case 'voice':
                // FIX: Passed commonProps to VoiceStudioView to provide the required 'language' prop.
                return <VoiceStudioView {...commonProps} />;
            default:
                return <VideoGenerationView {...commonProps} preset={preset} clearPreset={clearPreset} />;
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex-shrink-0 mb-6 flex justify-center">
                <Tabs 
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isAdmin={currentUser.role === 'admin'}
                />
            </div>
            <div className="flex-1 overflow-y-auto">
                {renderActiveTabContent()}
            </div>
        </div>
    );
};

export default AiVideoSuiteView;