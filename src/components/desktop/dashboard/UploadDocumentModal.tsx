
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  onUploadComplete
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [version, setVersion] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleUploadComplete = () => {
    onUploadComplete();
    onClose();
    resetForm();
  };

  const { handleFileUpload, uploadingFiles } = useFileUpload(null, handleUploadComplete);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        if (!title) {
          setTitle(file.name.replace('.pdf', ''));
        }
      }
    }
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setVersion('');
    setSelectedFile(null);
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a PDF file to upload.",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please provide a title for the document.",
        variant: "destructive",
      });
      return;
    }

    // Create a new file with metadata
    const fileWithMetadata = new File([selectedFile], `${title}.pdf`, {
      type: selectedFile.type
    });

    handleFileUpload([fileWithMetadata]);
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload New Document to Oppr Docs</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* File Upload Area */}
          <div>
            <Label htmlFor="file-upload">Select PDF Document</Label>
            {!selectedFile ? (
              <div
                {...getRootProps()}
                className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-oppr-blue bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-sm text-gray-600">
                  {isDragActive ? 'Drop the PDF file here...' : 'Drag & drop a PDF file here, or click to select'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Maximum file size: 10MB</p>
              </div>
            ) : (
              <div className="mt-2 border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                      <span className="text-red-600 text-sm font-medium">PDF</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={removeFile}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Document Title */}
          <div>
            <Label htmlFor="title">Document Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., SOP-GRINDER-XG5-Rev2"
              className="mt-1"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description / Keywords</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Standard Operating Procedure for Grinder XG-5, safety, maintenance"
              className="mt-1"
            />
          </div>

          {/* Version */}
          <div>
            <Label htmlFor="version">Version (Optional)</Label>
            <Input
              id="version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="e.g., V1.0, Rev C"
              className="mt-1"
            />
          </div>

          {/* Upload Progress */}
          {uploadingFiles.length > 0 && (
            <div className="space-y-2">
              {uploadingFiles.map((file) => (
                <div key={file.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading {file.file.name}...</span>
                    <span>{file.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-oppr-blue h-2 rounded-full transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!selectedFile || !title.trim() || uploadingFiles.length > 0}
            >
              Upload & Save to Library
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
