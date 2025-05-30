
import React, { useState } from 'react';
import { ChevronDownIcon, UserCircleIcon, CogIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/desktop/settings');
    setIsOpen(false);
  };

  const displayName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}`
    : profile?.email || 'Manager';

  // Generate initials for fallback
  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
    }
    if (profile?.first_name) {
      return profile.first_name.charAt(0).toUpperCase();
    }
    if (profile?.last_name) {
      return profile.last_name.charAt(0).toUpperCase();
    }
    if (profile?.email) {
      return profile.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 p-2 text-gray-700">
        <UserCircleIcon className="w-6 h-6 animate-pulse" />
        <span className="text-sm font-medium">Loading...</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {profile?.avatar_url ? (
          <img 
            src={profile.avatar_url} 
            alt="Profile" 
            className="w-6 h-6 rounded-full object-cover"
            onError={(e) => {
              console.error('Avatar failed to load in dropdown:', profile.avatar_url);
              // Fallback to icon on error
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700">
            {getInitials()}
          </div>
        )}
        <UserCircleIcon className={`w-6 h-6 ${profile?.avatar_url ? 'hidden' : ''}`} />
        <span className="text-sm font-medium">{displayName}</span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      console.error('Avatar failed to load in dropdown detail:', profile.avatar_url);
                      // Fallback to initials on error
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700">
                    {getInitials()}
                  </div>
                )}
                <div className={`w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700 ${profile?.avatar_url ? 'hidden' : ''}`}>
                  {getInitials()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {profile?.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {profile?.role} • {profile?.department}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="py-2">
              <button
                onClick={handleProfileClick}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <CogIcon className="w-4 h-4 mr-3" />
                Profile Settings
              </button>
              
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDropdown;
