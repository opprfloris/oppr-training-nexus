
import React from 'react';
import { FileUploader } from './FileUploader';
import { FileTableView } from './FileTableView';
import { FileCardView } from './FileCardView';
import { BulkActionsToolbar } from './BulkActionsToolbar';
import { Button } from '@/components/ui/button';
import { FolderIcon, Move } from 'lucide-react';

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
  currentFolder?: Folder;
  documents: Document[];
  selectedFiles: string[];
  viewMode: 'table' | 'card';
  onFileSelect: (fileId: string) => void;
  onFilePreview: (file: Document) => void;
  onUploadComplete: () => void;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onMoveDocuments?: (documents: Document[]) => void;
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
  onBulkDelete,
  onMoveDocuments
}) => {
  const handleFileUpdated = () => {
    onUploadComplete(); // Reuse the same callback to refresh the documents
  };

  const selectedDocuments = documents.filter(doc => selectedFiles.includes(doc.id));

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Current folder breadcrumb */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <FolderIcon className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600">
            {currentFolder ? currentFolder.path : 'Root'}
          </span>
        </div>
      </div>

      {/* Bulk actions toolbar */}
      {selectedFiles.length > 0 && (
        <div className="p-4 border-b bg-blue-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedFiles.length} file(s) selected
            </span>
            <div className="flex items-center gap-2">
              {onMoveDocuments && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onMoveDocuments(selectedDocuments)}
                >
                  <Move className="w-4 h-4 mr-2" />
                  Move
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={onClearSelection}
              >
                Clear Selection
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={onBulkDelete}
              >
                Delete Selected
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* File uploader */}
      <div className="p-4 border-b">
        <FileUploader
          currentFolderId={currentFolderId}
          onUploadComplete={onUploadComplete}
        />
      </div>

      {/* Files display */}
      <div className="flex-1 p-4 overflow-hidden">
        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <FolderIcon className="w-16 h-16 mb-4" />
            <h3 className="text-lg font-medium mb-2">No files found</h3>
            <p className="text-sm">Upload some files to get started</p>
          </div>
        ) : (
          <>
            {viewMode === 'table' ? (
              <FileTableView
                documents={documents}
                selectedFiles={selectedFiles}
                onFileSelect={onFileSelect}
                onFilePreview={onFilePreview}
                onFileUpdated={handleFileUpdated}
              />
            ) : (
              <FileCardView
                documents={documents}
                selectedFiles={selectedFiles}
                onFileSelect={onFileSelect}
                onFilePreview={onFilePreview}
                onFileUpdated={handleFileUpdated}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
