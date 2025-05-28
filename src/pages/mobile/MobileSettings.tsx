
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const MobileSettings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/mobile/login');
  };

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <button 
          onClick={() => navigate('/mobile/trainings')}
          className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="ml-2 text-lg font-semibold text-gray-900">Settings</h1>
      </div>

      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>

        {/* User Profile Section */}
        <div className="oppr-card p-6 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Profile Information</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xl text-gray-600">👤</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {user?.email?.includes('operator') ? 'John Operator' : 'Training Manager'}
                </p>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-sm text-gray-500">
                  Department: {user?.email?.includes('operator') ? 'Manufacturing' : 'Management'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="w-full bg-red-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default MobileSettings;
