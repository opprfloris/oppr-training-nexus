
import React from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

export const MarkerSelectionPrompt: React.FC = () => {
  return (
    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
      <DocumentTextIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <p className="text-gray-600 text-sm">Select a marker to assign training content</p>
    </div>
  );
};
