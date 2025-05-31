
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Clock, Target, BookOpen, Plus, X } from 'lucide-react';

interface TrainingConfigurationStepProps {
  config: any;
  onUpdateConfig: (updates: any) => void;
}

const TrainingConfigurationStep: React.FC<TrainingConfigurationStepProps> = ({ config, onUpdateConfig }) => {
  const [newTopic, setNewTopic] = useState('');

  // Auto-extract topics from document content
  useEffect(() => {
    if (config.documentContent && config.selectedTopics.length === 0) {
      const extractedTopics = extractTopicsFromContent(config.documentContent);
      if (extractedTopics.length > 0) {
        onUpdateConfig({ selectedTopics: extractedTopics.slice(0, 5) });
      }
    }
  }, [config.documentContent, config.selectedTopics.length, onUpdateConfig]);

  // Calculate estimated duration based on content and steps
  useEffect(() => {
    const baseMinutes = Math.ceil(config.stepCount * 1.5); // 1.5 minutes per step
    const contentFactor = Math.min(config.documentContent.length / 5000, 2); // Max 2x multiplier
    const estimatedDuration = Math.ceil(baseMinutes * (1 + contentFactor * 0.5));
    
    if (estimatedDuration !== config.estimatedDuration) {
      onUpdateConfig({ estimatedDuration });
    }
  }, [config.stepCount, config.documentContent.length, config.estimatedDuration, onUpdateConfig]);

  const extractTopicsFromContent = (content: string): string[] => {
    // Simple topic extraction logic
    const commonTrainingTopics = [
      'Safety Procedures', 'Equipment Operation', 'Quality Control', 
      'Emergency Protocols', 'Maintenance', 'Documentation', 
      'Compliance', 'Best Practices', 'Troubleshooting', 'Standards'
    ];
    
    return commonTrainingTopics.filter(topic => 
      content.toLowerCase().includes(topic.toLowerCase()) ||
      content.toLowerCase().includes(topic.toLowerCase().replace(' ', ''))
    );
  };

  const addTopic = () => {
    if (newTopic.trim() && !config.selectedTopics.includes(newTopic.trim())) {
      onUpdateConfig({ 
        selectedTopics: [...config.selectedTopics, newTopic.trim()] 
      });
      setNewTopic('');
    }
  };

  const removeTopic = (topicToRemove: string) => {
    onUpdateConfig({ 
      selectedTopics: config.selectedTopics.filter((topic: string) => topic !== topicToRemove) 
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Settings className="w-12 h-12 text-purple-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Configure Your Training</h3>
        <p className="text-gray-600">
          Customize the training parameters to match your learning objectives.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title & Description Generation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <BookOpen className="w-4 h-4 mr-2" />
              Content Generation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="generate-title">Generate training title</Label>
              <Switch
                id="generate-title"
                checked={config.generateTitle}
                onCheckedChange={(checked) => onUpdateConfig({ generateTitle: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="generate-description">Generate description</Label>
              <Switch
                id="generate-description"
                checked={config.generateDescription}
                onCheckedChange={(checked) => onUpdateConfig({ generateDescription: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Training Parameters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <Target className="w-4 h-4 mr-2" />
              Training Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select value={config.difficulty} onValueChange={(value) => onUpdateConfig({ difficulty: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="step-count">Number of Steps: {config.stepCount}</Label>
              <Slider
                id="step-count"
                min={4}
                max={20}
                step={1}
                value={[config.stepCount]}
                onValueChange={([value]) => onUpdateConfig({ stepCount: value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="content-mix">
                Content Mix: {config.contentMix}% Information / {100 - config.contentMix}% Questions
              </Label>
              <Slider
                id="content-mix"
                min={30}
                max={80}
                step={5}
                value={[config.contentMix]}
                onValueChange={([value]) => onUpdateConfig({ contentMix: value })}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Topics Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <Target className="w-4 h-4 mr-2" />
            Training Topics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a training topic..."
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTopic()}
            />
            <Button onClick={addTopic} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {config.selectedTopics.map((topic: string, index: number) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {topic}
                <button
                  onClick={() => removeTopic(topic)}
                  className="ml-2 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>

          {config.selectedTopics.length === 0 && (
            <p className="text-sm text-gray-500">Add topics that your training should cover</p>
          )}
        </CardContent>
      </Card>

      {/* Duration Estimate */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Estimated training duration: <strong>{config.estimatedDuration} minutes</strong></span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingConfigurationStep;
