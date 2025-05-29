
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { TrainingProjectMarker, TrainingProjectContent } from '@/types/training-projects';

interface TrainingFlowOverviewProps {
  sortedMarkers: TrainingProjectMarker[];
  content: TrainingProjectContent[];
}

export const TrainingFlowOverview: React.FC<TrainingFlowOverviewProps> = ({
  sortedMarkers,
  content
}) => {
  if (sortedMarkers.length === 0) return null;

  return (
    <div className="border-t pt-6">
      <h4 className="text-base font-medium text-gray-900 mb-4">Training Flow Overview</h4>
      <div className="flex items-center space-x-2 overflow-x-auto pb-4">
        {sortedMarkers.map((marker, index) => {
          const markerContent = content.find(c => c.marker_id === marker.id);
          return (
            <React.Fragment key={marker.id}>
              <div className="flex-shrink-0 text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-medium mb-2">
                  {marker.sequence_order || marker.pin_number}
                </div>
                <div className="text-xs text-gray-600 max-w-20 truncate">
                  {marker.machine_qr_entity?.machine_id}
                </div>
                {markerContent ? (
                  <Badge 
                    variant={markerContent.training_definition_version?.status === 'published' ? 'default' : 'secondary'} 
                    className="text-xs mt-1"
                  >
                    {markerContent.training_definition_version?.status === 'published' ? 'Published' : 'Draft'}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs mt-1">No TD</Badge>
                )}
              </div>
              {index < sortedMarkers.length - 1 && (
                <ArrowRightIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
