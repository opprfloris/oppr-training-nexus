
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { StepBlock } from '@/types/training-definitions';
import DocumentSelectionStep from './wizard/DocumentSelectionStep';
import TrainingConfigurationStep from './wizard/TrainingConfigurationStep';
import AICustomizationStep from './wizard/AICustomizationStep';
import PreviewStep from './wizard/PreviewStep';
import { useEnhancedAIGeneration } from '@/hooks/useEnhancedAIGeneration';

interface EnhancedAIFlowWizardProps {
  onApplyFlow: (blocks: StepBlock[], title?: string, description?: string) => void;
  onClose: () => void;
}

type WizardStep = 'document' | 'config' | 'customize' | 'preview';

interface WizardConfig {
  // Document
  documentContent: string;
  fileName: string;
  
  // Training Configuration
  title: string;
  description: string;
  generateTitle: boolean;
  generateDescription: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  stepCount: number;
  contentMix: number; // 0-100, percentage of information vs questions
  selectedTopics: string[];
  estimatedDuration: number;
  
  // AI Customization
  customPrompt: string;
  tone: 'formal' | 'conversational' | 'technical';
  includeExamples: boolean;
  promptTemplate: string;
}

const stepTitles = {
  document: 'Document Selection',
  config: 'Training Configuration', 
  customize: 'AI Customization',
  preview: 'Preview & Apply'
};

const EnhancedAIFlowWizard: React.FC<EnhancedAIFlowWizardProps> = ({ onApplyFlow, onClose }) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('document');
  const [config, setConfig] = useState<WizardConfig>({
    documentContent: '',
    fileName: '',
    title: '',
    description: '',
    generateTitle: true,
    generateDescription: true,
    difficulty: 'intermediate',
    stepCount: 8,
    contentMix: 60,
    selectedTopics: [],
    estimatedDuration: 15,
    customPrompt: '',
    tone: 'conversational',
    includeExamples: true,
    promptTemplate: 'standard'
  });

  const { 
    generatedFlow, 
    generatedTitle,
    generatedDescription,
    isGenerating, 
    error, 
    generateFlow 
  } = useEnhancedAIGeneration();

  const steps: WizardStep[] = ['document', 'config', 'customize', 'preview'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const updateConfig = (updates: Partial<WizardConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'document':
        return config.documentContent.trim().length > 0;
      case 'config':
        return config.selectedTopics.length > 0;
      case 'customize':
        return true;
      case 'preview':
        return generatedFlow && generatedFlow.length > 0;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (currentStep === 'customize') {
      // Generate the flow when moving to preview
      await generateFlow(config);
    }
    
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const handleApply = () => {
    if (generatedFlow) {
      const finalTitle = config.generateTitle && generatedTitle ? generatedTitle : undefined;
      const finalDescription = config.generateDescription && generatedDescription ? generatedDescription : undefined;
      onApplyFlow(generatedFlow, finalTitle, finalDescription);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'document':
        return (
          <DocumentSelectionStep
            config={config}
            onUpdateConfig={updateConfig}
          />
        );
      case 'config':
        return (
          <TrainingConfigurationStep
            config={config}
            onUpdateConfig={updateConfig}
          />
        );
      case 'customize':
        return (
          <AICustomizationStep
            config={config}
            onUpdateConfig={updateConfig}
          />
        );
      case 'preview':
        return (
          <PreviewStep
            config={config}
            generatedFlow={generatedFlow}
            generatedTitle={generatedTitle}
            generatedDescription={generatedDescription}
            isGenerating={isGenerating}
            error={error}
            onUpdateConfig={updateConfig}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with Progress */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">AI Training Flow Generator</h2>
          </div>
          <Button variant="ghost" onClick={onClose}>×</Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{stepTitles[currentStep]}</span>
            <span>Step {currentStepIndex + 1} of {steps.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {renderStepContent()}
      </div>

      {/* Footer Navigation */}
      <div className="border-t border-gray-200 p-6">
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="space-x-3">
            {currentStep === 'preview' ? (
              <Button
                onClick={handleApply}
                disabled={!generatedFlow || isGenerating}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Apply Training Flow
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed() || isGenerating}
              >
                {currentStep === 'customize' ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Flow
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAIFlowWizard;
