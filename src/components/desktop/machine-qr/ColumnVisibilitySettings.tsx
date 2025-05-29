
import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export interface ColumnVisibility {
  machineId: boolean;
  qrIdentifier: boolean;
  qrName: boolean;
  machineType: boolean;
  location: boolean;
  brand: boolean;
  usageCount: boolean;
  dateCreated: boolean;
}

interface ColumnVisibilitySettingsProps {
  visibility: ColumnVisibility;
  onVisibilityChange: (visibility: ColumnVisibility) => void;
}

const defaultVisibility: ColumnVisibility = {
  machineId: true,
  qrIdentifier: false,
  qrName: true,
  machineType: true,
  location: false,
  brand: false,
  usageCount: true,
  dateCreated: false,
};

export const ColumnVisibilitySettings: React.FC<ColumnVisibilitySettingsProps> = ({
  visibility,
  onVisibilityChange,
}) => {
  const columns = [
    { key: 'machineId', label: 'Machine ID' },
    { key: 'qrIdentifier', label: 'QR Identifier' },
    { key: 'qrName', label: 'QR Name' },
    { key: 'machineType', label: 'Machine Type' },
    { key: 'location', label: 'Location' },
    { key: 'brand', label: 'Brand' },
    { key: 'usageCount', label: '# Projects Using' },
    { key: 'dateCreated', label: 'Date Created' },
  ];

  const handleColumnToggle = (columnKey: keyof ColumnVisibility) => {
    const newVisibility = {
      ...visibility,
      [columnKey]: !visibility[columnKey],
    };
    onVisibilityChange(newVisibility);
    localStorage.setItem('machineQRColumnVisibility', JSON.stringify(newVisibility));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" title="Column Settings">
          <Settings className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Show Columns</h4>
          <div className="space-y-2">
            {columns.map((column) => (
              <div key={column.key} className="flex items-center space-x-2">
                <Checkbox
                  id={column.key}
                  checked={visibility[column.key as keyof ColumnVisibility]}
                  onCheckedChange={() => handleColumnToggle(column.key as keyof ColumnVisibility)}
                />
                <Label htmlFor={column.key} className="text-sm">
                  {column.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { defaultVisibility };
