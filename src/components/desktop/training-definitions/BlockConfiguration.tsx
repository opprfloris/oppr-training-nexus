
import React, { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { StepBlock, InformationBlockConfig, GotoBlockConfig, QuestionBlockConfig } from '@/types/training-definitions';
import ImageUploadComponent from './ImageUploadComponent';
import MagicWandButton from './MagicWandButton';

interface BlockConfigurationProps {
  block: StepBlock | null;
  onUpdateConfig: (blockId: string, config: any) => void;
}

const BlockConfiguration: React.FC<BlockConfigurationProps> = ({ block, onUpdateConfig }) => {
  const updateConfig = useCallback((newConfig: Partial<InformationBlockConfig | GotoBlockConfig | QuestionBlockConfig>) => {
    if (!block) return;
    onUpdateConfig(block.id, { ...block.config, ...newConfig });
  }, [block, onUpdateConfig]);

  if (!block) {
    return (
      <div className="oppr-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Block Configuration</h3>
        <p className="text-gray-500">Select a block to configure its settings.</p>
      </div>
    );
  }

  const renderInformationConfig = () => (
    <div className="space-y-4">
      <div className="relative">
        <Label htmlFor="content">Content</Label>
        <MagicWandButton 
          blockType="information" 
          onUseSuggestion={(suggestion) => onUpdateConfig(block.id, suggestion)}
        />
        <Textarea
          id="content"
          value={(block.config as InformationBlockConfig).content}
          onChange={(e) => updateConfig({ content: e.target.value })}
          placeholder="Enter the information content..."
          rows={6}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label>Image (Optional)</Label>
        <ImageUploadComponent
          value={(block.config as InformationBlockConfig).image_url}
          onChange={(url) => updateConfig({ image_url: url })}
        />
      </div>
    </div>
  );

  const renderGotoConfig = () => (
    <div className="space-y-4">
      <div className="relative">
        <Label htmlFor="instructions">Instructions</Label>
        <MagicWandButton 
          blockType="goto" 
          onUseSuggestion={(suggestion) => onUpdateConfig(block.id, suggestion)}
        />
        <Textarea
          id="instructions"
          value={(block.config as GotoBlockConfig).instructions}
          onChange={(e) => updateConfig({ instructions: e.target.value })}
          placeholder="Enter navigation instructions..."
          rows={4}
          className="mt-1"
        />
      </div>
    </div>
  );

  const renderQuestionConfig = () => (
    <div className="space-y-4">
      {/* Question Text */}
      <div className="relative">
        <Label htmlFor="question_text">Question</Label>
        <MagicWandButton 
          blockType="question" 
          onUseSuggestion={(suggestion) => onUpdateConfig(block.id, suggestion)}
        />
        <Textarea
          id="question_text"
          value={(block.config as QuestionBlockConfig).question_text}
          onChange={(e) => updateConfig({ question_text: e.target.value })}
          placeholder="Enter your question..."
          rows={3}
          className="mt-1"
        />
      </div>

      {/* Image Upload */}
      <div>
        <Label>Image (Optional)</Label>
        <ImageUploadComponent
          value={(block.config as QuestionBlockConfig).image_url}
          onChange={(url) => updateConfig({ image_url: url })}
        />
      </div>

      {/* Question Type */}
      <div>
        <Label htmlFor="question_type">Question Type</Label>
        <Select
          value={(block.config as QuestionBlockConfig).question_type}
          onValueChange={(value: any) => updateConfig({ question_type: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text_input">Text Input</SelectItem>
            <SelectItem value="numerical_input">Numerical Input</SelectItem>
            <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
            <SelectItem value="voice_input">Voice Input</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Multiple Choice Options */}
      {(block.config as QuestionBlockConfig).question_type === 'multiple_choice' && (
        <div className="space-y-2">
          <Label>Answer Options</Label>
          {((block.config as QuestionBlockConfig).options || []).map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={option}
                onChange={(e) => {
                  const newOptions = [...((block.config as QuestionBlockConfig).options || [])];
                  newOptions[index] = e.target.value;
                  updateConfig({ options: newOptions });
                }}
                placeholder={`Option ${index + 1}`}
              />
              <input
                type="radio"
                name="correct_option"
                checked={(block.config as QuestionBlockConfig).correct_option === index}
                onChange={() => updateConfig({ correct_option: index })}
                title="Mark as correct answer"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newOptions = [...((block.config as QuestionBlockConfig).options || [])];
                  newOptions.splice(index, 1);
                  updateConfig({ options: newOptions });
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const currentOptions = (block.config as QuestionBlockConfig).options || [];
              updateConfig({ options: [...currentOptions, ''] });
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Option
          </Button>
        </div>
      )}

      {/* Ideal Answer for text/numerical inputs */}
      {['text_input', 'numerical_input'].includes((block.config as QuestionBlockConfig).question_type) && (
        <div>
          <Label htmlFor="ideal_answer">Ideal Answer (Optional)</Label>
          <Input
            id="ideal_answer"
            value={(block.config as QuestionBlockConfig).ideal_answer || ''}
            onChange={(e) => updateConfig({ ideal_answer: e.target.value })}
            placeholder="Enter the ideal answer..."
          />
        </div>
      )}

      {/* Hint */}
      <div>
        <Label htmlFor="hint">Hint (Optional)</Label>
        <Input
          id="hint"
          value={(block.config as QuestionBlockConfig).hint || ''}
          onChange={(e) => updateConfig({ hint: e.target.value })}
          placeholder="Provide a helpful hint..."
        />
      </div>

      {/* Points and Mandatory */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="points">Points</Label>
          <Input
            id="points"
            type="number"
            min="1"
            value={(block.config as QuestionBlockConfig).points}
            onChange={(e) => updateConfig({ points: parseInt(e.target.value) || 1 })}
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="mandatory"
            checked={(block.config as QuestionBlockConfig).mandatory}
            onChange={(e) => updateConfig({ mandatory: e.target.checked })}
            className="w-4 h-4"
          />
          <Label htmlFor="mandatory">Mandatory</Label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="oppr-card p-6 h-full overflow-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Block Configuration</h3>
      {block.type === 'information' && renderInformationConfig()}
      {block.type === 'goto' && renderGotoConfig()}
      {block.type === 'question' && renderQuestionConfig()}
    </div>
  );
};

export default BlockConfiguration;
