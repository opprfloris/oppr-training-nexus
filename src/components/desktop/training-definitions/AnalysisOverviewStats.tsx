
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Target } from 'lucide-react';

interface AnalysisOverviewStatsProps {
  complexity: string;
  estimatedDifficulty: string;
  estimatedDuration: number;
  suggestedQuestionCount: number;
}

const AnalysisOverviewStats: React.FC<AnalysisOverviewStatsProps> = ({
  complexity,
  estimatedDifficulty,
  estimatedDuration,
  suggestedQuestionCount
}) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">Complexity</span>
          <Badge className={getComplexityColor(complexity)}>
            {complexity}
          </Badge>
        </div>
        <p className="text-xs text-gray-600">Content sophistication</p>
      </div>
      
      <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">Difficulty</span>
          <Badge className={getDifficultyColor(estimatedDifficulty)}>
            {estimatedDifficulty}
          </Badge>
        </div>
        <p className="text-xs text-gray-600">Training challenge level</p>
      </div>

      <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">Duration</span>
          <div className="flex items-center text-sm font-medium">
            <Clock className="w-3 h-3 mr-1" />
            {estimatedDuration}min
          </div>
        </div>
        <p className="text-xs text-gray-600">Estimated completion time</p>
      </div>

      <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">Questions</span>
          <div className="flex items-center text-sm font-medium">
            <Target className="w-3 h-3 mr-1" />
            {suggestedQuestionCount}
          </div>
        </div>
        <p className="text-xs text-gray-600">Recommended assessments</p>
      </div>
    </div>
  );
};

export default AnalysisOverviewStats;
