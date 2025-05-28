
import React from 'react';
import { TrashIcon } from "@heroicons/react/24/outline";
import { Button } from '@/components/ui/button';
import { StepBlock } from '@/types/training-definitions';

interface FlowCanvasProps {
  steps: StepBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
  onDeleteBlock: (blockId: string) => void;
  onReorderBlocks: (startIndex: number, endIndex: number) => void;
}

const FlowCanvas: React.FC<FlowCanvasProps> = ({
  steps,
  selectedBlockId,
  onSelectBlock,
  onDeleteBlock,
  onReorderBlocks
}) => {
  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'information':
        return '📄';
      case 'goto':
        return '📍';
      case 'question':
        return '❓';
      default:
        return '📋';
    }
  };

  const getBlockTitle = (block: StepBlock) => {
    switch (block.type) {
      case 'information':
        return (block.config as any).content?.substring(0, 50) || 'Information Block';
      case 'goto':
        return (block.config as any).instructions?.substring(0, 50) || 'Go To Block';
      case 'question':
        return (block.config as any).question_text?.substring(0, 50) || 'Question Block';
      default:
        return 'Block';
    }
  };

  if (steps.length === 0) {
    return (
      <div className="oppr-card h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">🧩</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Blocks Yet</h3>
          <p className="text-gray-600">Drag blocks from the palette to start building your training</p>
        </div>
      </div>
    );
  }

  return (
    <div className="oppr-card p-6 h-full overflow-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Flow Canvas</h3>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                selectedBlockId === step.id
                  ? 'border-oppr-blue bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onSelectBlock(step.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{getBlockIcon(step.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-600">
                        Step {index + 1}
                      </span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
                        {step.type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-sm text-gray-900">
                      {getBlockTitle(step)}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteBlock(step.id);
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Connection line to next block */}
            {index < steps.length - 1 && (
              <div className="flex justify-center py-2">
                <div className="w-px h-4 bg-gray-300"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlowCanvas;
