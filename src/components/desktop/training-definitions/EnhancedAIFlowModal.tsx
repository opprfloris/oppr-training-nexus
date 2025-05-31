
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Brain } from 'lucide-react';
import EnhancedAIFlowWizard from './EnhancedAIFlowWizard';
import { StepBlock } from '@/types/training-definitions';

interface EnhancedAIFlowModalProps {
  onApplyFlow: (blocks: StepBlock[], title?: string, description?: string) => void;
  trigger?: React.ReactNode;
}

const EnhancedAIFlowModal: React.FC<EnhancedAIFlowModalProps> = ({ onApplyFlow, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleApplyFlow = (blocks: StepBlock[], title?: string, description?: string) => {
    onApplyFlow(blocks, title, description);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden p-0">
        <div className="h-[90vh]">
          <EnhancedAIFlowWizard 
            onApplyFlow={handleApplyFlow}
            onClose={handleClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedAIFlowModal;
