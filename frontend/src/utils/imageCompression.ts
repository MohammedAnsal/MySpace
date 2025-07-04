import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker: boolean;
  fileType?: string;
}

export const defaultCompressionOptions: CompressionOptions = {
  maxSizeMB: 1, // 1MB max file size
  maxWidthOrHeight: 1920, // Max dimension
  useWebWorker: true,
  fileType: 'image/jpeg'
};

// Supported image formats
export const SUPPORTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png'];

export const isValidImageFormat = (file: File): boolean => {
  return SUPPORTED_FORMATS.includes(file.type);
};

export const getOptimalFormat = (originalFile: File): string => {
  // Keep original format if it's PNG, otherwise convert to JPEG
  if (originalFile.type === 'image/png') {
    return 'image/png';
  }
  return 'image/jpeg';
};

export const compressImage = async (
  file: File,
  options: Partial<CompressionOptions> = {}
): Promise<File> => {
  try {
    // Validate file format
    if (!isValidImageFormat(file)) {
      throw new Error(`Unsupported file format. Please use: ${SUPPORTED_FORMATS.join(', ')}`);
    }

    const compressionOptions = { 
      ...defaultCompressionOptions, 
      ...options,
      fileType: getOptimalFormat(file) // Use optimal format based on original
    };
    
    // Don't compress if file is already small enough
    if (file.size <= compressionOptions.maxSizeMB * 1024 * 1024) {
      console.log('File already small enough, skipping compression');
      return file;
    }

    console.log('Compressing image:', file.name, 'Original size:', file.size);
    
    const compressedFile = await imageCompression(file, compressionOptions);
    
    console.log('Compressed size:', compressedFile.size, 'Reduction:', 
      Math.round(((file.size - compressedFile.size) / file.size) * 100) + '%');
    
    return compressedFile;
  } catch (error) {
    console.error('Image compression failed:', error);
    // Return original file if compression fails
    return file;
  }
};

export const compressMultipleImages = async (
  files: File[],
  options: Partial<CompressionOptions> = {}
): Promise<File[]> => {
  const compressionPromises = files.map(file => compressImage(file, options));
  return Promise.all(compressionPromises);
};

// Utility function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
