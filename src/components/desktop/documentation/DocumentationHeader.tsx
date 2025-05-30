
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, Menu } from 'lucide-react';

interface DocumentationHeaderProps {
  isTocOpen: boolean;
  searchTerm: string;
  onOpenToc: () => void;
  onSearchChange: (value: string) => void;
  onExportPDF: () => void;
}

export const DocumentationHeader: React.FC<DocumentationHeaderProps> = ({
  isTocOpen,
  searchTerm,
  onOpenToc,
  onSearchChange,
  onExportPDF
}) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {!isTocOpen && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenToc}
            >
              <Menu className="w-4 h-4" />
            </Button>
          )}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Technical Documentation
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onExportPDF}
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>
    </div>
  );
};
