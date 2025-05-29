
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  CloudArrowUpIcon, 
  DocumentIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

interface FileUploaderProps {
  currentFolderId: string | null;
  onUploadComplete: () => void;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  id: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ 
  currentFolderId, 
  onUploadComplete 
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const { toast } = useToast();

  // Function to sanitize file names for Supabase Storage
  const sanitizeFileName = (fileName: string): string => {
    return fileName
      .replace(/[^\w\s.-]/g, '') // Remove special characters except word chars, spaces, dots, hyphens
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/_{2,}/g, '_') // Replace multiple underscores with single
      .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
      .toLowerCase(); // Convert to lowercase
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newUploadingFiles = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const,
      id: Math.random().toString(36).substr(2, 9)
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    for (const uploadingFile of newUploadingFiles) {
      try {
        await uploadFile(uploadingFile);
      } catch (error) {
        console.error('Upload error:', error);
        setUploadingFiles(prev => 
          prev.map(f => 
            f.id === uploadingFile.id 
              ? { ...f, status: 'error' }
              : f
          )
        );
        toast({
          title: "Upload Failed",
          description: `Failed to upload ${uploadingFile.file.name}. Please try again.`,
          variant: "destructive",
        });
      }
    }
  }, [currentFolderId]);

  const uploadFile = async (uploadingFile: UploadingFile) => {
    const { file } = uploadingFile;
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Sanitize the file name and create the storage path
    const sanitizedFileName = sanitizeFileName(file.name);
    const fileName = `${user.id}/${Date.now()}-${sanitizedFileName}`;
    
    console.log('Uploading file with sanitized name:', fileName);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw uploadError;
    }

    // Update progress
    setUploadingFiles(prev => 
      prev.map(f => 
        f.id === uploadingFile.id 
          ? { ...f, progress: 50 }
          : f
      )
    );

    // Save document metadata to database
    const { error: dbError } = await supabase
      .from('documents')
      .insert({
        folder_id: currentFolderId,
        original_name: file.name, // Keep original name for display
        display_name: file.name,
        file_path: uploadData.path,
        file_size: file.size,
        file_type: file.name.split('.').pop() || 'unknown',
        mime_type: file.type,
        created_by: user.id
      });

    if (dbError) {
      console.error('Database insert error:', dbError);
      throw dbError;
    }

    // Mark as completed
    setUploadingFiles(prev => 
      prev.map(f => 
        f.id === uploadingFile.id 
          ? { ...f, progress: 100, status: 'completed' }
          : f
      )
    );

    // Remove from list after delay
    setTimeout(() => {
      setUploadingFiles(prev => prev.filter(f => f.id !== uploadingFile.id));
      onUploadComplete();
    }, 2000);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg']
    },
    multiple: true
  });

  const removeUploadingFile = (id: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <CloudArrowUpIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        {isDragActive ? (
          <p className="text-blue-600">Drop the files here ...</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-1">
              Drag 'n' drop files here, or click to select files
            </p>
            <p className="text-sm text-gray-500">
              Supports PDF, DOC, DOCX, TXT, and images
            </p>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Uploading files...</h4>
          {uploadingFiles.map(uploadingFile => (
            <div key={uploadingFile.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <DocumentIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{uploadingFile.file.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={uploadingFile.progress} className="flex-1" />
                  <span className="text-xs text-gray-500">
                    {uploadingFile.status === 'completed' ? 'Complete' : 
                     uploadingFile.status === 'error' ? 'Error' : `${uploadingFile.progress}%`}
                  </span>
                </div>
              </div>
              {uploadingFile.status !== 'completed' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeUploadingFile(uploadingFile.id)}
                  className="p-1"
                >
                  <XMarkIcon className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
