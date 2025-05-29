
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { TrainingProjectMarker, TrainingProjectContent } from '@/types/training-projects';
import { cn } from '@/lib/utils';

interface MarkerSequenceEditorProps {
  markers: TrainingProjectMarker[];
  content: TrainingProjectContent[];
  selectedMarkerId: string | null;
  onMarkerSelect: (markerId: string) => void;
  onSequenceChange: () => void;
}

const MarkerSequenceEditor: React.FC<MarkerSequenceEditorProps> = ({
  markers,
  content,
  selectedMarkerId,
  onMarkerSelect,
  onSequenceChange
}) => {
  const handleMoveMarker = (markerId: string, direction: 'up' | 'down') => {
    // This would integrate with the existing marker reordering logic
    // For now, we'll just trigger the callback
    onSequenceChange();
  };

  return (
    <div className="space-y-2">
      {markers.map((marker, index) => {
        const markerContent = content.find(c => c.marker_id === marker.id);
        const isSelected = selectedMarkerId === marker.id;
        
        return (
          <div
            key={marker.id}
            className={cn(
              "p-4 border rounded-lg cursor-pointer transition-colors",
              isSelected 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            )}
            onClick={() => onMarkerSelect(marker.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-medium text-sm">
                  {marker.sequence_order || marker.pin_number}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {marker.machine_qr_entity?.qr_name || `Marker ${marker.pin_number}`}
                  </div>
                  <div className="text-sm text-gray-600">
                    {marker.machine_qr_entity?.machine_id} • {marker.machine_qr_entity?.machine_type}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {markerContent ? (
                  <Badge 
                    variant={markerContent.training_definition_version?.status === 'published' ? 'default' : 'secondary'}
                  >
                    {markerContent.training_definition_version?.status === 'published' ? 'Published TD' : 'Draft TD'}
                  </Badge>
                ) : (
                  <Badge variant="outline">No TD</Badge>
                )}
                
                <div className="flex flex-col space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    disabled={index === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveMarker(marker.id, 'up');
                    }}
                  >
                    <ChevronUpIcon className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    disabled={index === markers.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveMarker(marker.id, 'down');
                    }}
                  >
                    <ChevronDownIcon className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
            
            {markerContent && (
              <div className="mt-2 ml-11">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">
                    {markerContent.training_definition_version?.training_definition?.title || 'Untitled Training'}
                  </span>
                  <span className="ml-2">
                    v{markerContent.training_definition_version?.version_number}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MarkerSequenceEditor;
