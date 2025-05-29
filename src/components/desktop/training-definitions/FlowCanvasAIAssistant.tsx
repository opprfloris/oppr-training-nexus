
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import DocumentUploader from './DocumentUploader';
import AIFlowPreview from './AIFlowPreview';
import AISettingsModal from './AISettingsModal';
import AIStatusDisplay from './AIStatusDisplay';
import DocumentAnalysisDisplay from './DocumentAnalysisDisplay';
import AIFlowGenerator from './AIFlowGenerator';
import { useAIFlowGeneration } from '@/hooks/useAIFlowGeneration';
import { StepBlock } from '@/types/training-definitions';

interface FlowCanvasAIAssistantProps {
  onApplyFlow: (blocks: StepBlock[]) => void;
}

const FlowCanvasAIAssistant: React.FC<FlowCanvasAIAssistantProps> = ({ onApplyFlow }) => {
  const {
    documentContent,
    analysisResults,
    generatedFlow,
    showPreview,
    isProcessing,
    handleDocumentProcessed,
    generateTrainingFlow,
    handleApplyFlow: handleInternalApplyFlow,
    handleBackToAssistant
  } = useAIFlowGeneration();

  const handleApplyFlow = (blocks: StepBlock[]) => {
    onApplyFlow(blocks);
    handleInternalApplyFlow(blocks);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-600" />
            AI Training Flow Generator
          </CardTitle>
          <div className="flex items-center space-x-3">
            <AIStatusDisplay />
            <AISettingsModal />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {/* Document Upload Section */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
            Document Overview
          </h3>
          <DocumentUploader onDocumentProcessed={handleDocumentProcessed} />
        </div>

        <DocumentAnalysisDisplay analysisResults={analysisResults} />

        <AIFlowGenerator
          onGenerateFlow={generateTrainingFlow}
          isProcessing={isProcessing}
          documentContent={documentContent}
        />

        {/* AI Flow Preview */}
        {showPreview && (
          <div className="mt-4">
            <AIFlowPreview
              blocks={generatedFlow}
              onApply={handleApplyFlow}
              onBack={handleBackToAssistant}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FlowCanvasAIAssistant;
