
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckBadgeIcon, PlayIcon, StopIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { TrainingProject } from '@/types/training-projects';
import { useToast } from '@/hooks/use-toast';

interface ParametersActivationTabProps {
  project: TrainingProject;
  onProjectUpdate: (updates: Partial<TrainingProject>) => Promise<void>;
  saving: boolean;
}

export const ParametersActivationTab: React.FC<ParametersActivationTabProps> = ({
  project,
  onProjectUpdate,
  saving
}) => {
  const [localProject, setLocalProject] = useState(project);
  const { toast } = useToast();

  const handleInputChange = (field: keyof TrainingProject, value: any) => {
    setLocalProject(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveParameters = async () => {
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
        description: "Project parameters updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project parameters",
        variant: "destructive"
      });
    }
  };

  const getReadinessChecks = () => {
    const checks = [
      {
        name: "Floor Plan & Markers",
        completed: !!project.floor_plan_image_id,
        description: "Floor plan selected with training markers placed"
      },
      {
        name: "Training Content",
        completed: false, // This would need to check actual content
        description: "All markers have assigned training definitions"
      },
      {
        name: "Learner Assignment",
        completed: false, // This would need to check operator assignments
        description: "At least one operator assigned to the project"
      },
      {
        name: "Pass/Fail Threshold",
        completed: project.pass_fail_threshold >= 50,
        description: "Minimum pass threshold set (≥50%)"
      }
    ];

    return checks;
  };

  const readinessChecks = getReadinessChecks();
  const allChecksCompleted = readinessChecks.every(check => check.completed);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-2">Training Parameters & Activation</h3>
        <p className="text-gray-600">
          Configure training parameters, review readiness, and activate your training project.
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

          <div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Training Start Date
            </label>
            <input
              type="datetime-local"
              value={localProject.start_date ? new Date(localProject.start_date).toISOString().slice(0, 16) : ''}
              onChange={(e) => handleInputChange('start_date', e.target.value ? new Date(e.target.value).toISOString() : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-oppr-blue focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Training End Date
            </label>
            <input
              type="datetime-local"
              value={localProject.end_date ? new Date(localProject.end_date).toISOString().slice(0, 16) : ''}
              onChange={(e) => handleInputChange('end_date', e.target.value ? new Date(e.target.value).toISOString() : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-oppr-blue focus:border-transparent"
            />
          </div>
        </div>

        <Button onClick={handleSaveParameters} disabled={saving}>
          {saving ? 'Saving...' : 'Save Parameters'}
        </Button>
      </div>

      {/* Readiness Check */}
      <div className="space-y-6">
        <h4 className="font-medium text-gray-900">Project Readiness Check</h4>
        
        <div className="space-y-3">
          {readinessChecks.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  check.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {check.completed ? '✓' : '○'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{check.name}</p>
                  <p className="text-sm text-gray-600">{check.description}</p>
                </div>
              </div>
              <Badge variant={check.completed ? "default" : "outline"}>
                {check.completed ? 'Complete' : 'Pending'}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Activation Controls */}
      <div className="space-y-6">
        <h4 className="font-medium text-gray-900">Project Activation</h4>
        
        <div className="p-6 border rounded-lg bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium text-gray-900">Current Status: {project.status}</p>
              <p className="text-sm text-gray-600 mt-1">
                {allChecksCompleted 
                  ? 'Project is ready for activation' 
                  : 'Complete all readiness checks before activation'
                }
              </p>
            </div>
            <Badge variant={project.status === 'active' ? 'default' : 'outline'}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </Badge>
          </div>

          <div className="flex space-x-3">
            {project.status === 'draft' && (
              <Button 
                disabled={!allChecksCompleted}
                className="bg-green-600 hover:bg-green-700"
              >
                <PlayIcon className="w-4 h-4 mr-2" />
                Activate Project
              </Button>
            )}
            
            {project.status === 'active' && (
              <Button variant="destructive">
                <StopIcon className="w-4 h-4 mr-2" />
                Stop Project
              </Button>
            )}

            <Button variant="outline">
              <CheckBadgeIcon className="w-4 h-4 mr-2" />
              Run Full Readiness Check
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
