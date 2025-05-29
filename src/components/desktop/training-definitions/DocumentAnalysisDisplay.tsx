
import React from 'react';
import { FileText } from 'lucide-react';

interface DocumentAnalysisDisplayProps {
  analysisResults: {
    complexity: string;
    keyTopics: string[];
    suggestedQuestionCount: number;
  } | null;
}

const DocumentAnalysisDisplay: React.FC<DocumentAnalysisDisplayProps> = ({ analysisResults }) => {
  if (!analysisResults) return null;

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
        <FileText className="w-4 h-4 mr-2 text-gray-600" />
        Content Analysis
      </h3>
      <div className="text-sm text-gray-700 space-y-2">
        <p><strong>Complexity:</strong> {analysisResults.complexity}</p>
        <p><strong>Key Topics:</strong> {analysisResults.keyTopics.join(', ')}</p>
        <p><strong>Suggested Questions:</strong> {analysisResults.suggestedQuestionCount}</p>
      </div>
    </div>
  );
};

export default DocumentAnalysisDisplay;
