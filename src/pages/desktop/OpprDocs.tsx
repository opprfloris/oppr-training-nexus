
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FolderTree } from '@/components/desktop/oppr-docs/FolderTree';
import { FileUploader } from '@/components/desktop/oppr-docs/FileUploader';
import { FileTableView } from '@/components/desktop/oppr-docs/FileTableView';
import { FileCardView } from '@/components/desktop/oppr-docs/FileCardView';
import { CreateFolderModal } from '@/components/desktop/oppr-docs/CreateFolderModal';
import { FilePreviewModal } from '@/components/desktop/oppr-docs/FilePreviewModal';
import { BulkActionsToolbar } from '@/components/desktop/oppr-docs/BulkActionsToolbar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  FolderIcon, 
  DocumentIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  Squares2X2Icon,
  TableCellsIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface Folder {
  id: string;
  name: string;
  parent_folder_id: string | null;
  path: string;
  created_at: string;
  children?: Folder[];
}

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
  const [folders, setFolders] = useState<Folder[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [previewFile, setPreviewFile] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFolders();
    fetchDocuments();
  }, []);

  const fetchFolders = async () => {
    try {
      const { data, error } = await supabase
        .from('document_folders')
        .select('*')
        .order('name');

      if (error) throw error;
      
      // Build tree structure
      const foldersWithChildren = buildFolderTree(data || []);
      setFolders(foldersWithChildren);
    } catch (error) {
      console.error('Error fetching folders:', error);
      toast({
        title: "Error",
        description: "Failed to load folders. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('display_name');

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to load documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const buildFolderTree = (folders: any[]): Folder[] => {
    const folderMap = new Map();
    const roots: Folder[] = [];

    // Create map of all folders
    folders.forEach(folder => {
      folderMap.set(folder.id, { ...folder, children: [] });
    });

    // Build tree structure
    folders.forEach(folder => {
      const folderWithChildren = folderMap.get(folder.id);
      if (folder.parent_folder_id) {
        const parent = folderMap.get(folder.parent_folder_id);
        if (parent) {
          parent.children.push(folderWithChildren);
        }
      } else {
        roots.push(folderWithChildren);
      }
    });

    return roots;
  };

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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Oppr Docs</h1>
          <p className="text-gray-600">Manage your documents and files</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowCreateFolder(true)}
            variant="outline"
            size="sm"
          >
            <FolderIcon className="w-4 h-4 mr-2" />
            New Folder
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Sidebar - Folder Tree */}
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
                onFolderSelect={handleFolderSelect}
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              
              <Button variant="outline" size="sm">
                <FunnelIcon className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="rounded-r-none"
                >
                  <TableCellsIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'card' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('card')}
                  className="rounded-l-none border-l"
                >
                  <Squares2X2Icon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedFiles.length > 0 && (
            <BulkActionsToolbar
              selectedCount={selectedFiles.length}
              onClearSelection={() => setSelectedFiles([])}
              onBulkDelete={() => {
                // Handle bulk delete
                setSelectedFiles([]);
              }}
            />
          )}

          {/* Upload Area */}
          <div className="mb-4">
            <FileUploader
              currentFolderId={currentFolderId}
              onUploadComplete={handleUploadComplete}
            />
          </div>

          {/* File Display */}
          <div className="flex-1 overflow-hidden">
            <Card className="h-full">
              <CardContent className="p-4 h-full">
                {currentDocuments.length === 0 ? (
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
                    documents={currentDocuments}
                    selectedFiles={selectedFiles}
                    onFileSelect={handleFileSelect}
                    onFilePreview={handleFilePreview}
                  />
                ) : (
                  <FileCardView
                    documents={currentDocuments}
                    selectedFiles={selectedFiles}
                    onFileSelect={handleFileSelect}
                    onFilePreview={handleFilePreview}
                  />
                )}
              </CardContent>
            </Card>
          </div>
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
