
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileTableView } from './FileTableView';
import { FileCardView } from './FileCardView';
import { FileUploader } from './FileUploader';
import { BulkActionsToolbar } from './BulkActionsToolbar';
import { DocumentIcon } from '@heroicons/react/24/outline';

interface Document {
  id: string;
  folder_id: string | null;
  original_name: string;
  display_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  mime_type: string;
  created_at: string;
  tags: string[];
}

interface Folder {
  id: string;
  name: string;
  parent_folder_id: string | null;
  path: string;
  created_at: string;
  children?: Folder[];
}

interface OpprDocsMainContentProps {
  currentFolderId: string | null;
  currentFolder: Folder | undefined;
  documents: Document[];
  selectedFiles: string[];
  viewMode: 'table' | 'card';
  onFileSelect: (fileId: string) => void;
  onFilePreview: (file: Document) => void;
  onUploadComplete: () => void;
  onClearSelection: () => void;
  onBulkDelete: () => void;
}

export const OpprDocsMainContent: React.FC<OpprDocsMainContentProps> = ({
  currentFolderId,
  currentFolder,
  documents,
  selectedFiles,
  viewMode,
  onFileSelect,
  onFilePreview,
  onUploadComplete,
  onClearSelection,
  onBulkDelete
}) => {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Bulk Actions */}
      {selectedFiles.length > 0 && (
        <BulkActionsToolbar
          selectedCount={selectedFiles.length}
          onClearSelection={onClearSelection}
          onBulkDelete={onBulkDelete}
        />
      )}

      {/* Upload Area */}
      <div className="mb-4">
        <FileUploader
          currentFolderId={currentFolderId}
          onUploadComplete={onUploadComplete}
        />
      </div>

      {/* File Display */}
      <div className="flex-1 overflow-hidden">
        <Card className="h-full">
          <CardContent className="p-4 h-full">
            {documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <DocumentIcon className="w-12 h-12 mb-4" />
                <h3 className="text-lg font-medium mb-2">No documents found</h3>
                <p className="text-sm">
                  {currentFolder 
                    ? `Upload documents to the "${currentFolder.name}" folder`
                    : 'Upload documents or select a folder to get started'
                  }
                </p>
              </div>
            ) : viewMode === 'table' ? (
              <FileTableView
                documents={documents}
                selectedFiles={selectedFiles}
                onFileSelect={onFileSelect}
                onFilePreview={onFilePreview}
              />
            ) : (
              <FileCardView
                documents={documents}
                selectedFiles={selectedFiles}
                onFileSelect={onFileSelect}
                onFilePreview={onFilePreview}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
