
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

interface AssignOperatorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onAssignmentComplete: () => void;
}

export const AssignOperatorsModal: React.FC<AssignOperatorsModalProps> = ({
  isOpen,
  onClose,
  projectId,
  onAssignmentComplete
}) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOperators, setSelectedOperators] = useState<string[]>([]);
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
      console.log('Loading profiles for operator assignment...');
      
      // First, get all profiles and log them for debugging
      const { data: allProfiles, error: allProfilesError } = await supabase
        .from('profiles')
        .select('*');

      if (allProfilesError) {
        console.error('Error fetching all profiles:', allProfilesError);
      } else {
        console.log('All profiles in database:', allProfiles);
        console.log('Profiles with Operator role:', allProfiles?.filter(p => p.role === 'Operator'));
      }
      
      // Get all operators who aren't already assigned to this project
      const { data: operatorProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'Operator');

      if (profilesError) {
        console.error('Error fetching operator profiles:', profilesError);
        throw profilesError;
      }

      console.log('Found operator profiles:', operatorProfiles);

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

      const assignedOperatorIds = new Set(assignments?.map(a => a.operator_id) || []);
      const availableProfiles = (operatorProfiles || []).filter(p => !assignedOperatorIds.has(p.id));

      console.log('Available profiles for assignment:', availableProfiles);
      setProfiles(availableProfiles);
    } catch (error) {
      console.error('Error loading profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load available operators",
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

  const handleOperatorToggle = (operatorId: string) => {
    setSelectedOperators(prev => 
      prev.includes(operatorId) 
        ? prev.filter(id => id !== operatorId)
        : [...prev, operatorId]
    );
  };

  const handleAssign = async () => {
    if (selectedOperators.length === 0) return;
    if (!user) return;

    try {
      setAssigning(true);
      console.log('Assigning operators:', selectedOperators);
      
      const assignments = selectedOperators.map(operatorId => ({
        training_project_id: projectId,
        operator_id: operatorId,
        assigned_by: user.id
      }));

      const { error } = await supabase
        .from('training_project_operator_assignments')
        .insert(assignments);

      if (error) {
        console.error('Error inserting assignments:', error);
        throw error;
      }

      console.log('Successfully assigned operators');
      toast({
        title: "Success",
        description: `${selectedOperators.length} operator(s) assigned successfully`
      });

      onAssignmentComplete();
      onClose();
    } catch (error) {
      console.error('Error assigning operators:', error);
      toast({
        title: "Error",
        description: "Failed to assign operators",
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Operators</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search operators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2">
            {loading ? (
              <div className="text-center py-4 text-gray-600">Loading operators...</div>
            ) : filteredProfiles.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                <UserIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No available operators found</p>
                {profiles.length === 0 && (
                  <p className="text-sm mt-1">Create operators in User Management first</p>
                )}
              </div>
            ) : (
              filteredProfiles.map(profile => (
                <div key={profile.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    checked={selectedOperators.includes(profile.id)}
                    onCheckedChange={() => handleOperatorToggle(profile.id)}
                  />
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={undefined} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                      {getInitials(profile)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {getDisplayName(profile)}
                    </p>
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
              disabled={selectedOperators.length === 0 || assigning}
              className="bg-[#3a7ca5] hover:bg-[#2f6690]"
            >
              {assigning ? 'Assigning...' : `Assign ${selectedOperators.length} Operator(s)`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
