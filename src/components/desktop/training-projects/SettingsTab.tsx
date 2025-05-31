
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TrainingProject } from '@/types/training-projects';
import { useToast } from '@/hooks/use-toast';

interface SettingsTabProps {
  project: TrainingProject;
  onProjectUpdate: (updates: Partial<TrainingProject>) => Promise<void>;
  saving: boolean;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  project,
  onProjectUpdate,
  saving
}) => {
  const [localProject, setLocalProject] = useState(project);
  const { toast } = useToast();

  useEffect(() => {
    setLocalProject(project);
  }, [project]);

  const handleInputChange = (field: keyof TrainingProject, value: any) => {
    setLocalProject(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async () => {
    try {
      await onProjectUpdate({
        pass_fail_threshold: localProject.pass_fail_threshold,
        max_retake_attempts: localProject.max_retake_attempts,
        recommended_completion_time: localProject.recommended_completion_time,
        start_date: localProject.start_date,
        end_date: localProject.end_date
      });
      
      toast({
        title: "Success",
        description: "Project settings updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project settings",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-2">Training Settings</h3>
        <p className="text-gray-600">
          Configure training parameters and project timeline settings.
        </p>
      </div>

      {/* Training Parameters */}
      <div className="space-y-6">
        <h4 className="font-medium text-gray-900">Training Parameters</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pass/Fail Threshold (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={localProject.pass_fail_threshold}
              onChange={(e) => handleInputChange('pass_fail_threshold', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-oppr-blue focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum score required to pass the training</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Retake Attempts
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={localProject.max_retake_attempts}
              onChange={(e) => handleInputChange('max_retake_attempts', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-oppr-blue focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Number of times a trainee can retake the training</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recommended Completion Time
            </label>
            <input
              type="text"
              value={localProject.recommended_completion_time || ''}
              onChange={(e) => handleInputChange('recommended_completion_time', e.target.value)}
              placeholder="e.g., 2 hours, 45 minutes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-oppr-blue focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Estimated time to complete the training</p>
          </div>
        </div>
      </div>

      {/* Project Timeline */}
      <div className="space-y-6">
        <h4 className="font-medium text-gray-900">Project Timeline</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Training Start Date
            </label>
            <input
              type="date"
              value={localProject.start_date ? new Date(localProject.start_date).toISOString().split('T')[0] : ''}
              onChange={(e) => handleInputChange('start_date', e.target.value ? new Date(e.target.value + 'T00:00:00Z').toISOString() : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-oppr-blue focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">When learners can start this training</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Training End Date
            </label>
            <input
              type="date"
              value={localProject.end_date ? new Date(localProject.end_date).toISOString().split('T')[0] : ''}
              onChange={(e) => handleInputChange('end_date', e.target.value ? new Date(e.target.value + 'T23:59:59Z').toISOString() : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-oppr-blue focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Deadline for completing this training</p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4 border-t">
        <Button onClick={handleSaveSettings} disabled={saving}>
          {saving ? 'Saving Settings...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};
