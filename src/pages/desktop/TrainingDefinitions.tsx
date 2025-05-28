
import { PlusIcon } from "@heroicons/react/24/outline";

const TrainingDefinitions = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Training Definitions Library</h1>
          <p className="text-gray-600">Manage your reusable training content and procedures</p>
        </div>
        <button className="oppr-button-primary flex items-center space-x-2">
          <PlusIcon className="w-5 h-5" />
          <span>Create New Training Definition</span>
        </button>
      </div>

      {/* Content placeholder */}
      <div className="oppr-card p-8 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">📖</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Training Definitions Yet</h3>
        <p className="text-gray-600 mb-4">Create your first training definition to get started</p>
        <button className="oppr-button-primary">Create Training Definition</button>
      </div>
    </div>
  );
};

export default TrainingDefinitions;
