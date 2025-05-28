
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploaderProps {
  onDocumentProcessed: (file: File, content: string) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onDocumentProcessed }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF file.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setUploadedFile(file);

    try {
      // Simulate PDF processing - in a real implementation, this would extract text from PDF
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock extracted content for demonstration
      const mockContent = `This is extracted content from ${file.name}. 

Key concepts covered:
1. Safety protocols and procedures
2. Equipment operation guidelines
3. Quality control measures
4. Emergency response procedures
5. Documentation requirements

Important safety note: Always follow proper procedures when handling equipment. Regular maintenance checks are essential for optimal performance.

Quality standards must be maintained at all times. Any deviations should be reported immediately to supervisors.

Emergency procedures should be reviewed regularly and all personnel must be familiar with evacuation routes and safety equipment locations.`;

      onDocumentProcessed(file, mockContent);
      
      toast({
        title: "Document Processed",
        description: "PDF content has been extracted and is ready for AI analysis."
      });
    } catch (error) {
      console.error('Error processing document:', error);
      toast({
        title: "Processing Failed",
        description: "Failed to process the PDF. Please try again.",
        variant: "destructive"
      });
      setUploadedFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    // Reset the input value
    const input = document.getElementById('pdf-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  return (
    <div className="space-y-3">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {!uploadedFile ? (
          <div>
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-3">
              Upload a PDF document to generate content-specific questions
            </p>
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isProcessing}
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('pdf-upload')?.click()}
              disabled={isProcessing}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isProcessing ? 'Processing...' : 'Choose PDF File'}
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <p className="text-sm font-medium">{uploadedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeFile}
              disabled={isProcessing}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      
      {isProcessing && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">Processing PDF...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
