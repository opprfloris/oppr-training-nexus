
import React from 'react';
import { useUserManagement } from '@/hooks/useUserManagement';
import { UserManagementDebugPanel } from '@/components/desktop/user-management/UserManagementDebugPanel';
import { UserManagementHeader } from '@/components/desktop/user-management/UserManagementHeader';
import { UserManagementFilters } from '@/components/desktop/user-management/UserManagementFilters';
import { UserManagementTable } from '@/components/desktop/user-management/UserManagementTable';
import { UserManagementModals } from '@/components/desktop/user-management/UserManagementModals';

const UserManagement = () => {
  const {
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
  } = useUserManagement();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading users...</div>
      </div>
    );
  }

  return (
    <div>
      <UserManagementDebugPanel
        usersCount={users.length}
        currentUserEmail={user?.email}
        onRefreshUsers={fetchUsers}
        onCheckAuthSync={syncAuthUsersToProfiles}
      />

      <UserManagementHeader
        onAddUser={() => setIsAddUserOpen(true)}
        onBulkUpload={() => setIsBulkUploadOpen(true)}
      />

      <UserManagementFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        departmentFilter={departmentFilter}
        onDepartmentFilterChange={setDepartmentFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        departments={departments}
      />

      <UserManagementTable
        users={users}
        onEditUser={setEditingUser}
        onToggleUserStatus={toggleUserStatus}
        onAddUser={() => setIsAddUserOpen(true)}
        searchTerm={searchTerm}
        roleFilter={roleFilter}
        departmentFilter={departmentFilter}
        statusFilter={statusFilter}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <UserManagementModals
        isAddUserOpen={isAddUserOpen}
        onCloseAddUser={() => setIsAddUserOpen(false)}
        onUserAdded={handleUserAdded}
        isBulkUploadOpen={isBulkUploadOpen}
        onCloseBulkUpload={() => setIsBulkUploadOpen(false)}
        onUsersCreated={handleUsersCreated}
        editingUser={editingUser}
        onCloseEditUser={() => setEditingUser(null)}
        onUserUpdated={handleUserUpdated}
      />
    </div>
  );
};

export default UserManagement;
