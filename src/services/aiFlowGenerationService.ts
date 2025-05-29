
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
    const systemPrompt = `You are an expert training developer. Create engaging training flows based on the provided content and requirements.

IMPORTANT: You must respond with ONLY valid JSON in this exact format:

{
  "blocks": [
    {
      "id": "step-1",
      "type": "information",
      "order": 1,
      "config": {
        "content": "Your information content here"
      }
    },
    {
      "id": "step-2",
      "type": "question",
      "order": 2,
      "config": {
        "question_text": "Your question here?",
        "question_type": "multiple_choice",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct_option": 0,
        "hint": "Explanation for the correct answer",
        "points": 10,
        "mandatory": true
      }
    }
  ]
}

Guidelines:
- Use "information" blocks for teaching content
- Use "question" blocks for assessments
- For multiple_choice questions, always include 3-4 options
- Set correct_option as the index (0, 1, 2, or 3)
- Make questions practical and relevant to the content
- Provide helpful hints that explain why the answer is correct
- Mix information and question blocks appropriately`;

    const userPrompt = `${generationPrompt}

Document: ${request.fileName}
Selected Topics: ${request.selectedTopics.join(', ')}
Required Steps: ${request.stepCount}

Content Summary (first 2000 chars):
${request.content.substring(0, 2000)}

${request.analysisResult ? `Analysis: ${request.analysisResult}` : ''}

Please create exactly ${request.stepCount} training steps focusing on: ${request.selectedTopics.join(', ')}.
Ensure the content is practical and engaging for learners.`;

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

    const data = await response.json();
    console.log('AI Flow Generation response received:', data);

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response generated from AI');
    }

    const responseContent = data.choices[0].message.content.trim();
    console.log('Raw AI response content:', responseContent);
    
    try {
      // Try to extract JSON if the response has extra text
      let jsonContent = responseContent;
      
      // Look for JSON block markers
      const jsonStart = responseContent.indexOf('{');
      const jsonEnd = responseContent.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        jsonContent = responseContent.substring(jsonStart, jsonEnd + 1);
      }
      
      console.log('Extracted JSON content:', jsonContent);
      
      const parsedResponse = JSON.parse(jsonContent);
      
      if (parsedResponse.blocks && Array.isArray(parsedResponse.blocks)) {
        console.log('Successfully parsed AI response with', parsedResponse.blocks.length, 'blocks');
        return { blocks: parsedResponse.blocks };
      } else {
        console.error('Invalid response structure - missing blocks array');
        throw new Error('Invalid response structure - missing blocks array');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      console.error('Response content was:', responseContent);
      throw new Error(`AI response was not valid JSON: ${parseError.message}`);
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
  
  console.log('Generating fallback flow with topics:', request.selectedTopics);
  
  // Create a mix of information and question blocks
  for (let i = 0; i < request.stepCount; i++) {
    const isQuestion = i % 2 === 1 && i > 0; // Every other block after the first
    const topicIndex = i % request.selectedTopics.length;
    const topic = request.selectedTopics[topicIndex] || 'General Training';
    
    if (isQuestion) {
      blocks.push({
        id: `question-${i + 1}`,
        type: 'question',
        order: i + 1,
        config: {
          question_text: `What is an important consideration regarding ${topic.toLowerCase()}?`,
          question_type: 'multiple_choice',
          options: [
            'Always follow proper procedures',
            'Speed is more important than safety',
            'Documentation is optional',
            'Training is not necessary'
          ],
          correct_option: 0,
          hint: `Following proper procedures is essential for ${topic.toLowerCase()} to ensure safety and quality.`,
          points: 10,
          mandatory: true
        }
      });
    } else {
      blocks.push({
        id: `info-${i + 1}`,
        type: 'information',
        order: i + 1,
        config: {
          content: `This section covers important aspects of ${topic.toLowerCase()} based on the training content. Key points include proper procedures, safety considerations, and best practices that should be followed in this area.`
        }
      });
    }
  }
  
  console.log('Generated fallback flow with', blocks.length, 'blocks');
  return blocks;
};
