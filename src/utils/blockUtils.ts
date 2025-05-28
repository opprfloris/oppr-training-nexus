
import { StepBlock } from '@/types/training-definitions';

export const getDefaultBlockConfig = (blockType: string) => {
  switch (blockType) {
    case 'information':
      return { content: '' };
    case 'goto':
      return { instructions: '' };
    case 'question':
      return {
        question_text: '',
        question_type: 'text_input' as const,
        points: 1,
        mandatory: true
      };
    default:
      return {};
  }
};

export const createNewBlock = (blockType: 'information' | 'goto' | 'question', order: number): StepBlock => {
  return {
    id: `block_${Date.now()}`,
    type: blockType,
    order,
    config: getDefaultBlockConfig(blockType)
  };
};
