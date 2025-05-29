
import { useState, useCallback } from 'react';
import { analyzeDocumentWithAI } from '@/services/aiAnalysisService';

interface UseAIAnalysisResult {
  analysis: string | null;
  isLoading: boolean;
  error: string | null;
  analyzeDocument: (content: string, fileName: string, customPrompt?: string) => Promise<void>;
  regenerateAnalysis: () => Promise<void>;
}

export const useAIAnalysis = (): UseAIAnalysisResult => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRequest, setLastRequest] = useState<{ content: string; fileName: string; customPrompt?: string } | null>(null);

  const analyzeDocument = useCallback(async (content: string, fileName: string, customPrompt?: string) => {
    console.log('Starting AI analysis for:', fileName);
    setIsLoading(true);
    setError(null);
    
    const request = { content, fileName, prompt: customPrompt };
    setLastRequest(request);

    try {
      const result = await analyzeDocumentWithAI(request);
      
      if (result.error) {
        setError(result.error);
        console.warn('AI analysis completed with error:', result.error);
      } else {
        console.log('AI analysis completed successfully');
      }
      
      setAnalysis(result.analysis);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze document';
      setError(errorMessage);
      console.error('AI analysis failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const regenerateAnalysis = useCallback(async () => {
    if (!lastRequest) {
      console.warn('No previous request to regenerate');
      return;
    }
    
    console.log('Regenerating AI analysis...');
    await analyzeDocument(lastRequest.content, lastRequest.fileName, lastRequest.customPrompt);
  }, [lastRequest, analyzeDocument]);

  return {
    analysis,
    isLoading,
    error,
    analyzeDocument,
    regenerateAnalysis
  };
};
