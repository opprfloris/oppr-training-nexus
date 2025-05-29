
import React from 'react';
import SmartContentAnalyzer from './SmartContentAnalyzer';

interface DocumentAnalysisDisplayProps {
  analysisResults: {
    complexity: string;
    keyTopics: string[];
    suggestedQuestionCount: number;
    documentMetadata?: {
      fileName: string;
      pageCount: number;
      extractedImages: number;
    };
  } | null;
  documentContent?: string;
}

const DocumentAnalysisDisplay: React.FC<DocumentAnalysisDisplayProps> = ({ 
  analysisResults, 
  documentContent 
}) => {
  if (!analysisResults || !documentContent) return null;

  return (
    <SmartContentAnalyzer 
      content={documentContent}
      fileName={analysisResults.documentMetadata?.fileName || 'Document'}
    />
  );
};

export default DocumentAnalysisDisplay;
