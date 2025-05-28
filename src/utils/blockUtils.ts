
import { StepBlock, InformationBlockConfig, GotoBlockConfig, QuestionBlockConfig } from '@/types/training-definitions';

export const getDefaultBlockConfig = (blockType: string): InformationBlockConfig | GotoBlockConfig | QuestionBlockConfig => {
  switch (blockType) {
    case 'information':
      return { content: '' } as InformationBlockConfig;
    case 'goto':
      return { instructions: '' } as GotoBlockConfig;
    case 'question':
      return {
        question_text: '',
        question_type: 'text_input' as const,
        points: 1,
        mandatory: true
      } as QuestionBlockConfig;
    default:
      return { content: '' } as InformationBlockConfig;
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
