
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";

const UserManagement = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage operators, managers, and access permissions</p>
        </div>
        <button className="oppr-button-primary flex items-center space-x-2">
          <PlusIcon className="w-5 h-5" />
          <span>Add User</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative max-w-md">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oppr-blue focus:border-transparent"
          />
        </div>
        <button className="oppr-button-secondary flex items-center space-x-2">
          <FunnelIcon className="w-5 h-5" />
          <span>Filter by Role</span>
        </button>
      </div>

      {/* Content placeholder */}
      <div className="oppr-card p-8 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">👥</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Added</h3>
        <p className="text-gray-600 mb-4">Add operators and managers to start building your training organization</p>
        <button className="oppr-button-primary">Add First User</button>
      </div>
    </div>
  );
};

export default UserManagement;
