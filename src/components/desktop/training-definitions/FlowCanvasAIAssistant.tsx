
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import DocumentUploader from './DocumentUploader';
import AIFlowPreview from './AIFlowPreview';
import AISettingsModal from './AISettingsModal';
import AIStatusDisplay from './AIStatusDisplay';
import DocumentAnalysisDisplay from './DocumentAnalysisDisplay';
import { useAIFlowGeneration } from '@/hooks/useAIFlowGeneration';
import { StepBlock } from '@/types/training-definitions';

interface FlowCanvasAIAssistantProps {
  onApplyFlow: (blocks: StepBlock[]) => void;
}

const FlowCanvasAIAssistant: React.FC<FlowCanvasAIAssistantProps> = ({ onApplyFlow }) => {
  // Local state for document management
  const [documentContent, setDocumentContent] = useState<string>('');
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  // AI flow generation hook
  const { generatedFlow, isGenerating, error: generationError, generateFlow } = useAIFlowGeneration();

  const handleDocumentProcessed = (content: string, results: any) => {
    console.log('Document processed:', { contentLength: content.length, results });
    setDocumentContent(content);
    setAnalysisResults(results);
    setShowPreview(false);
  };

  const handleGenerateFlow = async (config: { selectedTopics: string[]; stepCount: number; content: string; fileName: string }) => {
    console.log('Generating flow with config:', config);
    try {
      await generateFlow(config);
      setShowPreview(true);
    } catch (error) {
      console.error('Failed to generate flow:', error);
    }
  };

  const handleApplyFlow = (blocks: StepBlock[]) => {
    onApplyFlow(blocks);
    setShowPreview(false);
  };

  const handleBackToAssistant = () => {
    setShowPreview(false);
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

        <DocumentAnalysisDisplay 
          analysisResults={analysisResults} 
          documentContent={documentContent}
          onGenerateFlow={handleGenerateFlow}
        />

        {/* Show generation status */}
        {isGenerating && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-blue-800">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm font-medium">Generating training flow...</span>
            </div>
          </div>
        )}

        {/* Show generation error */}
        {generationError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-red-800">
              <span className="text-sm font-medium">Generation Error: {generationError}</span>
            </div>
          </div>
        )}

        {/* AI Flow Preview */}
        {showPreview && generatedFlow && (
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
