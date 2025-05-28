
import { PlusIcon, MagnifyingGlassIcon, QrCodeIcon } from "@heroicons/react/24/outline";

const MachineRegistry = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Machine & QR Registry</h1>
          <p className="text-gray-600">Manage equipment catalog and QR code assignments</p>
        </div>
        <button className="oppr-button-primary flex items-center space-x-2">
          <PlusIcon className="w-5 h-5" />
          <span>Add New Machine+QR</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative max-w-md">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search machines..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oppr-blue focus:border-transparent"
          />
        </div>
      </div>

      {/* Content placeholder */}
      <div className="oppr-card p-8 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
          <QrCodeIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Machines Registered</h3>
        <p className="text-gray-600 mb-4">Add machines and equipment to enable QR-based training experiences</p>
        <button className="oppr-button-primary">Add Machine</button>
      </div>
    </div>
  );
};

export default MachineRegistry;
