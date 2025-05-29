
import { useState, useCallback } from 'react';
import { generateTrainingFlowWithAI } from '@/services/aiFlowGenerationService';
import { StepBlock } from '@/types/training-definitions';

interface UseAIFlowGenerationResult {
  generatedFlow: StepBlock[] | null;
  isGenerating: boolean;
  error: string | null;
  generateFlow: (config: {
    selectedTopics: string[];
    stepCount: number;
    content: string;
    fileName: string;
    analysisResult?: string;
  }) => Promise<void>;
}

export const useAIFlowGeneration = (): UseAIFlowGenerationResult => {
  const [generatedFlow, setGeneratedFlow] = useState<StepBlock[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateFlow = useCallback(async (config: {
    selectedTopics: string[];
    stepCount: number;
    content: string;
    fileName: string;
    analysisResult?: string;
  }) => {
    console.log('Starting AI flow generation with config:', config);
    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateTrainingFlowWithAI(config);
      
      if (result.error) {
        setError(result.error);
        console.warn('AI flow generation completed with error:', result.error);
      } else {
        console.log('AI flow generation completed successfully, generated blocks:', result.blocks.length);
      }
      
      setGeneratedFlow(result.blocks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate training flow';
      setError(errorMessage);
      console.error('AI flow generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    generatedFlow,
    isGenerating,
    error,
    generateFlow
  };
};
