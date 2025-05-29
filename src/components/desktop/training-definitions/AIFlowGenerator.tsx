
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { StepBlock } from '@/types/training-definitions';

interface AIFlowGeneratorProps {
  onGenerateFlow: () => void;
  isProcessing: boolean;
  documentContent: string;
}

const AIFlowGenerator: React.FC<AIFlowGeneratorProps> = ({
  onGenerateFlow,
  isProcessing,
  documentContent
}) => {
  return (
    <Button
      onClick={onGenerateFlow}
      disabled={isProcessing || !documentContent.trim()}
      className="w-full"
    >
      {isProcessing ? (
        <>
          <Sparkles className="w-4 h-4 mr-2 animate-spin" />
          Generating Flow...
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Training Flow
        </>
      )}
    </Button>
  );
};

export default AIFlowGenerator;
