
import React from 'react';
import { Cloud, CloudOff, Save } from 'lucide-react';

interface AutoSaveIndicatorProps {
  hasUnsavedChanges: boolean;
  saving: boolean;
  lastSaved?: Date;
}

const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({
  hasUnsavedChanges,
  saving,
  lastSaved
}) => {
  if (saving) {
    return (
      <div className="flex items-center space-x-2 text-blue-600">
        <Save className="w-4 h-4 animate-pulse" />
        <span className="text-sm">Saving...</span>
      </div>
    );
  }

  if (hasUnsavedChanges) {
    return (
      <div className="flex items-center space-x-2 text-yellow-600">
        <CloudOff className="w-4 h-4" />
        <span className="text-sm">Unsaved changes</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-green-600">
      <Cloud className="w-4 h-4" />
      <span className="text-sm">
        {lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'All changes saved'}
      </span>
    </div>
  );
};

export default AutoSaveIndicator;
