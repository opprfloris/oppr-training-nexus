
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, AlertTriangle } from 'lucide-react';

interface ContentSection {
  section: string;
  importance: number;
  questionPotential: number;
  riskLevel?: 'low' | 'medium' | 'high';
}

interface ContentSectionsAnalysisProps {
  contentSections: ContentSection[];
}

const ContentSectionsAnalysis: React.FC<ContentSectionsAnalysisProps> = ({ contentSections }) => {
  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (contentSections.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-medium mb-3">Content Section Analysis</h4>
      <div className="space-y-3">
        {contentSections.slice(0, 6).map((section, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium flex items-center">
                {section.section}
                {section.riskLevel && (
                  <AlertTriangle className={`w-3 h-3 ml-1 ${getRiskColor(section.riskLevel)}`} />
                )}
              </span>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-600">
                  {Math.round(section.questionPotential)}% potential
                </span>
                {section.riskLevel && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getRiskColor(section.riskLevel)}`}
                  >
                    {section.riskLevel} risk
                  </Badge>
                )}
              </div>
            </div>
            <Progress value={section.questionPotential} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentSectionsAnalysis;
