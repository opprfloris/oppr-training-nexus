
import React from 'react';
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';
import { TrainingDefinition, TrainingDefinitionVersion } from '@/types/training-definitions';

interface BuilderBreadcrumbsProps {
  isNewDefinition: boolean;
  definition: TrainingDefinition | null;
  version: TrainingDefinitionVersion | null;
}

const BuilderBreadcrumbs: React.FC<BuilderBreadcrumbsProps> = ({
  isNewDefinition,
  definition,
  version
}) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <button 
          onClick={() => navigate('/desktop/training-definitions')}
          className="hover:text-oppr-blue flex items-center space-x-1"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Training Definitions</span>
        </button>
        <span>{'>'}</span>
        <span className="text-gray-900">
          {isNewDefinition ? 'New Training Definition' : definition?.title}
        </span>
        {!isNewDefinition && version && (
          <>
            <span>{'>'}</span>
            <span className="text-gray-900">
              {version.status === 'draft' ? 'Edit Draft' : `Version ${version.version_number}`}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default BuilderBreadcrumbs;
