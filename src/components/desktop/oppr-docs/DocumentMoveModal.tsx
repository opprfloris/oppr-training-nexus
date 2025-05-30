
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FolderTree } from './FolderTree';
import { supabase } from '@/integrations/supabase/client';
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

interface Folder {
  id: string;
  name: string;
  parent_folder_id: string | null;
  path: string;
  created_at: string;
  children?: Folder[];
}

interface DocumentMoveModalProps {
  documents: Document[];
  folders: Folder[];
  onClose: () => void;
  onSuccess: () => void;
}

export const DocumentMoveModal: React.FC<DocumentMoveModalProps> = ({
  documents,
  folders,
  onClose,
  onSuccess
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const { toast } = useToast();

  const handleMove = async () => {
    if (documents.length === 0) return;

    setIsMoving(true);
    try {
      const documentIds = documents.map(doc => doc.id);
      
      const { error } = await supabase
        .from('documents')
        .update({ folder_id: selectedFolderId })
        .in('id', documentIds);

      if (error) throw error;

      onSuccess();
      onClose();
      toast({
        title: "Success",
        description: `${documents.length} document(s) moved successfully.`,
      });
    } catch (error) {
      console.error('Error moving documents:', error);
      toast({
        title: "Error",
        description: "Failed to move documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMoving(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Move {documents.length} Document(s)
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Select the destination folder:
          </div>
          
          <div className="border rounded-lg p-3 max-h-64 overflow-y-auto">
            <FolderTree
              folders={folders}
              currentFolderId={selectedFolderId}
              onFolderSelect={setSelectedFolderId}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleMove} 
              disabled={isMoving}
            >
              {isMoving ? 'Moving...' : 'Move'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
