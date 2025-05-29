
import React from 'react';

export const EmptyMarkersState: React.FC = () => {
  return (
    <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
        <span className="text-2xl">📍</span>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Markers Added Yet</h3>
      <p className="text-gray-600 mb-4">
        You need to add markers to your floor plan before you can assign training content.
      </p>
      <p className="text-sm text-gray-500">
        Go to the "Floor Plan & Markers" tab to add markers first.
      </p>
    </div>
  );
};
