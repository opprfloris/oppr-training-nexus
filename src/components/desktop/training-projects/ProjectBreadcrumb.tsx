
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface ProjectBreadcrumbProps {
  projectId: string;
  activeTab: string;
}

export const ProjectBreadcrumb: React.FC<ProjectBreadcrumbProps> = ({
  projectId,
  activeTab
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
      <button 
        onClick={() => navigate('/desktop/training-projects')}
        className="hover:text-gray-900 flex items-center space-x-1"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        <span>Training Projects</span>
      </button>
      <span>/</span>
      <span className="text-gray-900">{projectId}</span>
      <span>/</span>
      <span className="text-gray-900">Edit</span>
      <span>/</span>
      <span className="text-gray-900 capitalize">{activeTab.replace('-', ' & ')}</span>
    </div>
  );
};
