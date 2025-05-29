import { useState } from 'react';
import { StepBlock } from '@/types/training-definitions';
import { createNewBlock } from '@/utils/blockUtils';

export const useStepManagement = (initialSteps: StepBlock[] = []) => {
  const [steps, setSteps] = useState<StepBlock[]>(initialSteps);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const addStep = (blockType: 'information' | 'goto' | 'question'): 'config' | 'validation' | null => {
    const newOrder = steps.length;
    const newBlock = createNewBlock(blockType, newOrder);
    setSteps([...steps, newBlock]);
    setSelectedBlockId(newBlock.id);
    
    // On mobile, switch to config panel when adding a block
    if (window.innerWidth < 1024) {
      return 'config';
    }
    return null;
  };

  const updateStep = (stepId: string, updatedConfig: any) => {
    setSteps(steps.map(step => 
      step.id === stepId 
        ? { ...step, config: updatedConfig }
        : step
    ));
  };

  const deleteStep = (stepId: string) => {
    const filteredSteps = steps.filter(step => step.id !== stepId);
    const reorderedSteps = filteredSteps.map((step, index) => ({
      ...step,
      order: index
    }));
    setSteps(reorderedSteps);
    
    if (selectedBlockId === stepId) {
      setSelectedBlockId(null);
    }
  };

  const reorderSteps = (startIndex: number, endIndex: number) => {
    const newSteps = [...steps];
    const [movedStep] = newSteps.splice(startIndex, 1);
    newSteps.splice(endIndex, 0, movedStep);
    
    newSteps.forEach((step, index) => {
      step.order = index;
    });

    setSteps(newSteps);
  };

  const applyAIFlow = (blocks: StepBlock[]) => {
    setSteps(blocks);
    if (blocks.length > 0) {
      setSelectedBlockId(blocks[0].id);
    }
  };

  const selectedBlock = selectedBlockId ? steps.find(step => step.id === selectedBlockId) : null;

  return {
    steps,
    setSteps,
    selectedBlockId,
    setSelectedBlockId,
    selectedBlock,
    addStep,
    updateStep,
    deleteStep,
    reorderSteps,
    applyAIFlow
  };
};
