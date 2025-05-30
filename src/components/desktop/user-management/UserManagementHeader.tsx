
import React from 'react';
import { CloudArrowUpIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { Button } from '@/components/ui/button';

interface UserManagementHeaderProps {
  onAddUser: () => void;
  onBulkUpload: () => void;
}

export const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({
  onAddUser,
  onBulkUpload,
}) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage operators, managers, and access permissions</p>
      </div>
      <div className="flex items-center space-x-3">
        <Button 
          onClick={onBulkUpload}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <CloudArrowUpIcon className="w-5 h-5" />
          <span>Bulk Upload</span>
        </Button>
        <Button 
          onClick={onAddUser}
          className="bg-[#3a7ca5] hover:bg-[#2f6690] text-white flex items-center space-x-2"
        >
          <UserPlusIcon className="w-5 h-5" />
          <span>Add User</span>
        </Button>
      </div>
    </div>
  );
};
