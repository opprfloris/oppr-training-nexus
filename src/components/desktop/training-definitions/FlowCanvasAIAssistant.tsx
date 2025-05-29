import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Upload, FileText, Settings, Brain } from 'lucide-react';
import { StepBlock } from '@/types/training-definitions';
import { createNewBlock } from '@/utils/blockUtils';
import DocumentUploader from './DocumentUploader';
import AIFlowPreview from './AIFlowPreview';
import AIDebugPanel from './AIDebugPanel';

interface FlowCanvasAIAssistantProps {
  onApplyFlow: (blocks: StepBlock[]) => void;
}

const FlowCanvasAIAssistant: React.FC<FlowCanvasAIAssistantProps> = ({ onApplyFlow }) => {
  const [documentContent, setDocumentContent] = useState('');
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [generatedFlow, setGeneratedFlow] = useState<StepBlock[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Add AI settings integration
  const [aiSettings, setAiSettings] = useState({
    apiKey: localStorage.getItem('openai_api_key') || '',
    model: localStorage.getItem('ai_model') || 'gpt-4o-mini',
    temperature: parseFloat(localStorage.getItem('ai_temperature') || '0.7'),
    maxTokens: parseInt(localStorage.getItem('ai_max_tokens') || '2000')
  });

  const { toast } = useToast();

  const handleDocumentProcessed = (content: string) => {
    setDocumentContent(content);
  };

  const handleAnalysisUpdate = (results: any) => {
    setAnalysisResults(results);
  };

  const generateTrainingFlow = async () => {
    if (!documentContent.trim()) {
      toast({
        title: "Document Required",
        description: "Please upload a document to generate a training flow",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    // Simulate AI generation with mock data for now
    // In a real implementation, this would call an AI service
    setTimeout(() => {
      const mockFlow = generateMockFlow(documentContent);
      setGeneratedFlow(mockFlow);
      setIsProcessing(false);
      setShowPreview(true);

      toast({
        title: "Flow Generated",
        description: `Generated a training flow with ${mockFlow.length} blocks`,
      });
    }, 2000);
  };

  const generateMockFlow = (content: string): StepBlock[] => {
    const baseId = Date.now();

    return [
      {
        id: `${baseId}-1`,
        type: 'information',
        order: 0,
        config: {
          content: `Understanding ${content.substring(0, 50)}...\n\nThis section covers the fundamental concepts and principles related to ${content.substring(0, 50)}. It's important to understand these basics before proceeding to practical applications.`
        }
      },
      {
        id: `${baseId}-2`,
        type: 'question',
        order: 1,
        config: {
          question_text: `What are the three most important considerations when working with ${content.substring(0, 50)}?`,
          question_type: 'text_input',
          ideal_answer: 'Consideration 1, Consideration 2, and Consideration 3',
          hint: 'Think about key factors and requirements',
          points: 3,
          mandatory: true
        }
      },
      {
        id: `${baseId}-3`,
        type: 'goto',
        order: 2,
        config: {
          instructions: `Navigate to the next section to learn more about ${content.substring(0, 50)}. Ensure you have completed the previous steps before proceeding.`
        }
      }
    ];
  };

  const handleApplyFlow = (blocks: StepBlock[]) => {
    onApplyFlow(blocks);
    setShowPreview(false);
    toast({
      title: "Flow Applied",
      description: "The AI-generated training flow has been applied to the canvas",
    });
  };

  const handleBackToAssistant = () => {
    setShowPreview(false);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Brain className="w-5 h-5 mr-2 text-purple-600" />
          Advanced AI Training Flow Generator
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {/* AI Debug Panel */}
        <AIDebugPanel className="mb-4" />
        
        {/* AI Settings Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">AI Configuration</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${aiSettings.apiKey ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-xs text-blue-700">
                {aiSettings.apiKey ? `Connected (${aiSettings.model})` : 'No API Key'}
              </span>
            </div>
          </div>
          {!aiSettings.apiKey && (
            <p className="text-xs text-blue-600 mt-2">
              Configure your AI settings in the Settings page to enable advanced features.
            </p>
          )}
        </div>

        {/* Document Upload Section */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
            Document Overview
          </h3>
          <DocumentUploader
            onContentProcessed={handleDocumentProcessed}
            onAnalysisUpdate={handleAnalysisUpdate}
          />
        </div>

        {/* Analysis Results Section */}
        {analysisResults && (
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
        )}

        {/* Generate Flow Button */}
        <Button
          onClick={generateTrainingFlow}
          disabled={isProcessing || !documentContent.trim()}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              Generating Flow...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Training Flow
            </>
          )}
        </Button>

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
