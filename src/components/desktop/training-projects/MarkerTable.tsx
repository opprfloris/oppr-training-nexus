
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TrashIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { TrainingProjectMarker } from '@/types/training-projects';

interface MarkerTableProps {
  markers: TrainingProjectMarker[];
  onMarkersChange: () => void;
}

const MarkerTable: React.FC<MarkerTableProps> = ({ markers, onMarkersChange }) => {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const deleteMarker = async (markerId: string) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('training_project_markers')
        .delete()
        .eq('id', markerId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Marker deleted successfully"
      });
      
      onMarkersChange();
    } catch (error) {
      console.error('Error deleting marker:', error);
      toast({
        title: "Error",
        description: "Failed to delete marker",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const moveMarker = async (markerId: string, direction: 'up' | 'down') => {
    try {
      setSaving(true);
      const marker = markers.find(m => m.id === markerId);
      if (!marker) return;

      const currentOrder = marker.sequence_order || marker.pin_number;
      const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;

      // Find the marker to swap with
      const swapMarker = markers.find(m => 
        (m.sequence_order || m.pin_number) === newOrder
      );

      if (!swapMarker) return;

      // Update both markers
      const { error: error1 } = await supabase
        .from('training_project_markers')
        .update({ sequence_order: newOrder })
        .eq('id', markerId);

      const { error: error2 } = await supabase
        .from('training_project_markers')
        .update({ sequence_order: currentOrder })
        .eq('id', swapMarker.id);

      if (error1 || error2) throw error1 || error2;

      onMarkersChange();
    } catch (error) {
      console.error('Error moving marker:', error);
      toast({
        title: "Error",
        description: "Failed to reorder marker",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

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
            <tr key={marker.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-oppr-blue text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {marker.sequence_order || marker.pin_number}
                  </div>
                  <div className="flex flex-col">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveMarker(marker.id, 'up')}
                      disabled={saving || index === 0}
                      className="h-5 w-5 p-0"
                    >
                      <ChevronUpIcon className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveMarker(marker.id, 'down')}
                      disabled={saving || index === sortedMarkers.length - 1}
                      className="h-5 w-5 p-0"
                    >
                      <ChevronDownIcon className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
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
                  onClick={() => deleteMarker(marker.id)}
                  disabled={saving}
                  className="text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MarkerTable;
