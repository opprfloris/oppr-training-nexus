
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DocumentIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon 
} from '@heroicons/react/24/outline';

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

interface FileTableViewProps {
  documents: Document[];
  selectedFiles: string[];
  onFileSelect: (fileId: string) => void;
  onFilePreview: (file: Document) => void;
}

export const FileTableView: React.FC<FileTableViewProps> = ({
  documents,
  selectedFiles,
  onFileSelect,
  onFilePreview
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="overflow-auto">
      <table className="w-full">
        <thead className="border-b">
          <tr>
            <th className="text-left p-3 w-12">
              <Checkbox />
            </th>
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">Type</th>
            <th className="text-left p-3">Size</th>
            <th className="text-left p-3">Modified</th>
            <th className="text-right p-3 w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map(doc => (
            <tr key={doc.id} className="border-b hover:bg-gray-50">
              <td className="p-3">
                <Checkbox
                  checked={selectedFiles.includes(doc.id)}
                  onCheckedChange={() => onFileSelect(doc.id)}
                />
              </td>
              <td className="p-3">
                <div className="flex items-center gap-3">
                  <DocumentIcon className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">{doc.display_name}</span>
                </div>
              </td>
              <td className="p-3 text-gray-600 uppercase text-xs">
                {doc.file_type}
              </td>
              <td className="p-3 text-gray-600">
                {formatFileSize(doc.file_size)}
              </td>
              <td className="p-3 text-gray-600">
                {formatDate(doc.created_at)}
              </td>
              <td className="p-3">
                <div className="flex items-center gap-1 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFilePreview(doc)}
                  >
                    <EyeIcon className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
