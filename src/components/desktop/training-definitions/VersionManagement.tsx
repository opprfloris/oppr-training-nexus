
import React from 'react';
import VersionHistoryModal from './VersionHistoryModal';
import { TrainingDefinition } from '@/types/training-definitions';

interface VersionManagementProps {
  definition: TrainingDefinition | null;
  showVersionHistory: boolean;
  setShowVersionHistory: (show: boolean) => void;
  onCreateNewVersion: (sourceVersionId: string) => void;
}

const VersionManagement: React.FC<VersionManagementProps> = ({
  definition,
  showVersionHistory,
  setShowVersionHistory,
  onCreateNewVersion
}) => {
  if (!definition) return null;

  return (
    <VersionHistoryModal
      isOpen={showVersionHistory}
      onClose={() => setShowVersionHistory(false)}
      definitionId={definition.id}
      definitionTitle={definition.title}
      onCreateNewVersion={onCreateNewVersion}
    />
  );
};

export default VersionManagement;
