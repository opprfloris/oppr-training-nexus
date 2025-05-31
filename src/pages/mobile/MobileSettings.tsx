
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const MobileSettings = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const handleLogout = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      await signOut();
      // The signOut function will handle the redirect
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center shadow-sm">
        <button 
          onClick={() => navigate('/mobile/trainings')}
          className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="ml-2 text-xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="p-4">
        {/* User Profile Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Profile Information</h3>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-oppr-blue/10 rounded-full flex items-center justify-center overflow-hidden border-2 border-oppr-blue/20">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Avatar failed to load:', profile.avatar_url);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-2xl font-bold text-oppr-blue">
                  {profile?.first_name && profile?.last_name 
                    ? `${profile.first_name[0]}${profile.last_name[0]}` 
                    : '👤'
                  }
                </span>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg text-gray-900">
                {profile?.first_name && profile?.last_name 
                  ? `${profile.first_name} ${profile.last_name}`
                  : profile?.role || 'User'
                }
              </h4>
              <p className="text-gray-600 font-medium">{profile?.email || user?.email}</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Role</span>
              <span className="text-sm font-semibold text-gray-900">
                {profile?.role || 'Not assigned'}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Department</span>
              <span className="text-sm font-semibold text-gray-900">
                {profile?.department || 'Not assigned'}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3">
              <span className="text-sm font-medium text-gray-600">Email</span>
              <span className="text-sm font-semibold text-gray-900">
                {profile?.email || user?.email || 'Not available'}
              </span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full bg-red-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-red-700 active:scale-[0.98] transition-all shadow-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default MobileSettings;
