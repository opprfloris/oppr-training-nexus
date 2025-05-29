
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  id: string;
}

interface UploadProgressListProps {
  uploadingFiles: UploadingFile[];
  onRemoveFile: (id: string) => void;
}

export const UploadProgressList: React.FC<UploadProgressListProps> = ({
  uploadingFiles,
  onRemoveFile
}) => {
  if (uploadingFiles.length === 0) {
    return null;
  }

  return (
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
              onClick={() => onRemoveFile(uploadingFile.id)}
              className="p-1"
            >
              <XMarkIcon className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
