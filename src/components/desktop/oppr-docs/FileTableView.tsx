
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  DocumentIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

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

interface FileTableViewProps {
  documents: Document[];
  selectedFiles: string[];
  onFileSelect: (fileId: string) => void;
  onFilePreview: (file: Document) => void;
  onFileUpdated?: () => void;
}

export const FileTableView: React.FC<FileTableViewProps> = ({
  documents,
  selectedFiles,
  onFileSelect,
  onFilePreview,
  onFileUpdated
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const { toast } = useToast();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleRename = (doc: Document) => {
    setEditingId(doc.id);
    setEditingName(doc.display_name);
  };

  const handleSaveRename = async (docId: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .update({ display_name: editingName })
        .eq('id', docId);

      if (error) throw error;

      setEditingId(null);
      setEditingName('');
      onFileUpdated?.();
      toast({
        title: "Success",
        description: "File renamed successfully.",
      });
    } catch (error) {
      console.error('Error renaming file:', error);
      toast({
        title: "Error",
        description: "Failed to rename file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelRename = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleDelete = async (doc: Document) => {
    if (!confirm(`Are you sure you want to delete "${doc.display_name}"?`)) {
      return;
    }

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([doc.file_path]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
        // Continue with database deletion even if storage fails
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', doc.id);

      if (dbError) throw dbError;

      onFileUpdated?.();
      toast({
        title: "Success",
        description: "File deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: "Failed to delete file. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="overflow-auto">
      <table className="w-full">
        <thead className="border-b">
          <tr>
            <th className="text-left p-3 w-12">
              <Checkbox />
            </th>
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">Type</th>
            <th className="text-left p-3">Size</th>
            <th className="text-left p-3">Modified</th>
            <th className="text-right p-3 w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map(doc => (
            <tr key={doc.id} className="border-b hover:bg-gray-50">
              <td className="p-3">
                <Checkbox
                  checked={selectedFiles.includes(doc.id)}
                  onCheckedChange={() => onFileSelect(doc.id)}
                />
              </td>
              <td className="p-3">
                <div className="flex items-center gap-3">
                  <DocumentIcon className="w-5 h-5 text-gray-400" />
                  {editingId === doc.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="h-8 text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveRename(doc.id);
                          } else if (e.key === 'Escape') {
                            handleCancelRename();
                          }
                        }}
                        autoFocus
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSaveRename(doc.id)}
                        className="p-1 h-6"
                      >
                        <CheckIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelRename}
                        className="p-1 h-6"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <span className="font-medium">{doc.display_name}</span>
                  )}
                </div>
              </td>
              <td className="p-3 text-gray-600 uppercase text-xs">
                {doc.file_type}
              </td>
              <td className="p-3 text-gray-600">
                {formatFileSize(doc.file_size)}
              </td>
              <td className="p-3 text-gray-600">
                {formatDate(doc.created_at)}
              </td>
              <td className="p-3">
                <div className="flex items-center gap-1 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFilePreview(doc)}
                  >
                    <EyeIcon className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRename(doc)}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(doc)}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
