
import React from 'react';
import { Button } from '@/components/ui/button';

interface UserManagementDebugPanelProps {
  usersCount: number;
  currentUserEmail?: string;
  onRefreshUsers: () => void;
  onCheckAuthSync: () => void;
}

export const UserManagementDebugPanel: React.FC<UserManagementDebugPanelProps> = ({
  usersCount,
  currentUserEmail,
  onRefreshUsers,
  onCheckAuthSync,
}) => {
  return (
    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="font-medium text-yellow-800 mb-2">Debug Information:</h3>
      <p className="text-sm text-yellow-700">Total users found in profiles table: {usersCount}</p>
      <p className="text-sm text-yellow-700">Current authenticated user: {currentUserEmail}</p>
      <div className="mt-2 space-x-2">
        <Button 
          onClick={onRefreshUsers} 
          size="sm" 
          variant="outline"
        >
          Refresh Users
        </Button>
        <Button 
          onClick={onCheckAuthSync} 
          size="sm" 
          variant="outline"
        >
          Check Auth Sync
        </Button>
      </div>
      <p className="text-xs text-yellow-600 mt-2">
        If users appear in Supabase Auth but not here, there may be an issue with the profile creation trigger.
      </p>
    </div>
  );
};
