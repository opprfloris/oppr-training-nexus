
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Eye, Code, Zap } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface AIDebugPanelProps {
  className?: string;
}

const AIDebugPanel: React.FC<AIDebugPanelProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePrompt, setActivePrompt] = useState('');
  const [lastRawOutput, setLastRawOutput] = useState('');
  const [lastProcessedSteps, setLastProcessedSteps] = useState('');

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
    <div className={className}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="w-full justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>AI Debug Panel</span>
            </div>
            <Badge variant="secondary" className="ml-2">
              {isOpen ? 'Hide' : 'Show'}
            </Badge>
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Code className="w-4 h-4 mr-2" />
                AI Configuration & Debug
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="prompts" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="prompts">Prompts</TabsTrigger>
                  <TabsTrigger value="output">Raw Output</TabsTrigger>
                  <TabsTrigger value="processing">Processing</TabsTrigger>
                </TabsList>
                
                <TabsContent value="prompts" className="space-y-4 mt-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      Content Extraction Prompt
                    </h4>
                    <Textarea
                      value={extractionPrompt}
                      onChange={(e) => setActivePrompt(e.target.value)}
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

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-blue-700">
                      <strong>Current Model:</strong> GPT-4o-mini<br/>
                      <strong>Temperature:</strong> 0.7<br/>
                      <strong>Max Tokens:</strong> 2000
                    </p>
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
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default AIDebugPanel;
