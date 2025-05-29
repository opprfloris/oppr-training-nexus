
import React from 'react';
import BlockPalette from './BlockPalette';
import FlowCanvas from './FlowCanvas';
import BlockConfiguration from './BlockConfiguration';
import { StepBlock } from '@/types/training-definitions';

interface BuilderLayoutProps {
  // Mobile state
  mobileActivePanel: 'palette' | 'canvas' | 'config';
  setMobileActivePanel: (panel: 'palette' | 'canvas' | 'config') => void;
  
  // Data
  steps: StepBlock[];
  selectedBlock: StepBlock | null;
  selectedBlockId: string | null;
  
  // Actions
  onAddBlock: (blockType: 'information' | 'goto' | 'question') => void;
  onSelectBlock: (blockId: string) => void;
  onDeleteBlock: (blockId: string) => void;
  onReorderBlocks: (startIndex: number, endIndex: number) => void;
  onUpdateConfig: (stepId: string, updatedConfig: any) => void;
  onApplyAIFlow: (blocks: StepBlock[]) => void;
}

const BuilderLayout: React.FC<BuilderLayoutProps> = ({
  mobileActivePanel,
  setMobileActivePanel,
  steps,
  selectedBlock,
  selectedBlockId,
  onAddBlock,
  onSelectBlock,
  onDeleteBlock,
  onReorderBlocks,
  onUpdateConfig,
  onApplyAIFlow
}) => {
  const handleSelectBlock = (blockId: string) => {
    onSelectBlock(blockId);
    if (blockId && window.innerWidth < 1024) {
      setMobileActivePanel('config');
    }
  };

  return (
    <div className="flex-1 overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6 h-full p-6">
        {/* Left Panel - Block Palette */}
        <div className="col-span-3">
          <BlockPalette 
            onAddBlock={onAddBlock}
            onApplyAIFlow={onApplyAIFlow}
          />
        </div>

        {/* Center Panel - Flow Canvas */}
        <div className="col-span-5">
          <FlowCanvas
            steps={steps}
            selectedBlockId={selectedBlockId}
            onSelectBlock={onSelectBlock}
            onDeleteBlock={onDeleteBlock}
            onReorderBlocks={onReorderBlocks}
          />
        </div>

        {/* Right Panel - Block Configuration */}
        <div className="col-span-4">
          <BlockConfiguration
            block={selectedBlock}
            onUpdateConfig={onUpdateConfig}
          />
        </div>
      </div>

      {/* Mobile Layout - Single Panel */}
      <div className="lg:hidden h-full p-4">
        {mobileActivePanel === 'palette' && (
          <div className="h-full">
            <BlockPalette 
              onAddBlock={onAddBlock}
              onApplyAIFlow={onApplyAIFlow}
            />
          </div>
        )}

        {mobileActivePanel === 'canvas' && (
          <div className="h-full">
            <FlowCanvas
              steps={steps}
              selectedBlockId={selectedBlockId}
              onSelectBlock={handleSelectBlock}
              onDeleteBlock={onDeleteBlock}
              onReorderBlocks={onReorderBlocks}
            />
          </div>
        )}

        {mobileActivePanel === 'config' && (
          <div className="h-full">
            <BlockConfiguration
              block={selectedBlock}
              onUpdateConfig={onUpdateConfig}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BuilderLayout;
