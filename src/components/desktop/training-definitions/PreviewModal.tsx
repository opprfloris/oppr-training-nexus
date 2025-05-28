
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StepBlock, InformationBlockConfig, GotoBlockConfig, QuestionBlockConfig } from '@/types/training-definitions';
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  steps: StepBlock[];
  title: string;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  steps,
  title
}) => {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);

  const currentStep = steps[currentStepIndex];
  const canGoBack = currentStepIndex > 0;
  const canGoForward = currentStepIndex < steps.length - 1;

  const handleNext = () => {
    if (canGoForward) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (canGoBack) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleClose = () => {
    setCurrentStepIndex(0);
    onClose();
  };

  const renderInformationBlock = (config: InformationBlockConfig) => (
    <div className="space-y-4">
      {config.image_url && (
        <img 
          src={config.image_url} 
          alt="Information visual" 
          className="w-full max-h-64 object-cover rounded"
        />
      )}
      <div className="prose max-w-none">
        <p className="text-gray-700 whitespace-pre-wrap">{config.content}</p>
      </div>
    </div>
  );

  const renderGotoBlock = (config: GotoBlockConfig) => (
    <div className="space-y-4">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Navigation Instructions</h3>
        <p className="text-blue-700 whitespace-pre-wrap">{config.instructions}</p>
      </div>
    </div>
  );

  const renderQuestionBlock = (config: QuestionBlockConfig) => (
    <div className="space-y-4">
      {config.image_url && (
        <img 
          src={config.image_url} 
          alt="Question visual" 
          className="w-full max-h-64 object-cover rounded"
        />
      )}
      
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Question</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{config.question_text}</p>
      </div>

      <div className="space-y-2">
        {config.question_type === 'multiple_choice' && config.options ? (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Select an answer:</p>
            {config.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                <input type="radio" name="preview-answer" className="w-4 h-4" />
                <span>{option}</span>
                {config.correct_option === index && (
                  <span className="text-green-600 text-sm">(Correct)</span>
                )}
              </label>
            ))}
          </div>
        ) : config.question_type === 'text_input' ? (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Your answer:</p>
            <textarea 
              className="w-full p-2 border rounded" 
              rows={3}
              placeholder="Type your answer here..."
              disabled
            />
            {config.ideal_answer && (
              <p className="text-sm text-gray-600 mt-1">
                <strong>Ideal answer:</strong> {config.ideal_answer}
              </p>
            )}
          </div>
        ) : config.question_type === 'numerical_input' ? (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Enter a number:</p>
            <input 
              type="number" 
              className="w-full p-2 border rounded" 
              placeholder="Enter number..."
              disabled
            />
            {config.ideal_answer && (
              <p className="text-sm text-gray-600 mt-1">
                <strong>Ideal answer:</strong> {config.ideal_answer}
              </p>
            )}
          </div>
        ) : (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Voice input expected</p>
            <div className="p-4 border-2 border-dashed border-gray-300 rounded text-center">
              <p className="text-gray-500">🎤 Voice recording would start here</p>
            </div>
          </div>
        )}

        {config.hint && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
            <p className="text-sm text-yellow-700">
              <strong>Hint:</strong> {config.hint}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Points: {config.points}</span>
          <span>{config.mandatory ? 'Required' : 'Optional'}</span>
        </div>
      </div>
    </div>
  );

  if (steps.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Preview: {title}</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-gray-500">No steps to preview. Add some blocks to see the preview.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preview: {title}</DialogTitle>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium capitalize bg-gray-100 px-2 py-1 rounded">
              {currentStep?.type.replace('_', ' ')} Block
            </span>
          </div>
        </DialogHeader>

        <div className="py-4">
          {currentStep?.type === 'information' && renderInformationBlock(currentStep.config as InformationBlockConfig)}
          {currentStep?.type === 'goto' && renderGotoBlock(currentStep.config as GotoBlockConfig)}
          {currentStep?.type === 'question' && renderQuestionBlock(currentStep.config as QuestionBlockConfig)}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={!canGoBack}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex space-x-1">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStepIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentStepIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            onClick={handleNext}
            disabled={!canGoForward}
          >
            Next
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;
