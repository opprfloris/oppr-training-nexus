
import React from 'react';
import { 
  InformationCircleIcon, 
  MapPinIcon, 
  QuestionMarkCircleIcon 
} from "@heroicons/react/24/outline";
import { Button } from '@/components/ui/button';
import AITrainingFlowModal from './AITrainingFlowModal';
import { StepBlock } from '@/types/training-definitions';

interface BlockPaletteProps {
  onAddBlock: (blockType: 'information' | 'goto' | 'question') => void;
  onApplyAIFlow: (blocks: StepBlock[]) => void;
}

const BlockPalette: React.FC<BlockPaletteProps> = ({ onAddBlock, onApplyAIFlow }) => {
  const blocks = [
    {
      type: 'information' as const,
      icon: InformationCircleIcon,
      label: 'Information Block',
      description: 'Display text and images'
    },
    {
      type: 'goto' as const,
      icon: MapPinIcon,
      label: 'Go To Block',
      description: 'Navigation instructions'
    },
    {
      type: 'question' as const,
      icon: QuestionMarkCircleIcon,
      label: 'Question Block',
      description: 'Interactive questions'
    }
  ];

  return (
    <div className="oppr-card p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Block Palette</h3>
      <div className="space-y-3">
        {/* AI Training Flow Generator Button */}
        <AITrainingFlowModal onApplyFlow={onApplyAIFlow} />
        
        {/* Separator */}
        <div className="border-t border-gray-200 my-4"></div>
        
        {/* Regular Block Buttons */}
        {blocks.map((block) => {
          const Icon = block.icon;
          return (
            <Button
              key={block.type}
              variant="outline"
              onClick={() => onAddBlock(block.type)}
              className="w-full justify-start h-auto p-4 text-left"
            >
              <div className="flex items-start space-x-3">
                <Icon className="w-5 h-5 mt-0.5 text-oppr-blue" />
                <div>
                  <div className="font-medium text-gray-900">{block.label}</div>
                  <div className="text-sm text-gray-600">{block.description}</div>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default BlockPalette;
