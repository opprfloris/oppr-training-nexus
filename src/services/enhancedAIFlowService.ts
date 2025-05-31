
import { StepBlock } from '@/types/training-definitions';

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

interface EnhancedAIFlowResponse {
  blocks: StepBlock[];
  title?: string;
  description?: string;
  error?: string;
}

export const generateEnhancedTrainingFlow = async (config: WizardConfig): Promise<EnhancedAIFlowResponse> => {
  // Get AI configuration from localStorage
  const savedConfig = localStorage.getItem('ai-settings');
  let aiConfig = {
    apiKey: '',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 4000
  };

  if (savedConfig) {
    try {
      aiConfig = { ...aiConfig, ...JSON.parse(savedConfig) };
    } catch (error) {
      console.error('Failed to parse AI config:', error);
    }
  }

  console.log('Enhanced AI generation request:', {
    fileName: config.fileName,
    selectedTopics: config.selectedTopics,
    stepCount: config.stepCount,
    difficulty: config.difficulty,
    tone: config.tone,
    generateTitle: config.generateTitle,
    generateDescription: config.generateDescription
  });

  if (!aiConfig.apiKey) {
    console.warn('No API key configured, using fallback flow');
    return {
      blocks: generateEnhancedFallbackFlow(config),
      title: config.generateTitle ? `Training: ${config.selectedTopics.join(', ')}` : undefined,
      description: config.generateDescription ? `Comprehensive training covering ${config.selectedTopics.join(', ')} with ${config.difficulty} difficulty level.` : undefined,
      error: 'No API key configured'
    };
  }

  try {
    // Generate title and description if requested
    let generatedTitle = undefined;
    let generatedDescription = undefined;

    if (config.generateTitle || config.generateDescription) {
      const metadataResult = await generateTrainingMetadata(config, aiConfig);
      generatedTitle = config.generateTitle ? metadataResult.title : undefined;
      generatedDescription = config.generateDescription ? metadataResult.description : undefined;
    }

    // Generate the training flow
    const flowResult = await generateTrainingBlocks(config, aiConfig);

    return {
      blocks: flowResult.blocks,
      title: generatedTitle,
      description: generatedDescription,
      error: flowResult.error
    };

  } catch (error) {
    console.error('Enhanced AI Flow Generation Error:', error);
    return {
      blocks: generateEnhancedFallbackFlow(config),
      title: config.generateTitle ? `Training: ${config.selectedTopics.join(', ')}` : undefined,
      description: config.generateDescription ? `Comprehensive training covering ${config.selectedTopics.join(', ')} with ${config.difficulty} difficulty level.` : undefined,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

const generateTrainingMetadata = async (config: WizardConfig, aiConfig: any) => {
  const systemPrompt = `You are a training content specialist. Generate professional training titles and descriptions.

IMPORTANT: Respond with ONLY valid JSON in this format:
{
  "title": "Training Title Here",
  "description": "Training description here"
}`;

  const userPrompt = `Create a professional training title and description based on:

Document: ${config.fileName}
Topics: ${config.selectedTopics.join(', ')}
Difficulty: ${config.difficulty}
Duration: ~${config.estimatedDuration} minutes
Tone: ${config.tone}

Requirements:
- Title should be concise and engaging (max 60 characters)
- Description should be 1-2 sentences explaining what learners will achieve
- Match the ${config.tone} tone
- Appropriate for ${config.difficulty} level learners`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${aiConfig.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: aiConfig.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.5,
      max_tokens: 200,
    }),
  });

  if (!response.ok) {
    throw new Error(`Metadata generation failed: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content.trim();
  
  try {
    return JSON.parse(content);
  } catch {
    return {
      title: `${config.difficulty.charAt(0).toUpperCase() + config.difficulty.slice(1)} Training: ${config.selectedTopics[0] || 'Professional Development'}`,
      description: `Learn essential skills in ${config.selectedTopics.join(', ')} through this ${config.difficulty}-level training program.`
    };
  }
};

const generateTrainingBlocks = async (config: WizardConfig, aiConfig: any) => {
  const toneInstructions = {
    formal: 'Use professional, formal language appropriate for corporate training',
    conversational: 'Use friendly, approachable language that engages learners',
    technical: 'Use precise technical language with detailed explanations'
  };

  const difficultyInstructions = {
    beginner: 'Focus on fundamentals, use simple explanations, include more information blocks',
    intermediate: 'Balance theory and practice, assume some background knowledge',
    advanced: 'Cover complex concepts, focus on practical application and edge cases'
  };

  const systemPrompt = `You are an expert training developer. Create engaging, effective training flows.

IMPORTANT: Respond with ONLY valid JSON in this format:
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

Style Guidelines:
${toneInstructions[config.tone]}
${difficultyInstructions[config.difficulty]}

Content Mix: ${config.contentMix}% information blocks, ${100 - config.contentMix}% question blocks
Target Duration: ${config.estimatedDuration} minutes

Block Types:
- "information": Teaching content, explanations, examples
- "question": Assessments with multiple_choice, true_false, or text_input types`;

  const basePrompt = `Create a ${config.stepCount}-step training flow covering: ${config.selectedTopics.join(', ')}

Document Source: ${config.fileName}
Difficulty: ${config.difficulty}
Tone: ${config.tone}

Content Summary (first 1500 chars):
${config.documentContent.substring(0, 1500)}`;

  const customInstructions = config.customPrompt.trim() 
    ? `\n\nAdditional Instructions:\n${config.customPrompt}`
    : '';

  const exampleInstructions = config.includeExamples 
    ? '\n\nInclude practical examples and real-world scenarios where appropriate.'
    : '';

  const userPrompt = basePrompt + customInstructions + exampleInstructions;

  console.log('Sending enhanced request to OpenAI API...');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${aiConfig.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: aiConfig.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: aiConfig.temperature,
      max_tokens: aiConfig.maxTokens,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const responseContent = data.choices[0].message.content.trim();
  
  try {
    const jsonStart = responseContent.indexOf('{');
    const jsonEnd = responseContent.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      const jsonContent = responseContent.substring(jsonStart, jsonEnd + 1);
      const parsedResponse = JSON.parse(jsonContent);
      
      if (parsedResponse.blocks && Array.isArray(parsedResponse.blocks)) {
        return { blocks: parsedResponse.blocks };
      }
    }
    
    throw new Error('Invalid response structure');
  } catch (parseError) {
    console.error('Failed to parse AI response:', parseError);
    throw new Error(`AI response was not valid JSON: ${parseError.message}`);
  }
};

const generateEnhancedFallbackFlow = (config: WizardConfig): StepBlock[] => {
  const blocks: StepBlock[] = [];
  const infoRatio = config.contentMix / 100;
  const questionRatio = 1 - infoRatio;
  
  const infoCount = Math.ceil(config.stepCount * infoRatio);
  const questionCount = config.stepCount - infoCount;
  
  console.log(`Generating enhanced fallback flow: ${infoCount} info blocks, ${questionCount} question blocks`);
  
  let blockIndex = 0;
  
  // Create alternating pattern starting with info
  for (let i = 0; i < config.stepCount; i++) {
    const shouldBeInfo = i < infoCount && (i % 2 === 0 || questionCount === 0);
    const topicIndex = i % config.selectedTopics.length;
    const topic = config.selectedTopics[topicIndex] || 'General Training';
    
    if (shouldBeInfo) {
      blocks.push({
        id: `info-${blockIndex + 1}`,
        type: 'information',
        order: blockIndex,
        config: {
          content: `## ${topic}\n\nThis section covers essential concepts related to ${topic.toLowerCase()}. Understanding these fundamentals is crucial for safe and effective operation.\n\nKey points to remember:\n- Follow established procedures\n- Prioritize safety at all times\n- Apply best practices consistently\n- Seek clarification when uncertain`
        }
      });
    } else {
      const difficultyOptions = {
        beginner: {
          options: ['Always follow safety protocols', 'Speed over safety', 'Skip documentation', 'Ignore training requirements'],
          correct: 0
        },
        intermediate: {
          options: ['Systematic approach with verification', 'Quick completion without checks', 'Partial compliance with standards', 'Minimal documentation'],
          correct: 0
        },
        advanced: {
          options: ['Comprehensive risk assessment and mitigation', 'Expedited process with reduced oversight', 'Standard approach without customization', 'Simplified methodology'],
          correct: 0
        }
      };
      
      const questionData = difficultyOptions[config.difficulty];
      
      blocks.push({
        id: `question-${blockIndex + 1}`,
        type: 'question',
        order: blockIndex,
        config: {
          question_text: `What is the most appropriate approach when working with ${topic.toLowerCase()}?`,
          question_type: 'multiple_choice',
          options: questionData.options,
          correct_option: questionData.correct,
          hint: `The correct approach prioritizes safety, proper procedures, and best practices for ${topic.toLowerCase()}.`,
          points: 10,
          mandatory: true
        }
      });
    }
    
    blockIndex++;
  }
  
  return blocks;
};
