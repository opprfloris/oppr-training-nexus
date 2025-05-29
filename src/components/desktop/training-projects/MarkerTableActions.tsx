
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TrashIcon } from '@heroicons/react/24/outline';
import { TrainingProjectMarker } from '@/types/training-projects';

interface MarkerTableActionsProps {
  markers: TrainingProjectMarker[];
  onMarkersChange: () => void;
}

const MarkerTableActions: React.FC<MarkerTableActionsProps> = ({ 
  markers, 
  onMarkersChange 
}) => {
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

      // Use sequence_order if available, otherwise pin_number
      const currentOrder = currentMarker.sequence_order || currentMarker.pin_number;
      const swapOrder = swapMarker.sequence_order || swapMarker.pin_number;

      console.log('Swapping markers:', {
        current: { id: currentMarker.id, order: currentOrder },
        swap: { id: swapMarker.id, order: swapOrder }
      });

      // Update both markers with swapped sequence orders
      const { error: error1 } = await supabase
        .from('training_project_markers')
        .update({ 
          sequence_order: swapOrder,
          pin_number: swapOrder // Also update pin_number to keep them in sync
        })
        .eq('id', currentMarker.id);

      if (error1) throw error1;

      const { error: error2 } = await supabase
        .from('training_project_markers')
        .update({ 
          sequence_order: currentOrder,
          pin_number: currentOrder // Also update pin_number to keep them in sync
        })
        .eq('id', swapMarker.id);

      if (error2) throw error2;

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

export default MarkerTableActions;
