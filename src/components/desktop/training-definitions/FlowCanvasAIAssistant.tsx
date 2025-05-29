
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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

  const handleDocumentProcessed = (file: File, content: string, extractedImages?: string[]) => {
    console.log('Document processed:', { fileName: file.name, contentLength: content.length, extractedImages });
    setDocumentContent(content);
    
    // Create mock analysis results to match the expected structure
    const mockAnalysisResults = {
      complexity: 'Intermediate',
      keyTopics: ['Safety protocols', 'Equipment operation', 'Quality control'],
      suggestedQuestionCount: 8,
      documentMetadata: {
        fileName: file.name,
        pageCount: Math.floor(Math.random() * 20) + 5,
        extractedImages: extractedImages?.length || 0
      }
    };
    
    setAnalysisResults(mockAnalysisResults);
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
      <CardContent className="flex-1 overflow-y-auto space-y-4 pt-6">
        {/* AI Status and Settings */}
        <div className="flex items-center justify-end space-x-3">
          <AIStatusDisplay />
          <AISettingsModal />
        </div>

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

        {/* Show generation error with more details */}
        {generationError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-red-800">
                <span className="text-sm font-semibold">Generation Error:</span>
              </div>
              <div className="text-sm text-red-700 bg-red-100 p-3 rounded">
                {generationError}
              </div>
              <div className="text-xs text-red-600">
                Check your AI settings and ensure your API key is valid. The system will use fallback questions if AI generation fails.
              </div>
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
