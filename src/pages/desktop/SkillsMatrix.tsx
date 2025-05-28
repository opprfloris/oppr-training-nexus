
import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const SkillsMatrix = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Skills Matrix</h1>
          <p className="text-gray-600">Track operator competencies and training progress across all skills</p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative max-w-md">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search skills or operators..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oppr-blue focus:border-transparent"
          />
        </div>
        <button className="oppr-button-secondary flex items-center space-x-2">
          <FunnelIcon className="w-5 h-5" />
          <span>Filter by Department</span>
        </button>
        <button className="oppr-button-secondary flex items-center space-x-2">
          <FunnelIcon className="w-5 h-5" />
          <span>Filter by Skill Level</span>
        </button>
      </div>

      {/* Content placeholder */}
      <div className="oppr-card p-8 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">📊</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Skills Matrix Coming Soon</h3>
        <p className="text-gray-600 mb-4">The skills matrix will display operator competencies and training progress in a comprehensive grid view</p>
      </div>
    </div>
  );
};

export default SkillsMatrix;
