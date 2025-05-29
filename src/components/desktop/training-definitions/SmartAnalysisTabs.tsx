
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Target, FileText, TrendingUp, Lightbulb } from 'lucide-react';

interface ContentAnalysis {
  complexity: 'basic' | 'intermediate' | 'advanced';
  keyTopics: string[];
  suggestedQuestionCount: number;
  estimatedDifficulty: 'easy' | 'medium' | 'hard';
  readingLevel: number;
  contentSections: {
    section: string;
    importance: number;
    questionPotential: number;
  }[];
}

interface SmartAnalysisTabsProps {
  analysis: ContentAnalysis;
}

const SmartAnalysisTabs: React.FC<SmartAnalysisTabsProps> = ({ analysis }) => {
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'basic': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview" className="flex items-center space-x-1">
          <Brain className="w-4 h-4" />
          <span>Overview</span>
        </TabsTrigger>
        <TabsTrigger value="topics" className="flex items-center space-x-1">
          <Target className="w-4 h-4" />
          <span>Topics</span>
        </TabsTrigger>
        <TabsTrigger value="sections" className="flex items-center space-x-1">
          <FileText className="w-4 h-4" />
          <span>Sections</span>
        </TabsTrigger>
        <TabsTrigger value="recommendations" className="flex items-center space-x-1">
          <Lightbulb className="w-4 h-4" />
          <span>Suggestions</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Content Complexity</span>
              <Badge className={getComplexityColor(analysis.complexity)}>
                {analysis.complexity}
              </Badge>
            </div>
            <p className="text-xs text-gray-600">Document sophistication level</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Suggested Difficulty</span>
              <Badge className={getDifficultyColor(analysis.estimatedDifficulty)}>
                {analysis.estimatedDifficulty}
              </Badge>
            </div>
            <p className="text-xs text-gray-600">Recommended question difficulty</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-1">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">Question Count</span>
            </div>
            <div className="text-2xl font-bold text-blue-800">{analysis.suggestedQuestionCount}</div>
            <p className="text-xs text-blue-600">Recommended questions</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2 mb-1">
              <FileText className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-purple-900">Reading Level</span>
            </div>
            <div className="text-2xl font-bold text-purple-800">Grade {Math.round(analysis.readingLevel)}</div>
            <p className="text-xs text-purple-600">Educational level</p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="topics" className="space-y-4 mt-4">
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Identified Key Topics</h4>
          {analysis.keyTopics.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {analysis.keyTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="text-sm font-medium text-blue-900">{topic}</span>
                  <Badge variant="outline" className="text-blue-700 border-blue-300">
                    High Priority
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No specific topics identified</p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="sections" className="space-y-4 mt-4">
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Content Section Analysis</h4>
          {analysis.contentSections.length > 0 ? (
            <div className="space-y-3">
              {analysis.contentSections.slice(0, 6).map((section, index) => (
                <div key={index} className="space-y-2 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{section.section}</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">
                        {Math.round(section.questionPotential)}% potential
                      </span>
                    </div>
                  </div>
                  <Progress value={section.questionPotential} className="h-2" />
                  <p className="text-xs text-gray-600">
                    Importance: {Math.round(section.importance)}%
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No content sections analyzed</p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="recommendations" className="space-y-4 mt-4">
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">AI Recommendations</h4>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Primary Focus Area</p>
                  <p>Focus on {analysis.keyTopics[0] || 'core concepts'} for primary learning objectives</p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Target className="w-4 h-4 text-green-600 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">Question Strategy</p>
                  <p>Create {Math.ceil(analysis.suggestedQuestionCount * 0.4)} {analysis.estimatedDifficulty} difficulty questions for optimal learning</p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <FileText className="w-4 h-4 text-purple-600 mt-0.5" />
                <div className="text-sm text-purple-800">
                  <p className="font-medium mb-1">Content Structure</p>
                  <p>Include practical scenarios based on identified procedures and workflows</p>
                </div>
              </div>
            </div>
            
            {analysis.complexity === 'advanced' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Brain className="w-4 h-4 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">Complexity Management</p>
                    <p>Consider breaking complex concepts into digestible information blocks</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default SmartAnalysisTabs;
