
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useFloorPlans } from '@/hooks/useFloorPlans';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import FloorPlanSelectionModal from './FloorPlanSelectionModal';
import FloorPlanViewer from './FloorPlanViewer';

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
  projectId: string;
  markers: any[];
  onMarkersChange: () => void;
}

const FloorPlanSelector: React.FC<FloorPlanSelectorProps> = ({
  selectedFloorPlanId,
  onFloorPlanSelect,
  projectId,
  markers,
  onMarkersChange
}) => {
  const [selectedFloorPlan, setSelectedFloorPlan] = useState<FloorPlan | null>(null);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { getImageUrl } = useFloorPlans();
  const { toast } = useToast();

  useEffect(() => {
    if (selectedFloorPlanId) {
      loadSelectedFloorPlan();
    }
  }, [selectedFloorPlanId]);

  const loadSelectedFloorPlan = async () => {
    if (!selectedFloorPlanId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('floor_plan_images')
        .select('*')
        .eq('id', selectedFloorPlanId)
        .single();

      if (error) throw error;
      setSelectedFloorPlan(data);
    } catch (error) {
      console.error('Error loading selected floor plan:', error);
      toast({
        title: "Error",
        description: "Failed to load selected floor plan",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFloorPlanSelect = (floorPlanId: string) => {
    onFloorPlanSelect(floorPlanId);
    setShowSelectionModal(false);
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
        <h4 className="text-base font-medium text-gray-900">Floor Plan & Markers</h4>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowSelectionModal(true)}
        >
          <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
          {selectedFloorPlanId ? 'Change Floor Plan' : 'Select Floor Plan'}
        </Button>
      </div>

      {!selectedFloorPlanId ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <h3 className="text-sm font-medium text-gray-900 mb-2">No floor plan selected</h3>
          <p className="text-sm text-gray-500 mb-4">Select a floor plan to start adding markers</p>
          <Button 
            variant="outline"
            onClick={() => setShowSelectionModal(true)}
          >
            <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
            Select Floor Plan
          </Button>
        </div>
      ) : selectedFloorPlan ? (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-gray-900">{selectedFloorPlan.name}</h5>
                {selectedFloorPlan.description && (
                  <p className="text-sm text-gray-500">{selectedFloorPlan.description}</p>
                )}
                {selectedFloorPlan.width && selectedFloorPlan.height && (
                  <p className="text-xs text-gray-400 mt-1">
                    {selectedFloorPlan.width} × {selectedFloorPlan.height}
                  </p>
                )}
              </div>
            </div>
            
            <FloorPlanViewer
              floorPlanId={selectedFloorPlan.file_path}
              projectId={projectId}
              markers={markers}
              onMarkersChange={onMarkersChange}
            />
            
            <p className="text-xs text-gray-500 mt-2">
              Click anywhere on the floor plan to add a new marker
            </p>
          </div>
        </div>
      ) : null}

      <FloorPlanSelectionModal
        isOpen={showSelectionModal}
        onClose={() => setShowSelectionModal(false)}
        onFloorPlanSelect={handleFloorPlanSelect}
        selectedFloorPlanId={selectedFloorPlanId}
      />
    </div>
  );
};

export default FloorPlanSelector;
