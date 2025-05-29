
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  HomeIcon, 
  BookOpenIcon, 
  ClipboardDocumentListIcon, 
  ArchiveBoxIcon, 
  UsersIcon, 
  TableCellsIcon,
  CogIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ChevronDownIcon,
  DocumentIcon
} from "@heroicons/react/24/outline";

const DesktopLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === 'dashboard') {
      return location.pathname === '/desktop' || location.pathname === '/desktop/dashboard';
    }
    return location.pathname.includes(path);
  };

  const navigationItems = [
    { name: 'Dashboard', path: 'dashboard', icon: HomeIcon },
    { name: 'Training Definitions', path: 'training-definitions', icon: BookOpenIcon },
    { name: 'Training Projects', path: 'training-projects', icon: ClipboardDocumentListIcon },
    { name: 'Floor Plans', path: 'floor-plans', icon: ArchiveBoxIcon },
    { name: 'Machine & QR Registry', path: 'machine-registry', icon: ArchiveBoxIcon },
    { name: 'Oppr Docs', path: 'oppr-docs', icon: DocumentIcon },
    { name: 'User Management', path: 'user-management', icon: UsersIcon },
    { name: 'Skills Matrix', path: 'skills-matrix', icon: TableCellsIcon },
  ];

  const handleNavigation = (path: string) => {
    if (path === 'dashboard') {
      navigate('/desktop/dashboard');
    } else {
      navigate(`/desktop/${path}`);
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-oppr-gray-800 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-oppr-blue rounded-lg flex items-center justify-center transform rotate-3">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <h1 className="text-lg font-semibold">Oppr Training</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  isActive(item.path)
                    ? 'bg-oppr-blue text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => navigate('/desktop/settings')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
              isActive('settings')
                ? 'bg-oppr-blue text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            <CogIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          {/* Breadcrumbs placeholder */}
          <div className="text-sm text-gray-600">
            Dashboard
          </div>

          {/* Search and User */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Global search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oppr-blue focus:border-transparent w-64"
              />
            </div>
            
            <div className="relative">
              <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900">
                <UserCircleIcon className="w-6 h-6" />
                <span className="text-sm font-medium">Manager</span>
                <ChevronDownIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-oppr-gray-50 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DesktopLayout;
