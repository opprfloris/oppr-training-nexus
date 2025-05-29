
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@heroicons/react/24/outline';

interface ContentAssemblyActionsProps {
  onAssignContent: () => void;
}

export const ContentAssemblyActions: React.FC<ContentAssemblyActionsProps> = ({
  onAssignContent
}) => {
  return (
    <div className="flex justify-between items-center">
      <h4 className="font-medium text-gray-900">Training Content by Marker</h4>
      <Button
        onClick={onAssignContent}
        className="bg-[#3a7ca5] hover:bg-[#2f6690]"
      >
        <PlusIcon className="w-4 h-4 mr-2" />
        Assign Content
      </Button>
    </div>
  );
};
