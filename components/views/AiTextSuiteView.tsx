import React, { useState, useEffect } from 'react';
import ContentIdeasView from './ContentIdeasView';
import MarketingCopyView from './MarketingCopyView';
import ProductAdView from './ProductAdView';
import StaffMonoklixView from './StaffMonoklixView';
import Tabs, { type Tab } from '../common/Tabs';
import { type Language, type User } from '../../types';
import { getTranslations } from '../../services/translations';

type TabId = 'staff-monoklix' | 'content-ideas' | 'marketing-copy' | 'storyline';

interface AiTextSuiteViewProps {
    language: Language;
    currentUser: User;
}

const AiTextSuiteView: React.FC<AiTextSuiteViewProps> = ({ language, currentUser }) => {
    const [activeTab, setActiveTab] = useState<TabId>('staff-monoklix');
    const T = getTranslations(language).tabs;

    useEffect(() => {
        if (currentUser.role !== 'admin' && activeTab === 'storyline') {
            setActiveTab('staff-monoklix');
        }
    }, [currentUser.role, activeTab]);

    const tabs: Tab<TabId>[] = [
        { id: 'staff-monoklix', label: T.staffMonoklix },
        { id: 'content-ideas', label: T.contentIdeas },
        { id: 'marketing-copy', label: T.marketingCopy },
        { id: 'storyline', label: T.storyline, adminOnly: true },
    ];

    const renderActiveTabContent = () => {
        const commonProps = { language };
        switch (activeTab) {
            case 'staff-monoklix':
                return <StaffMonoklixView {...commonProps} />;
            case 'content-ideas':
                return <ContentIdeasView {...commonProps} />;
            case 'marketing-copy':
                return <MarketingCopyView {...commonProps} />;
            case 'storyline':
                return <ProductAdView {...commonProps} />;
            default:
                return <StaffMonoklixView {...commonProps} />;
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

export default AiTextSuiteView;