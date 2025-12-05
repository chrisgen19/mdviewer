import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  let codeLanguage = '';

  while (i < lines.length) {
    const line = lines[i];

    // Handle code blocks
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        // Starting code block
        inCodeBlock = true;
        codeLanguage = line.trim().replace('```', '');
        codeBlockLines = [];
      } else {
        // Ending code block
        inCodeBlock = false;
        elements.push(
          <div key={i} className="my-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="bg-gray-800 dark:bg-gray-900 px-4 py-2 text-xs text-gray-400 font-mono border-b border-gray-700">
              {codeLanguage || 'code'}
            </div>
            <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 overflow-x-auto">
              <code className="font-mono text-sm leading-relaxed whitespace-pre">
                {codeBlockLines.join('\n')}
              </code>
            </pre>
          </div>
        );
        codeBlockLines = [];
        codeLanguage = '';
      }
      i++;
      continue;
    }

    // If inside code block, collect lines
    if (inCodeBlock) {
      codeBlockLines.push(line);
      i++;
      continue;
    }

    // Handle headers
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={i} className="text-3xl font-bold text-gray-900 dark:text-white pb-4 border-b border-gray-200 dark:border-gray-800 mt-8 mb-4">
          {line.replace('# ', '')}
        </h1>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-6 mb-3">
          {line.replace('## ', '')}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-5 mb-2">
          {line.replace('### ', '')}
        </h3>
      );
    }
    // Handle blockquotes
    else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 my-4 bg-gray-50 dark:bg-gray-800/50 py-2 rounded-r">
          {line.replace('> ', '')}
        </blockquote>
      );
    }
    // Handle unordered lists
    else if (line.match(/^[\s]*[-*]\s/)) {
      const indent = line.search(/[-*]/);
      elements.push(
        <li key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed" style={{ marginLeft: `${indent * 8 + 16}px` }}>
          {line.replace(/^[\s]*[-*]\s/, '')}
        </li>
      );
    }
    // Handle ordered lists
    else if (line.match(/^[\s]*\d+\.\s/)) {
      const indent = line.search(/\d/);
      elements.push(
        <li key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed list-decimal" style={{ marginLeft: `${indent * 8 + 32}px` }}>
          {line.replace(/^[\s]*\d+\.\s/, '')}
        </li>
      );
    }
    // Handle bold text **text**
    else if (line.includes('**')) {
      const parts = line.split('**');
      const rendered = parts.map((part, idx) =>
        idx % 2 === 1 ? <strong key={idx} className="font-bold">{part}</strong> : part
      );
      elements.push(
        <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed my-2">
          {rendered}
        </p>
      );
    }
    // Handle inline code `code`
    else if (line.includes('`') && !line.startsWith('```')) {
      const parts = line.split('`');
      const rendered = parts.map((part, idx) =>
        idx % 2 === 1 ? (
          <code key={idx} className="bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded text-sm font-mono">
            {part}
          </code>
        ) : part
      );
      elements.push(
        <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed my-2">
          {rendered}
        </p>
      );
    }
    // Empty lines for spacing
    else if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />);
    }
    // Regular paragraph
    else {
      elements.push(
        <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed my-2">
          {line}
        </p>
      );
    }

    i++;
  }

  return <div className="space-y-1">{elements}</div>;
};
