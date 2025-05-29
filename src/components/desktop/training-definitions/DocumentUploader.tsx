
import React from 'react';
import DocumentUploadZone from './DocumentUploadZone';
import DocumentPreview from './DocumentPreview';
import DocumentProcessingStatus from './DocumentProcessingStatus';
import DocumentUploadInfo from './DocumentUploadInfo';
import { useDocumentProcessor } from '@/hooks/useDocumentProcessor';

interface DocumentUploaderProps {
  onDocumentProcessed: (file: File, content: string, extractedImages?: string[]) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onDocumentProcessed }) => {
  const { uploadedDocument, isProcessing, processDocument, removeDocument } = useDocumentProcessor();

  const handleFileSelect = (file: File) => {
    processDocument(file, onDocumentProcessed);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {!uploadedDocument ? (
          <DocumentUploadZone onFileSelect={handleFileSelect} isProcessing={isProcessing} />
        ) : (
          <DocumentPreview 
            document={uploadedDocument} 
            onRemove={removeDocument} 
            isProcessing={isProcessing} 
          />
        )}
      </div>
      
      <DocumentProcessingStatus isProcessing={isProcessing} />

      {!uploadedDocument && <DocumentUploadInfo />}
    </div>
  );
};

export default DocumentUploader;
