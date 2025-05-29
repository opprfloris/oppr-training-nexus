
import React from 'react';
import { Button } from '@/components/ui/button';
import { FolderIcon } from '@heroicons/react/24/outline';

interface OpprDocsHeaderProps {
  onCreateFolder: () => void;
}

export const OpprDocsHeader: React.FC<OpprDocsHeaderProps> = ({ onCreateFolder }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Oppr Docs</h1>
        <p className="text-gray-600">Manage your documents and files</p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          onClick={onCreateFolder}
          variant="outline"
          size="sm"
        >
          <FolderIcon className="w-4 h-4 mr-2" />
          New Folder
        </Button>
      </div>
    </div>
  );
};
