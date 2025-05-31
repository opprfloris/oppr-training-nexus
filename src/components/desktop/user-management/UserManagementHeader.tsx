
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import { QuickSetupUsers } from './QuickSetupUsers';

interface UserManagementHeaderProps {
  onAddUser: () => void;
  onBulkUpload: () => void;
  onUsersCreated?: () => void;
}

export const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({
  onAddUser,
  onBulkUpload,
  onUsersCreated
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-gray-600">
            Manage user accounts, roles, and permissions across your organization.
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={onAddUser}
            className="bg-[#3a7ca5] hover:bg-[#2f6690] text-white"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add User
          </Button>
          
          <Button
            onClick={onBulkUpload}
            variant="outline"
          >
            <DocumentArrowUpIcon className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>

          {onUsersCreated && (
            <QuickSetupUsers onUsersCreated={onUsersCreated} />
          )}
        </div>
      </div>
    </div>
  );
};
