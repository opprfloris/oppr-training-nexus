
import { AIConfig } from './aiFlowTypes';
import { buildSystemPrompt, buildUserPrompt } from './aiPromptBuilder';
import { AIFlowGenerationRequest } from './aiFlowTypes';

export const callOpenAIAPI = async (
  request: AIFlowGenerationRequest, 
  config: AIConfig, 
  generationPrompt: string
) => {
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(request, generationPrompt);

  console.log('Sending request to OpenAI API...');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: config.temperature,
      max_tokens: config.maxTokens,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = `API request failed: ${response.status} ${response.statusText}`;
    console.error('OpenAI API Error:', errorMessage, errorData);
    throw new Error(`${errorMessage} - ${errorData.error?.message || 'Unknown error'}`);
  }

  return response.json();
};
