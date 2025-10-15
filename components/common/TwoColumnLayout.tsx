import React from 'react';

interface TwoColumnLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({ leftPanel, rightPanel }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Left Panel: Controls */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
        {leftPanel}
      </div>
      {/* Right Panel: Results */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg flex flex-col p-4 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Output</h2>
        <div className="flex-1 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800/50 rounded-md overflow-hidden relative group p-2">
          {rightPanel}
        </div>
      </div>
    </div>
  );
};

export default TwoColumnLayout;