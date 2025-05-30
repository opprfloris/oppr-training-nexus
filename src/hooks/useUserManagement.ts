
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  department: string | null;
  avatar_url: string | null;
  created_at: string;
  status?: 'Active' | 'Inactive';
}

export const useUserManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const departments = [
    'All Departments',
    'Assembly Line 1',
    'Assembly Line 3', 
    'Maintenance',
    'Quality Control',
    'Operations',
    'Training Department'
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching users from profiles table...');
      console.log('Current authenticated user:', user?.email);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('Fetched users data:', data);
      console.log('Number of profiles found:', data?.length || 0);

      const usersWithStatus = (data || []).map(user => ({
        ...user,
        status: 'Active' as const
      }));

      console.log('Users with status:', usersWithStatus);
      setUsers(usersWithStatus);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const syncAuthUsersToProfiles = async () => {
    try {
      console.log('Attempting to sync auth users to profiles...');
      
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Cannot access auth users (expected for non-admin):', authError);
        toast({
          title: "Info",
          description: "Manual sync not available - profiles should be created automatically",
          variant: "default",
        });
        return;
      }

      console.log('Auth users found:', authData.users?.length || 0);
      
      const { data: existingProfiles } = await supabase
        .from('profiles')
        .select('id');
      
      const existingProfileIds = new Set(existingProfiles?.map(p => p.id) || []);
      const missingProfiles = authData.users?.filter((authUser: any) => !existingProfileIds.has(authUser.id)) || [];
      
      console.log('Users missing profiles:', missingProfiles.length);
      
      if (missingProfiles.length > 0) {
        console.log('Missing profiles for users:', missingProfiles.map((u: any) => u.email));
        toast({
          title: "Profile Sync Issue",
          description: `Found ${missingProfiles.length} users without profiles. Contact support to fix this.`,
          variant: "destructive",
        });
      }
      
    } catch (error) {
      console.error('Sync error:', error);
    }
  };

  const handleUserAdded = async () => {
    console.log('User added, refreshing user list...');
    
    // Immediate refresh
    await fetchUsers();
    
    // Additional refreshes with delays to catch any timing issues
    setTimeout(async () => {
      console.log('First delayed refresh...');
      await fetchUsers();
    }, 1000);
    
    setTimeout(async () => {
      console.log('Second delayed refresh...');
      await fetchUsers();
      setIsAddUserOpen(false);
    }, 3000);
    
    toast({
      title: "Success",
      description: "User created successfully",
    });
  };

  const handleUsersCreated = async () => {
    console.log('Users created via bulk upload, refreshing user list...');
    
    // Immediate refresh
    await fetchUsers();
    
    // Additional refreshes with delays
    setTimeout(async () => {
      console.log('First delayed refresh after bulk upload...');
      await fetchUsers();
    }, 2000);
    
    setTimeout(async () => {
      console.log('Final delayed refresh after bulk upload...');
      await fetchUsers();
      setIsBulkUploadOpen(false);
    }, 5000);
    
    toast({
      title: "Success",
      description: "Users created successfully",
    });
  };

  const handleUserUpdated = async () => {
    console.log('User updated, refreshing user list...');
    await fetchUsers();
    setEditingUser(null);
    
    toast({
      title: "Success",
      description: "User updated successfully",
    });
  };

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    
    try {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: newStatus as 'Active' | 'Inactive' } : user
      ));

      toast({
        title: "Success",
        description: `User ${newStatus.toLowerCase()}`,
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    departmentFilter,
    setDepartmentFilter,
    statusFilter,
    setStatusFilter,
    isAddUserOpen,
    setIsAddUserOpen,
    isBulkUploadOpen,
    setIsBulkUploadOpen,
    editingUser,
    setEditingUser,
    currentPage,
    setCurrentPage,
    departments,
    fetchUsers,
    syncAuthUsersToProfiles,
    handleUserAdded,
    handleUsersCreated,
    handleUserUpdated,
    toggleUserStatus,
    user,
  };
};
