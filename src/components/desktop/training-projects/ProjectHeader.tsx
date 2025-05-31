
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckBadgeIcon, PlayIcon, StopIcon, ArrowPathIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { TrainingProject } from '@/types/training-projects';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProjectHeaderProps {
  project: TrainingProject;
  saving: boolean;
  onSave: () => void;
  onProjectUpdate: (updates: Partial<TrainingProject>) => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  saving,
  onSave,
  onProjectUpdate
}) => {
  const [updating, setUpdating] = useState(false);
  const [readinessChecks, setReadinessChecks] = useState<any[]>([]);
  const [showReadinessModal, setShowReadinessModal] = useState(false);
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    const colors = {
      draft: 'text-amber-600 border-amber-200 bg-amber-50',
      published: 'text-blue-600 border-blue-200 bg-blue-50',
      active: 'text-green-600 border-green-200 bg-green-50',
      stopped: 'text-yellow-600 border-yellow-200 bg-yellow-50',
      archived: 'text-gray-600 border-gray-200 bg-gray-50',
    };

    return (
      <Badge variant="outline" className={colors[status as keyof typeof colors] || ''}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const checkProjectReadiness = async () => {
    try {
      // Check floor plan and markers
      const hasFloorPlan = !!project.floor_plan_image_id;
      
      const { data: markers } = await supabase
        .from('training_project_markers')
        .select('id')
        .eq('training_project_id', project.id);

      const hasMarkers = markers && markers.length > 0;

      // Check training content
      const { data: content } = await supabase
        .from('training_project_content')
        .select(`
          id,
          training_definition_version:training_definition_versions(
            id,
            status
          )
        `)
        .eq('training_project_id', project.id);

      const hasContent = content && content.length > 0;
      const allContentPublished = content?.every(c => 
        c.training_definition_version?.status === 'published'
      ) ?? false;

      // Check learner assignments (both operators and managers)
      const { data: learners } = await supabase
        .from('training_project_operator_assignments')
        .select('id')
        .eq('training_project_id', project.id);

      const hasLearners = learners && learners.length > 0;

      const checks = [
        {
          name: "Floor Plan & Markers",
          completed: hasFloorPlan && hasMarkers,
          description: "Floor plan selected with training markers placed"
        },
        {
          name: "Training Content",
          completed: hasContent && allContentPublished,
          description: "All markers have published training definitions"
        },
        {
          name: "Learner Assignment",
          completed: hasLearners,
          description: "At least one learner assigned to the project"
        },
        {
          name: "Pass/Fail Threshold",
          completed: project.pass_fail_threshold >= 50,
          description: "Minimum pass threshold set (≥50%)"
        }
      ];

      setReadinessChecks(checks);
      return checks;
    } catch (error) {
      console.error('Error checking project readiness:', error);
      return [];
    }
  };

  const handlePublishProject = async () => {
    const checks = await checkProjectReadiness();
    const completedChecks = checks.filter(check => check.completed).length;
    const isReady = completedChecks === checks.length;

    if (!isReady) {
      setShowReadinessModal(true);
      return;
    }

    try {
      setUpdating(true);
      await updateProjectStatus('published');
      
      toast({
        title: "Success",
        description: "Training project published successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish project",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleActivateProject = async () => {
    if (project.status === 'draft') {
      await handlePublishProject();
      return;
    }

    try {
      setUpdating(true);
      await updateProjectStatus('active');
      
      toast({
        title: "Success",
        description: "Training project activated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to activate project",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleStopProject = async () => {
    try {
      setUpdating(true);
      await updateProjectStatus('stopped');
      
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
      setUpdating(false);
    }
  };

  const handleReactivateProject = async () => {
    try {
      setUpdating(true);
      await updateProjectStatus('active');
      
      toast({
        title: "Success",
        description: "Training project reactivated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reactivate project",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const updateProjectStatus = async (status: string) => {
    const { error } = await supabase
      .from('training_projects')
      .update({ status })
      .eq('id', project.id);

    if (error) throw error;

    onProjectUpdate({ status });
  };

  const getActionButton = () => {
    switch (project.status) {
      case 'draft':
        return (
          <Button 
            onClick={handleActivateProject}
            disabled={updating}
            className="bg-green-600 hover:bg-green-700"
          >
            <PlayIcon className="w-4 h-4 mr-2" />
            {updating ? 'Publishing...' : 'Publish & Activate'}
          </Button>
        );
      case 'published':
        return (
          <Button 
            onClick={handleActivateProject}
            disabled={updating}
            className="bg-green-600 hover:bg-green-700"
          >
            <PlayIcon className="w-4 h-4 mr-2" />
            {updating ? 'Activating...' : 'Activate Project'}
          </Button>
        );
      case 'active':
        return (
          <Button 
            variant="destructive"
            onClick={handleStopProject}
            disabled={updating}
          >
            <StopIcon className="w-4 h-4 mr-2" />
            {updating ? 'Stopping...' : 'Stop Project'}
          </Button>
        );
      case 'stopped':
        return (
          <Button 
            onClick={handleReactivateProject}
            disabled={updating}
            className="bg-green-600 hover:bg-green-700"
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            {updating ? 'Reactivating...' : 'Reactivate Project'}
          </Button>
        );
      default:
        return null;
    }
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
          {project.status === 'draft' && (
            <Button
              variant="outline"
              onClick={onSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => checkProjectReadiness().then(() => setShowReadinessModal(true))}
          >
            <CheckBadgeIcon className="w-4 h-4 mr-2" />
            Check Readiness
          </Button>
          {getActionButton()}
        </div>
      </div>

      {/* Readiness Modal */}
      {showReadinessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Project Readiness Check</h3>
            <div className="space-y-3 mb-6">
              {readinessChecks.map((check, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    check.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {check.completed ? '✓' : '○'}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{check.name}</p>
                    <p className="text-xs text-gray-600">{check.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowReadinessModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
