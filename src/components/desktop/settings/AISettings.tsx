
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Brain, Key, Settings, TestTube, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAISettings } from '@/contexts/AISettingsContext';

const AISettings: React.FC = () => {
  const { config, updateConfig, connectionStatus, setConnectionStatus, testConnection } = useAISettings();
  const [showApiKey, setShowApiKey] = React.useState(false);
  const [isTesting, setIsTesting] = React.useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const { toast } = useToast();

  const handleConfigChange = (key: keyof typeof config, value: any) => {
    updateConfig(key, value);
    setHasUnsavedChanges(false); // Context handles saving automatically
  };

  const handleTestConnection = async () => {
    if (!config.apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter an API key to test the connection.",
        variant: "destructive"
      });
      return;
    }

    setIsTesting(true);
    try {
      await testConnection();
      toast({
        title: "Connection Successful",
        description: "Successfully connected to OpenAI API."
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to OpenAI API. Please check your API key.",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  const resetToDefaults = () => {
    updateConfig('apiKey', '');
    updateConfig('model', 'gpt-4o-mini');
    updateConfig('temperature', 0.7);
    updateConfig('maxTokens', 4000);
    updateConfig('timeout', 30);
    setConnectionStatus('none');
  };

  const getModelInfo = (model: string) => {
    const modelInfo = {
      'gpt-4o': { cost: 'High', speed: 'Medium', capability: 'Maximum' },
      'gpt-4o-mini': { cost: 'Low', speed: 'Fast', capability: 'High' },
      'gpt-4.5-preview': { cost: 'Very High', speed: 'Slow', capability: 'Maximum+' }
    };
    return modelInfo[model as keyof typeof modelInfo] || { cost: 'Unknown', speed: 'Unknown', capability: 'Unknown' };
  };

  const modelInfo = getModelInfo(config.model);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center space-x-2 mb-6">
        <Brain className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold">AI Settings</h2>
      </div>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="w-5 h-5" />
            <span>API Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">OpenAI API Key</Label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  value={config.apiKey}
                  onChange={(e) => handleConfigChange('apiKey', e.target.value)}
                  placeholder="sk-..."
                  className="pr-10"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={isTesting || !config.apiKey.trim()}
                className="flex items-center space-x-2"
              >
                <TestTube className="w-4 h-4" />
                <span>{isTesting ? 'Testing...' : 'Test'}</span>
              </Button>
            </div>
            
            {connectionStatus !== 'none' && (
              <div className={`flex items-center space-x-2 text-sm ${
                connectionStatus === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
                {connectionStatus === 'success' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                <span>
                  {connectionStatus === 'success' ? 'Connection successful' : 'Connection failed'}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Model Selection</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="model">AI Model</Label>
            <Select value={config.model} onValueChange={(value) => handleConfigChange('model', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o-mini">GPT-4o Mini - Fast & Efficient</SelectItem>
                <SelectItem value="gpt-4o">GPT-4o - Powerful & Versatile</SelectItem>
                <SelectItem value="gpt-4.5-preview">GPT-4.5 Preview - Cutting Edge</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium">Cost</p>
              <Badge variant="outline" className="mt-1">{modelInfo.cost}</Badge>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium">Speed</p>
              <Badge variant="outline" className="mt-1">{modelInfo.speed}</Badge>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium">Capability</p>
              <Badge variant="outline" className="mt-1">{modelInfo.capability}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="temperature">Temperature</Label>
              <span className="text-sm text-gray-500">{config.temperature}</span>
            </div>
            <Slider
              value={[config.temperature]}
              onValueChange={(value) => handleConfigChange('temperature', value[0])}
              max={1}
              min={0.1}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Lower values make output more focused, higher values more creative
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxTokens">Max Tokens</Label>
              <Input
                id="maxTokens"
                type="number"
                value={config.maxTokens}
                onChange={(e) => handleConfigChange('maxTokens', parseInt(e.target.value) || 4000)}
                min={100}
                max={8000}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeout">Timeout (seconds)</Label>
              <Input
                id="timeout"
                type="number"
                value={config.timeout}
                onChange={(e) => handleConfigChange('timeout', parseInt(e.target.value) || 30)}
                min={5}
                max={120}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={resetToDefaults}>
          Reset to Defaults
        </Button>
        
        <div className="text-sm text-green-600">
          Settings are automatically saved
        </div>
      </div>
    </div>
  );
};

export default AISettings;
