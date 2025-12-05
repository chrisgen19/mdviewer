import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface MarkdownRendererProps {
  content: string;
  darkMode?: boolean;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, darkMode = false }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  let codeLanguage = '';

  // Get syntax highlighting theme based on dark mode
  const codeStyle = darkMode ? vscDarkPlus : vs;

  while (i < lines.length) {
    const line = lines[i];

    // Handle code blocks
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        // Starting code block
        inCodeBlock = true;
        codeLanguage = line.trim().replace('```', '').toLowerCase();
        codeBlockLines = [];
      } else {
        // Ending code block
        inCodeBlock = false;
        const codeContent = codeBlockLines.join('\n');

        elements.push(
          <div key={i} className="my-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
            {codeLanguage && (
              <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <span className="uppercase tracking-wide">{codeLanguage}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(codeContent)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  title="Copy code"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            )}
            <SyntaxHighlighter
              language={codeLanguage || 'text'}
              style={codeStyle}
              customStyle={{
                margin: 0,
                borderRadius: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5',
              }}
              showLineNumbers={codeBlockLines.length > 10}
              wrapLines={true}
              PreTag="div"
            >
              {codeContent}
            </SyntaxHighlighter>
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
        <h1 key={i} className="text-3xl font-bold text-gray-900 dark:text-white pb-4 border-b border-gray-200 dark:border-gray-800 mt-8 mb-4 first:mt-0">
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
    } else if (line.startsWith('#### ')) {
      elements.push(
        <h4 key={i} className="text-lg font-semibold text-gray-800 dark:text-gray-100 mt-4 mb-2">
          {line.replace('#### ', '')}
        </h4>
      );
    }
    // Handle blockquotes
    else if (line.startsWith('> ')) {
      const quoteText = line.replace('> ', '');
      // Handle bold text in quotes
      const formattedQuote = quoteText.split('**').map((part, idx) =>
        idx % 2 === 1 ? <strong key={idx} className="font-bold">{part}</strong> : part
      );

      elements.push(
        <blockquote key={i} className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 italic text-gray-600 dark:text-gray-400 my-4 bg-gray-50 dark:bg-gray-800/50 py-3 rounded-r">
          {formattedQuote}
        </blockquote>
      );
    }
    // Handle unordered lists
    else if (line.match(/^[\s]*[-*+]\s/)) {
      const indent = line.search(/[-*+]/);
      const content = line.replace(/^[\s]*[-*+]\s/, '');
      const formattedContent = formatInlineStyles(content);

      elements.push(
        <li key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed my-1" style={{ marginLeft: `${indent * 8 + 16}px` }}>
          {formattedContent}
        </li>
      );
    }
    // Handle ordered lists
    else if (line.match(/^[\s]*\d+\.\s/)) {
      const indent = line.search(/\d/);
      const content = line.replace(/^[\s]*\d+\.\s/, '');
      const formattedContent = formatInlineStyles(content);

      elements.push(
        <li key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed my-1 list-decimal" style={{ marginLeft: `${indent * 8 + 32}px` }}>
          {formattedContent}
        </li>
      );
    }
    // Handle horizontal rules
    else if (line.match(/^(\*{3,}|-{3,}|_{3,})$/)) {
      elements.push(
        <hr key={i} className="my-8 border-t border-gray-300 dark:border-gray-700" />
      );
    }
    // Empty lines for spacing
    else if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />);
    }
    // Regular paragraph
    else if (line.trim().length > 0) {
      const formattedLine = formatInlineStyles(line);
      elements.push(
        <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed my-2">
          {formattedLine}
        </p>
      );
    }

    i++;
  }

  return <div className="space-y-1">{elements}</div>;
};

// Helper function to format inline styles (bold, italic, code, links)
function formatInlineStyles(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let currentText = text;
  let key = 0;

  // Handle inline code first
  const codeRegex = /`([^`]+)`/g;
  const codeParts = currentText.split(codeRegex);

  codeParts.forEach((part, idx) => {
    if (idx % 2 === 1) {
      // This is code
      parts.push(
        <code key={`code-${key++}`} className="bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded text-sm font-mono">
          {part}
        </code>
      );
    } else {
      // Handle bold
      const boldParts = part.split(/\*\*(.+?)\*\*/g);
      boldParts.forEach((boldPart, boldIdx) => {
        if (boldIdx % 2 === 1) {
          parts.push(<strong key={`bold-${key++}`} className="font-bold">{boldPart}</strong>);
        } else if (boldPart) {
          // Handle italic
          const italicParts = boldPart.split(/\*(.+?)\*/g);
          italicParts.forEach((italicPart, italicIdx) => {
            if (italicIdx % 2 === 1) {
              parts.push(<em key={`italic-${key++}`} className="italic">{italicPart}</em>);
            } else if (italicPart) {
              parts.push(<span key={`text-${key++}`}>{italicPart}</span>);
            }
          });
        }
      });
    }
  });

  return parts;
}
