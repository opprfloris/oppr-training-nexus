
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  department: string | null;
  role: string;
}

interface AssignLearnersModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onAssignmentComplete: () => void;
}

export const AssignLearnersModal: React.FC<AssignLearnersModalProps> = ({
  isOpen,
  onClose,
  projectId,
  onAssignmentComplete
}) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLearners, setSelectedLearners] = useState<string[]>([]);
  const [assigning, setAssigning] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      loadProfiles();
    }
  }, [isOpen]);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      console.log('Loading profiles for learner assignment...');
      
      // Get all operators and managers who aren't already assigned to this project
      const { data: learnerProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['Operator', 'Manager']);

      if (profilesError) {
        console.error('Error fetching learner profiles:', profilesError);
        throw profilesError;
      }

      console.log('Found learner profiles:', learnerProfiles);

      // Get existing assignments for this project
      const { data: assignments, error: assignmentsError } = await supabase
        .from('training_project_operator_assignments')
        .select('operator_id')
        .eq('training_project_id', projectId);

      if (assignmentsError) {
        console.error('Error fetching assignments:', assignmentsError);
        throw assignmentsError;
      }

      console.log('Existing assignments for project:', assignments);

      const assignedLearnerIds = new Set(assignments?.map(a => a.operator_id) || []);
      const availableProfiles = (learnerProfiles || []).filter(p => !assignedLearnerIds.has(p.id));

      console.log('Available profiles for assignment:', availableProfiles);
      setProfiles(availableProfiles);
    } catch (error) {
      console.error('Error loading profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load available learners",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const displayName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email;
    return displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           profile.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleLearnerToggle = (learnerId: string) => {
    setSelectedLearners(prev => 
      prev.includes(learnerId) 
        ? prev.filter(id => id !== learnerId)
        : [...prev, learnerId]
    );
  };

  const handleAssign = async () => {
    if (selectedLearners.length === 0) return;
    if (!user) return;

    try {
      setAssigning(true);
      console.log('Assigning learners:', selectedLearners);
      
      const assignments = selectedLearners.map(learnerId => ({
        training_project_id: projectId,
        operator_id: learnerId, // Using operator_id field for all learners
        assigned_by: user.id
      }));

      const { error } = await supabase
        .from('training_project_operator_assignments')
        .insert(assignments);

      if (error) {
        console.error('Error inserting assignments:', error);
        throw error;
      }

      console.log('Successfully assigned learners');
      toast({
        title: "Success",
        description: `${selectedLearners.length} learner(s) assigned successfully`
      });

      onAssignmentComplete();
      onClose();
    } catch (error) {
      console.error('Error assigning learners:', error);
      toast({
        title: "Error",
        description: "Failed to assign learners",
        variant: "destructive"
      });
    } finally {
      setAssigning(false);
    }
  };

  const getDisplayName = (profile: Profile) => {
    const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    return name || profile.email;
  };

  const getInitials = (profile: Profile) => {
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
    }
    if (profile.first_name) {
      return profile.first_name.charAt(0).toUpperCase();
    }
    if (profile.last_name) {
      return profile.last_name.charAt(0).toUpperCase();
    }
    return profile.email.charAt(0).toUpperCase();
  };

  const getRoleBadgeColor = (role: string) => {
    return role === 'Manager' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-blue-100 text-blue-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Learners</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search operators and managers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2">
            {loading ? (
              <div className="text-center py-4 text-gray-600">Loading learners...</div>
            ) : filteredProfiles.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                <UserIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No available learners found</p>
                {profiles.length === 0 && (
                  <p className="text-sm mt-1">Create operators or managers in User Management first</p>
                )}
              </div>
            ) : (
              filteredProfiles.map(profile => (
                <div key={profile.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    checked={selectedLearners.includes(profile.id)}
                    onCheckedChange={() => handleLearnerToggle(profile.id)}
                  />
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={undefined} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                      {getInitials(profile)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900 truncate">
                        {getDisplayName(profile)}
                      </p>
                      <Badge className={`text-xs ${getRoleBadgeColor(profile.role)}`}>
                        {profile.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {profile.email} • {profile.department || 'No department'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleAssign}
              disabled={selectedLearners.length === 0 || assigning}
              className="bg-[#3a7ca5] hover:bg-[#2f6690]"
            >
              {assigning ? 'Assigning...' : `Assign ${selectedLearners.length} Learner(s)`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
