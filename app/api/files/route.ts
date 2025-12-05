import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface FileNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  updatedAt: string;
  path: string;
  children?: FileNode[];
}

function getRelativeTime(mtime: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - mtime.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`;
  return `${Math.floor(seconds / 2592000)} months ago`;
}

function readDirectory(dirPath: string, relativePath: string = ''): FileNode[] {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const nodes: FileNode[] = [];

    for (const entry of entries) {
      // Skip hidden files and node_modules
      if (entry.name.startsWith('.') || entry.name === 'node_modules') {
        continue;
      }

      const fullPath = path.join(dirPath, entry.name);
      const relPath = relativePath ? path.join(relativePath, entry.name) : entry.name;
      const stats = fs.statSync(fullPath);

      if (entry.isDirectory()) {
        nodes.push({
          id: relPath.replace(/\\/g, '/'),
          name: entry.name,
          type: 'folder',
          updatedAt: getRelativeTime(stats.mtime),
          path: relPath.replace(/\\/g, '/'),
          children: readDirectory(fullPath, relPath)
        });
      } else if (entry.name.endsWith('.md')) {
        nodes.push({
          id: relPath.replace(/\\/g, '/'),
          name: entry.name,
          type: 'file',
          updatedAt: getRelativeTime(stats.mtime),
          path: relPath.replace(/\\/g, '/')
        });
      }
    }

    return nodes.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === 'folder' ? -1 : 1;
    });
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const requestedPath = searchParams.get('path') || '';

    // Base directory for markdown files
    const baseDir = path.join(process.cwd(), 'docs');

    // Ensure base directory exists
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }

    const targetDir = requestedPath
      ? path.join(baseDir, requestedPath)
      : baseDir;

    // Security check: ensure the path is within baseDir
    const normalizedTarget = path.normalize(targetDir);
    const normalizedBase = path.normalize(baseDir);

    if (!normalizedTarget.startsWith(normalizedBase)) {
      return NextResponse.json(
        { error: 'Invalid path' },
        { status: 403 }
      );
    }

    if (!fs.existsSync(targetDir)) {
      return NextResponse.json(
        { error: 'Directory not found' },
        { status: 404 }
      );
    }

    const children = readDirectory(targetDir, requestedPath);

    const response: FileNode = {
      id: requestedPath || 'root',
      name: requestedPath ? path.basename(requestedPath) : 'Docs',
      type: 'folder',
      updatedAt: 'now',
      path: requestedPath,
      children
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to read directory' },
      { status: 500 }
    );
  }
}
