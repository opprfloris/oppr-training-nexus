
import React from 'react';
import { PencilSquareIcon, EyeSlashIcon, EyeIcon, ListBulletIcon } from "@heroicons/react/24/outline";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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

interface UserManagementTableProps {
  users: User[];
  onEditUser: (user: User) => void;
  onToggleUserStatus: (userId: string, currentStatus: string) => void;
  onAddUser: () => void;
  searchTerm: string;
  roleFilter: string;
  departmentFilter: string;
  statusFilter: string;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users,
  onEditUser,
  onToggleUserStatus,
  onAddUser,
  searchTerm,
  roleFilter,
  departmentFilter,
  statusFilter,
  currentPage,
  setCurrentPage,
}) => {
  const usersPerPage = 15;

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
    return email.charAt(0).toUpperCase();
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

  if (filteredUsers.length === 0) {
    return (
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
        <Button onClick={onAddUser} className="bg-[#3a7ca5] hover:bg-[#2f6690] text-white">
          Add First User
        </Button>
      </div>
    );
  }

  return (
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
                    onClick={() => onEditUser(user)}
                    className="p-1 h-8 w-8"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleUserStatus(user.id, user.status || 'Active')}
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
  );
};
