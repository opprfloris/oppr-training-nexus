
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Edit3, Check, X, Plus } from 'lucide-react';
import { StepBlock, InformationBlockConfig, GotoBlockConfig, QuestionBlockConfig } from '@/types/training-definitions';

interface AIFlowPreviewProps {
  blocks: StepBlock[];
  onApply: (editedBlocks: StepBlock[]) => void;
  onBack: () => void;
}

const AIFlowPreview: React.FC<AIFlowPreviewProps> = ({ blocks, onApply, onBack }) => {
  const [editedBlocks, setEditedBlocks] = useState<StepBlock[]>(blocks);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  const updateBlock = (blockId: string, updates: Partial<StepBlock>) => {
    setEditedBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    ));
  };

  const updateBlockConfig = (blockId: string, configUpdates: any) => {
    setEditedBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, config: { ...block.config, ...configUpdates } } : block
    ));
  };

  const addOption = (blockId: string) => {
    const block = editedBlocks.find(b => b.id === blockId);
    if (block && block.type === 'question') {
      const config = block.config as QuestionBlockConfig;
      const newOptions = [...(config.options || []), ''];
      updateBlockConfig(blockId, { options: newOptions });
    }
  };

  const removeOption = (blockId: string, optionIndex: number) => {
    const block = editedBlocks.find(b => b.id === blockId);
    if (block && block.type === 'question') {
      const config = block.config as QuestionBlockConfig;
      const newOptions = [...(config.options || [])];
      newOptions.splice(optionIndex, 1);
      updateBlockConfig(blockId, { options: newOptions });
    }
  };

  const updateOption = (blockId: string, optionIndex: number, value: string) => {
    const block = editedBlocks.find(b => b.id === blockId);
    if (block && block.type === 'question') {
      const config = block.config as QuestionBlockConfig;
      const newOptions = [...(config.options || [])];
      newOptions[optionIndex] = value;
      updateBlockConfig(blockId, { options: newOptions });
    }
  };

  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'information':
        return '📄';
      case 'goto':
        return '📍';
      case 'question':
        return '❓';
      default:
        return '📋';
    }
  };

  const renderBlockContent = (block: StepBlock) => {
    const isEditing = editingBlockId === block.id;

    if (block.type === 'information') {
      const config = block.config as InformationBlockConfig;
      return (
        <div className="space-y-3">
          <div>
            <Label>Content</Label>
            {isEditing ? (
              <Textarea
                value={config.content}
                onChange={(e) => updateBlockConfig(block.id, { content: e.target.value })}
                rows={4}
                className="mt-1"
              />
            ) : (
              <p className="text-sm text-gray-700 mt-1 p-3 bg-gray-50 rounded">{config.content}</p>
            )}
          </div>
        </div>
      );
    }

    if (block.type === 'goto') {
      const config = block.config as GotoBlockConfig;
      return (
        <div className="space-y-3">
          <div>
            <Label>Instructions</Label>
            {isEditing ? (
              <Textarea
                value={config.instructions}
                onChange={(e) => updateBlockConfig(block.id, { instructions: e.target.value })}
                rows={3}
                className="mt-1"
              />
            ) : (
              <p className="text-sm text-gray-700 mt-1 p-3 bg-gray-50 rounded">{config.instructions}</p>
            )}
          </div>
        </div>
      );
    }

    if (block.type === 'question') {
      const config = block.config as QuestionBlockConfig;
      return (
        <div className="space-y-4">
          <div>
            <Label>Question Text</Label>
            {isEditing ? (
              <Textarea
                value={config.question_text}
                onChange={(e) => updateBlockConfig(block.id, { question_text: e.target.value })}
                rows={3}
                className="mt-1"
              />
            ) : (
              <p className="text-sm text-gray-700 mt-1 p-3 bg-gray-50 rounded">{config.question_text}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Question Type</Label>
              {isEditing ? (
                <Select
                  value={config.question_type}
                  onValueChange={(value: any) => updateBlockConfig(block.id, { question_type: value })}
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
              ) : (
                <p className="text-sm text-gray-700 mt-1 p-2 bg-gray-50 rounded capitalize">
                  {config.question_type.replace('_', ' ')}
                </p>
              )}
            </div>

            <div>
              <Label>Points</Label>
              {isEditing ? (
                <Input
                  type="number"
                  min="1"
                  value={config.points}
                  onChange={(e) => updateBlockConfig(block.id, { points: parseInt(e.target.value) || 1 })}
                />
              ) : (
                <p className="text-sm text-gray-700 mt-1 p-2 bg-gray-50 rounded">{config.points}</p>
              )}
            </div>
          </div>

          {config.question_type === 'multiple_choice' && (
            <div>
              <Label>Answer Options</Label>
              <div className="space-y-2 mt-1">
                {(config.options || []).map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {isEditing ? (
                      <>
                        <Input
                          value={option}
                          onChange={(e) => updateOption(block.id, index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                        <input
                          type="radio"
                          name={`correct_${block.id}`}
                          checked={config.correct_option === index}
                          onChange={() => updateBlockConfig(block.id, { correct_option: index })}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(block.id, index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <div className={`flex-1 p-2 rounded text-sm ${
                        config.correct_option === index ? 'bg-green-100 border border-green-300' : 'bg-gray-50'
                      }`}>
                        {option} {config.correct_option === index && '✓ (Correct)'}
                      </div>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addOption(block.id)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Option
                  </Button>
                )}
              </div>
            </div>
          )}

          {['text_input', 'numerical_input'].includes(config.question_type) && (
            <div>
              <Label>Ideal Answer</Label>
              {isEditing ? (
                <Input
                  value={config.ideal_answer || ''}
                  onChange={(e) => updateBlockConfig(block.id, { ideal_answer: e.target.value })}
                  placeholder="Enter the ideal answer..."
                />
              ) : (
                <p className="text-sm text-gray-700 mt-1 p-2 bg-gray-50 rounded">
                  {config.ideal_answer || 'Not specified'}
                </p>
              )}
            </div>
          )}

          <div>
            <Label>Hint</Label>
            {isEditing ? (
              <Textarea
                value={config.hint || ''}
                onChange={(e) => updateBlockConfig(block.id, { hint: e.target.value })}
                rows={2}
              />
            ) : (
              <p className="text-sm text-gray-700 mt-1 p-2 bg-gray-50 rounded">
                {config.hint || 'No hint provided'}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`mandatory_${block.id}`}
              checked={config.mandatory}
              onChange={(e) => updateBlockConfig(block.id, { mandatory: e.target.checked })}
              disabled={!isEditing}
            />
            <Label htmlFor={`mandatory_${block.id}`}>Mandatory Question</Label>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Configuration
        </Button>
        <h3 className="text-lg font-semibold">AI-Generated Training Flow Preview</h3>
        <Button onClick={() => onApply(editedBlocks)}>
          Apply Flow to Canvas
        </Button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {editedBlocks.map((block, index) => (
          <div key={block.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getBlockIcon(block.type)}</span>
                <div>
                  <h4 className="font-medium">Step {index + 1}</h4>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
                    {block.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingBlockId(editingBlockId === block.id ? null : block.id)}
              >
                {editingBlockId === block.id ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Edit3 className="w-4 h-4" />
                )}
              </Button>
            </div>
            {renderBlockContent(block)}
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <div className="text-sm text-gray-600">
          Generated {editedBlocks.length} blocks • Click edit icons to modify content
        </div>
        <Button onClick={() => onApply(editedBlocks)} size="lg">
          Apply Flow to Canvas
        </Button>
      </div>
    </div>
  );
};

export default AIFlowPreview;
