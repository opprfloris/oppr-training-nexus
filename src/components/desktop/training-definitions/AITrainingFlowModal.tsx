
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';
import FlowCanvasAIAssistant from './FlowCanvasAIAssistant';
import { StepBlock } from '@/types/training-definitions';

interface AITrainingFlowModalProps {
  onApplyFlow: (blocks: StepBlock[]) => void;
}

const AITrainingFlowModal: React.FC<AITrainingFlowModalProps> = ({ onApplyFlow }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleApplyFlow = (blocks: StepBlock[]) => {
    onApplyFlow(blocks);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start h-auto p-4 text-left bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100"
        >
          <div className="flex items-start space-x-3">
            <Brain className="w-5 h-5 mt-0.5 text-purple-600" />
            <div>
              <div className="font-medium text-gray-900">AI Training Flow Generator</div>
              <div className="text-sm text-gray-600">Create training flows with AI assistance</div>
            </div>
          </div>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-600" />
            Advanced AI Training Flow Generator
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <FlowCanvasAIAssistant onApplyFlow={handleApplyFlow} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AITrainingFlowModal;
