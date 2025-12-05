'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { FileList } from '@/components/FileList';
import { FileViewer } from '@/components/FileViewer';
import { FileNode } from '@/lib/mockData';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [path, setPath] = useState<FileNode[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [fileSystem, setFileSystem] = useState<FileNode | null>(null);

  // Load dark mode preference from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      setDarkMode(saved === 'true');
    }
  }, []);

  // Save dark mode preference to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('darkMode', darkMode.toString());
    }
  }, [darkMode, mounted]);

  // Load initial file system
  useEffect(() => {
    loadFileSystem('');
  }, []);

  const loadFileSystem = async (folderPath: string = '') => {
    try {
      setLoading(true);
      const response = await fetch(`/api/files?path=${encodeURIComponent(folderPath)}`);
      const data = await response.json();

      if (response.ok) {
        setFileSystem(data);
        if (path.length === 0) {
          setPath([data]);
        }
      }
    } catch (error) {
      console.error('Error loading file system:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFileContent = async (filePath: string): Promise<string> => {
    try {
      const response = await fetch(`/api/file-content?path=${encodeURIComponent(filePath)}`);
      const data = await response.json();

      if (response.ok) {
        return data.content;
      }
      return 'Error loading file content.';
    } catch (error) {
      console.error('Error loading file content:', error);
      return 'Error loading file content.';
    }
  };

  const handleEntryClick = async (entry: FileNode) => {
    if (entry.type === 'file') {
      // Load file content if not already loaded
      if (!entry.content) {
        const content = await loadFileContent(entry.path);
        entry.content = content;
      }
      setPath([...path, entry]);
    } else {
      // Navigate into folder
      setPath([...path, entry]);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    const newPath = path.slice(0, index + 1);
    setPath(newPath);
  };

  const navigateUp = () => {
    if (path.length > 1) {
      setPath(path.slice(0, -1));
    }
  };

  const currentFolder = path[path.length - 1];

  // Prevent flash by not rendering until mounted
  if (!mounted) {
    return null;
  }

  if (loading || !fileSystem) {
    return (
      <div className={`h-screen w-full flex items-center justify-center font-sans bg-white dark:bg-gray-950 ${darkMode ? 'dark' : ''}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen w-full flex overflow-hidden font-sans ${darkMode ? 'dark' : ''}`}>
      <div className="flex w-full bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 relative">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar
          isOpen={sidebarOpen}
          fileSystem={fileSystem}
          path={path}
          onEntryClick={handleEntryClick}
        />

        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          <Header
            darkMode={darkMode}
            sidebarOpen={sidebarOpen}
            path={path}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
            onBreadcrumbClick={handleBreadcrumbClick}
          />

          <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-950 custom-scrollbar p-6">
            {currentFolder?.type === 'folder' ? (
              <FileList
                currentFolder={currentFolder}
                path={path}
                onEntryClick={handleEntryClick}
                onNavigateUp={navigateUp}
              />
            ) : currentFolder?.type === 'file' ? (
              <FileViewer
                currentFile={currentFolder}
                parentName={path[path.length - 2]?.name || 'Docs'}
                onNavigateUp={navigateUp}
              />
            ) : (
              <div className="text-center text-gray-500 mt-20">
                <p>No files found. Add some .md files to the docs folder.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
