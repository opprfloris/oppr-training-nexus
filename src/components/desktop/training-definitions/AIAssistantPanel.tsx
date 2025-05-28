
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, RefreshCw, ThumbsUp, Edit3 } from 'lucide-react';

interface AIAssistantPanelProps {
  blockType: 'information' | 'goto' | 'question';
  onUseSuggestion: (suggestion: any) => void;
  className?: string;
}

interface AISuggestion {
  id: string;
  type: 'information' | 'goto' | 'question';
  content: any;
  confidence: number;
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  blockType,
  onUseSuggestion,
  className = ''
}) => {
  const [context, setContext] = useState('');
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [generating, setGenerating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const { toast } = useToast();

  const generateSuggestions = async () => {
    if (!context.trim()) {
      toast({
        title: "Context Required",
        description: "Please provide some context for the AI to generate suggestions",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);
    
    // Simulate AI generation with mock data for now
    // In a real implementation, this would call an AI service
    setTimeout(() => {
      const mockSuggestions = generateMockSuggestions(blockType, context);
      setSuggestions(mockSuggestions);
      setGenerating(false);
      
      toast({
        title: "Suggestions Generated",
        description: `Generated ${mockSuggestions.length} suggestions for ${blockType} block`,
      });
    }, 1500);
  };

  const generateMockSuggestions = (type: string, context: string): AISuggestion[] => {
    const baseId = Date.now();
    
    switch (type) {
      case 'information':
        return [
          {
            id: `${baseId}-1`,
            type: 'information',
            content: {
              content: `Understanding ${context}\n\nThis section covers the fundamental concepts and principles related to ${context}. It's important to understand these basics before proceeding to practical applications.\n\nKey points to remember:\n• Proper safety procedures\n• Step-by-step methodology\n• Quality standards and expectations`
            },
            confidence: 0.92
          },
          {
            id: `${baseId}-2`,
            type: 'information',
            content: {
              content: `Important Safety Information for ${context}\n\nBefore beginning any work with ${context}, ensure you understand all safety requirements and have the proper protective equipment.\n\nRequired safety measures:\n• Personal protective equipment (PPE)\n• Proper ventilation if applicable\n• Emergency procedures\n• Equipment inspection protocols`
            },
            confidence: 0.87
          }
        ];
      
      case 'goto':
        return [
          {
            id: `${baseId}-1`,
            type: 'goto',
            content: {
              instructions: `Navigate to the ${context} workstation. Ensure all equipment is properly set up and calibrated before proceeding. Check that all safety systems are active and functional.`
            },
            confidence: 0.89
          },
          {
            id: `${baseId}-2`,
            type: 'goto',
            content: {
              instructions: `Proceed to the designated ${context} area. Verify that the workspace is clean and organized. Gather all necessary tools and materials for the upcoming procedures.`
            },
            confidence: 0.85
          }
        ];
      
      case 'question':
        return [
          {
            id: `${baseId}-1`,
            type: 'question',
            content: {
              question_text: `What are the three most important safety considerations when working with ${context}?`,
              question_type: 'text_input',
              ideal_answer: 'Proper PPE, equipment inspection, and emergency procedures',
              hint: 'Think about personal protection, equipment safety, and emergency preparedness',
              points: 3,
              mandatory: true
            },
            confidence: 0.94
          },
          {
            id: `${baseId}-2`,
            type: 'question',
            content: {
              question_text: `Which tool is primarily used for ${context}?`,
              question_type: 'multiple_choice',
              options: ['Tool A', 'Tool B', 'Tool C', 'Tool D'],
              correct_option: 0,
              points: 2,
              mandatory: true
            },
            confidence: 0.88
          }
        ];
      
      default:
        return [];
    }
  };

  const handleUseSuggestion = (suggestion: AISuggestion) => {
    onUseSuggestion(suggestion.content);
    toast({
      title: "Suggestion Applied",
      description: "The AI suggestion has been applied to your block",
    });
  };

  const handleEditSuggestion = (suggestion: AISuggestion) => {
    setEditingId(suggestion.id);
    if (suggestion.type === 'information') {
      setEditContent(suggestion.content.content);
    } else if (suggestion.type === 'goto') {
      setEditContent(suggestion.content.instructions);
    } else if (suggestion.type === 'question') {
      setEditContent(suggestion.content.question_text);
    }
  };

  const handleSaveEdit = (suggestion: AISuggestion) => {
    const updatedContent = { ...suggestion.content };
    
    if (suggestion.type === 'information') {
      updatedContent.content = editContent;
    } else if (suggestion.type === 'goto') {
      updatedContent.instructions = editContent;
    } else if (suggestion.type === 'question') {
      updatedContent.question_text = editContent;
    }

    onUseSuggestion(updatedContent);
    setEditingId(null);
    setEditContent('');
    
    toast({
      title: "Edited Suggestion Applied",
      description: "Your edited suggestion has been applied to the block",
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-100 text-green-800';
    if (confidence >= 0.8) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <span>AI Assistant</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Context for {blockType} block
          </label>
          <Textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder={`Describe what this ${blockType} block should cover...`}
            rows={3}
          />
        </div>

        <Button
          onClick={generateSuggestions}
          disabled={generating || !context.trim()}
          className="w-full"
          variant="outline"
        >
          {generating ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 mr-2" />
          )}
          {generating ? 'Generating...' : 'Generate Suggestions'}
        </Button>

        {suggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">AI Suggestions</h4>
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge className={getConfidenceColor(suggestion.confidence)}>
                    {Math.round(suggestion.confidence * 100)}% confidence
                  </Badge>
                </div>

                {editingId === suggestion.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                    />
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(suggestion)}
                      >
                        Save & Use
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-sm text-gray-700">
                      {suggestion.type === 'information' && (
                        <p className="whitespace-pre-wrap">{suggestion.content.content}</p>
                      )}
                      {suggestion.type === 'goto' && (
                        <p>{suggestion.content.instructions}</p>
                      )}
                      {suggestion.type === 'question' && (
                        <div>
                          <p className="font-medium">{suggestion.content.question_text}</p>
                          {suggestion.content.question_type === 'multiple_choice' && suggestion.content.options && (
                            <ul className="list-disc list-inside mt-2 text-xs">
                              {suggestion.content.options.map((option: string, index: number) => (
                                <li key={index} className={index === suggestion.content.correct_option ? 'font-medium' : ''}>
                                  {option} {index === suggestion.content.correct_option && '(Correct)'}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleUseSuggestion(suggestion)}
                      >
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        Use This
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditSuggestion(suggestion)}
                      >
                        <Edit3 className="w-3 h-3 mr-1" />
                        Edit & Use
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAssistantPanel;
