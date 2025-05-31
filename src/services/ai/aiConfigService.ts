
import { AIConfig } from './aiFlowTypes';

export const getAIConfig = (): AIConfig => {
  const savedConfig = localStorage.getItem('ai-settings');
  let config: AIConfig = {
    apiKey: '',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 4000
  };

  if (savedConfig) {
    try {
      config = { ...config, ...JSON.parse(savedConfig) };
    } catch (error) {
      console.error('Failed to parse AI config:', error);
    }
  }

  return config;
};

export const getGenerationPrompt = (): string => {
  return localStorage.getItem('ai-generation-prompt') || `Create a training flow based on the document analysis and user configuration.

Requirements:
- Use the specified question count and content mix
- Focus on the selected topics
- Match the requested difficulty level
- Create engaging, practical content

Generate a well-structured training sequence with clear learning progression.`;
};
