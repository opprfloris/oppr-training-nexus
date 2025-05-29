
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Eye, Code, Zap, ExternalLink } from 'lucide-react';
import { useAISettings } from '@/contexts/AISettingsContext';

interface AISettingsModalProps {
  className?: string;
}

const AISettingsModal: React.FC<AISettingsModalProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { config, connectionStatus } = useAISettings();

  // Mock data for demonstration
  const extractionPrompt = `You are an expert training content analyzer. Analyze the provided document and extract:

1. Key learning objectives and topics
2. Content complexity level (basic, intermediate, advanced)
3. Suggested question types and difficulty
4. Important concepts that need reinforcement
5. Practical applications mentioned

Format your response as structured JSON with the following schema:
{
  "topics": ["topic1", "topic2"],
  "complexity": "intermediate",
  "suggestedQuestions": 8,
  "keyConceptes": ["concept1", "concept2"],
  "practicalApplications": ["app1", "app2"]
}`;

  const generationPrompt = `Based on the document analysis, generate a comprehensive training flow with the following requirements:

- Create a mix of information blocks, goto blocks, and question blocks
- Ensure logical progression from basic concepts to advanced applications
- Include practical scenarios and real-world applications
- Generate questions that test understanding at multiple levels
- Maintain engagement through varied content types

Structure each block according to the provided schema and ensure all content is relevant and educational.`;

  const mockRawOutput = `{
  "steps": [
    {
      "type": "information",
      "title": "Safety Introduction",
      "content": "Understanding workplace safety protocols is crucial for maintaining a secure work environment..."
    },
    {
      "type": "question",
      "question": "What are the three primary safety protocols mentioned?",
      "type": "multiple_choice",
      "options": ["PPE, Training, Documentation", "Speed, Efficiency, Cost", "Planning, Execution, Review"],
      "correct": 0
    }
  ],
  "metadata": {
    "totalSteps": 8,
    "estimatedDuration": "15 minutes",
    "difficultyLevel": "intermediate"
  }
}`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={`p-2 ${className}`}>
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              AI Configuration & Debug
            </div>
            <Button variant="outline" size="sm" onClick={() => window.open('/desktop/settings', '_blank')}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Settings
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs defaultValue="configuration" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="configuration">Configuration</TabsTrigger>
              <TabsTrigger value="prompts">Prompts</TabsTrigger>
              <TabsTrigger value="output">Raw Output</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="configuration" className="space-y-4 mt-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
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
            </TabsContent>
            
            <TabsContent value="prompts" className="space-y-4 mt-4">
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  Content Extraction Prompt
                </h4>
                <Textarea
                  value={extractionPrompt}
                  rows={8}
                  className="text-xs font-mono"
                  readOnly
                />
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Zap className="w-3 h-3 mr-1" />
                  Flow Generation Prompt
                </h4>
                <Textarea
                  value={generationPrompt}
                  rows={6}
                  className="text-xs font-mono"
                  readOnly
                />
              </div>
            </TabsContent>
            
            <TabsContent value="output" className="space-y-4 mt-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Last AI Response (Raw JSON)</h4>
                <Textarea
                  value={mockRawOutput}
                  rows={12}
                  className="text-xs font-mono"
                  readOnly
                />
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-xs text-green-700">
                  <strong>Response Time:</strong> 2.3s<br/>
                  <strong>Tokens Used:</strong> 1,247<br/>
                  <strong>Status:</strong> Successfully parsed
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="processing" className="space-y-4 mt-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Processing Steps</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Document uploaded and parsed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Content analysis completed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Training flow generated</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Converted to step blocks</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Converted Step Blocks</h4>
                <Textarea
                  value={JSON.stringify([
                    {
                      id: "step_1",
                      type: "information",
                      order: 0,
                      config: {
                        content: "Understanding workplace safety protocols is crucial..."
                      }
                    },
                    {
                      id: "step_2", 
                      type: "question",
                      order: 1,
                      config: {
                        question_text: "What are the three primary safety protocols mentioned?",
                        question_type: "multiple_choice",
                        options: ["PPE, Training, Documentation", "Speed, Efficiency, Cost"],
                        correct_option: 0
                      }
                    }
                  ], null, 2)}
                  rows={10}
                  className="text-xs font-mono"
                  readOnly
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AISettingsModal;
