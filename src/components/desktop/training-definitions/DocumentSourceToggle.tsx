
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FolderOpen } from 'lucide-react';

interface DocumentSourceToggleProps {
  mode: 'upload' | 'select';
  onModeChange: (mode: 'upload' | 'select') => void;
}

const DocumentSourceToggle: React.FC<DocumentSourceToggleProps> = ({ mode, onModeChange }) => {
  return (
    <div className="flex space-x-2 mb-4">
      <Button
        variant={mode === 'upload' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onModeChange('upload')}
        className="flex items-center space-x-2"
      >
        <Upload className="w-4 h-4" />
        <span>Upload New</span>
      </Button>
      <Button
        variant={mode === 'select' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onModeChange('select')}
        className="flex items-center space-x-2"
      >
        <FolderOpen className="w-4 h-4" />
        <span>Select from Oppr Docs</span>
      </Button>
    </div>
  );
};

export default DocumentSourceToggle;
