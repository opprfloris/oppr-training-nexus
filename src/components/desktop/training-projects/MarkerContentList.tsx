
import React from 'react';
import { TrainingProjectMarker } from '@/types/training-projects';
import { MarkerContentCard } from './MarkerContentCard';
import { EmptyMarkersState } from './EmptyMarkersState';

interface MarkerContent {
  id: string;
  marker_id: string;
  training_definition_version_id: string | null;
  sequence_order: number;
  training_definition_version?: {
    id: string;
    version_number: string;
    status: 'draft' | 'published' | 'archived';
    training_definition: {
      title: string;
    };
  };
}

interface MarkerContentListProps {
  markers: TrainingProjectMarker[];
  markerContents: MarkerContent[];
  onAssignContent: (markerId: string) => void;
  onRemoveContent: (contentId: string) => void;
}

export const MarkerContentList: React.FC<MarkerContentListProps> = ({
  markers,
  markerContents,
  onAssignContent,
  onRemoveContent
}) => {
  if (markers.length === 0) {
    return <EmptyMarkersState />;
  }

  return (
    <div className="space-y-4">
      {markers.map(marker => {
        const assignedContents = markerContents.filter(c => c.marker_id === marker.id);
        
        return (
          <MarkerContentCard
            key={marker.id}
            marker={marker}
            assignedContents={assignedContents}
            onAssignContent={onAssignContent}
            onRemoveContent={onRemoveContent}
          />
        );
      })}
    </div>
  );
};
