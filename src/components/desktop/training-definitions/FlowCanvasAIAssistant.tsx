
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2, FileText, Brain, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DocumentUploader from './DocumentUploader';
import AIFlowPreview from './AIFlowPreview';
import { StepBlock } from '@/types/training-definitions';

interface FlowCanvasAIAssistantProps {
  onApplyFlow: (blocks: StepBlock[]) => void;
}

interface FlowGenerationConfig {
  objective: string;
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  questionTypes: string[];
  includeInformation: boolean;
  includeGoto: boolean;
  focusAreas: string[];
}

const FlowCanvasAIAssistant: React.FC<FlowCanvasAIAssistantProps> = ({ onApplyFlow }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<FlowGenerationConfig>({
    objective: '',
    questionCount: 8,
    difficulty: 'medium',
    questionTypes: ['multiple_choice'],
    includeInformation: true,
    includeGoto: false,
    focusAreas: []
  });
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);
  const [documentContent, setDocumentContent] = useState<string>('');
  const [extractedImages, setExtractedImages] = useState<string[]>([]);
  const [generatedFlow, setGeneratedFlow] = useState<StepBlock[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const handleDocumentUpload = (file: File, content: string, images: string[] = []) => {
    setUploadedDocument(file);
    setDocumentContent(content);
    setExtractedImages(images);
    
    // Auto-extract focus areas from document content
    const detectedAreas = extractFocusAreas(content);
    setConfig(prev => ({ ...prev, focusAreas: detectedAreas }));
    
    toast({
      title: "Document Processed",
      description: `${file.name} analyzed. Found ${images.length} images and ${detectedAreas.length} focus areas.`
    });
  };

  const extractFocusAreas = (content: string): string[] => {
    const areas = [];
    if (content.toLowerCase().includes('safety')) areas.push('Safety Protocols');
    if (content.toLowerCase().includes('equipment')) areas.push('Equipment Operation');
    if (content.toLowerCase().includes('quality')) areas.push('Quality Control');
    if (content.toLowerCase().includes('emergency')) areas.push('Emergency Procedures');
    if (content.toLowerCase().includes('maintenance')) areas.push('Maintenance');
    if (content.toLowerCase().includes('documentation')) areas.push('Documentation');
    return areas;
  };

  const generateDifficultyBasedQuestion = (
    area: string, 
    index: number, 
    difficulty: string, 
    questionType: string,
    documentSnippet?: string
  ) => {
    const baseQuestions = {
      easy: {
        safety: 'What is the first step in safety protocols?',
        equipment: 'Which safety equipment is required?',
        quality: 'What is the quality standard requirement?',
        emergency: 'Where is the emergency assembly point?'
      },
      medium: {
        safety: 'How would you respond to a safety violation scenario?',
        equipment: 'Describe the proper equipment maintenance procedure.',
        quality: 'What steps would you take if quality standards are not met?',
        emergency: 'Explain the emergency evacuation procedure for your area.'
      },
      hard: {
        safety: 'Analyze a complex safety situation and determine the most appropriate response strategy.',
        equipment: 'Evaluate equipment performance data and recommend optimization strategies.',
        quality: 'Design a quality improvement plan for a failing process.',
        emergency: 'Develop an emergency response plan for multiple simultaneous incidents.'
      }
    };

    const areaKey = area.toLowerCase().split(' ')[0] as keyof typeof baseQuestions.easy;
    const questionText = baseQuestions[difficulty as keyof typeof baseQuestions]?.[areaKey] || 
                        `${difficulty === 'easy' ? 'What' : difficulty === 'medium' ? 'How' : 'Analyze'} ${area.toLowerCase()} in this context?`;

    let options: string[] = [];
    let correctOption = 0;
    let hint = '';
    let idealAnswer = '';

    if (questionType === 'multiple_choice') {
      if (difficulty === 'easy') {
        options = [
          'Follow the standard procedure',
          'Skip the safety check',
          'Proceed without verification',
          'Ignore the guidelines'
        ];
        hint = 'Always prioritize safety and follow established procedures.';
      } else if (difficulty === 'medium') {
        options = [
          'Assess the situation and apply appropriate protocols',
          'Apply a generic solution',
          'Wait for supervisor instructions',
          'Ignore the issue'
        ];
        hint = 'Consider the specific circumstances and apply relevant knowledge.';
      } else {
        options = [
          'Conduct comprehensive analysis and implement strategic solution',
          'Apply quick fix without analysis',
          'Escalate without initial assessment',
          'Delay decision making'
        ];
        hint = 'Advanced problems require thorough analysis and strategic thinking.';
      }
    } else {
      if (difficulty === 'easy') {
        idealAnswer = 'A basic, direct response following standard procedures';
        hint = 'Provide a straightforward answer based on basic principles.';
      } else if (difficulty === 'medium') {
        idealAnswer = 'A detailed explanation with step-by-step approach and reasoning';
        hint = 'Explain your approach with clear reasoning and steps.';
      } else {
        idealAnswer = 'A comprehensive analysis with multiple considerations, risk assessment, and strategic recommendations';
        hint = 'Provide thorough analysis considering multiple factors and implications.';
      }
    }

    // Enhance hint with document snippet if available
    if (documentSnippet) {
      const snippet = documentSnippet.substring(0, 150) + '...';
      hint += ` Document reference: "${snippet}" - ${uploadedDocument?.name}, extracted content.`;
    }

    return {
      questionText,
      options,
      correctOption,
      idealAnswer,
      hint,
      points: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15
    };
  };

  const generateFlow = async () => {
    if (!config.objective.trim()) {
      toast({
        title: "Missing Objective",
        description: "Please provide a training objective to generate the flow.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 4000));

      const blocks: StepBlock[] = [];
      let order = 0;

      // Add comprehensive information block
      if (config.includeInformation) {
        let infoContent = `# ${config.objective} - Training Overview\n\n`;
        
        if (documentContent) {
          infoContent += `This training is based on comprehensive documentation and covers the following key areas:\n\n`;
          config.focusAreas.forEach(area => {
            infoContent += `• ${area}\n`;
          });
          infoContent += `\n**Learning Objectives:**\n`;
          infoContent += `By the end of this training, you will be able to understand and apply the principles outlined in the source material, demonstrate proficiency in key procedures, and respond appropriately to various scenarios.\n\n`;
          infoContent += `**Training Material Source:** ${uploadedDocument?.name}\n`;
        } else {
          infoContent += `This comprehensive training will help you master the essential concepts and practical applications related to ${config.objective}.\n\n`;
          infoContent += `**Key Learning Outcomes:**\n`;
          infoContent += `• Understand fundamental principles\n`;
          infoContent += `• Apply knowledge in practical scenarios\n`;
          infoContent += `• Demonstrate competency in assessment\n`;
        }

        blocks.push({
          id: `block_${Date.now()}_${order}`,
          type: 'information',
          order: order++,
          config: {
            content: infoContent,
            image_url: extractedImages.length > 0 ? extractedImages[0] : undefined
          }
        });
      }

      // Generate sophisticated questions
      const focusAreas = config.focusAreas.length > 0 ? config.focusAreas : ['General Knowledge'];
      const questionsPerArea = Math.ceil(config.questionCount / focusAreas.length);

      for (const area of focusAreas) {
        const areaQuestions = Math.min(questionsPerArea, config.questionCount - (blocks.length - (config.includeInformation ? 1 : 0)));
        
        for (let i = 0; i < areaQuestions; i++) {
          const questionType = config.questionTypes[i % config.questionTypes.length];
          
          // Extract relevant document snippet for this question
          let documentSnippet = '';
          if (documentContent) {
            const areaRegex = new RegExp(`[^.]*${area.toLowerCase()}[^.]*\\.`, 'i');
            const match = documentContent.match(areaRegex);
            documentSnippet = match ? match[0] : '';
          }

          const questionData = generateDifficultyBasedQuestion(
            area, 
            i, 
            config.difficulty, 
            questionType, 
            documentSnippet
          );

          blocks.push({
            id: `block_${Date.now()}_${order}`,
            type: 'question',
            order: order++,
            config: {
              question_text: `**${area}** - ${questionData.questionText}`,
              question_type: questionType as any,
              options: questionType === 'multiple_choice' ? questionData.options : undefined,
              correct_option: questionType === 'multiple_choice' ? questionData.correctOption : undefined,
              ideal_answer: questionType !== 'multiple_choice' ? questionData.idealAnswer : undefined,
              hint: questionData.hint,
              points: questionData.points,
              mandatory: true,
              image_url: extractedImages.length > i + 1 ? extractedImages[i + 1] : undefined
            }
          });
        }
      }

      // Add goto block if requested
      if (config.includeGoto) {
        blocks.push({
          id: `block_${Date.now()}_${order}`,
          type: 'goto',
          order: order++,
          config: {
            instructions: `Proceed to the practical assessment area for hands-on evaluation of ${config.objective}. Ensure you have completed all theoretical components before proceeding. Follow all safety protocols and have your training materials readily available.`
          }
        });
      }

      setGeneratedFlow(blocks);
      setShowPreview(true);
      
      toast({
        title: "Training Flow Generated",
        description: `Created ${blocks.length} blocks with ${config.difficulty} difficulty level${documentContent ? ' based on uploaded document' : ''}.`
      });
    } catch (error) {
      console.error('Error generating flow:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate training flow. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyFlow = (editedBlocks: StepBlock[]) => {
    onApplyFlow(editedBlocks);
    setIsOpen(false);
    setShowPreview(false);
    setGeneratedFlow(null);
    toast({
      title: "Training Flow Applied",
      description: "AI-generated training flow with enhanced content has been applied to your canvas."
    });
  };

  const resetForm = () => {
    setConfig({
      objective: '',
      questionCount: 8,
      difficulty: 'medium',
      questionTypes: ['multiple_choice'],
      includeInformation: true,
      includeGoto: false,
      focusAreas: []
    });
    setUploadedDocument(null);
    setDocumentContent('');
    setExtractedImages([]);
    setGeneratedFlow(null);
    setShowPreview(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Brain className="w-4 h-4 mr-2" />
          AI Flow Generator
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Wand2 className="w-5 h-5" />
            <span>Advanced AI Training Flow Generator</span>
          </DialogTitle>
        </DialogHeader>

        {!showPreview ? (
          <div className="space-y-6">
            {/* Document Upload Section */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Document-Based Training Generation
              </h4>
              <DocumentUploader onDocumentProcessed={handleDocumentUpload} />
            </div>

            {/* Training Configuration */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="objective" className="flex items-center space-x-1">
                    <Target className="w-4 h-4" />
                    <span>Training Objective *</span>
                  </Label>
                  <Textarea
                    id="objective"
                    value={config.objective}
                    onChange={(e) => setConfig(prev => ({ ...prev, objective: e.target.value }))}
                    placeholder="Describe the comprehensive learning objectives for this training program..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="questionCount">Questions</Label>
                    <Input
                      id="questionCount"
                      type="number"
                      min="3"
                      max="25"
                      value={config.questionCount}
                      onChange={(e) => setConfig(prev => ({ ...prev, questionCount: parseInt(e.target.value) || 8 }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={config.difficulty} onValueChange={(value: any) => setConfig(prev => ({ ...prev, difficulty: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy - Basic recall</SelectItem>
                        <SelectItem value="medium">Medium - Application</SelectItem>
                        <SelectItem value="hard">Hard - Analysis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id="includeGoto"
                      checked={config.includeGoto}
                      onChange={(e) => setConfig(prev => ({ ...prev, includeGoto: e.target.checked }))}
                    />
                    <Label htmlFor="includeGoto" className="text-sm">Practical Component</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Question Types</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {[
                      { value: 'multiple_choice', label: 'Multiple Choice' },
                      { value: 'text_input', label: 'Text Input' },
                      { value: 'numerical_input', label: 'Numerical' },
                      { value: 'voice_input', label: 'Voice Input' }
                    ].map((type) => (
                      <label key={type.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={config.questionTypes.includes(type.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setConfig(prev => ({ ...prev, questionTypes: [...prev.questionTypes, type.value] }));
                            } else {
                              setConfig(prev => ({ ...prev, questionTypes: prev.questionTypes.filter(t => t !== type.value) }));
                            }
                          }}
                        />
                        <span className="text-sm">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {config.focusAreas.length > 0 && (
                  <div>
                    <Label>Detected Focus Areas</Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {config.focusAreas.map((area, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button 
                onClick={generateFlow}
                disabled={isGenerating || !config.objective.trim() || config.questionTypes.length === 0}
              >
                {isGenerating ? 'Generating Advanced Training Flow...' : 'Generate Training Flow'}
              </Button>
            </div>
          </div>
        ) : (
          <AIFlowPreview
            blocks={generatedFlow || []}
            onApply={handleApplyFlow}
            onBack={() => setShowPreview(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FlowCanvasAIAssistant;
