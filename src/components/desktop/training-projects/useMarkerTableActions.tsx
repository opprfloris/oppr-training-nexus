
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

      // Use a temporary high value to avoid constraint violations
      const tempValue = 9999 + Date.now();
      
      // Step 1: Set current marker to temporary value
      const { error: tempError } = await supabase
        .from('training_project_markers')
        .update({ 
          sequence_order: tempValue,
          pin_number: tempValue
        })
        .eq('id', currentMarker.id);

      if (tempError) throw tempError;

      // Step 2: Move swap marker to current marker's position
      const currentOrder = currentMarker.sequence_order || currentMarker.pin_number;
      const { error: swapError } = await supabase
        .from('training_project_markers')
        .update({ 
          sequence_order: currentOrder,
          pin_number: currentOrder
        })
        .eq('id', swapMarker.id);

      if (swapError) throw swapError;

      // Step 3: Move current marker to swap marker's final position
      const swapOrder = swapMarker.sequence_order || swapMarker.pin_number;
      const { error: finalError } = await supabase
        .from('training_project_markers')
        .update({ 
          sequence_order: swapOrder,
          pin_number: swapOrder
        })
        .eq('id', currentMarker.id);

      if (finalError) throw finalError;

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
