
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, UserIcon, TrashIcon } from '@heroicons/react/24/outline';
import { TrainingProject, TrainingProjectOperatorAssignment, TrainingProjectCollaborator } from '@/types/training-projects';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AssignOperatorsModal } from './AssignOperatorsModal';
import { AssignCollaboratorsModal } from './AssignCollaboratorsModal';

interface UserAccessTabProps {
  project: TrainingProject;
  onAccessChange: () => void;
}

export const UserAccessTab: React.FC<UserAccessTabProps> = ({
  project,
  onAccessChange
}) => {
  const [operators, setOperators] = useState<TrainingProjectOperatorAssignment[]>([]);
  const [collaborators, setCollaborators] = useState<TrainingProjectCollaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOperatorsModal, setShowOperatorsModal] = useState(false);
  const [showCollaboratorsModal, setShowCollaboratorsModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUserAccess();
  }, [project.id]);

  const loadUserAccess = async () => {
    try {
      // Load operators
      const { data: operatorData, error: operatorError } = await supabase
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
      const { data: collaboratorData, error: collaboratorError } = await supabase
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

      if (collaboratorError) throw collaboratorError;

      setOperators(operatorData || []);
      setCollaborators(collaboratorData || []);
    } catch (error) {
      console.error('Error loading user access:', error);
      toast({
        title: "Error",
        description: "Failed to load user access information",
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

      loadUserAccess();
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

  const handleRemoveCollaborator = async (collaborationId: string) => {
    try {
      const { error } = await supabase
        .from('training_project_collaborators')
        .delete()
        .eq('id', collaborationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Collaborator removed successfully"
      });

      loadUserAccess();
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

  const getUserDisplayName = (user: any) => {
    if (user?.first_name || user?.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user?.email || 'Unknown User';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-2">User Access Management</h3>
        <p className="text-gray-600">
          Assign operators who will take the training and collaborators who can help manage the project.
        </p>
      </div>

      {/* Operators Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Training Operators</h4>
            <p className="text-sm text-gray-600">Users who will complete this training project</p>
          </div>
          <Button variant="outline" onClick={() => setShowOperatorsModal(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Assign Operators
          </Button>
        </div>

        {operators.length > 0 ? (
          <div className="space-y-2">
            {operators.map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {getUserDisplayName(assignment.operator)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {assignment.operator?.email} • {assignment.operator?.department || 'No department'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Operator</Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleRemoveOperator(assignment.id)}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <UserIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No operators assigned yet</p>
            <p className="text-sm text-gray-500 mt-1">Assign operators who will take this training</p>
          </div>
        )}
      </div>

      {/* Collaborators Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Project Collaborators</h4>
            <p className="text-sm text-gray-600">Users who can help manage and monitor this training project</p>
          </div>
          <Button variant="outline" onClick={() => setShowCollaboratorsModal(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Collaborators
          </Button>
        </div>

        {collaborators.length > 0 ? (
          <div className="space-y-2">
            {collaborators.map((collaboration) => (
              <div key={collaboration.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {getUserDisplayName(collaboration.collaborator)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {collaboration.collaborator?.email} • {collaboration.collaborator?.department || 'No department'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                    Collaborator
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleRemoveCollaborator(collaboration.id)}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <UserIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No collaborators assigned yet</p>
            <p className="text-sm text-gray-500 mt-1">Add collaborators to help manage this project</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AssignOperatorsModal
        isOpen={showOperatorsModal}
        onClose={() => setShowOperatorsModal(false)}
        projectId={project.id}
        onAssignmentComplete={() => {
          loadUserAccess();
          onAccessChange();
        }}
      />

      <AssignCollaboratorsModal
        isOpen={showCollaboratorsModal}
        onClose={() => setShowCollaboratorsModal(false)}
        projectId={project.id}
        onAssignmentComplete={() => {
          loadUserAccess();
          onAccessChange();
        }}
      />
    </div>
  );
};
