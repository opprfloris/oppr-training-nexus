
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { CogIcon, AcademicCapIcon, UserCircleIcon } from "@heroicons/react/24/outline";

const MobileLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActiveTab = (path: string) => {
    return location.pathname.includes(path) || (path === 'trainings' && location.pathname === '/mobile');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">My Trainings</h1>
        <button 
          onClick={() => navigate('/mobile/settings')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <CogIcon className="w-6 h-6" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      {/* Bottom Tab Navigation */}
      <nav className="bg-white border-t border-gray-200 px-2 py-2 flex justify-around shadow-lg">
        <button
          onClick={() => navigate('/mobile/trainings')}
          className={`flex flex-col items-center p-3 min-w-0 flex-1 rounded-xl transition-colors ${
            isActiveTab('trainings') 
              ? 'text-oppr-blue bg-oppr-blue/10' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <AcademicCapIcon className="w-6 h-6 mb-1" />
          <span className="text-xs font-semibold">My Trainings</span>
        </button>
        
        <button
          onClick={() => navigate('/mobile/settings')}
          className={`flex flex-col items-center p-3 min-w-0 flex-1 rounded-xl transition-colors ${
            isActiveTab('settings') 
              ? 'text-oppr-blue bg-oppr-blue/10' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <UserCircleIcon className="w-6 h-6 mb-1" />
          <span className="text-xs font-semibold">Settings</span>
        </button>
      </nav>
    </div>
  );
};

export default MobileLayout;
