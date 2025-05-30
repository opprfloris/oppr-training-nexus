
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { XMarkIcon, CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  id: string;
  error?: string;
}

interface UploadProgressListProps {
  uploadingFiles: UploadingFile[];
  onRemoveFile: (id: string) => void;
}

export const UploadProgressList: React.FC<UploadProgressListProps> = ({
  uploadingFiles,
  onRemoveFile
}) => {
  if (uploadingFiles.length === 0) return null;

  return (
    <div className="space-y-2">
      {uploadingFiles.map(file => (
        <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium truncate">{file.file.name}</span>
              <div className="flex items-center gap-2">
                {file.status === 'completed' && (
                  <CheckIcon className="w-4 h-4 text-green-500" />
                )}
                {file.status === 'error' && (
                  <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFile(file.id)}
                  className="p-1 h-6 w-6"
                >
                  <XMarkIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {file.status === 'uploading' && (
              <Progress value={file.progress} className="h-2" />
            )}
            
            {file.status === 'error' && file.error && (
              <p className="text-xs text-red-600 mt-1">{file.error}</p>
            )}
            
            {file.status === 'completed' && (
              <p className="text-xs text-green-600 mt-1">Upload completed</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
