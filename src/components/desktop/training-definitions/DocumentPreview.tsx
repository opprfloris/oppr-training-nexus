
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, X, CheckCircle } from 'lucide-react';

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
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">Document Successfully Processed</span>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;
