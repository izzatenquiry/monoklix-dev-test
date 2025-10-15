import React from 'react';
import { type View, type NavItem, type User, type Language } from '../types';
import {
  ImageIcon, VideoIcon, SettingsIcon, BookOpenIcon, LogoutIcon, GalleryIcon, LogoIcon, XIcon, LibraryIcon, FileTextIcon, GraduationCapIcon, TrendingUpIcon, RobotIcon, MegaphoneIcon, DatabaseIcon
} from './Icons';
import { getTranslations } from '../services/translations';


const getNavItems = (T: ReturnType<typeof getTranslations>['sidebar']): NavItem[] => [
  { id: 'home', label: T.home, description: T.homeDesc, section: 'main', icon: BookOpenIcon, isSpecial: true },
  { id: 'get-started', label: T.getStarted, section: 'main', icon: GraduationCapIcon },
  { id: 'ai-text-suite', label: T.aiContentIdea, section: 'free', icon: FileTextIcon },
  { id: 'ai-image-suite', label: T.aiImage, section: 'free', icon: ImageIcon },
  { id: 'ai-video-suite', label: T.aiVideo, section: 'free', icon: VideoIcon },
  { id: 'gallery', label: T.imageGallery, section: 'free', icon: GalleryIcon },
  { id: 'ai-prompt-library-suite', label: T.promptLibrary, section: 'free', icon: LibraryIcon, isNew: true },
  { id: 'social-post-studio', label: T.socialPostStudio, section: 'free', icon: MegaphoneIcon, isNew: true, roles: ['admin'] },
  { id: 'settings', label: T.settings, section: 'bottom', icon: SettingsIcon, roles: ['admin', 'user'] },
  { id: 'cache-manager', label: T.cacheManager, section: 'bottom', icon: DatabaseIcon, roles: ['admin', 'user'] },
  { id: 'logout', label: T.logout, section: 'bottom', icon: LogoutIcon, roles: ['admin', 'user'] }
];


interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  onLogout: () => Promise<void>;
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}


const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, onLogout, currentUser, isOpen, onClose, language }) => {
  const T = getTranslations(language);
  const navItems = getNavItems(T.sidebar);

  const handleItemClick = async (viewId: View | 'logout') => {
    if (viewId === 'logout') {
      await onLogout();
    } else {
      setActiveView(viewId as View);
    }
    if (isOpen) {
      onClose();
    }
  };

  const renderNavItem = (item: NavItem) => {
    if (item.isSpecial) {
        return (
            <button 
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full p-4 rounded-lg text-left mb-6 transition-all duration-300 transform hover:scale-[1.02] ${
                activeView === 'home' 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg' 
                    : 'bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-900/40 dark:to-indigo-900/40 border border-transparent text-neutral-700 dark:text-neutral-200 hover:shadow-md'
                }`}
            >
                <div className="flex items-center">
                <item.icon className="w-5 h-5 mr-3" />
                <div>
                    <p className="font-bold">{item.label}</p>
                    <p className={`text-xs ${activeView === 'home' ? 'text-white/80' : 'text-primary-600 dark:text-primary-400'}`}>{item.description}</p>
                </div>
                </div>
            </button>
        );
    }

    return (
        <li key={item.id}>
            <button
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-left text-sm font-medium hover:translate-x-1 ${
                activeView === item.id
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                  : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 mr-4" />
              <span className="flex-1">{item.label}</span>
              {item.isNew && <span className="text-xs bg-primary-500/20 text-primary-500 dark:text-primary-400 font-bold px-2 py-0.5 rounded-full">New!</span>}
            </button>
        </li>
    );
  };

  const renderSection = (section: NavItem['section'], title?: string) => {
    const filteredItems = navItems.filter(item => {
        if (item.section !== section) return false;
        if (item.roles && !item.roles.includes(currentUser.role)) return false;
        return true;
    });

    if (filteredItems.length === 0) return null;

    return (
    <div>
      {title && <h3 className="px-4 pt-6 pb-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide">{title}</h3>}
      <ul className="space-y-2">
        {filteredItems.map(item => renderNavItem(item))}
      </ul>
    </div>
    );
  }

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black/60 z-30 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <nav 
        className={`w-80 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 p-5 flex flex-col transition-transform duration-300 ease-custom-ease z-40
                   lg:relative lg:translate-x-0
                   fixed inset-y-0 left-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="mb-8 flex items-center justify-between">
            <LogoIcon className="w-40 text-neutral-800 dark:text-neutral-200" />
          <button onClick={onClose} className="lg:hidden p-2" aria-label="Close menu">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          {renderSection('main')}
          {renderSection('free', T.sidebar.aiAgent)}
          {renderSection('ugc', 'UGC Content')}
          {renderSection('admin', 'Admin')}
        </div>
        
        <div className="mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-800">
          {renderSection('bottom')}
          <p className="mt-4 text-center text-neutral-500 dark:text-neutral-600 text-xs">© 2025 MONOklix.com</p>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;