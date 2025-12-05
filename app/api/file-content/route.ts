import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

    // Base directory for markdown files
    const baseDir = path.join(process.cwd(), 'docs');
    const targetFile = path.join(baseDir, filePath);

    // Security check: ensure the path is within baseDir
    const normalizedTarget = path.normalize(targetFile);
    const normalizedBase = path.normalize(baseDir);

    if (!normalizedTarget.startsWith(normalizedBase)) {
      return NextResponse.json(
        { error: 'Invalid path' },
        { status: 403 }
      );
    }

    if (!fs.existsSync(targetFile)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Only allow reading .md files
    if (!targetFile.endsWith('.md')) {
      return NextResponse.json(
        { error: 'Only markdown files are allowed' },
        { status: 403 }
      );
    }

    const content = fs.readFileSync(targetFile, 'utf-8');
    const stats = fs.statSync(targetFile);

    return NextResponse.json({
      content,
      updatedAt: stats.mtime,
      size: stats.size
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to read file' },
      { status: 500 }
    );
  }
}
