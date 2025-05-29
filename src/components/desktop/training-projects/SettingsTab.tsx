
import React from 'react';
import { TrainingProject } from '@/types/training-projects';

interface SettingsTabProps {
  project: TrainingProject;
  onProjectChange: (updatedProject: TrainingProject) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  project,
  onProjectChange
}) => {
  const handleInputChange = (field: keyof TrainingProject, value: string) => {
    onProjectChange({ ...project, [field]: value });
  };

  return (
    <div className="space-y-8">
      <h3 className="text-lg font-medium">Project Settings & Shell</h3>
      <div className="grid gap-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Training Project ID
          </label>
          <input
            type="text"
            value={project.project_id}
            readOnly
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Training Project Name *
          </label>
          <input
            type="text"
            value={project.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-oppr-blue focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Description
          </label>
          <textarea
            value={project.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-oppr-blue focus:border-transparent"
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Color Code
            </label>
            <input
              type="color"
              value={project.color_code}
              onChange={(e) => handleInputChange('color_code', e.target.value)}
              className="w-full h-12 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Icon
            </label>
            <input
              type="text"
              value={project.icon}
              onChange={(e) => handleInputChange('icon', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-oppr-blue focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
