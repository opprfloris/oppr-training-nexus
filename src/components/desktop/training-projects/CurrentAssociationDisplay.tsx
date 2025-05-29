
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { TrainingProjectContent } from '@/types/training-projects';

interface CurrentAssociationDisplayProps {
  selectedMarkerContent: TrainingProjectContent | null;
}

export const CurrentAssociationDisplay: React.FC<CurrentAssociationDisplayProps> = ({
  selectedMarkerContent
}) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Current Association:</span>
      </div>
      {selectedMarkerContent ? (
        <div className="flex items-center space-x-3">
          <DocumentTextIcon className="w-5 h-5 text-gray-400" />
          <div className="flex-1">
            <p className="font-medium text-gray-900">
              {selectedMarkerContent.training_definition_version?.training_definition?.title || 'Untitled Training'}
            </p>
            <p className="text-sm text-gray-600">
              Version {selectedMarkerContent.training_definition_version?.version_number} • 
              <Badge 
                variant={selectedMarkerContent.training_definition_version?.status === 'published' ? 'default' : 'secondary'} 
                className="ml-2"
              >
                {selectedMarkerContent.training_definition_version?.status}
              </Badge>
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 italic">No training definition assigned</p>
      )}
    </div>
  );
};
