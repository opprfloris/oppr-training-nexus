
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Brain, MessageSquare, Lightbulb, FileText } from 'lucide-react';

interface AICustomizationStepProps {
  config: any;
  onUpdateConfig: (updates: any) => void;
}

const promptTemplates = {
  standard: '',
  safety_focused: 'Emphasize safety protocols and risk management throughout the training. Include safety checks and warnings where appropriate.',
  hands_on: 'Focus on practical, hands-on activities and real-world scenarios. Include step-by-step procedures and troubleshooting guides.',
  compliance: 'Ensure all content aligns with industry regulations and compliance requirements. Include references to relevant standards.',
  assessment_heavy: 'Include more assessment questions and knowledge checks. Focus on validating understanding at each step.'
};

const AICustomizationStep: React.FC<AICustomizationStepProps> = ({ config, onUpdateConfig }) => {
  const applyTemplate = (template: string) => {
    onUpdateConfig({ 
      promptTemplate: template,
      customPrompt: promptTemplates[template as keyof typeof promptTemplates] 
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Brain className="w-12 h-12 text-purple-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Customize AI Generation</h3>
        <p className="text-gray-600">
          Fine-tune how the AI creates your training content with custom instructions and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tone and Style */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <MessageSquare className="w-4 h-4 mr-2" />
              Tone & Style
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tone">Communication Tone</Label>
              <Select value={config.tone} onValueChange={(value) => onUpdateConfig({ tone: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal & Professional</SelectItem>
                  <SelectItem value="conversational">Conversational & Friendly</SelectItem>
                  <SelectItem value="technical">Technical & Precise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="include-examples">Include practical examples</Label>
              <Switch
                id="include-examples"
                checked={config.includeExamples}
                onCheckedChange={(checked) => onUpdateConfig({ includeExamples: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <FileText className="w-4 h-4 mr-2" />
              Quick Templates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => applyTemplate('safety_focused')}
            >
              Safety-Focused Training
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => applyTemplate('hands_on')}
            >
              Hands-On Practical
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => applyTemplate('compliance')}
            >
              Compliance & Standards
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => applyTemplate('assessment_heavy')}
            >
              Assessment-Heavy
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Custom Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <Lightbulb className="w-4 h-4 mr-2" />
            Custom Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="custom-prompt">Additional Instructions for AI Generation</Label>
            <Textarea
              id="custom-prompt"
              placeholder="Add specific instructions for how you want the training content generated. For example: 'Include more visual descriptions', 'Focus on troubleshooting scenarios', 'Add industry-specific terminology', etc."
              value={config.customPrompt}
              onChange={(e) => onUpdateConfig({ customPrompt: e.target.value })}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              These instructions will be included in the AI prompt to customize the generated content.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preview Settings */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-sm text-blue-800">
            <h4 className="font-medium mb-2">Generation Preview:</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• <strong>Difficulty:</strong> {config.difficulty}</li>
              <li>• <strong>Tone:</strong> {config.tone}</li>
              <li>• <strong>Steps:</strong> {config.stepCount} blocks</li>
              <li>• <strong>Topics:</strong> {config.selectedTopics.join(', ') || 'None selected'}</li>
              <li>• <strong>Examples:</strong> {config.includeExamples ? 'Included' : 'Minimal'}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AICustomizationStep;
