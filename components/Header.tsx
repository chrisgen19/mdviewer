import React from 'react';
import { Menu, ChevronRight, Search, Moon, Sun } from 'lucide-react';
import { FileNode } from '@/lib/mockData';

interface HeaderProps {
  darkMode: boolean;
  sidebarOpen: boolean;
  path: FileNode[];
  onToggleSidebar: () => void;
  onToggleDarkMode: () => void;
  onBreadcrumbClick: (index: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  sidebarOpen,
  path,
  onToggleSidebar,
  onToggleDarkMode,
  onBreadcrumbClick,
}) => {
  return (
    <header className="h-14 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
        >
          <Menu size={20} className="text-gray-600 dark:text-gray-400" />
        </button>

        <div className="hidden sm:flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 overflow-x-auto no-scrollbar">
          {path.map((item, idx) => (
            <div key={idx} className="flex items-center whitespace-nowrap">
              {idx > 0 && <ChevronRight size={14} className="mx-1 text-gray-400" />}
              <button
                onClick={() => onBreadcrumbClick(idx)}
                className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                  idx === path.length - 1 ? 'font-semibold text-gray-900 dark:text-gray-100' : ''
                }`}
              >
                {item.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-900 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-800 w-64 focus-within:ring-2 ring-blue-500/50 transition-all">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700 dark:text-gray-200 placeholder-gray-400"
          />
        </div>
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-transform active:scale-95"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
};
