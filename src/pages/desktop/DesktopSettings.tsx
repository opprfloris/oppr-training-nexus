
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const DesktopSettings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/desktop/login');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your profile and account preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Profile */}
        <div className="oppr-card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">My Profile</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-2xl text-gray-600">👤</span>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {user?.email?.includes('manager') ? 'Training Manager' : 'User'}
                </p>
                <p className="text-gray-600">{user?.email}</p>
                <button className="text-sm text-oppr-blue hover:underline">Change Photo</button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input 
                  type="text" 
                  className="oppr-input" 
                  placeholder="First name" 
                  defaultValue={user?.email?.includes('manager') ? 'Training' : 'User'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input 
                  type="text" 
                  className="oppr-input" 
                  placeholder="Last name" 
                  defaultValue={user?.email?.includes('manager') ? 'Manager' : 'Name'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  className="oppr-input bg-gray-100" 
                  placeholder="Email" 
                  value={user?.email || ''} 
                  readOnly 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select className="oppr-input">
                  <option>Management</option>
                  <option>Manufacturing</option>
                  <option>Quality Control</option>
                  <option>Engineering</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="oppr-button-primary">Save Profile</button>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="oppr-card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input type="password" className="oppr-input" placeholder="Current password" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input type="password" className="oppr-input" placeholder="New password" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input type="password" className="oppr-input" placeholder="Confirm new password" />
            </div>
            
            <div className="mt-6">
              <button className="oppr-button-primary">Update Password</button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button 
          onClick={handleLogout}
          className="text-red-600 hover:text-red-800 font-medium flex items-center"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DesktopSettings;
