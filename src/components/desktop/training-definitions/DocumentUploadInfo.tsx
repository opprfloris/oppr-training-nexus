
import React from 'react';
import { AlertCircle } from 'lucide-react';

const DocumentUploadInfo: React.FC = () => {
  return (
    <div className="flex items-start space-x-2 text-xs text-gray-500">
      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <div>
        <p className="font-medium">Enhanced PDF Processing Features:</p>
        <ul className="list-disc list-inside mt-1 space-y-0.5">
          <li>Automatic text extraction and content analysis</li>
          <li>Image extraction for visual training materials</li>
          <li>Key topic identification for targeted questions</li>
          <li>Citation-ready content snippets for hints and references</li>
          <li>Smart content complexity analysis and recommendations</li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentUploadInfo;
