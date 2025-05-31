
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, AlertCircle, Eye, Edit3, FileText, HelpCircle } from 'lucide-react';
import { StepBlock } from '@/types/training-definitions';

interface PreviewStepProps {
  config: any;
  generatedFlow: StepBlock[] | null;
  generatedTitle: string | null;
  generatedDescription: string | null;
  isGenerating: boolean;
  error: string | null;
  onUpdateConfig: (updates: any) => void;
}

const PreviewStep: React.FC<PreviewStepProps> = ({
  config,
  generatedFlow,
  generatedTitle,
  generatedDescription,
  isGenerating,
  error,
  onUpdateConfig
}) => {
  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <h3 className="text-lg font-semibold text-gray-900">Generating Your Training Flow</h3>
        <p className="text-gray-600 text-center max-w-md">
          Our AI is creating {config.stepCount} training steps based on your configuration. 
          This may take a few moments...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h3 className="text-lg font-semibold text-gray-900">Generation Error</h3>
        <div className="text-center space-y-2 max-w-md">
          <p className="text-gray-600">There was an issue generating your training flow:</p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <p className="text-xs text-gray-500">
            A fallback training flow has been generated instead.
          </p>
        </div>
      </div>
    );
  }

  if (!generatedFlow || generatedFlow.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <AlertCircle className="w-12 h-12 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900">No Content Generated</h3>
        <p className="text-gray-600">No training blocks were generated. Please try again.</p>
      </div>
    );
  }

  const infoBlocks = generatedFlow.filter(block => block.type === 'information').length;
  const questionBlocks = generatedFlow.filter(block => block.type === 'question').length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Training Flow Generated Successfully</h3>
        <p className="text-gray-600">
          Review your generated training content and make any final adjustments before applying.
        </p>
      </div>

      {/* Generated Metadata */}
      {(config.generateTitle || config.generateDescription) && (generatedTitle || generatedDescription) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <Edit3 className="w-4 h-4 mr-2" />
              Generated Training Metadata
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {config.generateTitle && generatedTitle && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Generated Title
                </label>
                <Input value={generatedTitle} readOnly className="bg-gray-50" />
              </div>
            )}

            {config.generateDescription && generatedDescription && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Generated Description
                </label>
                <Textarea value={generatedDescription} readOnly className="bg-gray-50" rows={3} />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Flow Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <Eye className="w-4 h-4 mr-2" />
            Training Flow Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-purple-600">{generatedFlow.length}</div>
              <div className="text-sm text-gray-600">Total Steps</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-600">{infoBlocks}</div>
              <div className="text-sm text-gray-600">Information</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">{questionBlocks}</div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-orange-600">{config.estimatedDuration}m</div>
              <div className="text-sm text-gray-600">Est. Duration</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Block Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <FileText className="w-4 h-4 mr-2" />
            Content Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {generatedFlow.slice(0, 6).map((block, index) => (
              <div key={block.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant={block.type === 'information' ? 'secondary' : 'default'}>
                      {block.type === 'information' ? (
                        <FileText className="w-3 h-3 mr-1" />
                      ) : (
                        <HelpCircle className="w-3 h-3 mr-1" />
                      )}
                      {block.type === 'information' ? 'Info' : 'Question'}
                    </Badge>
                    <span className="text-sm text-gray-600">Step {index + 1}</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-700">
                  {block.type === 'information' ? (
                    <p className="line-clamp-3">{block.config.content || 'Information content...'}</p>
                  ) : (
                    <p className="line-clamp-2">{block.config.question_text || 'Question content...'}</p>
                  )}
                </div>
              </div>
            ))}
            
            {generatedFlow.length > 6 && (
              <div className="text-center py-2">
                <span className="text-sm text-gray-500">
                  ... and {generatedFlow.length - 6} more steps
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Summary */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <div className="text-sm text-gray-600">
            <h4 className="font-medium text-gray-900 mb-3">Configuration Summary:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>Source:</strong> {config.fileName}</p>
                <p><strong>Difficulty:</strong> {config.difficulty}</p>
                <p><strong>Tone:</strong> {config.tone}</p>
              </div>
              <div>
                <p><strong>Topics:</strong> {config.selectedTopics.slice(0, 3).join(', ')}{config.selectedTopics.length > 3 ? '...' : ''}</p>
                <p><strong>Content Mix:</strong> {config.contentMix}% Info / {100 - config.contentMix}% Questions</p>
                <p><strong>Examples:</strong> {config.includeExamples ? 'Included' : 'Minimal'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreviewStep;
