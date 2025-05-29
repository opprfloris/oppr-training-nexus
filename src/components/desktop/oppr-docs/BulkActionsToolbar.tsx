
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  TrashIcon,
  ArrowDownTrayIcon,
  TagIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

interface BulkActionsToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDelete: () => void;
}

export const BulkActionsToolbar: React.FC<BulkActionsToolbarProps> = ({
  selectedCount,
  onClearSelection,
  onBulkDelete
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-blue-900">
          {selectedCount} file{selectedCount !== 1 ? 's' : ''} selected
        </span>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            Download
          </Button>
          
          <Button variant="outline" size="sm">
            <TagIcon className="w-4 h-4 mr-2" />
            Add Tags
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={onBulkDelete}
            className="text-red-600 hover:text-red-700"
          >
            <TrashIcon className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearSelection}
      >
        <XMarkIcon className="w-4 h-4" />
      </Button>
    </div>
  );
};
