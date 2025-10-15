import React, { useState } from 'react';
import { ClipboardIcon, CheckCircleIcon } from '../Icons';

interface MarkdownRendererProps {
  content: string;
}

const CodeBlock: React.FC<{ language: string, codeContent: string }> = ({ language, codeContent }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        if (!codeContent) return;
        navigator.clipboard.writeText(codeContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-neutral-100 dark:bg-neutral-900 rounded-lg my-4 not-prose">
            <div className="flex justify-between items-center px-4 py-2 bg-neutral-200 dark:bg-neutral-800 rounded-t-lg">
                <span className="text-neutral-500 dark:text-neutral-400 text-xs font-sans">{language}</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white text-xs px-2 py-1 rounded bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600 transition-colors"
                >
                    {copied ? <CheckCircleIcon className="w-3 h-3 text-green-500" /> : <ClipboardIcon className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
            <pre className="p-4 overflow-x-auto">
                <code className="font-mono text-sm">{codeContent}</code>
            </pre>
        </div>
    );
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderLine = (line: string) => {
    // Bold
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return <span dangerouslySetInnerHTML={{ __html: line }} />;
  };

  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300 break-words">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const codeBlock = part.slice(3, -3).trim();
          const lines = codeBlock.split('\n');
          const language = lines[0].trim();
          const codeContent = lines.slice(1).join('\n');
          
          return <CodeBlock key={index} language={language} codeContent={codeContent} />;
        }
        
        // Handle other markdown for non-code parts
        const lines = part.trim().split('\n');
        // FIX: Replaced JSX.Element with React.ReactElement to resolve namespace error.
        const elements: React.ReactElement[] = [];
        let listType: 'ul' | 'ol' | null = null;
        // FIX: Replaced JSX.Element with React.ReactElement to resolve namespace error.
        let listItems: React.ReactElement[] = [];

        const flushList = () => {
          if (listItems.length > 0) {
            if (listType === 'ul') {
              elements.push(<ul key={`ul-${elements.length}`}>{listItems}</ul>);
            } else if (listType === 'ol') {
              elements.push(<ol key={`ol-${elements.length}`}>{listItems}</ol>);
            }
            listItems = [];
            listType = null;
          }
        };

        lines.forEach((line, lineIndex) => {
          if (line.startsWith('# ')) {
            flushList();
            elements.push(<h1 key={`${index}-${lineIndex}`}>{renderLine(line.substring(2))}</h1>);
          } else if (line.startsWith('## ')) {
            flushList();
            elements.push(<h2 key={`${index}-${lineIndex}`}>{renderLine(line.substring(3))}</h2>);
          } else if (line.startsWith('### ')) {
            flushList();
            elements.push(<h3 key={`${index}-${lineIndex}`}>{renderLine(line.substring(4))}</h3>);
          } else if (line.startsWith('* ') || line.startsWith('- ')) {
            if (listType !== 'ul') {
              flushList();
              listType = 'ul';
            }
            listItems.push(<li key={`${index}-${lineIndex}`}>{renderLine(line.substring(2))}</li>);
          } else if (line.match(/^\d+\.\s/)) {
            if (listType !== 'ol') {
              flushList();
              listType = 'ol';
            }
            listItems.push(<li key={`${index}-${lineIndex}`}>{renderLine(line.replace(/^\d+\.\s/, ''))}</li>);
          } else if (line.trim() === '') {
             // We don't flush the list here to allow for multi-line list items.
             // Instead, we just add the line break to the last list item if it exists.
            if (listItems.length > 0) {
                // FIX: Cast `lastItem` to a generic ReactElement to fix type inference issues
                // where `props` was being treated as `unknown`, causing errors.
                const lastItem = listItems[listItems.length - 1] as React.ReactElement<any>;
                const newContent = <>{lastItem.props.children}<br/></>;
                listItems[listItems.length-1] = React.cloneElement(lastItem, {children: newContent});
            } else {
                 elements.push(<br key={`${index}-${lineIndex}-br`} />);
            }
          } else {
            flushList();
            elements.push(<p key={`${index}-${lineIndex}`}>{renderLine(line)}</p>);
          }
        });
        
        flushList();

        return <div key={index}>{elements}</div>;
      })}
    </div>
  );
};

export default MarkdownRenderer;