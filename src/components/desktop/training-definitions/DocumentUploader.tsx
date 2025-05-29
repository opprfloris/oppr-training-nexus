
import React, { useState } from 'react';
import DocumentUploadZone from './DocumentUploadZone';
import DocumentPreview from './DocumentPreview';
import DocumentProcessingStatus from './DocumentProcessingStatus';
import DocumentUploadInfo from './DocumentUploadInfo';
import DocumentSourceToggle from './DocumentSourceToggle';
import DocumentSelector from './DocumentSelector';
import { useDocumentProcessor } from '@/hooks/useDocumentProcessor';

interface Document {
  id: string;
  folder_id: string | null;
  original_name: string;
  display_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  mime_type: string;
  created_at: string;
  tags: string[];
}

interface DocumentUploaderProps {
  onDocumentProcessed: (file: File, content: string, extractedImages?: string[]) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onDocumentProcessed }) => {
  const { uploadedDocument, isProcessing, processDocument, removeDocument } = useDocumentProcessor();
  const [sourceMode, setSourceMode] = useState<'upload' | 'select'>('upload');

  const handleFileSelect = (file: File) => {
    processDocument(file, onDocumentProcessed);
  };

  const handleDocumentSelected = (document: Document, content: string) => {
    // Create a mock File object for consistency with the existing flow
    const mockFile = new File([''], document.original_name, {
      type: document.mime_type,
    });
    
    // Call the callback with the mock file and extracted content
    onDocumentProcessed(mockFile, content);
  };

  return (
    <div className="space-y-4">
      <DocumentSourceToggle mode={sourceMode} onModeChange={setSourceMode} />
      
      {sourceMode === 'upload' ? (
        <>
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
        </>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4">
          <DocumentSelector 
            onDocumentSelected={handleDocumentSelected} 
            isProcessing={isProcessing}
          />
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
