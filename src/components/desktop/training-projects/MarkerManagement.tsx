
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { TrainingProjectMarker } from '@/types/training-projects';
import MarkerTable from './MarkerTable';

interface MarkerManagementProps {
  projectId: string;
  floorPlanId: string | null;
  markers: TrainingProjectMarker[];
  onMarkersChange: () => void;
}

const MarkerManagement: React.FC<MarkerManagementProps> = ({
  projectId,
  floorPlanId,
  markers,
  onMarkersChange
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!floorPlanId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-medium text-gray-900">Training Markers</h4>
        </div>
        
        <div className="text-center py-8 bg-yellow-50 rounded-lg border border-yellow-200">
          <MapPinIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-sm text-yellow-700">Please select a floor plan to manage markers</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-medium text-gray-900">Training Markers</h4>
        <span className="text-sm text-gray-500">
          {markers.length} marker{markers.length !== 1 ? 's' : ''} added
        </span>
      </div>

      <MarkerTable 
        markers={markers}
        onMarkersChange={onMarkersChange}
      />
    </div>
  );
};

export default MarkerManagement;
