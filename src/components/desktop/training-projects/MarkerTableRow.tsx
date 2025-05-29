
import React from 'react';
import { Button } from '@/components/ui/button';
import { TrashIcon } from '@heroicons/react/24/outline';
import { TrainingProjectMarker } from '@/types/training-projects';
import MarkerSequenceControls from './MarkerSequenceControls';

interface MarkerTableRowProps {
  marker: TrainingProjectMarker;
  index: number;
  totalMarkers: number;
  onMoveUp: (markerId: string) => void;
  onMoveDown: (markerId: string) => void;
  onDelete: (markerId: string) => void;
  disabled: boolean;
}

const MarkerTableRow: React.FC<MarkerTableRowProps> = ({
  marker,
  index,
  totalMarkers,
  onMoveUp,
  onMoveDown,
  onDelete,
  disabled
}) => {
  return (
    <tr key={marker.id} className="hover:bg-gray-50">
      <td className="px-4 py-3">
        <MarkerSequenceControls
          sequenceNumber={marker.sequence_order || marker.pin_number}
          canMoveUp={index > 0}
          canMoveDown={index < totalMarkers - 1}
          onMoveUp={() => onMoveUp(marker.id)}
          onMoveDown={() => onMoveDown(marker.id)}
          disabled={disabled}
        />
      </td>
      <td className="px-4 py-3 text-sm font-medium text-gray-900">
        {marker.machine_qr_entity?.qr_name || '-'}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {marker.machine_qr_entity?.qr_identifier || '-'}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {marker.machine_qr_entity?.machine_id || '-'}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {marker.machine_qr_entity?.machine_type || '-'}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {marker.machine_qr_entity?.brand || '-'}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {marker.x_position.toFixed(1)}%, {marker.y_position.toFixed(1)}%
      </td>
      <td className="px-4 py-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(marker.id)}
          disabled={disabled}
          className="text-red-600 hover:text-red-700"
        >
          <TrashIcon className="w-4 h-4" />
        </Button>
      </td>
    </tr>
  );
};

export default MarkerTableRow;
