import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;
  const lines = content.split('\n');

  return (
    <div className="space-y-4">
      {lines.map((line, idx) => {
        if (line.startsWith('# '))
          return (
            <h1 key={idx} className="text-3xl font-bold text-gray-900 dark:text-white pb-4 border-b border-gray-200 dark:border-gray-800">
              {line.replace('# ', '')}
            </h1>
          );
        if (line.startsWith('## '))
          return (
            <h2 key={idx} className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-6 mb-2">
              {line.replace('## ', '')}
            </h2>
          );
        if (line.startsWith('- '))
          return (
            <li key={idx} className="ml-4 list-disc text-gray-700 dark:text-gray-300">
              {line.replace('- ', '')}
            </li>
          );
        if (line.startsWith('1. '))
          return (
            <li key={idx} className="ml-4 list-decimal text-gray-700 dark:text-gray-300">
              {line.replace(/^\d+\. /, '')}
            </li>
          );
        if (line.startsWith('> '))
          return (
            <blockquote key={idx} className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 my-4 bg-gray-50 dark:bg-gray-800/50 py-2 rounded-r">
              {line.replace('> ', '')}
            </blockquote>
          );
        if (line.startsWith('```'))
          return null;
        if (line.trim().startsWith('npm') || line.trim().startsWith('const'))
          return (
            <div key={idx} className="bg-gray-900 text-gray-200 p-3 rounded-md font-mono text-sm shadow-inner overflow-x-auto">
              {line}
            </div>
          );

        return <p key={idx} className="text-gray-600 dark:text-gray-300 leading-relaxed">{line}</p>;
      })}
    </div>
  );
};
