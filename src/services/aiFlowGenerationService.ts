
import { AIFlowGenerationRequest, AIFlowGenerationResponse } from './ai/aiFlowTypes';
import { getAIConfig, getGenerationPrompt } from './ai/aiConfigService';
import { generateFallbackFlow } from './ai/aiFallbackGenerator';
import { callOpenAIAPI } from './ai/aiApiClient';
import { parseAIResponse } from './ai/aiResponseParser';

export const generateTrainingFlowWithAI = async (request: AIFlowGenerationRequest): Promise<AIFlowGenerationResponse> => {
  const config = getAIConfig();
  const generationPrompt = getGenerationPrompt();

  console.log('Using AI generation prompt:', generationPrompt);
  console.log('Generation request:', { 
    fileName: request.fileName,
    selectedTopics: request.selectedTopics,
    stepCount: request.stepCount,
    contentLength: request.content.length
  });

  if (!config.apiKey) {
    console.warn('No API key configured, using fallback flow');
    return {
      blocks: generateFallbackFlow(request),
      error: 'No API key configured'
    };
  }

  try {
    const data = await callOpenAIAPI(request, config, generationPrompt);
    const blocks = parseAIResponse(data);
    
    return { blocks };
  } catch (error) {
    console.error('AI Flow Generation Error:', error);
    return {
      blocks: generateFallbackFlow(request),
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
