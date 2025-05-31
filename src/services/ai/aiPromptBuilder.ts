
import { AIFlowGenerationRequest } from './aiFlowTypes';

export const buildSystemPrompt = (): string => {
  return `You are an expert training developer. Create engaging training flows based on the provided content and requirements.

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
};

export const buildUserPrompt = (request: AIFlowGenerationRequest, generationPrompt: string): string => {
  return `${generationPrompt}

Document: ${request.fileName}
Selected Topics: ${request.selectedTopics.join(', ')}
Required Steps: ${request.stepCount}

Content Summary (first 2000 chars):
${request.content.substring(0, 2000)}

${request.analysisResult ? `Analysis: ${request.analysisResult}` : ''}

Please create exactly ${request.stepCount} training steps focusing on: ${request.selectedTopics.join(', ')}.
Ensure the content is practical and engaging for learners.`;
};
