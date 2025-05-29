
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { TrainingProjectMarker } from '@/types/training-projects';

interface MarkerManagementProps {
  projectId: string;
  floorPlanId: string;
  markers: TrainingProjectMarker[];
  onMarkersChange: () => void;
}

const MarkerManagement: React.FC<MarkerManagementProps> = ({
  projectId,
  floorPlanId,
  markers,
  onMarkersChange
}) => {
  const [showAddMarker, setShowAddMarker] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-900">Training Markers</h4>
          <p className="text-sm text-gray-600">
            {markers.length} marker{markers.length !== 1 ? 's' : ''} placed
          </p>
        </div>
        <Button onClick={() => setShowAddMarker(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Marker
        </Button>
      </div>

      {/* Floor Plan Preview with Markers */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="aspect-video bg-white rounded border-2 border-dashed border-gray-300 relative flex items-center justify-center">
          <div className="text-center">
            <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Floor plan preview with markers will appear here</p>
            <p className="text-sm text-gray-500 mt-1">Click to add markers to specific locations</p>
          </div>
          
          {/* Render markers as positioned elements */}
          {markers.map((marker) => (
            <div
              key={marker.id}
              className="absolute w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-red-600 transition-colors"
              style={{
                left: `${marker.x_position}%`,
                top: `${marker.y_position}%`,
                transform: 'translate(-50%, -50%)'
              }}
              title={marker.machine_qr_entity?.qr_name || `Marker ${marker.pin_number}`}
            >
              {marker.pin_number}
            </div>
          ))}
        </div>
      </div>

      {/* Markers List */}
      {markers.length > 0 && (
        <div className="space-y-3">
          <h5 className="font-medium text-gray-900">Marker Details</h5>
          <div className="space-y-2">
            {markers.map((marker) => (
              <div key={marker.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-medium">
                    {marker.pin_number}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {marker.machine_qr_entity?.qr_name || `Marker ${marker.pin_number}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      Position: {marker.x_position.toFixed(1)}%, {marker.y_position.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {marker.machine_qr_entity?.machine_type || 'No machine'}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {markers.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <MapPinIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">No markers added yet</p>
          <p className="text-sm text-gray-500 mt-1">Click "Add Marker" to place your first training marker</p>
        </div>
      )}
    </div>
  );
};

export default MarkerManagement;
