export interface FileNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  updatedAt: string;
  path: string;
  content?: string;
  children?: FileNode[];
}
