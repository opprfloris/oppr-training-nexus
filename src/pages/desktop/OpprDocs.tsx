
import React, { useState } from 'react';
import { OpprDocsHeader } from '@/components/desktop/oppr-docs/OpprDocsHeader';
import { OpprDocsToolbar } from '@/components/desktop/oppr-docs/OpprDocsToolbar';
import { OpprDocsSidebar } from '@/components/desktop/oppr-docs/OpprDocsSidebar';
import { OpprDocsMainContent } from '@/components/desktop/oppr-docs/OpprDocsMainContent';
import { CreateFolderModal } from '@/components/desktop/oppr-docs/CreateFolderModal';
import { FilePreviewModal } from '@/components/desktop/oppr-docs/FilePreviewModal';
import { useOpprDocsData } from '@/hooks/useOpprDocsData';
import { useToast } from '@/hooks/use-toast';

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

const OpprDocs = () => {
  const { folders, documents, loading, fetchFolders, fetchDocuments } = useOpprDocsData();
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [previewFile, setPreviewFile] = useState<Document | null>(null);
  const { toast } = useToast();

  const getCurrentFolderDocuments = () => {
    return documents.filter(doc => 
      doc.folder_id === currentFolderId &&
      doc.display_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleFolderSelect = (folderId: string | null) => {
    setCurrentFolderId(folderId);
    setSelectedFiles([]);
  };

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleFilePreview = (file: Document) => {
    setPreviewFile(file);
    setShowFilePreview(true);
  };

  const handleUploadComplete = () => {
    fetchDocuments();
    toast({
      title: "Success",
      description: "Files uploaded successfully.",
    });
  };

  const handleFolderCreated = () => {
    fetchFolders();
    setShowCreateFolder(false);
    toast({
      title: "Success",
      description: "Folder created successfully.",
    });
  };

  const handleBulkDelete = () => {
    // Handle bulk delete
    setSelectedFiles([]);
  };

  const currentFolder = folders.find(f => f.id === currentFolderId);
  const currentDocuments = getCurrentFolderDocuments();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-oppr-blue"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <OpprDocsHeader onCreateFolder={() => setShowCreateFolder(true)} />

      <div className="flex-1 flex gap-6 min-h-0">
        <OpprDocsSidebar
          folders={folders}
          currentFolderId={currentFolderId}
          onFolderSelect={handleFolderSelect}
        />

        <div className="flex-1 flex flex-col min-h-0">
          <OpprDocsToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          <OpprDocsMainContent
            currentFolderId={currentFolderId}
            currentFolder={currentFolder}
            documents={currentDocuments}
            selectedFiles={selectedFiles}
            viewMode={viewMode}
            onFileSelect={handleFileSelect}
            onFilePreview={handleFilePreview}
            onUploadComplete={handleUploadComplete}
            onClearSelection={() => setSelectedFiles([])}
            onBulkDelete={handleBulkDelete}
          />
        </div>
      </div>

      {/* Modals */}
      {showCreateFolder && (
        <CreateFolderModal
          parentFolderId={currentFolderId}
          onClose={() => setShowCreateFolder(false)}
          onSuccess={handleFolderCreated}
        />
      )}

      {showFilePreview && previewFile && (
        <FilePreviewModal
          file={previewFile}
          onClose={() => setShowFilePreview(false)}
        />
      )}
    </div>
  );
};

export default OpprDocs;
