
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TrainingProject, TrainingProjectOperatorAssignment, TrainingProjectCollaborator } from '@/types/training-projects';
import { AssignOperatorsModal } from './AssignOperatorsModal';
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
  const [operatorAssignments, setOperatorAssignments] = useState<TrainingProjectOperatorAssignment[]>([]);
  const [collaborators, setCollaborators] = useState<TrainingProjectCollaborator[]>([]);
  const [showOperatorModal, setShowOperatorModal] = useState(false);
  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAssignments();
  }, [project.id]);

  const loadAssignments = async () => {
    setLoading(true);
    try {
      // Load operator assignments
      const { data: operators, error: operatorError } = await supabase
        .from('training_project_operator_assignments')
        .select(`
          *,
          operator:profiles!operator_id(
            first_name,
            last_name,
            email,
            department
          )
        `)
        .eq('training_project_id', project.id);

      if (operatorError) throw operatorError;

      // Load collaborators
      const { data: collabs, error: collabError } = await supabase
        .from('training_project_collaborators')
        .select(`
          *,
          collaborator:profiles!collaborator_id(
            first_name,
            last_name,
            email,
            department
          )
        `)
        .eq('training_project_id', project.id);

      if (collabError) throw collabError;

      setOperatorAssignments(operators || []);
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

  const handleRemoveOperator = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from('training_project_operator_assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Operator removed successfully"
      });

      loadAssignments();
      onAccessChange();
    } catch (error) {
      console.error('Error removing operator:', error);
      toast({
        title: "Error",
        description: "Failed to remove operator",
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

  const handleOperatorAssigned = () => {
    setShowOperatorModal(false);
    loadAssignments();
    onAccessChange();
    toast({
      title: "Success",
      description: "Operators assigned successfully"
    });
  };

  const handleCollaboratorAssigned = () => {
    setShowCollaboratorModal(false);
    loadAssignments();
    onAccessChange();
    toast({
      title: "Success",
      description: "Collaborators assigned successfully"
    });
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

      {/* Operators Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Assigned Operators</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOperatorModal(true)}
            >
              <UserPlusIcon className="w-4 h-4 mr-2" />
              Assign Operators
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {operatorAssignments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No operators assigned to this project</p>
              <p className="text-sm mt-1">Click "Assign Operators" to add learners</p>
            </div>
          ) : (
            <div className="space-y-3">
              {operatorAssignments.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">
                      {assignment.operator?.first_name} {assignment.operator?.last_name}
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
                    onClick={() => handleRemoveOperator(assignment.id)}
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
                    <div className="font-medium">
                      {collaborator.collaborator?.first_name} {collaborator.collaborator?.last_name}
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
      <AssignOperatorsModal
        isOpen={showOperatorModal}
        onClose={() => setShowOperatorModal(false)}
        onOperatorsAssigned={handleOperatorAssigned}
        projectId={project.id}
        currentOperatorIds={operatorAssignments.map(a => a.operator_id)}
      />

      <AssignCollaboratorsModal
        isOpen={showCollaboratorModal}
        onClose={() => setShowCollaboratorModal(false)}
        onCollaboratorsAssigned={handleCollaboratorAssigned}
        projectId={project.id}
        currentCollaboratorIds={collaborators.map(c => c.collaborator_id)}
      />
    </div>
  );
};
