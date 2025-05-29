
import React from 'react';
import { StepBlock, TrainingDefinition, TrainingDefinitionVersion } from '@/types/training-definitions';

interface DebugInfoProps {
  id: string | undefined;
  pathname: string;
  isNewDefinition: boolean;
  loading: boolean;
  mobileActivePanel: 'palette' | 'canvas' | 'config';
  title: string;
  description: string;
  definition: TrainingDefinition | null;
  version: TrainingDefinitionVersion | null;
  steps: StepBlock[];
  selectedBlockId: string | null;
}

const DebugInfo: React.FC<DebugInfoProps> = ({
  id,
  pathname,
  isNewDefinition,
  loading,
  mobileActivePanel,
  title,
  description,
  definition,
  version,
  steps,
  selectedBlockId
}) => {
  return (
    <div className="bg-gray-50 border-t border-gray-200 p-3 lg:p-4">
      <details className="group">
        <summary className="cursor-pointer font-medium text-gray-900 text-sm lg:text-base">
          Debug Info & Status
        </summary>
        <div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-2 text-xs lg:text-sm text-gray-600">
          <div>
            <p>Route ID: {id}</p>
            <p>Pathname: {pathname}</p>
            <p>Is New: {isNewDefinition ? 'Yes' : 'No'}</p>
            <p>Loading: {loading ? 'Yes' : 'No'}</p>
            <p>Mobile Panel: {mobileActivePanel}</p>
          </div>
          <div>
            <p>Title: {title || 'Not set'}</p>
            <p>Description: {description || 'Not set'}</p>
            <p>Definition ID: {definition?.id || 'None'}</p>
            <p>Version: {version?.version_number || 'None'}</p>
            <p>Steps Count: {steps.length}</p>
            <p>Selected Block: {selectedBlockId || 'None'}</p>
          </div>
        </div>
        <p className="text-xs lg:text-sm text-green-600 font-medium mt-2">
          Status: Phase 5C complete - UI Polish & Mobile Responsiveness
        </p>
      </details>
    </div>
  );
};

export default DebugInfo;
