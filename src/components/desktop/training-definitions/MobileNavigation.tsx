
import React from 'react';
import { Button } from '@/components/ui/button';
import { StepBlock } from '@/types/training-definitions';

interface MobileNavigationProps {
  mobileActivePanel: 'palette' | 'canvas' | 'config' | 'validation';
  setMobileActivePanel: (panel: 'palette' | 'canvas' | 'config' | 'validation') => void;
  steps: StepBlock[];
  selectedBlock: StepBlock | null;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  mobileActivePanel,
  setMobileActivePanel,
  steps,
  selectedBlock
}) => {
  return (
    <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex space-x-1">
        <Button
          variant={mobileActivePanel === 'palette' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMobileActivePanel('palette')}
          className="flex-1"
        >
          Blocks
        </Button>
        <Button
          variant={mobileActivePanel === 'canvas' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMobileActivePanel('canvas')}
          className="flex-1"
        >
          Flow ({steps.length})
        </Button>
        <Button
          variant={mobileActivePanel === 'config' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMobileActivePanel('config')}
          className="flex-1"
          disabled={!selectedBlock}
        >
          Config
        </Button>
        <Button
          variant={mobileActivePanel === 'validation' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMobileActivePanel('validation')}
          className="flex-1"
        >
          Valid
        </Button>
      </div>
    </div>
  );
};

export default MobileNavigation;
