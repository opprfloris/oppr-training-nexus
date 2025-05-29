
import React from 'react';
import { Brain } from 'lucide-react';
import { useAISettings } from '@/contexts/AISettingsContext';

const AIStatusDisplay: React.FC = () => {
  const { config } = useAISettings();

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className="flex items-center space-x-1">
        <div className={`w-2 h-2 rounded-full ${config.apiKey ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-xs text-gray-600">
          {config.apiKey ? `AI Ready (${config.model})` : 'No API Key'}
        </span>
      </div>
    </div>
  );
};

export default AIStatusDisplay;
