
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, X } from 'lucide-react';

interface ProcessedDocument {
  file: File;
  content: string;
  extractedImages: string[];
  metadata: {
    pageCount: number;
    extractedAt: string;
    keyTopics: string[];
  };
}

interface DocumentPreviewProps {
  document: ProcessedDocument;
  onRemove: () => void;
  isProcessing: boolean;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ document, onRemove, isProcessing }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-blue-600" />
          <div className="text-left">
            <p className="text-sm font-medium">{document.file.name}</p>
            <p className="text-xs text-gray-500">
              {(document.file.size / 1024 / 1024).toFixed(2)} MB • {document.metadata.pageCount} pages
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          disabled={isProcessing}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <div className="text-green-600 mt-0.5">
            <FileText className="w-4 h-4" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-green-800">Document Successfully Processed</p>
            <div className="mt-2 space-y-1 text-green-700">
              <p>• Extracted {document.extractedImages.length} images</p>
              <p>• Identified {document.metadata.keyTopics.length} key topics</p>
              <p>• Ready for AI-powered question generation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;
