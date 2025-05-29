
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText, Calendar } from 'lucide-react';
import { useOpprDocsData } from '@/hooks/useOpprDocsData';
import { supabase } from '@/integrations/supabase/client';

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

interface DocumentSelectorProps {
  onDocumentSelected: (document: Document, content: string) => void;
  isProcessing?: boolean;
}

const DocumentSelector: React.FC<DocumentSelectorProps> = ({ onDocumentSelected, isProcessing }) => {
  const { documents, loading } = useOpprDocsData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  const filteredDocuments = documents.filter(doc =>
    doc.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.file_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleDocumentSelect = async (document: Document) => {
    if (isProcessing) return;
    
    setSelectedDocumentId(document.id);
    
    try {
      // For now, we'll create mock content since we don't have document content extraction yet
      // In a real implementation, you would fetch the actual document content from storage
      const mockContent = `This is the content of ${document.display_name}. 
      
This document covers important training topics and procedures. It includes safety protocols, equipment operation guidelines, and quality control measures that are essential for proper training and certification.

Key areas covered:
- Safety protocols and emergency procedures
- Equipment operation and maintenance
- Quality control standards
- Best practices and compliance requirements

This content would normally be extracted from the actual document file.`;

      onDocumentSelected(document, mockContent);
    } catch (error) {
      console.error('Error processing selected document:', error);
    } finally {
      setSelectedDocumentId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm text-gray-600">Loading documents...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Document List */}
      <div className="max-h-64 overflow-y-auto border rounded-lg">
        {filteredDocuments.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No documents found</p>
            {searchQuery && (
              <p className="text-xs mt-1">Try adjusting your search terms</p>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {filteredDocuments.map((document) => (
              <div
                key={document.id}
                className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleDocumentSelect(document)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {document.display_name}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        <span>{document.file_type.toUpperCase()}</span>
                        <span>{formatFileSize(document.file_size)}</span>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(document.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isProcessing}
                    className="ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDocumentSelect(document);
                    }}
                  >
                    {selectedDocumentId === document.id ? (
                      <div className="flex items-center space-x-1">
                        <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600"></div>
                        <span>Loading...</span>
                      </div>
                    ) : (
                      'Select'
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {filteredDocuments.length > 0 && (
        <p className="text-xs text-gray-500 text-center">
          Click on a document or use the Select button to choose it for AI analysis
        </p>
      )}
    </div>
  );
};

export default DocumentSelector;
