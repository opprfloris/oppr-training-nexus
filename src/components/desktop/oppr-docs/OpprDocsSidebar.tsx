
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderTree } from './FolderTree';

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
  onRenameFolder?: (folder: Folder) => void;
  onDeleteFolder?: (folder: Folder) => void;
}

export const OpprDocsSidebar: React.FC<OpprDocsSidebarProps> = ({
  folders,
  currentFolderId,
  onFolderSelect,
  onRenameFolder,
  onDeleteFolder
}) => {
  return (
    <div className="w-64 min-h-0">
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Folders</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <FolderTree
            folders={folders}
            currentFolderId={currentFolderId}
            onFolderSelect={onFolderSelect}
            onRenameFolder={onRenameFolder}
            onDeleteFolder={onDeleteFolder}
            showContextMenu={true}
          />
        </CardContent>
      </Card>
    </div>
  );
};
