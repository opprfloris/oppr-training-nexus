
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckBadgeIcon, PlayIcon } from "@heroicons/react/24/outline";
import { TrainingProject } from '@/types/training-projects';

interface ProjectHeaderProps {
  project: TrainingProject;
  saving: boolean;
  onSave: () => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  saving,
  onSave
}) => {
  const getStatusBadge = (status: string) => {
    const colors = {
      draft: 'text-amber-600 border-amber-200 bg-amber-50',
      scheduled: 'text-blue-600 border-blue-200 bg-blue-50',
      active: 'text-green-600 border-green-200 bg-green-50',
      stopped: 'text-red-600 border-red-200 bg-red-50',
      archived: 'text-gray-600 border-gray-200 bg-gray-50',
    };

    return (
      <Badge variant="outline" className={colors[status as keyof typeof colors] || ''}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="oppr-card p-8">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-3">
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            {getStatusBadge(project.status)}
          </div>
          <p className="text-gray-600 mb-2">ID: {project.project_id}</p>
          {project.description && (
            <p className="text-gray-600">{project.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Draft Project'}
          </Button>
          <Button variant="outline" size="sm">
            <CheckBadgeIcon className="w-4 h-4 mr-2" />
            Readiness Check
          </Button>
          <Button className="bg-oppr-blue hover:bg-oppr-blue/90">
            <PlayIcon className="w-4 h-4 mr-2" />
            Activate Project
          </Button>
        </div>
      </div>
    </div>
  );
};
