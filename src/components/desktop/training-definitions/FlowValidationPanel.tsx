
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Target, 
  Clock, 
  TrendingUp,
  BarChart3,
  Lightbulb,
  Shield
} from 'lucide-react';
import { StepBlock } from '@/types/training-definitions';
import { 
  validateTrainingFlow, 
  analyzeFlowMetrics, 
  extractLearningObjectives, 
  generateOptimizationSuggestions,
  ValidationResult,
  FlowMetrics,
  LearningObjective
} from '@/utils/flowValidation';

interface FlowValidationPanelProps {
  steps: StepBlock[];
  title: string;
  isVisible: boolean;
  onToggle: () => void;
}

const FlowValidationPanel: React.FC<FlowValidationPanelProps> = ({
  steps,
  title,
  isVisible,
  onToggle
}) => {
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [metrics, setMetrics] = useState<FlowMetrics | null>(null);
  const [objectives, setObjectives] = useState<LearningObjective[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  React.useEffect(() => {
    if (isVisible) {
      const validationResult = validateTrainingFlow(steps, title);
      const flowMetrics = analyzeFlowMetrics(steps);
      const learningObjectives = extractLearningObjectives(steps);
      const optimizationSuggestions = generateOptimizationSuggestions(steps);

      setValidation(validationResult);
      setMetrics(flowMetrics);
      setObjectives(learningObjectives);
      setSuggestions(optimizationSuggestions);
    }
  }, [steps, title, isVisible]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 40) return 'Needs Improvement';
    return 'Poor';
  };

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        onClick={onToggle}
        className="fixed bottom-4 right-4 z-50 shadow-lg"
      >
        <Shield className="w-4 h-4 mr-2" />
        Validate Flow
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 max-h-[600px] z-50 shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Flow Validation
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onToggle}>×</Button>
        </div>
        
        {validation && (
          <div className="flex items-center space-x-2">
            <Progress value={validation.score} className="flex-1" />
            <Badge variant={validation.score >= 80 ? "default" : validation.score >= 60 ? "secondary" : "destructive"}>
              {validation.score}/100
            </Badge>
            <span className={`text-sm font-medium ${getScoreColor(validation.score)}`}>
              {getScoreLabel(validation.score)}
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="max-h-[500px] overflow-y-auto">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="issues" className="text-xs">Issues</TabsTrigger>
            <TabsTrigger value="metrics" className="text-xs">Metrics</TabsTrigger>
            <TabsTrigger value="objectives" className="text-xs">Objectives</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {validation && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  {validation.isValid ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-medium">
                    {validation.isValid ? 'Flow is valid' : 'Issues found'}
                  </span>
                </div>

                {metrics && (
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-blue-50 p-2 rounded">
                      <div className="flex items-center space-x-1">
                        <Target className="w-4 h-4" />
                        <span>Questions: {metrics.totalQuestions}</span>
                      </div>
                    </div>
                    <div className="bg-green-50 p-2 rounded">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>~{metrics.estimatedDuration} min</span>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-2 rounded">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>Avg: {metrics.averagePoints.toFixed(1)} pts</span>
                      </div>
                    </div>
                    <div className="bg-orange-50 p-2 rounded">
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="w-4 h-4" />
                        <span>Total: {metrics.totalPoints} pts</span>
                      </div>
                    </div>
                  </div>
                )}

                {suggestions.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <div className="flex items-start space-x-2">
                      <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-yellow-800 mb-1">Quick Wins:</p>
                        <p className="text-yellow-700">{suggestions[0]}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="issues" className="space-y-3">
            {validation && (
              <div className="space-y-3">
                {validation.errors.length > 0 && (
                  <div>
                    <h4 className="font-medium text-red-600 mb-2 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Errors ({validation.errors.length})
                    </h4>
                    {validation.errors.map((error, index) => (
                      <div key={index} className="bg-red-50 border border-red-200 rounded p-2">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    ))}
                  </div>
                )}

                {validation.warnings.length > 0 && (
                  <div>
                    <h4 className="font-medium text-yellow-600 mb-2 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Warnings ({validation.warnings.length})
                    </h4>
                    {validation.warnings.map((warning, index) => (
                      <div key={index} className="bg-yellow-50 border border-yellow-200 rounded p-2">
                        <p className="text-sm text-yellow-700">{warning}</p>
                      </div>
                    ))}
                  </div>
                )}

                {validation.suggestions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-blue-600 mb-2 flex items-center">
                      <Info className="w-4 h-4 mr-1" />
                      Suggestions ({validation.suggestions.length})
                    </h4>
                    {validation.suggestions.map((suggestion, index) => (
                      <div key={index} className="bg-blue-50 border border-blue-200 rounded p-2">
                        <p className="text-sm text-blue-700">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                )}

                {validation.errors.length === 0 && validation.warnings.length === 0 && validation.suggestions.length === 0 && (
                  <div className="text-center py-4">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No issues found!</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="metrics" className="space-y-3">
            {metrics && (
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Difficulty Distribution</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Easy</span>
                      <Badge variant="secondary">{metrics.difficultyDistribution.easy}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Medium</span>
                      <Badge variant="secondary">{metrics.difficultyDistribution.medium}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Hard</span>
                      <Badge variant="secondary">{metrics.difficultyDistribution.hard}</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Question Types</h4>
                  <div className="space-y-2">
                    {Object.entries(metrics.questionTypeDistribution).map(([type, count]) => (
                      count > 0 && (
                        <div key={type} className="flex justify-between items-center">
                          <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      )
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Structure</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Information blocks:</span>
                      <span>{metrics.informationBlocks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Navigation blocks:</span>
                      <span>{metrics.gotoBlocks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mandatory questions:</span>
                      <span>{metrics.mandatoryQuestions}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="objectives" className="space-y-3">
            {objectives.length > 0 ? (
              <div className="space-y-3">
                <h4 className="font-medium">Learning Objectives Coverage</h4>
                {objectives.map((objective, index) => (
                  <div key={index} className="border rounded p-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-sm">{objective.topic}</span>
                      <Badge 
                        variant={objective.difficulty === 'easy' ? 'secondary' : 
                                objective.difficulty === 'medium' ? 'default' : 'destructive'}
                      >
                        {objective.difficulty}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Coverage</span>
                        <span>{objective.coverage}%</span>
                      </div>
                      <Progress value={objective.coverage} className="h-2" />
                      <p className="text-xs text-gray-500">{objective.questionCount} questions</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No learning objectives detected</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FlowValidationPanel;
