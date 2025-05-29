
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { XMarkIcon } from '@heroicons/react/24/outline';

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

interface FilePreviewModalProps {
  file: Document;
  onClose: () => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  file,
  onClose
}) => {
  const getPublicUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const renderPreview = () => {
    if (file.mime_type === 'application/pdf') {
      return (
        <iframe
          src={getPublicUrl(file.file_path)}
          className="w-full h-96 border rounded"
          title={file.display_name}
        />
      );
    }

    if (file.mime_type.startsWith('image/')) {
      return (
        <img
          src={getPublicUrl(file.file_path)}
          alt={file.display_name}
          className="max-w-full h-auto rounded"
        />
      );
    }

    return (
      <div className="flex items-center justify-center h-48 bg-gray-100 rounded">
        <p className="text-gray-500">Preview not available for this file type</p>
      </div>
    );
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{file.display_name}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <XMarkIcon className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">File Type:</span> {file.file_type.toUpperCase()}
            </div>
            <div>
              <span className="font-medium">Size:</span> {(file.file_size / 1024).toFixed(1)} KB
            </div>
            <div>
              <span className="font-medium">Created:</span> {new Date(file.created_at).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Original Name:</span> {file.original_name}
            </div>
          </div>
          
          <div>
            {renderPreview()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
