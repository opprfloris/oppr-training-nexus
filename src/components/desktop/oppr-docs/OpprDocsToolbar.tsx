
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MagnifyingGlassIcon,
  Squares2X2Icon,
  TableCellsIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface OpprDocsToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'table' | 'card';
  onViewModeChange: (mode: 'table' | 'card') => void;
}

export const OpprDocsToolbar: React.FC<OpprDocsToolbarProps> = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 w-64"
          />
        </div>
        
        <Button variant="outline" size="sm">
          <FunnelIcon className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex border rounded-lg">
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('table')}
            className="rounded-r-none"
          >
            <TableCellsIcon className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'card' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('card')}
            className="rounded-l-none border-l"
          >
            <Squares2X2Icon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
