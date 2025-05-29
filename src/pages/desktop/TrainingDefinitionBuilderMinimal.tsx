
import React from 'react';
import { useParams } from 'react-router-dom';

const TrainingDefinitionBuilderMinimal = () => {
  const { id } = useParams<{ id: string }>();
  
  console.log('TrainingDefinitionBuilderMinimal loaded with id:', id);
  
  const isNewDefinition = id === 'new';

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNewDefinition ? 'Create New Training Definition' : `Edit Training Definition ${id}`}
        </h1>
        <p className="text-gray-600 mt-2">
          Phase 1: Minimal builder - {isNewDefinition ? 'New Definition' : 'Existing Definition'}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter training definition title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter description (optional)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Save Draft
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-2">Debug Info:</h3>
        <p className="text-sm text-gray-600">Route ID: {id}</p>
        <p className="text-sm text-gray-600">Is New: {isNewDefinition ? 'Yes' : 'No'}</p>
        <p className="text-sm text-gray-600">Status: Page loaded successfully</p>
      </div>
    </div>
  );
};

export default TrainingDefinitionBuilderMinimal;
