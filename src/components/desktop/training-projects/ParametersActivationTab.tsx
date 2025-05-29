
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckBadgeIcon, PlayIcon, StopIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { TrainingProject } from '@/types/training-projects';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ParametersActivationTabProps {
  project: TrainingProject;
  onProjectUpdate: (updates: Partial<TrainingProject>) => Promise<void>;
  saving: boolean;
}

interface ReadinessCheck {
  name: string;
  completed: boolean;
  description: string;
}

export const ParametersActivationTab: React.FC<ParametersActivationTabProps> = ({
  project,
  onProjectUpdate,
  saving
}) => {
  const [localProject, setLocalProject] = useState(project);
  const [readinessChecks, setReadinessChecks] = useState<ReadinessCheck[]>([]);
  const [activating, setActivating] = useState(false);
  const [stopping, setStopping] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setLocalProject(project);
    checkProjectReadiness();
  }, [project]);

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

  const checkProjectReadiness = async () => {
    try {
      // Check floor plan and markers
      const hasFloorPlan = !!project.floor_plan_image_id;
      
      const { data: markers, error: markersError } = await supabase
        .from('training_project_markers')
        .select('id')
        .eq('training_project_id', project.id);

      if (markersError) throw markersError;
      const hasMarkers = markers && markers.length > 0;

      // Check training content
      const { data: content, error: contentError } = await supabase
        .from('training_project_content')
        .select(`
          id,
          training_definition_version:training_definition_versions(
            id,
            status
          )
        `)
        .eq('training_project_id', project.id);

      if (contentError) throw contentError;
      
      const hasContent = content && content.length > 0;
      const allContentPublished = content?.every(c => 
        c.training_definition_version?.status === 'published'
      ) ?? false;

      // Check operator assignments
      const { data: operators, error: operatorsError } = await supabase
        .from('training_project_operator_assignments')
        .select('id')
        .eq('training_project_id', project.id);

      if (operatorsError) throw operatorsError;
      const hasOperators = operators && operators.length > 0;

      const checks: ReadinessCheck[] = [
        {
          name: "Floor Plan & Markers",
          completed: hasFloorPlan && hasMarkers,
          description: "Floor plan selected with training markers placed"
        },
        {
          name: "Training Content",
          completed: hasContent && allContentPublished,
          description: "All markers have assigned published training definitions"
        },
        {
          name: "Learner Assignment",
          completed: hasOperators,
          description: "At least one operator assigned to the project"
        },
        {
          name: "Pass/Fail Threshold",
          completed: project.pass_fail_threshold >= 50,
          description: "Minimum pass threshold set (≥50%)"
        }
      ];

      setReadinessChecks(checks);
    } catch (error) {
      console.error('Error checking project readiness:', error);
    }
  };

  const handleActivateProject = async () => {
    if (!allChecksCompleted) {
      toast({
        title: "Cannot Activate",
        description: "Please complete all readiness checks before activating the project",
        variant: "destructive"
      });
      return;
    }

    try {
      setActivating(true);
      await onProjectUpdate({ status: 'active' });
      
      toast({
        title: "Success",
        description: "Training project has been activated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to activate project",
        variant: "destructive"
      });
    } finally {
      setActivating(false);
    }
  };

  const handleStopProject = async () => {
    try {
      setStopping(true);
      await onProjectUpdate({ status: 'stopped' });
      
      toast({
        title: "Success",
        description: "Training project has been stopped"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to stop project",
        variant: "destructive"
      });
    } finally {
      setStopping(false);
    }
  };

  const handleRunFullCheck = async () => {
    toast({
      title: "Running Check",
      description: "Performing full readiness check..."
    });
    
    await checkProjectReadiness();
    
    toast({
      title: "Check Complete",
      description: "Readiness check completed successfully"
    });
  };

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
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-gray-900">Project Readiness Check</h4>
          <Button variant="outline" onClick={handleRunFullCheck}>
            <CheckBadgeIcon className="w-4 h-4 mr-2" />
            Refresh Check
          </Button>
        </div>
        
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
                disabled={!allChecksCompleted || activating}
                onClick={handleActivateProject}
                className="bg-green-600 hover:bg-green-700"
              >
                <PlayIcon className="w-4 h-4 mr-2" />
                {activating ? 'Activating...' : 'Activate Project'}
              </Button>
            )}
            
            {project.status === 'active' && (
              <Button 
                variant="destructive" 
                onClick={handleStopProject}
                disabled={stopping}
              >
                <StopIcon className="w-4 h-4 mr-2" />
                {stopping ? 'Stopping...' : 'Stop Project'}
              </Button>
            )}

            <Button variant="outline" onClick={handleRunFullCheck}>
              <CheckBadgeIcon className="w-4 h-4 mr-2" />
              Run Full Readiness Check
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
