
import React from 'react';
import { EyeIcon } from "@heroicons/react/24/outline";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface BuilderControlsProps {
  saving: boolean;
  onSaveDraft: () => void;
  title: string;
  stepsCount: number;
}

const BuilderControls: React.FC<BuilderControlsProps> = ({
  saving,
  onSaveDraft,
  title,
  stepsCount
}) => {
  const { toast } = useToast();

  const handlePreview = () => {
    toast({
      title: "Coming Soon",
      description: "Preview functionality will be implemented next",
    });
  };

  const handlePublish = () => {
    toast({
      title: "Coming Soon",
      description: "Publish functionality will be implemented next",
    });
  };

  return (
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
        disabled={!title.trim() || stepsCount === 0}
      >
        Publish Version
      </Button>
    </div>
  );
};

export default BuilderControls;
