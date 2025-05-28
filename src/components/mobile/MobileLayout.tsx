
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { CogIcon, AcademicCapIcon, UserCircleIcon } from "@heroicons/react/24/outline";

const MobileLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActiveTab = (path: string) => {
    return location.pathname.includes(path) || (path === 'trainings' && location.pathname === '/mobile');
  };

  return (
    <div className="min-h-screen bg-oppr-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Oppr Training</h1>
        <button className="p-2 text-gray-600 hover:text-gray-900">
          <CogIcon className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      {/* Bottom Tab Navigation */}
      <nav className="bg-white border-t border-gray-200 px-4 py-2 flex justify-around">
        <button
          onClick={() => navigate('/mobile/trainings')}
          className={`flex flex-col items-center p-2 min-w-0 flex-1 ${
            isActiveTab('trainings') 
              ? 'text-oppr-blue' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <AcademicCapIcon className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">My Trainings</span>
        </button>
        
        <button
          onClick={() => navigate('/mobile/settings')}
          className={`flex flex-col items-center p-2 min-w-0 flex-1 ${
            isActiveTab('settings') 
              ? 'text-oppr-blue' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <UserCircleIcon className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Settings</span>
        </button>
      </nav>
    </div>
  );
};

export default MobileLayout;
