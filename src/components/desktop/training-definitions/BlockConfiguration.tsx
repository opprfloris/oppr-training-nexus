
import React from 'react';
import { StepBlock, InformationBlockConfig, GotoBlockConfig, QuestionBlockConfig } from '@/types/training-definitions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { SparklesIcon, EyeIcon, PhotoIcon } from "@heroicons/react/24/outline";

interface BlockConfigurationProps {
  block: StepBlock | undefined;
  onUpdateConfig: (blockId: string, config: any) => void;
}

const BlockConfiguration: React.FC<BlockConfigurationProps> = ({ 
  block, 
  onUpdateConfig 
}) => {
  if (!block) {
    return (
      <div className="oppr-card p-6 h-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">⚙️</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Block Selected</h3>
          <p className="text-gray-600">Select a block from the canvas to configure it</p>
        </div>
      </div>
    );
  }

  const updateConfig = (updates: Partial<any>) => {
    onUpdateConfig(block.id, { ...block.config, ...updates });
  };

  const handleAIAssistant = () => {
    // TODO: Implement AI assistant
    console.log('AI Assistant clicked for block:', block.id);
  };

  const handlePreviewBlock = () => {
    // TODO: Implement block preview
    console.log('Preview block:', block.id);
  };

  const handleImageUpload = () => {
    // TODO: Implement image upload
    console.log('Image upload for block:', block.id);
  };

  const renderInformationConfig = (config: InformationBlockConfig) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={config.content || ''}
          onChange={(e) => updateConfig({ content: e.target.value })}
          placeholder="Enter information content..."
          rows={6}
        />
      </div>
      
      <div>
        <Label>Image</Label>
        <Button
          variant="outline"
          onClick={handleImageUpload}
          className="w-full mt-2"
        >
          <PhotoIcon className="w-4 h-4 mr-2" />
          Upload Image
        </Button>
        {config.image_url && (
          <div className="mt-2">
            <img 
              src={config.image_url} 
              alt="Block content" 
              className="w-full h-32 object-cover rounded border"
            />
          </div>
        )}
      </div>

      <Button
        variant="outline"
        onClick={handlePreviewBlock}
        className="w-full"
      >
        <EyeIcon className="w-4 h-4 mr-2" />
        Preview Block
      </Button>
    </div>
  );

  const renderGotoConfig = (config: GotoBlockConfig) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="instructions">Instructions</Label>
        <Textarea
          id="instructions"
          value={config.instructions || ''}
          onChange={(e) => updateConfig({ instructions: e.target.value })}
          placeholder="Enter navigation instructions..."
          rows={4}
        />
      </div>

      <Button
        variant="outline"
        onClick={handlePreviewBlock}
        className="w-full"
      >
        <EyeIcon className="w-4 h-4 mr-2" />
        Preview Block
      </Button>
    </div>
  );

  const renderQuestionConfig = (config: QuestionBlockConfig) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="question_text">Question Text</Label>
        <Textarea
          id="question_text"
          value={config.question_text || ''}
          onChange={(e) => updateConfig({ question_text: e.target.value })}
          placeholder="Enter your question..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="question_type">Question Type</Label>
        <Select
          value={config.question_type}
          onValueChange={(value) => updateConfig({ question_type: value })}
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

      {config.question_type === 'multiple_choice' && (
        <div>
          <Label>Answer Options</Label>
          <div className="space-y-2 mt-2">
            {(config.options || ['', '']).map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...(config.options || [])];
                    newOptions[index] = e.target.value;
                    updateConfig({ options: newOptions });
                  }}
                  placeholder={`Option ${index + 1}`}
                />
                <input
                  type="radio"
                  name={`correct-${block.id}`}
                  checked={config.correct_option === index}
                  onChange={() => updateConfig({ correct_option: index })}
                  className="w-4 h-4"
                />
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newOptions = [...(config.options || []), ''];
                updateConfig({ options: newOptions });
              }}
            >
              Add Option
            </Button>
          </div>
        </div>
      )}

      {config.question_type !== 'multiple_choice' && (
        <div>
          <Label htmlFor="ideal_answer">Ideal Answer</Label>
          <Input
            id="ideal_answer"
            value={config.ideal_answer || ''}
            onChange={(e) => updateConfig({ ideal_answer: e.target.value })}
            placeholder="Enter the ideal answer..."
          />
        </div>
      )}

      <div>
        <Label htmlFor="hint">Hint (Optional)</Label>
        <Input
          id="hint"
          value={config.hint || ''}
          onChange={(e) => updateConfig({ hint: e.target.value })}
          placeholder="Provide a helpful hint..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="points">Points</Label>
          <Input
            id="points"
            type="number"
            value={config.points || 1}
            onChange={(e) => updateConfig({ points: parseInt(e.target.value) || 1 })}
            min="0"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="mandatory"
            checked={config.mandatory !== false}
            onCheckedChange={(checked) => updateConfig({ mandatory: checked })}
          />
          <Label htmlFor="mandatory">Mandatory</Label>
        </div>
      </div>

      <div>
        <Label>Image</Label>
        <Button
          variant="outline"
          onClick={handleImageUpload}
          className="w-full mt-2"
        >
          <PhotoIcon className="w-4 h-4 mr-2" />
          Upload Image
        </Button>
      </div>

      <Button
        variant="outline"
        onClick={handleAIAssistant}
        className="w-full"
      >
        <SparklesIcon className="w-4 h-4 mr-2" />
        AI Magic Wand
      </Button>

      <Button
        variant="outline"
        onClick={handlePreviewBlock}
        className="w-full"
      >
        <EyeIcon className="w-4 h-4 mr-2" />
        Preview Block
      </Button>
    </div>
  );

  return (
    <div className="oppr-card p-6 h-full overflow-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Block Configuration
      </h3>
      
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <div className="text-sm font-medium text-gray-700 capitalize">
          {block.type.replace('_', ' ')} Block
        </div>
      </div>

      {block.type === 'information' && renderInformationConfig(block.config as InformationBlockConfig)}
      {block.type === 'goto' && renderGotoConfig(block.config as GotoBlockConfig)}
      {block.type === 'question' && renderQuestionConfig(block.config as QuestionBlockConfig)}
    </div>
  );
};

export default BlockConfiguration;
