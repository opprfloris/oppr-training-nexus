
import React from 'react';
import SimpleContentSummary from './SimpleContentSummary';

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
  onGenerateFlow?: (config: { selectedTopics: string[]; stepCount: number; content: string; fileName: string }) => void;
}

const DocumentAnalysisDisplay: React.FC<DocumentAnalysisDisplayProps> = ({ 
  analysisResults, 
  documentContent,
  onGenerateFlow 
}) => {
  console.log('DocumentAnalysisDisplay received:', { 
    hasAnalysisResults: !!analysisResults, 
    hasDocumentContent: !!documentContent,
    fileName: analysisResults?.documentMetadata?.fileName 
  });

  if (!analysisResults || !documentContent) {
    console.log('Missing required data for analysis display');
    return null;
  }

  return (
    <SimpleContentSummary 
      content={documentContent}
      fileName={analysisResults.documentMetadata?.fileName || 'Document'}
      onGenerateFlow={onGenerateFlow}
    />
  );
};

export default DocumentAnalysisDisplay;
