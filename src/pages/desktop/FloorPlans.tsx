
import { PlusIcon, CloudArrowUpIcon } from "@heroicons/react/24/outline";

const FloorPlans = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Floor Plan Library</h1>
          <p className="text-gray-600">Manage facility layouts and spatial references for training</p>
        </div>
        <button className="oppr-button-primary flex items-center space-x-2">
          <CloudArrowUpIcon className="w-5 h-5" />
          <span>Upload New Floor Plan</span>
        </button>
      </div>

      {/* Content placeholder */}
      <div className="oppr-card p-8 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">🏗️</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Floor Plans Uploaded</h3>
        <p className="text-gray-600 mb-4">Upload facility layouts to provide spatial context for your training programs</p>
        <button className="oppr-button-primary">Upload Floor Plan</button>
      </div>
    </div>
  );
};

export default FloorPlans;
