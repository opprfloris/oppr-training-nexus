
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FolderTree } from './FolderTree';
import { FolderIcon } from '@heroicons/react/24/outline';

interface Folder {
  id: string;
  name: string;
  parent_folder_id: string | null;
  path: string;
  created_at: string;
  children?: Folder[];
}

interface OpprDocsSidebarProps {
  folders: Folder[];
  currentFolderId: string | null;
  onFolderSelect: (folderId: string | null) => void;
}

export const OpprDocsSidebar: React.FC<OpprDocsSidebarProps> = ({
  folders,
  currentFolderId,
  onFolderSelect
}) => {
  return (
    <div className="w-64 flex-shrink-0">
      <Card className="h-full">
        <CardContent className="p-4">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <FolderIcon className="w-4 h-4" />
            Folders
          </h3>
          <FolderTree
            folders={folders}
            currentFolderId={currentFolderId}
            onFolderSelect={onFolderSelect}
          />
        </CardContent>
      </Card>
    </div>
  );
};
