
import React from 'react';

interface DocumentProcessingStatusProps {
  isProcessing: boolean;
}

const DocumentProcessingStatus: React.FC<DocumentProcessingStatusProps> = ({ isProcessing }) => {
  if (!isProcessing) return null;

  return (
    <div className="text-center">
      <div className="inline-flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="text-sm text-gray-600">
          Processing PDF... Extracting content, images, and analyzing topics
        </span>
      </div>
    </div>
  );
};

export default DocumentProcessingStatus;
