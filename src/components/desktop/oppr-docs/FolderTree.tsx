
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FolderContextMenu } from './FolderContextMenu';
import { 
  FolderIcon, 
  FolderOpenIcon,
  ChevronRightIcon,
  ChevronDownIcon 
} from '@heroicons/react/24/outline';

interface Folder {
  id: string;
  name: string;
  parent_folder_id: string | null;
  children?: Folder[];
}

interface FolderTreeProps {
  folders: Folder[];
  currentFolderId: string | null;
  onFolderSelect: (folderId: string | null) => void;
  onRenameFolder?: (folder: Folder) => void;
  onDeleteFolder?: (folder: Folder) => void;
  showContextMenu?: boolean;
}

export const FolderTree: React.FC<FolderTreeProps> = ({ 
  folders, 
  currentFolderId, 
  onFolderSelect,
  onRenameFolder,
  onDeleteFolder,
  showContextMenu = false
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleExpanded = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const FolderItem: React.FC<{ folder: Folder; level: number }> = ({ folder, level }) => {
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = currentFolderId === folder.id;
    const hasChildren = folder.children && folder.children.length > 0;

    return (
      <div>
        <div 
          className={`flex items-center py-1 px-2 rounded cursor-pointer hover:bg-gray-100 group ${
            isSelected ? 'bg-blue-50 text-blue-700' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-4 w-4 mr-1"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(folder.id);
              }}
            >
              {isExpanded ? (
                <ChevronDownIcon className="w-3 h-3" />
              ) : (
                <ChevronRightIcon className="w-3 h-3" />
              )}
            </Button>
          ) : (
            <div className="w-4 mr-1" />
          )}
          
          <div 
            className="flex items-center flex-1"
            onClick={() => onFolderSelect(folder.id)}
          >
            {isSelected && hasChildren ? (
              <FolderOpenIcon className="w-4 h-4 mr-2" />
            ) : (
              <FolderIcon className="w-4 h-4 mr-2" />
            )}
            <span className="text-sm truncate flex-1">{folder.name}</span>
          </div>

          {showContextMenu && onRenameFolder && onDeleteFolder && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <FolderContextMenu
                folder={folder}
                onRename={onRenameFolder}
                onDelete={onDeleteFolder}
              />
            </div>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div>
            {folder.children!.map(child => (
              <FolderItem key={child.id} folder={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {/* Root folder */}
      <div 
        className={`flex items-center py-1 px-2 rounded cursor-pointer hover:bg-gray-100 ${
          currentFolderId === null ? 'bg-blue-50 text-blue-700' : ''
        }`}
        onClick={() => onFolderSelect(null)}
      >
        <FolderIcon className="w-4 h-4 mr-2" />
        <span className="text-sm font-medium">All Documents</span>
      </div>

      {/* Folder tree */}
      {folders.map(folder => (
        <FolderItem key={folder.id} folder={folder} level={0} />
      ))}
    </div>
  );
};
