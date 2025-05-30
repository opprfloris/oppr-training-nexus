import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  PencilSquareIcon,
  EyeSlashIcon,
  EyeIcon,
  ListBulletIcon,
  UserPlusIcon,
  CloudArrowUpIcon
} from "@heroicons/react/24/outline";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { AddUserModal } from '@/components/desktop/AddUserModal';
import { EditUserModal } from '@/components/desktop/EditUserModal';
import { BulkUploadUsersModal } from '@/components/desktop/BulkUploadUsersModal';

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

const UserManagement = () => {
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
  const usersPerPage = 15;

  const departments = [
    'All Departments',
    'Assembly Line 1',
    'Assembly Line 3', 
    'Maintenance',
    'Quality Control',
    'Operations',
    'Training Department'
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Add status field (defaulting to Active for now)
      const usersWithStatus = data.map(user => ({
        ...user,
        status: 'Active' as const
      }));

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

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    
    try {
      // In a real implementation, you'd update this in Supabase
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter;
    const matchesDepartment = departmentFilter === 'All Departments' || user.department === departmentFilter;
    const matchesStatus = statusFilter === 'All Statuses' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getInitials = (firstName: string | null, lastName: string | null, email: string) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    if (lastName) {
      return lastName.charAt(0).toUpperCase();
    }
    // Fallback to email initials
    return email.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading users...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage operators, managers, and access permissions</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            onClick={() => setIsBulkUploadOpen(true)}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <CloudArrowUpIcon className="w-5 h-5" />
            <span>Bulk Upload</span>
          </Button>
          <Button 
            onClick={() => setIsAddUserOpen(true)}
            className="bg-[#3a7ca5] hover:bg-[#2f6690] text-white flex items-center space-x-2"
          >
            <UserPlusIcon className="w-5 h-5" />
            <span>Add User</span>
          </Button>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Roles">All Roles</SelectItem>
                <SelectItem value="Operator">Operator</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Statuses">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search by Name or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">👥</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Users found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || roleFilter !== 'All Roles' || departmentFilter !== 'All Departments' || statusFilter !== 'All Statuses'
              ? 'No users match your current filters.'
              : 'Click "Add User" to create one.'
            }
          </p>
          <Button onClick={() => setIsAddUserOpen(true)} className="bg-[#3a7ca5] hover:bg-[#2f6690] text-white">
            Add First User
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={user.avatar_url || undefined} 
                        alt={`${user.first_name} ${user.last_name}`}
                        onError={(e) => {
                          console.error('Avatar failed to load in table:', user.avatar_url);
                        }}
                      />
                      <AvatarFallback className="bg-gray-300 text-gray-700 text-sm">
                        {getInitials(user.first_name, user.last_name, user.email)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">
                    {user.first_name && user.last_name 
                      ? `${user.first_name} ${user.last_name}`
                      : 'No name'
                    }
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'Manager' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>{user.department || 'Not assigned'}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm">{user.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingUser(user)}
                        className="p-1 h-8 w-8"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleUserStatus(user.id, user.status || 'Active')}
                        className="p-1 h-8 w-8"
                      >
                        {user.status === 'Active' ? (
                          <EyeSlashIcon className="w-4 h-4" />
                        ) : (
                          <EyeIcon className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled
                        className="p-1 h-8 w-8 opacity-50"
                      >
                        <ListBulletIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add User Modal */}
      <AddUserModal 
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onUserAdded={fetchUsers}
      />

      {/* Bulk Upload Modal */}
      <BulkUploadUsersModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onUsersCreated={fetchUsers}
      />

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          onUserUpdated={fetchUsers}
        />
      )}
    </div>
  );
};

export default UserManagement;
