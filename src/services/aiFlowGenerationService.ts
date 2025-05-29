
import { StepBlock } from '@/types/training-definitions';

interface AIFlowGenerationRequest {
  content: string;
  fileName: string;
  selectedTopics: string[];
  stepCount: number;
  analysisResult?: string;
}

interface AIFlowGenerationResponse {
  blocks: StepBlock[];
  error?: string;
}

export const generateTrainingFlowWithAI = async (request: AIFlowGenerationRequest): Promise<AIFlowGenerationResponse> => {
  // Get AI configuration from localStorage
  const savedConfig = localStorage.getItem('ai-settings');
  let config = {
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

  // Get the generation prompt
  const generationPrompt = localStorage.getItem('ai-generation-prompt') || `Create a training flow based on the document analysis and user configuration.

Requirements:
- Use the specified question count and content mix
- Focus on the selected topics
- Match the requested difficulty level
- Create engaging, practical content

Generate a well-structured training sequence with clear learning progression.`;

  console.log('Using AI generation prompt:', generationPrompt);
  console.log('Generation request:', { ...request, content: `${request.content.substring(0, 100)}...` });

  if (!config.apiKey) {
    return {
      blocks: generateFallbackFlow(request),
      error: 'No API key configured'
    };
  }

  try {
    const systemPrompt = `You are an expert training developer. Create engaging training flows that follow this exact JSON structure:

{
  "blocks": [
    {
      "id": "unique-id",
      "type": "information",
      "title": "Step Title",
      "content": "Detailed content"
    },
    {
      "id": "unique-id", 
      "type": "question",
      "title": "Question Title",
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C"],
      "correctAnswer": 0,
      "explanation": "Why this is correct"
    }
  ]
}

Always return valid JSON. Mix information and question blocks appropriately.`;

    const userPrompt = `${generationPrompt}

Document: ${request.fileName}
Selected Topics: ${request.selectedTopics.join(', ')}
Required Steps: ${request.stepCount}
Content: ${request.content}

${request.analysisResult ? `Analysis: ${request.analysisResult}` : ''}

Create exactly ${request.stepCount} training steps focusing on: ${request.selectedTopics.join(', ')}.`;

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
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('AI Flow Generation response received:', data);

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response generated from AI');
    }

    const responseContent = data.choices[0].message.content;
    
    try {
      const parsedResponse = JSON.parse(responseContent);
      if (parsedResponse.blocks && Array.isArray(parsedResponse.blocks)) {
        return { blocks: parsedResponse.blocks };
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      throw new Error('AI response was not valid JSON');
    }

  } catch (error) {
    console.error('AI Flow Generation Error:', error);
    return {
      blocks: generateFallbackFlow(request),
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

const generateFallbackFlow = (request: AIFlowGenerationRequest): StepBlock[] => {
  const blocks: StepBlock[] = [];
  
  // Create a mix of information and question blocks
  for (let i = 0; i < request.stepCount; i++) {
    const isQuestion = i % 2 === 1 && i > 0; // Every other block after the first
    const topicIndex = i % request.selectedTopics.length;
    const topic = request.selectedTopics[topicIndex] || 'General';
    
    if (isQuestion) {
      blocks.push({
        id: `question-${i + 1}`,
        type: 'question',
        title: `${topic} Knowledge Check`,
        question: `What is an important consideration regarding ${topic.toLowerCase()}?`,
        options: [
          'Always follow proper procedures',
          'Speed is more important than safety',
          'Documentation is optional',
          'Training is not necessary'
        ],
        correctAnswer: 0,
        explanation: `Following proper procedures is essential for ${topic.toLowerCase()} to ensure safety and quality.`
      });
    } else {
      blocks.push({
        id: `info-${i + 1}`,
        type: 'information',
        title: `${topic} Overview`,
        content: `This section covers important aspects of ${topic.toLowerCase()} related to the training content. Key points include proper procedures, safety considerations, and best practices that should be followed.`
      });
    }
  }
  
  return blocks;
};
