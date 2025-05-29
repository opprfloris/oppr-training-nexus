
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { TrainingProjectMarker } from '@/types/training-projects';

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

interface MarkerContentCardProps {
  marker: TrainingProjectMarker;
  assignedContents: MarkerContent[];
  onAssignContent: (markerId: string) => void;
  onRemoveContent: (contentId: string) => void;
}

export const MarkerContentCard: React.FC<MarkerContentCardProps> = ({
  marker,
  assignedContents,
  onAssignContent,
  onRemoveContent
}) => {
  return (
    <Card className="border">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">
            Pin {marker.pin_number} - {marker.machine_qr_entity?.qr_name}
          </CardTitle>
          <Badge variant="outline">
            {assignedContents.length} Definition(s)
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {assignedContents.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <p>No training content assigned</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAssignContent(marker.id)}
              className="mt-2"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Assign Content
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {assignedContents.map(content => (
              <div key={content.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">
                    {content.training_definition_version?.training_definition?.title || 'Unknown Definition'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Version {content.training_definition_version?.version_number} • 
                    Status: {content.training_definition_version?.status}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveContent(content.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAssignContent(marker.id)}
              className="w-full mt-2"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Add More Content
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
