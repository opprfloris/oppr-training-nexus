
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

      // 3-step approach to handle dual unique constraints:
      // Step 1: Set all pin_numbers to negative values to avoid conflicts
      console.log('Step 1: Setting pin_numbers to negative values');
      for (let i = 0; i < sortedMarkers.length; i++) {
        const marker = sortedMarkers[i];
        const { error } = await supabase
          .from('training_project_markers')
          .update({ pin_number: -(i + 1) })
          .eq('id', marker.id);

        if (error) {
          console.error('Error in step 1 for marker:', marker.id, error);
          throw error;
        }
      }

      // Step 2: Update sequence_order values to their final positions
      console.log('Step 2: Updating sequence_order values');
      for (let i = 0; i < sortedMarkers.length; i++) {
        const marker = sortedMarkers[i];
        let newSequenceOrder;
        
        if (marker.id === currentMarker.id) {
          newSequenceOrder = newIndex + 1;
        } else if (marker.id === swapMarker.id) {
          newSequenceOrder = currentIndex + 1;
        } else {
          newSequenceOrder = i + 1;
        }

        const { error } = await supabase
          .from('training_project_markers')
          .update({ sequence_order: newSequenceOrder })
          .eq('id', marker.id);

        if (error) {
          console.error('Error in step 2 for marker:', marker.id, error);
          throw error;
        }
      }

      // Step 3: Update pin_number values to match sequence_order
      console.log('Step 3: Updating pin_numbers to match sequence_order');
      for (let i = 0; i < sortedMarkers.length; i++) {
        const marker = sortedMarkers[i];
        let newPinNumber;
        
        if (marker.id === currentMarker.id) {
          newPinNumber = newIndex + 1;
        } else if (marker.id === swapMarker.id) {
          newPinNumber = currentIndex + 1;
        } else {
          newPinNumber = i + 1;
        }

        const { error } = await supabase
          .from('training_project_markers')
          .update({ pin_number: newPinNumber })
          .eq('id', marker.id);

        if (error) {
          console.error('Error in step 3 for marker:', marker.id, error);
          throw error;
        }
      }

      console.log('All steps completed successfully');

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
