
import React, { useState } from 'react';
import { EyeIcon } from "@heroicons/react/24/outline";
import { Button } from '@/components/ui/button';
import { StepBlock } from '@/types/training-definitions';
import PublishVersionModal from './PublishVersionModal';
import PreviewModal from './PreviewModal';

interface BuilderControlsProps {
  saving: boolean;
  onSaveDraft: () => void;
  title: string;
  steps: StepBlock[];
  definitionId?: string;
  currentVersion?: string;
  onPublishSuccess?: () => void;
}

const BuilderControls: React.FC<BuilderControlsProps> = ({
  saving,
  onSaveDraft,
  title,
  steps,
  definitionId,
  currentVersion,
  onPublishSuccess
}) => {
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const canPublish = title.trim() && steps.length > 0 && definitionId && currentVersion;

  const handlePreview = () => {
    setShowPreviewModal(true);
  };

  const handlePublish = () => {
    if (canPublish) {
      setShowPublishModal(true);
    }
  };

  const handlePublishSuccess = () => {
    if (onPublishSuccess) {
      onPublishSuccess();
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={onSaveDraft}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button
            variant="outline"
            onClick={handlePreview}
          >
            <EyeIcon className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
        <Button
          onClick={handlePublish}
          className="oppr-button-primary"
          disabled={!canPublish}
          title={!canPublish ? 'Add a title and at least one step to publish' : 'Publish this version'}
        >
          Publish Version
        </Button>
      </div>

      {definitionId && currentVersion && (
        <PublishVersionModal
          isOpen={showPublishModal}
          onClose={() => setShowPublishModal(false)}
          definitionId={definitionId}
          currentVersion={currentVersion}
          onPublishSuccess={handlePublishSuccess}
        />
      )}

      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        steps={steps}
        title={title}
      />
    </>
  );
};

export default BuilderControls;
