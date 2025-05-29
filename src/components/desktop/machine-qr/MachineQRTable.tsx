
import React from 'react';
import { PencilSquareIcon, EyeIcon, PrinterIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MachineQREntity } from '@/types/machine-qr';

interface MachineQRTableProps {
  entities: MachineQREntity[];
  loading: boolean;
  onEdit: (entity: MachineQREntity) => void;
  onViewUsage: (entity: MachineQREntity) => void;
  onDelete: (id: string) => void;
}

export const MachineQRTable: React.FC<MachineQRTableProps> = ({
  entities,
  loading,
  onEdit,
  onViewUsage,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="oppr-card p-8 text-center">
        <p className="text-gray-600">Loading machine QR entities...</p>
      </div>
    );
  }

  if (entities.length === 0) {
    return (
      <div className="oppr-card p-8 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">🏷️</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Machine & QR Entities Registered</h3>
        <p className="text-gray-600 mb-4">Add machines and equipment to enable QR-based training experiences</p>
      </div>
    );
  }

  return (
    <div className="oppr-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Machine ID</TableHead>
            <TableHead>QR Identifier</TableHead>
            <TableHead>QR Name</TableHead>
            <TableHead>Machine Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead># Projects Using</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entities.map((entity) => (
            <TableRow key={entity.id}>
              <TableCell className="font-medium">{entity.machine_id}</TableCell>
              <TableCell>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {entity.qr_identifier}
                </code>
              </TableCell>
              <TableCell>{entity.qr_name}</TableCell>
              <TableCell>{entity.machine_type || '-'}</TableCell>
              <TableCell className="max-w-32 truncate" title={entity.location_description || ''}>
                {entity.location_description || '-'}
              </TableCell>
              <TableCell>{entity.brand || '-'}</TableCell>
              <TableCell className="text-center">{entity.usage_count}</TableCell>
              <TableCell>{formatDate(entity.created_at)}</TableCell>
              <TableCell>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(entity)}
                    title="Edit Details"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewUsage(entity)}
                    title="View Usage"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {/* TODO: Implement print QR */}}
                    title="Print QR"
                    className="text-gray-400"
                  >
                    <PrinterIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(entity.id)}
                    title="Delete"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
