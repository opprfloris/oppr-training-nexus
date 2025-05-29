
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Brain } from 'lucide-react';
import FlowCanvasAIAssistant from './FlowCanvasAIAssistant';
import { StepBlock } from '@/types/training-definitions';

interface AITrainingFlowModalProps {
  onApplyFlow: (blocks: StepBlock[]) => void;
  trigger?: React.ReactNode;
}

const AITrainingFlowModal: React.FC<AITrainingFlowModalProps> = ({ onApplyFlow, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleApplyFlow = (blocks: StepBlock[]) => {
    onApplyFlow(blocks);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
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
