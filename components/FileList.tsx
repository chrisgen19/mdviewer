import React from 'react';
import { Folder, FileText, CornerUpLeft, MoreVertical } from 'lucide-react';
import { FileNode } from '@/lib/mockData';

interface FileListProps {
  currentFolder: FileNode;
  path: FileNode[];
  onEntryClick: (entry: FileNode) => void;
  onNavigateUp: () => void;
}

export const FileList: React.FC<FileListProps> = ({ currentFolder, path, onEntryClick, onNavigateUp }) => {
  return (
    <div className="max-w-6xl mx-auto animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Folder className="text-blue-500" />
          {currentFolder.name}
        </h2>
        <span className="text-sm text-gray-500">{currentFolder.children?.length || 0} items</span>
      </div>

      <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-900/50">
        <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs font-medium text-gray-500 uppercase tracking-wider">
          <span className="w-1/2">Name</span>
          <span className="w-1/4">Date Modified</span>
          <span className="w-1/4 text-right">Actions</span>
        </div>

        {path.length > 1 && (
          <div
            onClick={onNavigateUp}
            className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800/50 transition-colors group"
          >
            <CornerUpLeft size={16} className="text-gray-400 group-hover:text-blue-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-blue-600">..</span>
          </div>
        )}

        {currentFolder.children && currentFolder.children.length > 0 ? (
          currentFolder.children.map((child) => (
            <div
              key={child.id}
              onClick={() => onEntryClick(child)}
              className="px-4 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800/50 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
            >
              <div className="flex items-center gap-3 w-1/2">
                {child.type === 'folder' ? (
                  <Folder size={18} className="text-blue-500 fill-blue-500/20" />
                ) : (
                  <FileText size={18} className="text-gray-400 group-hover:text-blue-400" />
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {child.name}
                </span>
              </div>
              <div className="w-1/4 text-sm text-gray-500 dark:text-gray-500 flex items-center gap-1">
                {child.updatedAt}
              </div>
              <div className="w-1/4 flex justify-end">
                <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            Empty directory
          </div>
        )}
      </div>
    </div>
  );
};
