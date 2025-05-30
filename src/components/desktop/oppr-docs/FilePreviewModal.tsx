
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
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

interface FilePreviewModalProps {
  file: Document;
  onClose: () => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  file,
  onClose
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [publicUrl, setPublicUrl] = React.useState<string | null>(null);

  const getPublicUrl = async (filePath: string) => {
    try {
      console.log('Getting public URL for file:', filePath);
      
      const { data } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      
      console.log('Public URL data:', data);
      
      if (!data.publicUrl) {
        throw new Error('Failed to generate public URL');
      }
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error getting public URL:', error);
      throw error;
    }
  };

  const loadFileUrl = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading file URL for:', file.file_path);
      const url = await getPublicUrl(file.file_path);
      console.log('Got public URL:', url);
      setPublicUrl(url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load file';
      console.error('Failed to load file URL:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderPreview = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-48 bg-red-50 rounded border border-red-200">
          <p className="text-red-600 mb-4 text-center px-4">{error}</p>
          <Button
            variant="outline"
            onClick={loadFileUrl}
          >
            Retry
          </Button>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="flex items-center justify-center h-48 bg-gray-50 rounded">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!publicUrl) {
      return (
        <div className="flex items-center justify-center h-48 bg-gray-50 rounded">
          <p className="text-gray-500">No preview URL available</p>
        </div>
      );
    }

    if (file.mime_type === 'application/pdf') {
      return (
        <iframe
          src={`${publicUrl}#toolbar=1`}
          className="w-full h-96 border rounded"
          title={file.display_name}
          onError={() => {
            setError('Failed to load PDF file');
          }}
        />
      );
    }

    if (file.mime_type.startsWith('image/')) {
      return (
        <img
          src={publicUrl}
          alt={file.display_name}
          className="max-w-full h-auto rounded"
          onError={() => {
            setError('Failed to load image file');
          }}
        />
      );
    }

    if (file.mime_type === 'text/plain') {
      return (
        <div className="border rounded p-4 bg-gray-50 h-96 overflow-auto">
          <iframe
            src={publicUrl}
            className="w-full h-full border-0"
            title={file.display_name}
            onError={() => {
              setError('Failed to load text file');
            }}
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-48 bg-gray-100 rounded">
        <p className="text-gray-500 mb-2">Preview not available for this file type</p>
        <Button
          variant="outline"
          onClick={() => {
            if (publicUrl) {
              window.open(publicUrl, '_blank');
            } else {
              toast({
                title: "Error",
                description: "File URL not available. Please try again.",
                variant: "destructive",
              });
            }
          }}
        >
          Download File
        </Button>
      </div>
    );
  };

  React.useEffect(() => {
    loadFileUrl();
  }, [file.file_path]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{file.display_name}</DialogTitle>
          <DialogDescription>
            File preview and details
          </DialogDescription>
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
