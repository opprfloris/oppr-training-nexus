
import { StepBlock } from '@/types/training-definitions';
import { AIFlowGenerationRequest } from './aiFlowTypes';

export const generateFallbackFlow = (request: AIFlowGenerationRequest): StepBlock[] => {
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
