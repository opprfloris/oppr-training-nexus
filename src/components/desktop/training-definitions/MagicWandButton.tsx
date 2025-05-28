
import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface AIGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockType: string;
  onUseSuggestion: (suggestion: any) => void;
}

const AIGenerationModal: React.FC<AIGenerationModalProps> = ({
  isOpen,
  onClose,
  blockType,
  onUseSuggestion
}) => {
  const [prompt, setPrompt] = useState('');
  const [suggestion, setSuggestion] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateContent = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      // Mock AI generation for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let generatedSuggestion;
      
      if (blockType === 'information') {
        generatedSuggestion = {
          content: `Generated information content based on: "${prompt}". This content provides comprehensive details about the topic, including key concepts, practical applications, and important considerations that learners should understand.`
        };
      } else if (blockType === 'goto') {
        generatedSuggestion = {
          instructions: `Navigate to the specified location for: ${prompt}. Follow the detailed directions provided, ensuring you observe all safety protocols and procedures outlined in the training materials.`
        };
      } else if (blockType === 'question') {
        generatedSuggestion = {
          question_text: `What is the most important aspect of ${prompt}?`,
          question_type: 'multiple_choice',
          options: [
            'Safety protocols and procedures',
            'Efficiency and speed',
            'Cost considerations',
            'Documentation requirements'
          ],
          correct_option: 0,
          hint: `Consider the primary priority in any workplace scenario related to ${prompt}.`,
          points: 10,
          mandatory: true
        };
      }

      setSuggestion(generatedSuggestion);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate content",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseSuggestion = () => {
    if (suggestion) {
      onUseSuggestion(suggestion);
      onClose();
      setPrompt('');
      setSuggestion(null);
    }
  };

  const handleClose = () => {
    onClose();
    setPrompt('');
    setSuggestion(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>AI Content Generator</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">What would you like to generate?</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Describe what you want for this ${blockType} block...`}
              rows={3}
              className="mt-1"
            />
          </div>

          <Button 
            onClick={generateContent}
            disabled={!prompt.trim() || isGenerating}
            className="w-full"
          >
            {isGenerating ? 'Generating...' : 'Generate Content'}
          </Button>

          {suggestion && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium mb-2">Generated Content:</h4>
              <div className="text-sm space-y-2">
                {blockType === 'information' && (
                  <div>
                    <strong>Content:</strong>
                    <p className="mt-1">{suggestion.content}</p>
                  </div>
                )}
                {blockType === 'goto' && (
                  <div>
                    <strong>Instructions:</strong>
                    <p className="mt-1">{suggestion.instructions}</p>
                  </div>
                )}
                {blockType === 'question' && (
                  <div className="space-y-2">
                    <div>
                      <strong>Question:</strong>
                      <p className="mt-1">{suggestion.question_text}</p>
                    </div>
                    {suggestion.options && (
                      <div>
                        <strong>Options:</strong>
                        <ul className="mt-1 list-disc list-inside">
                          {suggestion.options.map((option: string, index: number) => (
                            <li key={index} className={index === suggestion.correct_option ? 'font-medium text-green-600' : ''}>
                              {option} {index === suggestion.correct_option && '(Correct)'}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {suggestion.hint && (
                      <div>
                        <strong>Hint:</strong>
                        <p className="mt-1">{suggestion.hint}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <Button 
                onClick={handleUseSuggestion}
                className="mt-3 w-full"
              >
                Use This Content
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface MagicWandButtonProps {
  blockType: 'information' | 'goto' | 'question';
  onUseSuggestion: (suggestion: any) => void;
}

const MagicWandButton: React.FC<MagicWandButtonProps> = ({ blockType, onUseSuggestion }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowModal(true)}
        className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-purple-100"
        title="AI Assistant"
      >
        <Wand2 className="h-4 w-4 text-purple-600" />
      </Button>

      <AIGenerationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        blockType={blockType}
        onUseSuggestion={onUseSuggestion}
      />
    </>
  );
};

export default MagicWandButton;
