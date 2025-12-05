import React from 'react';
import { Folder, FileText, LayoutGrid } from 'lucide-react';
import { FileNode } from '@/lib/mockData';

interface SidebarProps {
  isOpen: boolean;
  fileSystem: FileNode;
  path: FileNode[];
  onEntryClick: (entry: FileNode) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, fileSystem, path, onEntryClick }) => {
  const renderSidebarItem = (item: FileNode, depth = 0): React.ReactNode => {
    const isFile = item.type === 'file';
    const isActive = path.find(p => p.id === item.id);

    return (
      <div key={item.id}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (!isFile) onEntryClick(item);
          }}
          className={`
            group flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer mb-1 transition-all duration-200
            ${isActive
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }
          `}
          style={{ paddingLeft: `${depth * 12 + 12}px` }}
        >
          {isFile ? (
            <FileText size={16} />
          ) : (
            <Folder size={16} className={isActive ? 'fill-blue-400 text-blue-400' : ''} />
          )}
          <span className="truncate">{item.name}</span>
        </div>
        {item.children && !isFile && (
          <div className="border-l border-gray-200 dark:border-gray-800 ml-4">
            {item.children.map(child => renderSidebarItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`
        ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full opacity-0'}
        fixed md:relative z-20 h-full flex-shrink-0 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
        transition-all duration-300 ease-in-out flex flex-col
      `}
    >
      <div className="h-14 flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 font-bold text-lg text-gray-800 dark:text-white">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <LayoutGrid size={18} />
          </div>
          <span>MDView</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-2 custom-scrollbar">
        <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Directory
        </div>
        {fileSystem.children?.map(child => renderSidebarItem(child))}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Demo User</p>
            <p className="text-xs text-gray-500 truncate">pro@mdview.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
