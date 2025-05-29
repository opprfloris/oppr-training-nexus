
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { sanitizeFileName } from '@/utils/fileUploadUtils';

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  id: string;
}

export const useFileUpload = (currentFolderId: string | null, onUploadComplete: () => void) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const { toast } = useToast();

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

  const handleFileUpload = useCallback(async (acceptedFiles: File[]) => {
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
