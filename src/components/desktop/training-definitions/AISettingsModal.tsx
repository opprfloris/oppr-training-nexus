
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings, Save } from 'lucide-react';
import { useAISettings } from '@/contexts/AISettingsContext';
import { useToast } from '@/hooks/use-toast';

interface AISettingsModalProps {
  className?: string;
}

const AISettingsModal: React.FC<AISettingsModalProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { config, connectionStatus } = useAISettings();
  const { toast } = useToast();
  
  // Prompt configuration state
  const [analysisPrompt, setAnalysisPrompt] = useState(`Analyze this training document and provide a simple, helpful summary.

Focus on:
- Main topics and themes
- Key learning points
- Suggested training approach
- Content difficulty level

Keep the response concise and actionable for training developers.`);

  const [generationPrompt, setGenerationPrompt] = useState(`Create a training flow based on the document analysis and user configuration.

Requirements:
- Use the specified question count and content mix
- Focus on the selected topics
- Match the requested difficulty level
- Create engaging, practical content

Generate a well-structured training sequence with clear learning progression.`);

  const handleSavePrompts = () => {
    // Save prompts to localStorage
    localStorage.setItem('ai-analysis-prompt', analysisPrompt);
    localStorage.setItem('ai-generation-prompt', generationPrompt);
    
    toast({
      title: "Success",
      description: "Custom prompts saved successfully",
    });
    
    console.log('Prompts saved successfully');
  };

  // Load saved prompts on component mount
  React.useEffect(() => {
    const savedAnalysisPrompt = localStorage.getItem('ai-analysis-prompt');
    const savedGenerationPrompt = localStorage.getItem('ai-generation-prompt');
    
    if (savedAnalysisPrompt) setAnalysisPrompt(savedAnalysisPrompt);
    if (savedGenerationPrompt) setGenerationPrompt(savedGenerationPrompt);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={`p-2 ${className}`}>
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            AI Configuration
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Current Configuration Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Current AI Configuration</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${config.apiKey ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-blue-700">
                  {config.apiKey ? `Connected (${config.model})` : 'No API Key'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-700"><strong>Model:</strong> {config.model}</p>
                <p className="text-blue-700"><strong>Temperature:</strong> {config.temperature}</p>
              </div>
              <div>
                <p className="text-blue-700"><strong>Max Tokens:</strong> {config.maxTokens}</p>
                <p className="text-blue-700"><strong>Timeout:</strong> {config.timeout}s</p>
              </div>
            </div>
            
            {!config.apiKey && (
              <p className="text-xs text-blue-600 mt-2">
                Configure your AI settings in the main Settings page to enable advanced features.
              </p>
            )}
            
            {connectionStatus !== 'none' && (
              <div className={`flex items-center space-x-2 text-sm mt-2 ${
                connectionStatus === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
                <Badge variant={connectionStatus === 'success' ? 'default' : 'destructive'}>
                  {connectionStatus === 'success' ? 'Connected' : 'Connection Failed'}
                </Badge>
              </div>
            )}
          </div>

          {/* Custom Prompts Section */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="analysis-prompt" className="text-sm font-medium">
                Content Analysis Prompt
              </Label>
              <p className="text-xs text-gray-600 mb-2">
                This prompt is used to analyze uploaded documents and generate summaries
              </p>
              <Textarea
                id="analysis-prompt"
                value={analysisPrompt}
                onChange={(e) => setAnalysisPrompt(e.target.value)}
                rows={6}
                className="text-sm"
                placeholder="Enter your custom analysis prompt..."
              />
            </div>
            
            <div>
              <Label htmlFor="generation-prompt" className="text-sm font-medium">
                Training Generation Prompt
              </Label>
              <p className="text-xs text-gray-600 mb-2">
                This prompt is used to generate training flows based on configuration
              </p>
              <Textarea
                id="generation-prompt"
                value={generationPrompt}
                onChange={(e) => setGenerationPrompt(e.target.value)}
                rows={6}
                className="text-sm"
                placeholder="Enter your custom generation prompt..."
              />
            </div>
            
            <Button onClick={handleSavePrompts} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Custom Prompts
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AISettingsModal;
