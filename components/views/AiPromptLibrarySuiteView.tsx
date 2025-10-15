import React, { useState } from 'react';
import LibraryView from './LibraryView';
import PromptViralMyView from './PromptViralMyView';
import Tabs, { type Tab } from '../common/Tabs';
import { type Language } from '../../types';
import { getTranslations } from '../../services/translations';

type TabId = 'nano-banana' | 'viral-my';

interface AiPromptLibrarySuiteViewProps {
    language: Language;
    onUsePrompt: (prompt: string) => void;
}

const AiPromptLibrarySuiteView: React.FC<AiPromptLibrarySuiteViewProps> = ({ language, onUsePrompt }) => {
    const [activeTab, setActiveTab] = useState<TabId>('nano-banana');
    const T = getTranslations(language).tabs;

    const tabs: Tab<TabId>[] = [
        { id: 'nano-banana', label: T.nanoBanana },
        { id: 'viral-my', label: T.viralMy },
    ];

    const renderActiveTabContent = () => {
        const commonProps = { language, onUsePrompt };
        switch (activeTab) {
            case 'nano-banana':
                return <LibraryView {...commonProps} />;
            case 'viral-my':
                return <PromptViralMyView {...commonProps} />;
            default:
                return <LibraryView {...commonProps} />;
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex-shrink-0 mb-6 flex justify-center">
                <Tabs 
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </div>
            <div className="flex-1 overflow-y-auto min-h-0">
                {renderActiveTabContent()}
            </div>
        </div>
    );
};

export default AiPromptLibrarySuiteView;