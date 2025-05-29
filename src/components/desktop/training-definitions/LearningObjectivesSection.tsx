
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users } from 'lucide-react';

interface LearningObjectivesSectionProps {
  learningObjectives: string[];
  targetAudience: string[];
  prerequisiteKnowledge: string[];
}

const LearningObjectivesSection: React.FC<LearningObjectivesSectionProps> = ({
  learningObjectives,
  targetAudience,
  prerequisiteKnowledge
}) => {
  return (
    <>
      {/* Learning Objectives */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-indigo-800 mb-3 flex items-center">
          <BookOpen className="w-4 h-4 mr-2" />
          Learning Objectives
        </h4>
        <ul className="space-y-1">
          {learningObjectives.map((objective, index) => (
            <li key={index} className="text-sm text-indigo-700 flex items-start">
              <span className="mr-2">•</span>
              {objective}
            </li>
          ))}
        </ul>
      </div>

      {/* Target Audience & Prerequisites */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <Users className="w-4 h-4 mr-2 text-blue-600" />
            Target Audience
          </h4>
          <div className="flex flex-wrap gap-1">
            {targetAudience.map((audience, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {audience}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Prerequisites</h4>
          <div className="text-xs text-gray-600 space-y-1">
            {prerequisiteKnowledge.map((prereq, index) => (
              <div key={index} className="flex items-start">
                <span className="mr-1">•</span>
                {prereq}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default LearningObjectivesSection;
