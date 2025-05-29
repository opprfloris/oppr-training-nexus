
import { StepBlock } from '@/types/training-definitions';

// Type guard to safely convert Json to StepBlock[]
export const isStepBlockArray = (value: any): value is StepBlock[] => {
  return Array.isArray(value) && value.every((item: any) => 
    item && 
    typeof item === 'object' && 
    typeof item.id === 'string' &&
    typeof item.type === 'string' &&
    typeof item.order === 'number' &&
    item.config !== undefined
  );
};

export const safeConvertToStepBlocks = (value: any): StepBlock[] => {
  if (isStepBlockArray(value)) {
    return value;
  }
  return [];
};
