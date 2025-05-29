
import React from 'react';
import { TrainingProjectMarker } from '@/types/training-projects';
import { useMarkerTableActions } from './useMarkerTableActions';
import MarkerTableRow from './MarkerTableRow';

interface MarkerTableProps {
  markers: TrainingProjectMarker[];
  onMarkersChange: () => void;
}

const MarkerTable: React.FC<MarkerTableProps> = ({ markers, onMarkersChange }) => {
  const { deleteMarker, moveMarker, saving } = useMarkerTableActions({ 
    markers, 
    onMarkersChange 
  });

  const sortedMarkers = [...markers].sort((a, b) => 
    (a.sequence_order || a.pin_number) - (b.sequence_order || b.pin_number)
  );

  if (markers.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500">No markers added yet. Click on the floor plan to add markers.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Sequence
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              QR Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              QR Identifier
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Machine ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Brand
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Position
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedMarkers.map((marker, index) => (
            <MarkerTableRow
              key={marker.id}
              marker={marker}
              index={index}
              totalMarkers={sortedMarkers.length}
              onMoveUp={(markerId) => moveMarker(markerId, 'up')}
              onMoveDown={(markerId) => moveMarker(markerId, 'down')}
              onDelete={deleteMarker}
              disabled={saving}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MarkerTable;
