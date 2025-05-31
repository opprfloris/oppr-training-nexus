
import { useState, useCallback } from 'react';
import { StepBlock } from '@/types/training-definitions';
import { generateEnhancedTrainingFlow } from '@/services/enhancedAIFlowService';

interface WizardConfig {
  documentContent: string;
  fileName: string;
  title: string;
  description: string;
  generateTitle: boolean;
  generateDescription: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  stepCount: number;
  contentMix: number;
  selectedTopics: string[];
  estimatedDuration: number;
  customPrompt: string;
  tone: 'formal' | 'conversational' | 'technical';
  includeExamples: boolean;
  promptTemplate: string;
}

interface UseEnhancedAIGenerationResult {
  generatedFlow: StepBlock[] | null;
  generatedTitle: string | null;
  generatedDescription: string | null;
  isGenerating: boolean;
  error: string | null;
  generateFlow: (config: WizardConfig) => Promise<void>;
}

export const useEnhancedAIGeneration = (): UseEnhancedAIGenerationResult => {
  const [generatedFlow, setGeneratedFlow] = useState<StepBlock[] | null>(null);
  const [generatedTitle, setGeneratedTitle] = useState<string | null>(null);
  const [generatedDescription, setGeneratedDescription] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateFlow = useCallback(async (config: WizardConfig) => {
    console.log('Starting enhanced AI flow generation with config:', config);
    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateEnhancedTrainingFlow(config);
      
      if (result.error) {
        setError(result.error);
        console.warn('Enhanced AI flow generation completed with error:', result.error);
      } else {
        console.log('Enhanced AI flow generation completed successfully');
        console.log('Generated blocks:', result.blocks?.length || 0);
        console.log('Generated title:', result.title);
        console.log('Generated description:', result.description);
      }
      
      setGeneratedFlow(result.blocks || []);
      setGeneratedTitle(result.title || null);
      setGeneratedDescription(result.description || null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate enhanced training flow';
      setError(errorMessage);
      console.error('Enhanced AI flow generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    generatedFlow,
    generatedTitle,
    generatedDescription,
    isGenerating,
    error,
    generateFlow
  };
};
