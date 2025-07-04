import React from 'react';

interface ImageCompressionProgressProps {
  isCompressing: boolean;
  progress: number;
}

export const ImageCompressionProgress: React.FC<ImageCompressionProgressProps> = ({
  isCompressing,
  progress
}) => {
  if (!isCompressing) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500"></div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Compressing Images</h3>
            <p className="text-sm text-gray-500">Please wait while we optimize your images...</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-amber-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{progress}% complete</p>
        </div>
      </div>
    </div>
  );
}; 