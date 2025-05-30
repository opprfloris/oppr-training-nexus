
import React, { useState } from 'react';
import { OpprDocsHeader } from '@/components/desktop/oppr-docs/OpprDocsHeader';
import { OpprDocsToolbar } from '@/components/desktop/oppr-docs/OpprDocsToolbar';
import { OpprDocsSidebar } from '@/components/desktop/oppr-docs/OpprDocsSidebar';
import { OpprDocsMainContent } from '@/components/desktop/oppr-docs/OpprDocsMainContent';
import { CreateFolderModal } from '@/components/desktop/oppr-docs/CreateFolderModal';
import { FilePreviewModal } from '@/components/desktop/oppr-docs/FilePreviewModal';
import { DocumentMoveModal } from '@/components/desktop/oppr-docs/DocumentMoveModal';
import { RenameFolderModal } from '@/components/desktop/oppr-docs/RenameFolderModal';
import { useOpprDocsData } from '@/hooks/useOpprDocsData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

const OpprDocs = () => {
  const { folders, documents, loading, fetchFolders, fetchDocuments } = useOpprDocsData();
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [previewFile, setPreviewFile] = useState<Document | null>(null);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [documentsToMove, setDocumentsToMove] = useState<Document[]>([]);
  const [showRenameFolderModal, setShowRenameFolderModal] = useState(false);
  const [folderToRename, setFolderToRename] = useState<Folder | null>(null);
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

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedFiles.length} file(s)?`)) {
      return;
    }

    try {
      // Get the documents to delete
      const docsToDelete = documents.filter(doc => selectedFiles.includes(doc.id));
      
      // Delete from storage
      const filePaths = docsToDelete.map(doc => doc.file_path);
      if (filePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove(filePaths);

        if (storageError) {
          console.error('Storage delete error:', storageError);
        }
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .in('id', selectedFiles);

      if (dbError) throw dbError;

      setSelectedFiles([]);
      fetchDocuments();
      toast({
        title: "Success",
        description: `${selectedFiles.length} file(s) deleted successfully.`,
      });
    } catch (error) {
      console.error('Error deleting files:', error);
      toast({
        title: "Error",
        description: "Failed to delete files. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMoveDocuments = (documents: Document[]) => {
    setDocumentsToMove(documents);
    setShowMoveModal(true);
  };

  const handleMoveComplete = () => {
    fetchDocuments();
    setSelectedFiles([]);
    setShowMoveModal(false);
    setDocumentsToMove([]);
  };

  const handleRenameFolder = (folder: Folder) => {
    setFolderToRename(folder);
    setShowRenameFolderModal(true);
  };

  const handleRenameFolderComplete = () => {
    fetchFolders();
    setShowRenameFolderModal(false);
    setFolderToRename(null);
  };

  const handleDeleteFolder = async (folder: Folder) => {
    if (!confirm(`Are you sure you want to delete the folder "${folder.name}"? This will also delete all documents in this folder.`)) {
      return;
    }

    try {
      // First, delete all documents in the folder
      const folderDocuments = documents.filter(doc => doc.folder_id === folder.id);
      if (folderDocuments.length > 0) {
        const filePaths = folderDocuments.map(doc => doc.file_path);
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove(filePaths);

        if (storageError) {
          console.error('Storage delete error:', storageError);
        }

        const { error: docsError } = await supabase
          .from('documents')
          .delete()
          .eq('folder_id', folder.id);

        if (docsError) throw docsError;
      }

      // Then delete the folder
      const { error: folderError } = await supabase
        .from('document_folders')
        .delete()
        .eq('id', folder.id);

      if (folderError) throw folderError;

      // If we're currently viewing this folder, go to root
      if (currentFolderId === folder.id) {
        setCurrentFolderId(null);
      }

      fetchFolders();
      fetchDocuments();
      toast({
        title: "Success",
        description: "Folder and its contents deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast({
        title: "Error",
        description: "Failed to delete folder. Please try again.",
        variant: "destructive",
      });
    }
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
          onRenameFolder={handleRenameFolder}
          onDeleteFolder={handleDeleteFolder}
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
            onMoveDocuments={handleMoveDocuments}
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

      {showMoveModal && (
        <DocumentMoveModal
          documents={documentsToMove}
          folders={folders}
          onClose={() => setShowMoveModal(false)}
          onSuccess={handleMoveComplete}
        />
      )}

      {showRenameFolderModal && folderToRename && (
        <RenameFolderModal
          folder={folderToRename}
          onClose={() => setShowRenameFolderModal(false)}
          onSuccess={handleRenameFolderComplete}
        />
      )}
    </div>
  );
};

export default OpprDocs;
