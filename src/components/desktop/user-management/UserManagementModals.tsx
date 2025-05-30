
import React from 'react';
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

interface UserManagementModalsProps {
  isAddUserOpen: boolean;
  onCloseAddUser: () => void;
  onUserAdded: () => void;
  isBulkUploadOpen: boolean;
  onCloseBulkUpload: () => void;
  onUsersCreated: () => void;
  editingUser: User | null;
  onCloseEditUser: () => void;
  onUserUpdated: () => void;
}

export const UserManagementModals: React.FC<UserManagementModalsProps> = ({
  isAddUserOpen,
  onCloseAddUser,
  onUserAdded,
  isBulkUploadOpen,
  onCloseBulkUpload,
  onUsersCreated,
  editingUser,
  onCloseEditUser,
  onUserUpdated,
}) => {
  return (
    <>
      <AddUserModal 
        isOpen={isAddUserOpen}
        onClose={onCloseAddUser}
        onUserAdded={onUserAdded}
      />

      <BulkUploadUsersModal
        isOpen={isBulkUploadOpen}
        onClose={onCloseBulkUpload}
        onUsersCreated={onUsersCreated}
      />

      {editingUser && (
        <EditUserModal
          user={editingUser}
          isOpen={!!editingUser}
          onClose={onCloseEditUser}
          onUserUpdated={onUserUpdated}
        />
      )}
    </>
  );
};
