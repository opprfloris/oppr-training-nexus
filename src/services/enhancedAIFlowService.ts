
import { StepBlock } from '@/types/training-definitions';

interface EnhancedAIFlowRequest {
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

interface EnhancedAIFlowResponse {
  blocks: StepBlock[];
  title?: string;
  description?: string;
  error?: string;
}

export const generateEnhancedTrainingFlow = async (request: EnhancedAIFlowRequest): Promise<EnhancedAIFlowResponse> => {
  // Get AI configuration from localStorage
  const savedConfig = localStorage.getItem('ai-settings');
  let config = {
    apiKey: '',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 6000
  };

  if (savedConfig) {
    try {
      config = { ...config, ...JSON.parse(savedConfig) };
    } catch (error) {
      console.error('Failed to parse AI config:', error);
    }
  }

  console.log('Enhanced AI generation request:', {
    fileName: request.fileName,
    selectedTopics: request.selectedTopics,
    stepCount: request.stepCount,
    difficulty: request.difficulty,
    tone: request.tone,
    generateTitle: request.generateTitle,
    generateDescription: request.generateDescription
  });

  if (!config.apiKey) {
    console.warn('No API key configured, using fallback flow');
    return {
      blocks: generateEnhancedFallbackFlow(request),
      error: 'No API key configured'
    };
  }

  try {
    const systemPrompt = buildEnhancedSystemPrompt(request);
    const userPrompt = buildEnhancedUserPrompt(request);

    console.log('Sending enhanced request to OpenAI API...');

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
    const result = parseEnhancedAIResponse(data);
    
    return result;

  } catch (error) {
    console.error('Enhanced AI Flow Generation Error:', error);
    return {
      blocks: generateEnhancedFallbackFlow(request),
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

const buildEnhancedSystemPrompt = (request: EnhancedAIFlowRequest): string => {
  const difficultyGuide = {
    beginner: 'Use simple language, basic concepts, provide extra explanations',
    intermediate: 'Use moderate complexity, assume some background knowledge',
    advanced: 'Use technical language, complex concepts, minimal hand-holding'
  };

  const toneGuide = {
    formal: 'Professional, structured, academic tone',
    conversational: 'Friendly, approachable, casual tone',
    technical: 'Precise, detailed, industry-specific language'
  };

  return `You are an expert training developer creating ${request.difficulty}-level training content in a ${request.tone} tone.

${difficultyGuide[request.difficulty]}
${toneGuide[request.tone]}
${request.includeExamples ? 'Include practical examples and real-world scenarios.' : 'Focus on essential information without extensive examples.'}

IMPORTANT: You must respond with ONLY valid JSON in this exact format:

{
  ${request.generateTitle ? '"title": "Generated training title here",' : ''}
  ${request.generateDescription ? '"description": "Generated training description here",' : ''}
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

Content Mix Guidelines:
- Aim for approximately ${request.contentMix}% information blocks and ${100 - request.contentMix}% question blocks
- Make questions practical and relevant to the content
- Provide helpful hints that explain why answers are correct`;
};

const buildEnhancedUserPrompt = (request: EnhancedAIFlowRequest): string => {
  return `${request.customPrompt ? `Custom Instructions: ${request.customPrompt}\n\n` : ''}

Document: ${request.fileName}
Selected Topics: ${request.selectedTopics.join(', ')}
Required Steps: ${request.stepCount}
Difficulty Level: ${request.difficulty}
Estimated Duration: ${request.estimatedDuration} minutes
Content Mix: ${request.contentMix}% Information / ${100 - request.contentMix}% Questions

Content Summary (first 3000 chars):
${request.documentContent.substring(0, 3000)}

${request.generateTitle ? 'Generate an engaging title for this training.' : ''}
${request.generateDescription ? 'Generate a compelling description that explains what learners will gain.' : ''}

Please create exactly ${request.stepCount} training steps focusing on: ${request.selectedTopics.join(', ')}.
Ensure the content matches the ${request.difficulty} difficulty level and uses a ${request.tone} tone.`;
};

const parseEnhancedAIResponse = (data: any): EnhancedAIFlowResponse => {
  console.log('Enhanced AI response received:', data);

  if (!data.choices || data.choices.length === 0) {
    throw new Error('No response generated from AI');
  }

  const responseContent = data.choices[0].message.content.trim();
  console.log('Raw enhanced AI response content:', responseContent);
  
  try {
    let jsonContent = responseContent;
    
    const jsonStart = responseContent.indexOf('{');
    const jsonEnd = responseContent.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      jsonContent = responseContent.substring(jsonStart, jsonEnd + 1);
    }
    
    console.log('Extracted enhanced JSON content:', jsonContent);
    
    const parsedResponse = JSON.parse(jsonContent);
    
    if (parsedResponse.blocks && Array.isArray(parsedResponse.blocks)) {
      console.log('Successfully parsed enhanced AI response with', parsedResponse.blocks.length, 'blocks');
      return {
        blocks: parsedResponse.blocks,
        title: parsedResponse.title,
        description: parsedResponse.description
      };
    } else {
      console.error('Invalid enhanced response structure - missing blocks array');
      throw new Error('Invalid response structure - missing blocks array');
    }
  } catch (parseError) {
    console.error('Failed to parse enhanced AI response as JSON:', parseError);
    console.error('Response content was:', responseContent);
    throw new Error(`AI response was not valid JSON: ${parseError.message}`);
  }
};

const generateEnhancedFallbackFlow = (request: EnhancedAIFlowRequest): StepBlock[] => {
  const blocks: StepBlock[] = [];
  
  console.log('Generating enhanced fallback flow with topics:', request.selectedTopics);
  
  const infoRatio = request.contentMix / 100;
  const questionRatio = 1 - infoRatio;
  
  for (let i = 0; i < request.stepCount; i++) {
    const shouldBeInfo = (i / request.stepCount) < infoRatio || i === 0;
    const topicIndex = i % request.selectedTopics.length;
    const topic = request.selectedTopics[topicIndex] || 'General Training';
    
    if (!shouldBeInfo && i > 0) {
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
  
  console.log('Generated enhanced fallback flow with', blocks.length, 'blocks');
  return blocks;
};
