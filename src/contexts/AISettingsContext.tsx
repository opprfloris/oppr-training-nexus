
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AIConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  timeout: number;
}

interface AISettingsContextType {
  config: AIConfig;
  updateConfig: (key: keyof AIConfig, value: any) => void;
  connectionStatus: 'none' | 'success' | 'error';
  setConnectionStatus: (status: 'none' | 'success' | 'error') => void;
  testConnection: () => Promise<void>;
}

const AISettingsContext = createContext<AISettingsContextType | undefined>(undefined);

export const useAISettings = () => {
  const context = useContext(AISettingsContext);
  if (!context) {
    throw new Error('useAISettings must be used within an AISettingsProvider');
  }
  return context;
};

export const AISettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AIConfig>({
    apiKey: '',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 4000,
    timeout: 30
  });
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'success' | 'error'>('none');

  useEffect(() => {
    // Load saved config from localStorage
    const savedConfig = localStorage.getItem('ai-settings');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
      } catch (error) {
        console.error('Failed to parse saved AI config:', error);
      }
    }
  }, []);

  const updateConfig = (key: keyof AIConfig, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    localStorage.setItem('ai-settings', JSON.stringify(newConfig));
    setConnectionStatus('none');
  };

  const testConnection = async () => {
    if (!config.apiKey.trim()) {
      throw new Error('API Key Required');
    }

    try {
      // Simulate API test - replace with actual OpenAI API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setConnectionStatus('success');
    } catch (error) {
      setConnectionStatus('error');
      throw error;
    }
  };

  return (
    <AISettingsContext.Provider value={{
      config,
      updateConfig,
      connectionStatus,
      setConnectionStatus,
      testConnection
    }}>
      {children}
    </AISettingsContext.Provider>
  );
};
