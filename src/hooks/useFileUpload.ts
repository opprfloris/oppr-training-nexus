
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { sanitizeFileName } from '@/utils/fileUploadUtils';

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  id: string;
  error?: string;
}

export const useFileUpload = (currentFolderId: string | null, onUploadComplete: () => void) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const { toast } = useToast();

  const uploadFile = async (uploadingFile: UploadingFile) => {
    const { file } = uploadingFile;
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Starting upload for file:', file.name);

      // Sanitize the file name and create the storage path
      const sanitizedFileName = sanitizeFileName(file.name);
      const fileName = `${user.id}/${Date.now()}-${sanitizedFileName}`;
      
      console.log('Uploading file with sanitized name:', fileName);

      // Update progress to show upload starting
      setUploadingFiles(prev => 
        prev.map(f => 
          f.id === uploadingFile.id 
            ? { ...f, progress: 25 }
            : f
        )
      );

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log('File uploaded successfully:', uploadData);

      // Update progress
      setUploadingFiles(prev => 
        prev.map(f => 
          f.id === uploadingFile.id 
            ? { ...f, progress: 75 }
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
        // Try to clean up the uploaded file if database insert fails
        await supabase.storage.from('documents').remove([uploadData.path]);
        throw new Error(`Database error: ${dbError.message}`);
      }

      console.log('Document metadata saved successfully');

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

    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
      
      setUploadingFiles(prev => 
        prev.map(f => 
          f.id === uploadingFile.id 
            ? { ...f, status: 'error', error: errorMessage }
            : f
        )
      );
      
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = useCallback(async (acceptedFiles: File[]) => {
    console.log('Starting upload process for', acceptedFiles.length, 'files');

    const newUploadingFiles = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const,
      id: Math.random().toString(36).substr(2, 9)
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    for (const uploadingFile of newUploadingFiles) {
      await uploadFile(uploadingFile);
    }
  }, [currentFolderId, onUploadComplete, toast]);

  const removeUploadingFile = (id: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== id));
  };

  return {
    uploadingFiles,
    handleFileUpload,
    removeUploadingFile
  };
};
