
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { getAcceptedFileTypes } from '@/utils/fileUploadUtils';

interface UploadDropZoneProps {
  onDrop: (files: File[]) => void;
  isDragActive: boolean;
}

export const UploadDropZone: React.FC<UploadDropZoneProps> = ({ onDrop, isDragActive }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: getAcceptedFileTypes(),
    multiple: true
  });

  return (
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
  );
};
