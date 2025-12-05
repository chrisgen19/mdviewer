import React from 'react';
import { ArrowLeft, Hash, Clock } from 'lucide-react';
import { FileNode } from '@/lib/mockData';
import { MarkdownRenderer } from './MarkdownRenderer';

interface FileViewerProps {
  currentFile: FileNode;
  parentName: string;
  darkMode?: boolean;
  onNavigateUp: () => void;
}

export const FileViewer: React.FC<FileViewerProps> = ({ currentFile, parentName, darkMode = false, onNavigateUp }) => {
  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={onNavigateUp}
          className="mb-4 text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
        >
          <ArrowLeft size={16} /> Back to {parentName}
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Hash size={24} className="text-gray-500" />
            </div>
            {currentFile.name}
          </h1>
          <div className="flex gap-2">
            <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              <Clock size={12} /> {currentFile.updatedAt}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-8 relative">
        <div className="flex-1 min-h-[500px] bg-white dark:bg-gray-950">
          <article className="prose prose-slate dark:prose-invert max-w-none">
            <MarkdownRenderer content={currentFile.content || ''} darkMode={darkMode} />
          </article>
        </div>

        <div className="hidden xl:block w-64 flex-shrink-0">
          <div className="sticky top-0">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">On this page</h3>
            <ul className="space-y-2 border-l border-gray-200 dark:border-gray-800">
              {['Introduction', 'Usage', 'Configuration'].map((item, i) => (
                <li
                  key={i}
                  className={`pl-4 text-sm cursor-pointer border-l-2 transition-colors -ml-[2px] ${
                    i === 0
                      ? 'border-blue-500 text-blue-600 font-medium'
                      : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
