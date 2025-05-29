
import React from 'react';
import { TrainingProject, TrainingProjectMarker } from '@/types/training-projects';
import FloorPlanSelector from './FloorPlanSelector';
import MarkerManagement from './MarkerManagement';

interface FloorPlanMarkerTabProps {
  project: TrainingProject;
  markers: TrainingProjectMarker[];
  onFloorPlanSelect: (floorPlanId: string) => Promise<void>;
  onMarkersChange: () => void;
  saving: boolean;
}

export const FloorPlanMarkerTab: React.FC<FloorPlanMarkerTabProps> = ({
  project,
  markers,
  onFloorPlanSelect,
  onMarkersChange,
  saving
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Floor Plan Selection</h3>
        <p className="text-gray-600 mb-6">
          Choose a floor plan as the foundation for your training project. You can then add markers to specific locations.
        </p>
        
        <FloorPlanSelector
          selectedFloorPlanId={project.floor_plan_image_id}
          onFloorPlanSelect={onFloorPlanSelect}
          projectId={project.id}
          markers={markers}
          onMarkersChange={onMarkersChange}
        />
      </div>

      {project.floor_plan_image_id && (
        <div className="border-t pt-8">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Training Markers</h3>
            <p className="text-gray-600">
              Click on the floor plan to add markers at specific locations. Each marker represents a training station or checkpoint.
            </p>
          </div>
          
          <MarkerManagement
            projectId={project.id}
            floorPlanId={project.floor_plan_image_id}
            markers={markers}
            onMarkersChange={onMarkersChange}
          />
        </div>
      )}

      {!project.floor_plan_image_id && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">🗺️</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Floor Plan Selected</h3>
          <p className="text-gray-600">
            Select a floor plan above to start adding training markers to your project.
          </p>
        </div>
      )}
    </div>
  );
};
