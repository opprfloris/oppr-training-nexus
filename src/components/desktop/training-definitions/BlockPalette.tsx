
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight, HelpCircle, Brain } from 'lucide-react';
import { StepBlock } from '@/types/training-definitions';
import AITrainingFlowModal from './AITrainingFlowModal';
import EnhancedAIFlowModal from './EnhancedAIFlowModal';

interface BlockPaletteProps {
  onAddBlock: (blockType: 'information' | 'goto' | 'question') => void;
  onApplyAIFlow: (blocks: StepBlock[]) => void;
}

const BlockPalette: React.FC<BlockPaletteProps> = ({ onAddBlock, onApplyAIFlow }) => {
  const handleApplyFlow = (blocks: StepBlock[], title?: string, description?: string) => {
    onApplyAIFlow(blocks);
    // Note: Title and description would need to be handled by the parent component
    // This would require updating the interface to support metadata updates
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Add Blocks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Manual Block Creation */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Manual Blocks</h3>
          
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => onAddBlock('information')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Information Block
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => onAddBlock('question')}
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Question Block
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => onAddBlock('goto')}
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Navigation Block
          </Button>
        </div>

        <hr className="border-gray-200" />

        {/* AI Generation */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 mb-3">AI Generation</h3>
          
          <EnhancedAIFlowModal
            onApplyFlow={handleApplyFlow}
            trigger={
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Brain className="w-4 h-4 mr-2" />
                Enhanced AI Generator
              </Button>
            }
          />

          <AITrainingFlowModal
            onApplyFlow={onApplyAIFlow}
            trigger={
              <Button variant="outline" className="w-full justify-start text-xs">
                <Brain className="w-3 h-3 mr-2" />
                Simple AI Generator
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockPalette;
