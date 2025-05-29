
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

interface FileCardViewProps {
  documents: Document[];
  selectedFiles: string[];
  onFileSelect: (fileId: string) => void;
  onFilePreview: (file: Document) => void;
  onFileUpdated?: () => void;
}

export const FileCardView: React.FC<FileCardViewProps> = ({
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 overflow-auto">
      {documents.map(doc => (
        <Card 
          key={doc.id} 
          className={`cursor-pointer transition-colors ${
            selectedFiles.includes(doc.id) ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <DocumentIcon className="w-8 h-8 text-gray-400" />
              <Checkbox
                checked={selectedFiles.includes(doc.id)}
                onCheckedChange={() => onFileSelect(doc.id)}
              />
            </div>
            
            <div className="space-y-2">
              {editingId === doc.id ? (
                <div className="space-y-2">
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
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSaveRename(doc.id)}
                      className="p-1 h-6"
                    >
                      <CheckIcon className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelRename}
                      className="p-1 h-6"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <h4 className="font-medium text-sm truncate" title={doc.display_name}>
                  {doc.display_name}
                </h4>
              )}
              
              <div className="text-xs text-gray-500 space-y-1">
                <div>{doc.file_type.toUpperCase()}</div>
                <div>{formatFileSize(doc.file_size)}</div>
                <div>{formatDate(doc.created_at)}</div>
              </div>

              {editingId !== doc.id && (
                <div className="flex items-center gap-1 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFilePreview(doc)}
                    className="p-1 h-6"
                  >
                    <EyeIcon className="w-3 h-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1 h-6"
                    onClick={() => handleRename(doc)}
                  >
                    <PencilIcon className="w-3 h-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1 h-6"
                    onClick={() => handleDelete(doc)}
                  >
                    <TrashIcon className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
