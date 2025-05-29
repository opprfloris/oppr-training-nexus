
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { StepBlock } from '@/types/training-definitions';

export const useAIFlowGeneration = () => {
  const [documentContent, setDocumentContent] = useState('');
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [generatedFlow, setGeneratedFlow] = useState<StepBlock[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { toast } = useToast();

  const handleDocumentProcessed = (file: File, content: string, extractedImages?: string[]) => {
    setDocumentContent(content);
    
    // Generate mock analysis results based on the processed document
    const mockAnalysis = {
      complexity: 'Intermediate',
      keyTopics: ['Safety protocols', 'Equipment operation', 'Quality control'],
      suggestedQuestionCount: 5,
      documentMetadata: {
        fileName: file.name,
        pageCount: Math.floor(Math.random() * 20) + 5,
        extractedImages: extractedImages?.length || 0
      }
    };
    
    setAnalysisResults(mockAnalysis);
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

  const handleApplyFlow = (blocks: StepBlock[]) => {
    setShowPreview(false);
    toast({
      title: "Flow Applied",
      description: "The AI-generated training flow has been applied to the canvas",
    });
  };

  const handleBackToAssistant = () => {
    setShowPreview(false);
  };

  return {
    documentContent,
    analysisResults,
    generatedFlow,
    showPreview,
    isProcessing,
    handleDocumentProcessed,
    generateTrainingFlow,
    handleApplyFlow,
    handleBackToAssistant
  };
};
