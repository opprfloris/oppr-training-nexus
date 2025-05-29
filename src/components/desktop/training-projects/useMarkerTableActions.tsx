
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TrainingProjectMarker } from '@/types/training-projects';

interface UseMarkerTableActionsProps {
  markers: TrainingProjectMarker[];
  onMarkersChange: () => void;
}

export const useMarkerTableActions = ({ 
  markers, 
  onMarkersChange 
}: UseMarkerTableActionsProps) => {
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
      
      // Sort markers by sequence_order (or pin_number as fallback)
      const sortedMarkers = [...markers].sort((a, b) => 
        (a.sequence_order || a.pin_number) - (b.sequence_order || b.pin_number)
      );

      const currentIndex = sortedMarkers.findIndex(m => m.id === markerId);
      if (currentIndex === -1) return;

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= sortedMarkers.length) return;

      const currentMarker = sortedMarkers[currentIndex];
      const swapMarker = sortedMarkers[newIndex];

      console.log('Swapping markers:', {
        current: { id: currentMarker.id, order: currentMarker.sequence_order || currentMarker.pin_number },
        swap: { id: swapMarker.id, order: swapMarker.sequence_order || swapMarker.pin_number }
      });

      // Instead of swapping, renumber all markers to avoid constraint violations
      const updates = sortedMarkers.map((marker, index) => {
        let newOrder;
        if (marker.id === currentMarker.id) {
          // Current marker takes the swap marker's position
          newOrder = newIndex + 1;
        } else if (marker.id === swapMarker.id) {
          // Swap marker takes the current marker's position
          newOrder = currentIndex + 1;
        } else if (index < Math.min(currentIndex, newIndex)) {
          // Markers before the affected range stay the same
          newOrder = index + 1;
        } else if (index > Math.max(currentIndex, newIndex)) {
          // Markers after the affected range stay the same
          newOrder = index + 1;
        } else {
          // Markers in between get shifted
          newOrder = index + 1;
        }

        return {
          id: marker.id,
          sequence_order: newOrder,
          pin_number: newOrder
        };
      });

      console.log('Update plan:', updates);

      // Execute updates in sequence to avoid constraint violations
      for (const update of updates) {
        const { error } = await supabase
          .from('training_project_markers')
          .update({
            sequence_order: update.sequence_order,
            pin_number: update.pin_number
          })
          .eq('id', update.id);

        if (error) {
          console.error('Error updating marker:', update.id, error);
          throw error;
        }
      }

      toast({
        title: "Success",
        description: "Marker order updated successfully"
      });

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

  return {
    deleteMarker,
    moveMarker,
    saving
  };
};
