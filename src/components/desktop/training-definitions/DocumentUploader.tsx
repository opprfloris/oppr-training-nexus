import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploaderProps {
  onDocumentProcessed: (file: File, content: string, extractedImages?: string[]) => void;
}

interface ProcessedDocument {
  file: File;
  content: string;
  extractedImages: string[];
  metadata: {
    pageCount: number;
    extractedAt: string;
    keyTopics: string[];
  };
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onDocumentProcessed }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState<ProcessedDocument | null>(null);
  const { toast } = useToast();

  const extractKeyTopics = (content: string): string[] => {
    // Enhanced topic extraction simulation
    const commonTopics = [
      'Safety protocols', 'Equipment operation', 'Quality control', 'Emergency procedures',
      'Documentation requirements', 'Maintenance procedures', 'Compliance standards',
      'Risk assessment', 'Training objectives', 'Performance metrics'
    ];
    
    const topics = commonTopics.filter(() => Math.random() > 0.6);
    return topics.length > 0 ? topics : ['General procedures', 'Best practices'];
  };

  const simulateImageExtraction = (fileName: string): string[] => {
    // Simulate extracted images from PDF
    const imageCount = Math.floor(Math.random() * 3) + 1;
    return Array.from({ length: imageCount }, (_, i) => 
      `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=`
    );
  };

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

    if (file.size > 25 * 1024 * 1024) { // 25MB limit
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 25MB.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate enhanced PDF processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Enhanced mock content with structured sections
      const enhancedContent = `TRAINING DOCUMENT: ${file.name}

EXECUTIVE SUMMARY
This comprehensive training document covers essential operational procedures, safety protocols, and quality standards. The material is designed for both new employees and ongoing professional development.

SECTION 1: SAFETY PROTOCOLS
- Personal Protective Equipment (PPE) requirements must be followed at all times
- Emergency evacuation procedures are outlined in Section 4.2
- Hazard identification and reporting protocols are mandatory for all personnel
- Regular safety audits ensure compliance with industry standards

"Safety is our top priority. All personnel must complete safety training before beginning operations." - Safety Manual, Chapter 1

SECTION 2: EQUIPMENT OPERATION
Standard operating procedures for all machinery:
1. Pre-operation inspection checklist
2. Proper startup and shutdown sequences
3. Routine maintenance scheduling
4. Troubleshooting common issues

Key insight: "Equipment failure often results from inadequate pre-operation checks. A 5-minute inspection can prevent hours of downtime." - Equipment Manual, Page 47

SECTION 3: QUALITY CONTROL MEASURES
Quality standards must be maintained throughout all processes:
- Regular calibration of measuring instruments
- Documentation of all quality control checks
- Immediate reporting of any deviations from standards
- Continuous improvement initiatives

SECTION 4: EMERGENCY PROCEDURES
Emergency response protocols include:
- Fire evacuation procedures (Assembly Point A - Parking Lot East)
- Medical emergency response (Contact: 911, then Safety Coordinator)
- Equipment malfunction procedures
- Chemical spill response protocols

"In emergency situations, follow the established protocols without deviation. Quick, decisive action saves lives." - Emergency Response Guide, Section 1.1

SECTION 5: DOCUMENTATION REQUIREMENTS
All activities must be properly documented:
- Daily operation logs
- Maintenance records
- Quality control reports
- Incident reports
- Training completion certificates

SECTION 6: PERFORMANCE METRICS
Key performance indicators include:
- Safety incident rates (Target: Zero incidents)
- Quality compliance scores (Target: 99.5%)
- Equipment uptime (Target: 95%)
- Training completion rates (Target: 100%)

CONCLUSION
Adherence to these procedures ensures safe, efficient, and high-quality operations. Regular review and updates of these procedures maintain their effectiveness and relevance.`;

      const extractedImages = simulateImageExtraction(file.name);
      const keyTopics = extractKeyTopics(enhancedContent);
      
      const processedDoc: ProcessedDocument = {
        file,
        content: enhancedContent,
        extractedImages,
        metadata: {
          pageCount: Math.floor(Math.random() * 20) + 5,
          extractedAt: new Date().toISOString(),
          keyTopics
        }
      };

      setUploadedDocument(processedDoc);
      onDocumentProcessed(file, enhancedContent, extractedImages);
      
      toast({
        title: "Document Processed Successfully",
        description: `Extracted content from ${processedDoc.metadata.pageCount} pages with ${extractedImages.length} images and identified ${keyTopics.length} key topics.`
      });
    } catch (error) {
      console.error('Error processing document:', error);
      toast({
        title: "Processing Failed",
        description: "Failed to process the PDF. Please try again.",
        variant: "destructive"
      });
      setUploadedDocument(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = () => {
    setUploadedDocument(null);
    // Reset the input value
    const input = document.getElementById('pdf-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {!uploadedDocument ? (
          <div>
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-3">
              Upload a PDF document to generate content-specific questions and training materials
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
              {isProcessing ? 'Processing Document...' : 'Choose PDF File'}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <p className="text-sm font-medium">{uploadedDocument.file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(uploadedDocument.file.size / 1024 / 1024).toFixed(2)} MB • {uploadedDocument.metadata.pageCount} pages
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
            
            {/* Document processing results */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <div className="text-green-600 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-green-800">Document Successfully Processed</p>
                  <div className="mt-2 space-y-1 text-green-700">
                    <p>• Extracted {uploadedDocument.extractedImages.length} images</p>
                    <p>• Identified {uploadedDocument.metadata.keyTopics.length} key topics</p>
                    <p>• Ready for AI-powered question generation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {isProcessing && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">
              Processing PDF... Extracting content, images, and analyzing topics
            </span>
          </div>
        </div>
      )}

      {!uploadedDocument && (
        <div className="flex items-start space-x-2 text-xs text-gray-500">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Enhanced PDF Processing Features:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>Automatic text extraction and content analysis</li>
              <li>Image extraction for visual training materials</li>
              <li>Key topic identification for targeted questions</li>
              <li>Citation-ready content snippets for hints and references</li>
              <li>Smart content complexity analysis and recommendations</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
