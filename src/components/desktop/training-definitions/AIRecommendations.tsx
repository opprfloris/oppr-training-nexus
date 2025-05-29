
import React from 'react';

interface AIRecommendationsProps {
  keyTopics: string[];
  suggestedQuestionCount: number;
  estimatedDifficulty: string;
  complexity: string;
  estimatedDuration: number;
  readingLevel: number;
  contentSections: Array<{ riskLevel?: string }>;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  keyTopics,
  suggestedQuestionCount,
  estimatedDifficulty,
  complexity,
  estimatedDuration,
  readingLevel,
  contentSections
}) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 className="text-sm font-medium text-blue-800 mb-3">AI Training Recommendations</h4>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <ul className="text-xs text-blue-700 space-y-2">
          <li>• Prioritize {keyTopics[0] || 'core concepts'} for learning objectives</li>
          <li>• Create {Math.ceil(suggestedQuestionCount * 0.4)} {estimatedDifficulty} difficulty questions</li>
          <li>• Include practical scenarios and real-world applications</li>
          {complexity === 'advanced' && (
            <li>• Break complex concepts into digestible information blocks</li>
          )}
        </ul>
        <ul className="text-xs text-blue-700 space-y-2">
          <li>• Estimated training time: {estimatedDuration} minutes</li>
          <li>• Target reading level: Grade {Math.round(readingLevel)}</li>
          {contentSections.some(s => s.riskLevel === 'high') && (
            <li>• Emphasize safety-critical content with interactive assessments</li>
          )}
          <li>• Consider progressive difficulty based on learner feedback</li>
        </ul>
      </div>
    </div>
  );
};

export default AIRecommendations;
