
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface MarkerSequenceControlsProps {
  sequenceNumber: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  disabled: boolean;
}

const MarkerSequenceControls: React.FC<MarkerSequenceControlsProps> = ({
  sequenceNumber,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  disabled
}) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-6 h-6 bg-oppr-blue text-white rounded-full flex items-center justify-center text-xs font-bold">
        {sequenceNumber}
      </div>
      <div className="flex flex-col">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMoveUp}
          disabled={disabled || !canMoveUp}
          className="h-5 w-5 p-0"
        >
          <ChevronUpIcon className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onMoveDown}
          disabled={disabled || !canMoveDown}
          className="h-5 w-5 p-0"
        >
          <ChevronDownIcon className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

export default MarkerSequenceControls;
