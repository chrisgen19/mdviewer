import React, { useMemo, useState } from 'react';
import { ArrowLeft, Hash, Clock } from 'lucide-react';
import { FileNode } from '@/lib/mockData';
import { MarkdownRenderer } from './MarkdownRenderer';

interface FileViewerProps {
  currentFile: FileNode;
  parentName: string;
  darkMode?: boolean;
  onNavigateUp: () => void;
}

interface Heading {
  text: string;
  level: number;
  id: string;
}

// Helper function to generate heading IDs like GitHub does
function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

export const FileViewer: React.FC<FileViewerProps> = ({ currentFile, parentName, darkMode = false, onNavigateUp }) => {
  const [activeHeading, setActiveHeading] = useState<string>('');

  // Extract headings from markdown content
  const headings = useMemo(() => {
    if (!currentFile.content) return [];

    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const matches = [...currentFile.content.matchAll(headingRegex)];

    return matches.map((match, index) => {
      const level = match[1].length;
      const text = match[2];
      const id = generateHeadingId(text);

      return { text, level, id };
    });
  }, [currentFile.content]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveHeading(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn">
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
        <div className="flex-1 min-h-[500px] bg-white dark:bg-gray-950 min-w-0 overflow-hidden">
          <article className="prose prose-slate dark:prose-invert max-w-none">
            <MarkdownRenderer content={currentFile.content || ''} darkMode={darkMode} />
          </article>
        </div>

        <div className="hidden xl:block w-64 flex-shrink-0">
          <div className="sticky top-0">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">On this page</h3>
            {headings.length > 0 ? (
              <ul className="space-y-2 border-l border-gray-200 dark:border-gray-800">
                {headings.map((heading) => (
                  <li
                    key={heading.id}
                    onClick={() => scrollToHeading(heading.id)}
                    className={`text-sm cursor-pointer border-l-2 transition-colors -ml-[2px] ${
                      activeHeading === heading.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400 font-medium'
                        : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
                    }`}
                    style={{ paddingLeft: `${(heading.level - 1) * 8 + 16}px` }}
                  >
                    {heading.text}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">No headings</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
