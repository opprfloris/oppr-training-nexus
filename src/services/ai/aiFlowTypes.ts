
import { StepBlock } from '@/types/training-definitions';

export interface AIFlowGenerationRequest {
  content: string;
  fileName: string;
  selectedTopics: string[];
  stepCount: number;
  analysisResult?: string;
}

export interface AIFlowGenerationResponse {
  blocks: StepBlock[];
  error?: string;
}

export interface AIConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}
