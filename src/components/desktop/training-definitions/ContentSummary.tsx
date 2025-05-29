
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Clock, BookOpen } from 'lucide-react';

interface ContentSummaryProps {
  fileName: string;
  pageCount: number;
  summary: string;
}

const ContentSummary: React.FC<ContentSummaryProps> = ({ fileName, pageCount, summary }) => {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">{fileName}</span>
              <span className="text-sm text-blue-700">• {pageCount} pages</span>
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">{summary}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentSummary;
