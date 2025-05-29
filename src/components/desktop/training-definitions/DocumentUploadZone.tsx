
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface DocumentUploadZoneProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

const DocumentUploadZone: React.FC<DocumentUploadZoneProps> = ({ onFileSelect, isProcessing }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
      <p className="text-sm text-gray-600 mb-3">
        Upload a PDF document to generate content-specific questions and training materials
      </p>
      <input
        id="pdf-upload"
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
        disabled={isProcessing}
      />
      <Button
        variant="outline"
        onClick={() => document.getElementById('pdf-upload')?.click()}
        disabled={isProcessing}
      >
        <Upload className="w-4 h-4 mr-2" />
        {isProcessing ? 'Processing Document...' : 'Choose PDF File'}
      </Button>
    </div>
  );
};

export default DocumentUploadZone;
