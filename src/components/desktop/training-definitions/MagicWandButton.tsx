
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2, Sparkles, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MagicWandButtonProps {
  blockType: 'information' | 'goto' | 'question';
  onUseSuggestion: (suggestion: any) => void;
  className?: string;
}

const MagicWandButton: React.FC<MagicWandButtonProps> = ({ blockType, onUseSuggestion, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [context, setContext] = useState('');
  const { toast } = useToast();

  const generateSuggestions = async () => {
    setIsGenerating(true);
    try {
      // Simulate AI generation with enhanced content based on block type and difficulty
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let newSuggestions: any[] = [];

      if (blockType === 'information') {
        newSuggestions = [
          {
            content: `# ${context || 'Training Information'}\n\nThis section provides essential information about ${context || 'the key concepts'} that you need to understand. ${difficulty === 'easy' ? 'The concepts are presented in a straightforward manner for easy comprehension.' : difficulty === 'medium' ? 'This information builds upon basic knowledge and introduces more complex scenarios.' : 'This advanced content requires careful analysis and deep understanding of underlying principles.'}\n\n**Key Points:**\n• Important safety considerations\n• Standard operating procedures\n• Quality requirements\n• Best practices\n\n${difficulty === 'hard' ? '**Critical Analysis:** Consider how these principles apply in complex, real-world scenarios and potential edge cases.' : ''}`
          },
          {
            content: `## Understanding ${context || 'Core Concepts'}\n\n${difficulty === 'easy' ? 'Let\s start with the basics.' : difficulty === 'medium' ? 'Now we\ll explore the practical applications.' : 'We\ll examine the strategic implications and advanced considerations.'} ${context ? `Related to ${context}, ` : ''}the following information is crucial for your success:\n\n1. **Fundamental Principles** - ${difficulty === 'easy' ? 'Basic concepts you need to know' : difficulty === 'medium' ? 'How principles apply in practice' : 'Strategic understanding of underlying frameworks'}\n2. **Implementation Guidelines** - ${difficulty === 'easy' ? 'Step-by-step instructions' : difficulty === 'medium' ? 'Scenario-based applications' : 'Complex decision-making frameworks'}\n3. **Compliance Requirements** - ${difficulty === 'easy' ? 'Must-follow rules' : difficulty === 'medium' ? 'Situational compliance considerations' : 'Risk-based compliance strategies'}\n\n${difficulty !== 'easy' ? '> **Note:** This information forms the foundation for more advanced topics covered later in the training.' : ''}`
          }
        ];
      } else if (blockType === 'goto') {
        newSuggestions = [
          {
            instructions: `Please proceed to the ${difficulty === 'easy' ? 'designated practice area' : difficulty === 'medium' ? 'specialized training station' : 'advanced simulation facility'} to complete the hands-on component of this training. ${context ? `This practical session focuses on ${context.toLowerCase()} applications. ` : ''}${difficulty === 'easy' ? 'Follow the basic safety protocols and ask for assistance if needed.' : difficulty === 'medium' ? 'Apply the concepts you\'ve learned while maintaining safety standards and documenting your progress.' : 'Demonstrate mastery of complex procedures while managing multiple variables and potential complications.'}\n\n**Before proceeding:**\n• Ensure you have completed all theoretical components\n• ${difficulty === 'easy' ? 'Review basic safety guidelines' : difficulty === 'medium' ? 'Verify equipment functionality and safety protocols' : 'Conduct comprehensive risk assessment and prepare contingency plans'}\n• Have your training materials and documentation ready\n• ${difficulty !== 'easy' ? 'Coordinate with supervisors for advanced procedure clearance' : 'Notify your instructor of your readiness'}`
          },
          {
            instructions: `Navigate to the practical training area for ${context || 'hands-on experience'}. This ${difficulty === 'easy' ? 'introductory' : difficulty === 'medium' ? 'intermediate' : 'advanced'} session will reinforce your learning through direct application.\n\n**Required Actions:**\n1. ${difficulty === 'easy' ? 'Check in with training coordinator' : difficulty === 'medium' ? 'Complete pre-activity safety briefing' : 'Conduct comprehensive readiness assessment'}\n2. ${difficulty === 'easy' ? 'Gather basic required materials' : difficulty === 'medium' ? 'Verify all equipment and safety systems' : 'Execute full system checks and validation protocols'}\n3. ${difficulty === 'easy' ? 'Begin guided practice session' : difficulty === 'medium' ? 'Perform monitored practical exercises' : 'Execute independent complex scenarios with oversight'}\n\n**Safety Reminder:** ${difficulty === 'easy' ? 'Follow all posted safety guidelines.' : difficulty === 'medium' ? 'Maintain situational awareness and apply safety protocols consistently.' : 'Exercise advanced safety judgment and implement dynamic risk management strategies.'}`
          }
        ];
      } else if (blockType === 'question') {
        newSuggestions = [
          {
            question_text: difficulty === 'easy' 
              ? `What is the main purpose of ${context || 'this procedure'}?`
              : difficulty === 'medium'
              ? `How would you apply the principles of ${context || 'this process'} in a real-world scenario?`
              : `Analyze the complex factors involved in ${context || 'this situation'} and evaluate the optimal approach.`,
            question_type: 'multiple_choice',
            options: difficulty === 'easy'
              ? ['To ensure safety and compliance', 'To speed up the process', 'To reduce costs', 'To avoid documentation']
              : difficulty === 'medium'
              ? ['Systematically assess and apply appropriate protocols', 'Use the quickest available method', 'Wait for detailed instructions', 'Apply the same approach regardless of context']
              : ['Conduct comprehensive analysis considering multiple variables and stakeholder impacts', 'Apply standard procedure without modification', 'Escalate decision to management immediately', 'Implement quick fix based on previous experience'],
            correct_option: 0,
            hint: difficulty === 'easy'
              ? 'Think about the primary objective and safety considerations.'
              : difficulty === 'medium'
              ? 'Consider how the principles adapt to different situations while maintaining core objectives.'
              : 'Advanced scenarios require thorough analysis of multiple factors and strategic thinking.',
            points: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15,
            mandatory: true
          },
          {
            question_text: difficulty === 'easy'
              ? `Which safety equipment is required for ${context || 'this activity'}?`
              : difficulty === 'medium'
              ? `Describe the step-by-step process for handling ${context || 'this situation'} safely and effectively.`
              : `Design a comprehensive strategy for managing ${context || 'complex operational scenarios'} while optimizing for multiple objectives.`,
            question_type: difficulty === 'easy' ? 'multiple_choice' : 'text_input',
            options: difficulty === 'easy' 
              ? ['Personal protective equipment as specified', 'Any available safety gear', 'No special equipment needed', 'Equipment is optional']
              : undefined,
            correct_option: difficulty === 'easy' ? 0 : undefined,
            ideal_answer: difficulty !== 'easy' 
              ? difficulty === 'medium'
                ? 'A detailed step-by-step approach that includes safety checks, proper procedures, and verification steps.'
                : 'A comprehensive strategic analysis including risk assessment, stakeholder considerations, resource optimization, and implementation planning with contingencies.'
              : undefined,
            hint: difficulty === 'easy'
              ? 'Always prioritize safety and follow equipment specifications.'
              : difficulty === 'medium'
              ? 'Include safety considerations, logical sequence, and verification steps in your response.'
              : 'Consider multiple perspectives: safety, efficiency, compliance, stakeholder impact, and long-term implications.',
            points: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15,
            mandatory: true
          }
        ];
      }

      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate suggestions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const applySuggestion = (suggestion: any) => {
    onUseSuggestion(suggestion);
    setIsOpen(false);
    toast({
      title: "Content Applied",
      description: "AI-generated content has been applied to your block."
    });
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Content copied to clipboard."
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={`absolute top-0 right-0 z-10 ${className}`}
        title="AI Content Assistant"
      >
        <Wand2 className="w-4 h-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>AI Content Assistant - {blockType.charAt(0).toUpperCase() + blockType.slice(1)} Block</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Configuration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Difficulty Level</label>
                <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy - Basic Level</SelectItem>
                    <SelectItem value="medium">Medium - Intermediate</SelectItem>
                    <SelectItem value="hard">Hard - Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Context/Topic</label>
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g., Safety protocols, Equipment operation"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>

            <Button
              onClick={generateSuggestions}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating AI Content...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Content Suggestions
                </>
              )}
            </Button>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Generated Suggestions:</h4>
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Option {index + 1}</span>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(JSON.stringify(suggestion, null, 2))}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => applySuggestion(suggestion)}
                        >
                          Use This
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      {blockType === 'information' && (
                        <div className="bg-gray-50 p-3 rounded whitespace-pre-wrap">
                          {suggestion.content}
                        </div>
                      )}
                      {blockType === 'goto' && (
                        <div className="bg-gray-50 p-3 rounded whitespace-pre-wrap">
                          {suggestion.instructions}
                        </div>
                      )}
                      {blockType === 'question' && (
                        <div className="space-y-2">
                          <div className="font-medium">{suggestion.question_text}</div>
                          {suggestion.options && (
                            <div className="space-y-1">
                              {suggestion.options.map((option: string, optIndex: number) => (
                                <div
                                  key={optIndex}
                                  className={`px-2 py-1 rounded text-xs ${
                                    optIndex === suggestion.correct_option 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-gray-100'
                                  }`}
                                >
                                  {optIndex === suggestion.correct_option && '✓ '}{option}
                                </div>
                              ))}
                            </div>
                          )}
                          {suggestion.ideal_answer && (
                            <div className="text-xs text-blue-600">
                              <strong>Ideal Answer:</strong> {suggestion.ideal_answer}
                            </div>
                          )}
                          <div className="text-xs text-gray-600">
                            <strong>Hint:</strong> {suggestion.hint}
                          </div>
                          <div className="text-xs text-gray-500">
                            Points: {suggestion.points} | Mandatory: {suggestion.mandatory ? 'Yes' : 'No'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MagicWandButton;
