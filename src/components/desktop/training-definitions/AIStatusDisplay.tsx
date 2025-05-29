
import React from 'react';
import { Brain } from 'lucide-react';
import { useAISettings } from '@/contexts/AISettingsContext';

const AIStatusDisplay: React.FC = () => {
  const { config } = useAISettings();

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">AI Status</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${config.apiKey ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-xs text-blue-700">
            {config.apiKey ? `Connected (${config.model})` : 'No API Key'}
          </span>
        </div>
      </div>
      {!config.apiKey && (
        <p className="text-xs text-blue-600 mt-2">
          Configure your AI settings in the Settings page to enable advanced features.
        </p>
      )}
    </div>
  );
};

export default AIStatusDisplay;
