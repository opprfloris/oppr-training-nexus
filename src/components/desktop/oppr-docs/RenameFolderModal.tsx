
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Folder {
  id: string;
  name: string;
  parent_folder_id: string | null;
  path: string;
  created_at: string;
}

interface RenameFolderModalProps {
  folder: Folder;
  onClose: () => void;
  onSuccess: () => void;
}

export const RenameFolderModal: React.FC<RenameFolderModalProps> = ({
  folder,
  onClose,
  onSuccess
}) => {
  const [newName, setNewName] = useState(folder.name);
  const [isRenaming, setIsRenaming] = useState(false);
  const { toast } = useToast();

  const handleRename = async () => {
    if (!newName.trim() || newName === folder.name) {
      onClose();
      return;
    }

    setIsRenaming(true);
    try {
      const { error } = await supabase
        .from('document_folders')
        .update({ name: newName.trim() })
        .eq('id', folder.id);

      if (error) throw error;

      onSuccess();
      onClose();
      toast({
        title: "Success",
        description: "Folder renamed successfully.",
      });
    } catch (error) {
      console.error('Error renaming folder:', error);
      toast({
        title: "Error",
        description: "Failed to rename folder. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRenaming(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rename Folder</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Folder Name</label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter folder name"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRename();
                } else if (e.key === 'Escape') {
                  onClose();
                }
              }}
              autoFocus
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleRename} 
              disabled={isRenaming || !newName.trim()}
            >
              {isRenaming ? 'Renaming...' : 'Rename'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
