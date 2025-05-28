
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2, Upload, FileText } from 'lucide-react';
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
}

const FlowCanvasAIAssistant: React.FC<FlowCanvasAIAssistantProps> = ({ onApplyFlow }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<FlowGenerationConfig>({
    objective: '',
    questionCount: 5,
    difficulty: 'medium',
    questionTypes: ['multiple_choice'],
    includeInformation: true,
    includeGoto: false
  });
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);
  const [documentContent, setDocumentContent] = useState<string>('');
  const [generatedFlow, setGeneratedFlow] = useState<StepBlock[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const handleDocumentUpload = (file: File, content: string) => {
    setUploadedDocument(file);
    setDocumentContent(content);
    toast({
      title: "Document Uploaded",
      description: `${file.name} has been processed and is ready for AI analysis.`
    });
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
      // Simulate AI generation with realistic delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      const blocks: StepBlock[] = [];
      let order = 0;

      // Add information block if requested
      if (config.includeInformation) {
        blocks.push({
          id: `block_${Date.now()}_${order}`,
          type: 'information',
          order: order++,
          config: {
            content: `Welcome to this training on ${config.objective}. ${documentContent ? 'This training is based on the uploaded document and will test your understanding of the key concepts.' : 'This training will help you understand the fundamental concepts and apply them in practical scenarios.'}`
          }
        });
      }

      // Generate questions based on config
      for (let i = 0; i < config.questionCount; i++) {
        const questionType = config.questionTypes[i % config.questionTypes.length];
        
        let questionText = '';
        let options: string[] = [];
        let correctOption = 0;
        let hint = '';
        let idealAnswer = '';

        if (config.difficulty === 'easy') {
          questionText = `What is the basic concept ${i + 1} related to ${config.objective}?`;
          if (questionType === 'multiple_choice') {
            options = [
              'The correct fundamental principle',
              'An incorrect alternative',
              'Another wrong option',
              'Not the right answer'
            ];
            hint = 'Think about the most basic principle covered in the material.';
          } else {
            idealAnswer = 'The basic principle or concept';
            hint = 'Provide a simple, direct answer based on the fundamentals.';
          }
        } else if (config.difficulty === 'medium') {
          questionText = `How would you apply the principles of ${config.objective} in scenario ${i + 1}?`;
          if (questionType === 'multiple_choice') {
            options = [
              'Apply the standard procedure correctly',
              'Use an outdated method',
              'Ignore safety protocols',
              'Skip important steps'
            ];
            hint = 'Consider the proper application of the principles you learned.';
          } else {
            idealAnswer = 'A detailed explanation of the proper application';
            hint = 'Explain how you would systematically apply the principles.';
          }
        } else {
          questionText = `Analyze the complex situation ${i + 1} in ${config.objective} and evaluate the best course of action.`;
          if (questionType === 'multiple_choice') {
            options = [
              'Comprehensive analysis with risk assessment',
              'Quick decision without analysis',
              'Partial evaluation missing key factors',
              'Delegation without oversight'
            ];
            hint = 'Think critically about all factors and potential consequences.';
          } else {
            idealAnswer = 'A comprehensive analysis considering multiple factors';
            hint = 'Provide a thorough analysis considering all relevant factors.';
          }
        }

        if (documentContent && i < 2) {
          const snippet = documentContent.substring(0, 200) + '...';
          hint += ` Reference: "${snippet}" (from uploaded document)`;
        }

        blocks.push({
          id: `block_${Date.now()}_${order}`,
          type: 'question',
          order: order++,
          config: {
            question_text: questionText,
            question_type: questionType as any,
            options: questionType === 'multiple_choice' ? options : undefined,
            correct_option: questionType === 'multiple_choice' ? correctOption : undefined,
            ideal_answer: questionType !== 'multiple_choice' ? idealAnswer : undefined,
            hint,
            points: config.difficulty === 'easy' ? 5 : config.difficulty === 'medium' ? 10 : 15,
            mandatory: true
          }
        });
      }

      // Add goto block if requested
      if (config.includeGoto) {
        blocks.push({
          id: `block_${Date.now()}_${order}`,
          type: 'goto',
          order: order++,
          config: {
            instructions: `Please proceed to the designated area to complete the practical component of this ${config.objective} training. Follow all safety protocols as outlined in the training materials.`
          }
        });
      }

      setGeneratedFlow(blocks);
      setShowPreview(true);
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
      title: "Flow Applied",
      description: "AI-generated training flow has been applied to your canvas."
    });
  };

  const resetForm = () => {
    setConfig({
      objective: '',
      questionCount: 5,
      difficulty: 'medium',
      questionTypes: ['multiple_choice'],
      includeInformation: true,
      includeGoto: false
    });
    setUploadedDocument(null);
    setDocumentContent('');
    setGeneratedFlow(null);
    setShowPreview(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-4">
          <Wand2 className="w-4 h-4 mr-2" />
          AI Flow Generator
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>AI Training Flow Generator</DialogTitle>
        </DialogHeader>

        {!showPreview ? (
          <div className="space-y-6">
            {/* Document Upload Section */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Document Upload (Optional)
              </h4>
              <DocumentUploader onDocumentProcessed={handleDocumentUpload} />
              {uploadedDocument && (
                <div className="mt-2 text-sm text-green-600">
                  ✓ {uploadedDocument.name} uploaded and processed
                </div>
              )}
            </div>

            {/* Configuration Section */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="objective">Training Objective *</Label>
                  <Textarea
                    id="objective"
                    value={config.objective}
                    onChange={(e) => setConfig(prev => ({ ...prev, objective: e.target.value }))}
                    placeholder="Describe the main learning objective for this training..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="questionCount">Number of Questions</Label>
                    <Input
                      id="questionCount"
                      type="number"
                      min="1"
                      max="20"
                      value={config.questionCount}
                      onChange={(e) => setConfig(prev => ({ ...prev, questionCount: parseInt(e.target.value) || 5 }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select value={config.difficulty} onValueChange={(value: any) => setConfig(prev => ({ ...prev, difficulty: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Question Types</Label>
                  <div className="space-y-2 mt-2">
                    {['multiple_choice', 'text_input', 'numerical_input', 'voice_input'].map((type) => (
                      <label key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={config.questionTypes.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setConfig(prev => ({ ...prev, questionTypes: [...prev.questionTypes, type] }));
                            } else {
                              setConfig(prev => ({ ...prev, questionTypes: prev.questionTypes.filter(t => t !== type) }));
                            }
                          }}
                        />
                        <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Include Block Types</Label>
                  <div className="space-y-2 mt-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={config.includeInformation}
                        onChange={(e) => setConfig(prev => ({ ...prev, includeInformation: e.target.checked }))}
                      />
                      <span className="text-sm">Information Blocks</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={config.includeGoto}
                        onChange={(e) => setConfig(prev => ({ ...prev, includeGoto: e.target.checked }))}
                      />
                      <span className="text-sm">Go-To Blocks</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button 
                onClick={generateFlow}
                disabled={isGenerating || !config.objective.trim() || config.questionTypes.length === 0}
              >
                {isGenerating ? 'Generating...' : 'Generate Training Flow'}
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
