
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, AlertTriangle } from 'lucide-react';
import { useContentAnalysis } from '@/hooks/useContentAnalysis';
import AnalysisOverviewStats from './AnalysisOverviewStats';
import ContentSectionsAnalysis from './ContentSectionsAnalysis';
import LearningObjectivesSection from './LearningObjectivesSection';
import AIRecommendations from './AIRecommendations';

interface SmartContentAnalyzerProps {
  content: string;
  fileName: string;
}

const SmartContentAnalyzer: React.FC<SmartContentAnalyzerProps> = ({ content, fileName }) => {
  const analysis = useContentAnalysis(content);

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center">
          <Brain className="w-4 h-4 mr-2 text-purple-600" />
          Enhanced Content Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <AnalysisOverviewStats
          complexity={analysis.complexity}
          estimatedDifficulty={analysis.estimatedDifficulty}
          estimatedDuration={analysis.estimatedDuration}
          suggestedQuestionCount={analysis.suggestedQuestionCount}
        />

        <LearningObjectivesSection
          learningObjectives={analysis.learningObjectives}
          targetAudience={analysis.targetAudience}
          prerequisiteKnowledge={analysis.prerequisiteKnowledge}
        />

        {/* Key Topics */}
        {analysis.keyTopics.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Identified Topics</h4>
            <div className="flex flex-wrap gap-1">
              {analysis.keyTopics.map((topic, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <ContentSectionsAnalysis contentSections={analysis.contentSections} />

        {/* Critical Points Alert */}
        {analysis.criticalPoints.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-amber-800 mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Critical Training Points
            </h4>
            <ul className="text-xs text-amber-700 space-y-1">
              {analysis.criticalPoints.map((point, index) => (
                <li key={index}>• {point}</li>
              ))}
            </ul>
          </div>
        )}

        <AIRecommendations
          keyTopics={analysis.keyTopics}
          suggestedQuestionCount={analysis.suggestedQuestionCount}
          estimatedDifficulty={analysis.estimatedDifficulty}
          complexity={analysis.complexity}
          estimatedDuration={analysis.estimatedDuration}
          readingLevel={analysis.readingLevel}
          contentSections={analysis.contentSections}
        />
      </CardContent>
    </Card>
  );
};

export default SmartContentAnalyzer;
