
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageIcon, CheckIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FloorPlanImage } from '@/types/floor-plans';
import { TrainingProjectMarker } from '@/types/training-projects';

interface FloorPlanSelectorProps {
  selectedFloorPlanId: string | null;
  onFloorPlanSelect: (floorPlanId: string) => Promise<void>;
  projectId: string;
  markers: TrainingProjectMarker[];
  onMarkersChange: () => void;
}

const FloorPlanSelector: React.FC<FloorPlanSelectorProps> = ({
  selectedFloorPlanId,
  onFloorPlanSelect,
  projectId,
  markers,
  onMarkersChange
}) => {
  const [floorPlans, setFloorPlans] = useState<FloorPlanImage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadFloorPlans();
  }, []);

  const loadFloorPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('floor_plan_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFloorPlans(data || []);
    } catch (error) {
      console.error('Error loading floor plans:', error);
      toast({
        title: "Error",
        description: "Failed to load floor plans",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFloorPlanSelect = async (floorPlanId: string) => {
    if (selectedFloorPlanId === floorPlanId) return;

    try {
      await onFloorPlanSelect(floorPlanId);
      onMarkersChange();
    } catch (error) {
      console.error('Error selecting floor plan:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (floorPlans.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Floor Plans Available</h3>
        <p className="text-gray-600 mb-4">
          You need to upload floor plans before you can select one for your training project.
        </p>
        <Button variant="outline">
          Upload Floor Plan
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {floorPlans.map((floorPlan) => (
        <div
          key={floorPlan.id}
          className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
            selectedFloorPlanId === floorPlan.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => handleFloorPlanSelect(floorPlan.id)}
        >
          {selectedFloorPlanId === floorPlan.id && (
            <div className="absolute top-2 right-2">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center">
                <CheckIcon className="w-4 h-4" />
              </div>
            </div>
          )}
          
          <div className="aspect-video bg-gray-100 rounded-md mb-3 flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
          
          <h4 className="font-medium text-gray-900 mb-1">{floorPlan.name}</h4>
          {floorPlan.description && (
            <p className="text-sm text-gray-600 mb-2">{floorPlan.description}</p>
          )}
          
          <div className="flex items-center justify-between">
            <Badge variant="outline">
              {floorPlan.width}x{floorPlan.height}
            </Badge>
            <span className="text-xs text-gray-500">
              {floorPlan.usage_count} projects
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FloorPlanSelector;
