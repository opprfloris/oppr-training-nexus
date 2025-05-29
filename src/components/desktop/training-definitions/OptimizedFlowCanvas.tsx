
import React, { memo, useMemo } from 'react';
import { StepBlock } from '@/types/training-definitions';
import FlowCanvas from './FlowCanvas';

interface OptimizedFlowCanvasProps {
  steps: StepBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
  onDeleteBlock: (blockId: string) => void;
  onReorderBlocks: (startIndex: number, endIndex: number) => void;
}

const OptimizedFlowCanvas: React.FC<OptimizedFlowCanvasProps> = memo(({
  steps,
  selectedBlockId,
  onSelectBlock,
  onDeleteBlock,
  onReorderBlocks
}) => {
  // Memoize the steps to prevent unnecessary re-renders
  const memoizedSteps = useMemo(() => steps, [steps]);

  // Calculate performance metrics
  const performanceInfo = useMemo(() => {
    const stepCount = steps.length;
    const isLargeFlow = stepCount > 20;
    const complexityScore = steps.reduce((score, step) => {
      if (step.type === 'question' && (step.config as any).options?.length > 5) {
        return score + 2;
      }
      return score + 1;
    }, 0);

    return {
      stepCount,
      isLargeFlow,
      complexityScore,
      performance: complexityScore > 50 ? 'high' : complexityScore > 20 ? 'medium' : 'low'
    };
  }, [steps]);

  console.log('FlowCanvas Performance Info:', performanceInfo);

  return (
    <div className="relative">
      {performanceInfo.isLargeFlow && (
        <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
          Large flow detected ({performanceInfo.stepCount} steps). Consider breaking into smaller sections.
        </div>
      )}
      
      <FlowCanvas
        steps={memoizedSteps}
        selectedBlockId={selectedBlockId}
        onSelectBlock={onSelectBlock}
        onDeleteBlock={onDeleteBlock}
        onReorderBlocks={onReorderBlocks}
      />
      
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-500">
          Performance: {performanceInfo.performance} | Steps: {performanceInfo.stepCount} | Complexity: {performanceInfo.complexityScore}
        </div>
      )}
    </div>
  );
});

OptimizedFlowCanvas.displayName = 'OptimizedFlowCanvas';

export default OptimizedFlowCanvas;
