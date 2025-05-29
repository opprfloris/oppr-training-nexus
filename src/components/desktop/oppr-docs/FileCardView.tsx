
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

interface FileCardViewProps {
  documents: Document[];
  selectedFiles: string[];
  onFileSelect: (fileId: string) => void;
  onFilePreview: (file: Document) => void;
}

export const FileCardView: React.FC<FileCardViewProps> = ({
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 overflow-auto">
      {documents.map(doc => (
        <Card 
          key={doc.id} 
          className={`cursor-pointer transition-colors ${
            selectedFiles.includes(doc.id) ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <DocumentIcon className="w-8 h-8 text-gray-400" />
              <Checkbox
                checked={selectedFiles.includes(doc.id)}
                onCheckedChange={() => onFileSelect(doc.id)}
              />
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm truncate" title={doc.display_name}>
                {doc.display_name}
              </h4>
              
              <div className="text-xs text-gray-500 space-y-1">
                <div>{doc.file_type.toUpperCase()}</div>
                <div>{formatFileSize(doc.file_size)}</div>
                <div>{formatDate(doc.created_at)}</div>
              </div>

              <div className="flex items-center gap-1 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFilePreview(doc)}
                  className="p-1 h-6"
                >
                  <EyeIcon className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" className="p-1 h-6">
                  <PencilIcon className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" className="p-1 h-6">
                  <TrashIcon className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
