
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TrainingProject, TrainingProjectOperatorAssignment, TrainingProjectCollaborator } from '@/types/training-projects';
import { AssignLearnersModal } from './AssignLearnersModal';
import { AssignCollaboratorsModal } from './AssignCollaboratorsModal';
import { UserPlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface UserAccessTabProps {
  project: TrainingProject;
  onAccessChange: () => void;
}

export const UserAccessTab: React.FC<UserAccessTabProps> = ({ 
  project,
  onAccessChange 
}) => {
  const [learnerAssignments, setLearnerAssignments] = useState<TrainingProjectOperatorAssignment[]>([]);
  const [collaborators, setCollaborators] = useState<TrainingProjectCollaborator[]>([]);
  const [showLearnerModal, setShowLearnerModal] = useState(false);
  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAssignments();
  }, [project.id]);

  const loadAssignments = async () => {
    setLoading(true);
    try {
      // Load learner assignments (operators and managers)
      const { data: learners, error: learnerError } = await supabase
        .from('training_project_operator_assignments')
        .select(`
          *,
          operator:profiles!operator_id(
            first_name,
            last_name,
            email,
            department,
            role
          )
        `)
        .eq('training_project_id', project.id);

      if (learnerError) throw learnerError;

      // Load collaborators
      const { data: collabs, error: collabError } = await supabase
        .from('training_project_collaborators')
        .select(`
          *,
          collaborator:profiles!collaborator_id(
            first_name,
            last_name,
            email,
            department,
            role
          )
        `)
        .eq('training_project_id', project.id);

      if (collabError) throw collabError;

      setLearnerAssignments(learners || []);
      setCollaborators(collabs || []);
    } catch (error) {
      console.error('Error loading assignments:', error);
      toast({
        title: "Error",
        description: "Failed to load user assignments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLearner = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from('training_project_operator_assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Learner removed successfully"
      });

      loadAssignments();
      onAccessChange();
    } catch (error) {
      console.error('Error removing learner:', error);
      toast({
        title: "Error",
        description: "Failed to remove learner",
        variant: "destructive"
      });
    }
  };

  const handleRemoveCollaborator = async (collaboratorId: string) => {
    try {
      const { error } = await supabase
        .from('training_project_collaborators')
        .delete()
        .eq('id', collaboratorId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Collaborator removed successfully"
      });

      loadAssignments();
      onAccessChange();
    } catch (error) {
      console.error('Error removing collaborator:', error);
      toast({
        title: "Error",
        description: "Failed to remove collaborator",
        variant: "destructive"
      });
    }
  };

  const handleLearnerAssignmentComplete = () => {
    setShowLearnerModal(false);
    loadAssignments();
    onAccessChange();
    toast({
      title: "Success",
      description: "Learners assigned successfully"
    });
  };

  const handleCollaboratorAssignmentComplete = () => {
    setShowCollaboratorModal(false);
    loadAssignments();
    onAccessChange();
    toast({
      title: "Success",
      description: "Collaborators assigned successfully"
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Manager':
        return 'bg-purple-100 text-purple-800';
      case 'Operator':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">User Access Management</h3>
        <p className="text-gray-600">
          Manage who can access and collaborate on this training project.
        </p>
      </div>

      {/* Learners Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Assigned Learners</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLearnerModal(true)}
            >
              <UserPlusIcon className="w-4 h-4 mr-2" />
              Assign Learners
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {learnerAssignments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No learners assigned to this project</p>
              <p className="text-sm mt-1">Click "Assign Learners" to add operators or managers</p>
            </div>
          ) : (
            <div className="space-y-3">
              {learnerAssignments.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="font-medium">
                        {assignment.operator?.first_name} {assignment.operator?.last_name}
                      </div>
                      <Badge className={`text-xs ${getRoleBadgeColor(assignment.operator?.role || '')}`}>
                        {assignment.operator?.role}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">{assignment.operator?.email}</div>
                    {assignment.operator?.department && (
                      <Badge variant="secondary" className="mt-1">
                        {assignment.operator.department}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveLearner(assignment.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Collaborators Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Project Collaborators</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCollaboratorModal(true)}
            >
              <UserPlusIcon className="w-4 h-4 mr-2" />
              Add Collaborators
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {collaborators.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No collaborators added to this project</p>
              <p className="text-sm mt-1">Click "Add Collaborators" to invite team members</p>
            </div>
          ) : (
            <div className="space-y-3">
              {collaborators.map((collaborator) => (
                <div key={collaborator.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="font-medium">
                        {collaborator.collaborator?.first_name} {collaborator.collaborator?.last_name}
                      </div>
                      <Badge className={`text-xs ${getRoleBadgeColor(collaborator.collaborator?.role || '')}`}>
                        {collaborator.collaborator?.role}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">{collaborator.collaborator?.email}</div>
                    {collaborator.collaborator?.department && (
                      <Badge variant="secondary" className="mt-1">
                        {collaborator.collaborator.department}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCollaborator(collaborator.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AssignLearnersModal
        isOpen={showLearnerModal}
        onClose={() => setShowLearnerModal(false)}
        onAssignmentComplete={handleLearnerAssignmentComplete}
        projectId={project.id}
      />

      <AssignCollaboratorsModal
        isOpen={showCollaboratorModal}
        onClose={() => setShowCollaboratorModal(false)}
        onAssignmentComplete={handleCollaboratorAssignmentComplete}
        projectId={project.id}
      />
    </div>
  );
};
