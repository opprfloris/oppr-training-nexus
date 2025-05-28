
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";

const MobileTrainings = () => {
  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">My Trainings</h2>
        
        {/* Search and Filter */}
        <div className="flex space-x-2 mb-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search trainings..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oppr-blue focus:border-transparent"
            />
          </div>
          <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            <FunnelIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="flex border-b border-gray-200">
          <button className="px-4 py-2 border-b-2 border-oppr-blue text-oppr-blue font-medium">
            Active
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
            Completed
          </button>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">📚</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Trainings</h3>
        <p className="text-gray-600 mb-4">Training projects assigned to you will appear here.</p>
      </div>
    </div>
  );
};

export default MobileTrainings;
