export interface StoredFile {
  name: string;
  path: string;
  mimeType: string;
  size: number;
  savedAt: Date;
  category: FileCategory;
  iconName: string;
  displaySize: string;
}

export type FileCategory = 'image' | 'document' | 'other';

export function getFileCategory(mimeType: string): FileCategory {
  if (mimeType.startsWith('image/')) return 'image';
  if (
    mimeType.startsWith('application/pdf') ||
    mimeType.startsWith('text/') ||
    mimeType.includes('document') ||
    mimeType.includes('spreadsheet')
  ) {
    return 'document';
  }
  return 'other';
}

export function getIconName(mimeType: string): string {
  switch (getFileCategory(mimeType)) {
    case 'image':
      return 'image-outline';
    case 'document':
      return 'document-text-outline';
    default:
      return 'document-outline';
  }
}

export function enrichStoredFile(file: Omit<StoredFile, 'category' | 'iconName' | 'displaySize'>): StoredFile {
  return {
    ...file,
    category: getFileCategory(file.mimeType),
    iconName: getIconName(file.mimeType),
    displaySize: formatFileSize(file.size),
  };
}

const BYTES_PER_KB = 1024;
const BYTES_PER_MB = BYTES_PER_KB * BYTES_PER_KB;

export function formatFileSize(bytes: number): string {
  if (bytes < BYTES_PER_KB) return `${bytes} B`;
  if (bytes < BYTES_PER_MB) return `${(bytes / BYTES_PER_KB).toFixed(1)} KB`;
  return `${(bytes / BYTES_PER_MB).toFixed(1)} MB`;
}
