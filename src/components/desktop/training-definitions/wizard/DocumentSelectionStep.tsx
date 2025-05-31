
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Upload } from 'lucide-react';
import DocumentUploader from '../DocumentUploader';

interface DocumentSelectionStepProps {
  config: any;
  onUpdateConfig: (updates: any) => void;
}

const DocumentSelectionStep: React.FC<DocumentSelectionStepProps> = ({ config, onUpdateConfig }) => {
  const handleDocumentProcessed = (file: File, content: string) => {
    onUpdateConfig({
      documentContent: content,
      fileName: file.name
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <FileText className="w-12 h-12 text-purple-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Training Document</h3>
        <p className="text-gray-600">
          Upload or select a document that will serve as the foundation for your training content.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Document Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentUploader onDocumentProcessed={handleDocumentProcessed} />
          
          {config.fileName && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center text-green-800">
                <FileText className="w-4 h-4 mr-2" />
                <span className="font-medium">Document loaded: {config.fileName}</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Content length: {config.documentContent.length.toLocaleString()} characters
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentSelectionStep;
