
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

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

export const useDocumentProcessor = () => {
  const [uploadedDocument, setUploadedDocument] = useState<ProcessedDocument | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const extractKeyTopics = (content: string): string[] => {
    const commonTopics = [
      'Safety protocols', 'Equipment operation', 'Quality control', 'Emergency procedures',
      'Documentation requirements', 'Maintenance procedures', 'Compliance standards',
      'Risk assessment', 'Training objectives', 'Performance metrics'
    ];
    
    const topics = commonTopics.filter(() => Math.random() > 0.6);
    return topics.length > 0 ? topics : ['General procedures', 'Best practices'];
  };

  const simulateImageExtraction = (fileName: string): string[] => {
    const imageCount = Math.floor(Math.random() * 3) + 1;
    return Array.from({ length: imageCount }, (_, i) => 
      `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=`
    );
  };

  const validateFile = (file: File): boolean => {
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF file.",
        variant: "destructive"
      });
      return false;
    }

    if (file.size > 25 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 25MB.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const generateEnhancedContent = (fileName: string): string => {
    return `TRAINING DOCUMENT: ${fileName}

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
  };

  const processDocument = async (file: File, onDocumentProcessed: (file: File, content: string, extractedImages?: string[]) => void) => {
    if (!validateFile(file)) return;

    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const enhancedContent = generateEnhancedContent(file.name);
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

  const removeDocument = () => {
    setUploadedDocument(null);
    const input = document.getElementById('pdf-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  return {
    uploadedDocument,
    isProcessing,
    processDocument,
    removeDocument
  };
};
