
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PhotoIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

interface FloorPlan {
  id: string;
  name: string;
  description: string | null;
  file_path: string;
  width: number | null;
  height: number | null;
}

interface FloorPlanSelectorProps {
  selectedFloorPlanId: string | null;
  onFloorPlanSelect: (floorPlanId: string) => void;
}

const FloorPlanSelector: React.FC<FloorPlanSelectorProps> = ({
  selectedFloorPlanId,
  onFloorPlanSelect
}) => {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-medium text-gray-900">Select Floor Plan</h4>
        <Button variant="outline" size="sm">
          <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
          Upload New
        </Button>
      </div>

      {floorPlans.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-sm font-medium text-gray-900 mb-2">No floor plans available</h3>
          <p className="text-sm text-gray-500 mb-4">Upload a floor plan to get started</p>
          <Button variant="outline">
            <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
            Upload Floor Plan
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {floorPlans.map((floorPlan) => (
            <div
              key={floorPlan.id}
              className={`relative border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                selectedFloorPlanId === floorPlan.id
                  ? 'border-oppr-blue bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onFloorPlanSelect(floorPlan.id)}
            >
              <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                <PhotoIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h5 className="font-medium text-gray-900 truncate">{floorPlan.name}</h5>
              {floorPlan.description && (
                <p className="text-sm text-gray-500 truncate">{floorPlan.description}</p>
              )}
              {floorPlan.width && floorPlan.height && (
                <p className="text-xs text-gray-400 mt-1">
                  {floorPlan.width} × {floorPlan.height}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FloorPlanSelector;
