
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  PlusIcon, 
  LinkIcon, 
  PencilIcon, 
  LinkSlashIcon, 
  DocumentDuplicateIcon 
} from '@heroicons/react/24/outline';
import { TrainingProjectContent } from '@/types/training-projects';

interface TrainingDefinitionActionsProps {
  selectedMarkerContent: TrainingProjectContent | null;
  onLinkExistingTD: () => void;
  onCreateNewTD: () => void;
  onCopyTDAsDraft: () => void;
  onEditDraftTD: () => void;
  onUnlinkTD: () => void;
}

export const TrainingDefinitionActions: React.FC<TrainingDefinitionActionsProps> = ({
  selectedMarkerContent,
  onLinkExistingTD,
  onCreateNewTD,
  onCopyTDAsDraft,
  onEditDraftTD,
  onUnlinkTD
}) => {
  return (
    <div className="space-y-3">
      <Button 
        variant="outline" 
        className="w-full justify-start"
        onClick={onLinkExistingTD}
      >
        <LinkIcon className="w-4 h-4 mr-2" />
        Link Existing Published TD...
      </Button>

      <Button 
        variant="outline" 
        className="w-full justify-start"
        onClick={onCreateNewTD}
      >
        <PlusIcon className="w-4 h-4 mr-2" />
        Create New Draft TD for this Marker...
      </Button>

      <Button 
        variant="outline" 
        className="w-full justify-start"
        onClick={onCopyTDAsDraft}
      >
        <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
        Copy Published TD as New Draft...
      </Button>

      {selectedMarkerContent?.training_definition_version?.status === 'draft' && (
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={onEditDraftTD}
        >
          <PencilIcon className="w-4 h-4 mr-2" />
          Edit Associated Draft TD
        </Button>
      )}

      {selectedMarkerContent && (
        <Button 
          variant="destructive" 
          className="w-full justify-start"
          onClick={onUnlinkTD}
        >
          <LinkSlashIcon className="w-4 h-4 mr-2" />
          Unlink TD
        </Button>
      )}
    </div>
  );
};
