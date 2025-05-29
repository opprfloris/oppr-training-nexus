
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadDropZone } from './UploadDropZone';
import { UploadProgressList } from './UploadProgressList';
import { useFileUpload } from '@/hooks/useFileUpload';
import { getAcceptedFileTypes } from '@/utils/fileUploadUtils';

interface FileUploaderProps {
  currentFolderId: string | null;
  onUploadComplete: () => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ 
  currentFolderId, 
  onUploadComplete 
}) => {
  const { uploadingFiles, handleFileUpload, removeUploadingFile } = useFileUpload(
    currentFolderId, 
    onUploadComplete
  );

  const { isDragActive } = useDropzone({
    onDrop: handleFileUpload,
    accept: getAcceptedFileTypes(),
    multiple: true,
    noClick: true,
    noKeyboard: true
  });

  return (
    <div className="space-y-4">
      <UploadDropZone onDrop={handleFileUpload} isDragActive={isDragActive} />
      <UploadProgressList 
        uploadingFiles={uploadingFiles} 
        onRemoveFile={removeUploadingFile} 
      />
    </div>
  );
};
