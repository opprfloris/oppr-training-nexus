
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Tag } from 'lucide-react';

interface SimpleContentSummaryProps {
  content: string;
  fileName: string;
}

const SimpleContentSummary: React.FC<SimpleContentSummaryProps> = ({ content, fileName }) => {
  // Simple content analysis
  const words = content.split(/\s+/).length;
  const readingTime = Math.ceil(words / 200); // 200 words per minute
  
  // Extract basic topics using simple keyword matching
  const topicPatterns = [
    { pattern: /safety|hazard|risk|protection|emergency/gi, topic: 'Safety' },
    { pattern: /equipment|machine|tool|device/gi, topic: 'Equipment' },
    { pattern: /quality|standard|specification/gi, topic: 'Quality' },
    { pattern: /procedure|process|workflow|method/gi, topic: 'Procedures' },
    { pattern: /maintenance|repair|service/gi, topic: 'Maintenance' },
    { pattern: /training|education|skill/gi, topic: 'Training' }
  ];

  const detectedTopics = topicPatterns
    .filter(({ pattern }) => content.match(pattern))
    .map(({ topic }) => topic)
    .slice(0, 6); // Limit to 6 topics

  // Generate simple summary
  const summary = `This ${words > 1000 ? 'comprehensive' : 'concise'} document covers ${detectedTopics.length > 0 ? detectedTopics.slice(0, 2).join(' and ') : 'various topics'}. With approximately ${words} words, it provides ${words > 1500 ? 'detailed' : 'essential'} information suitable for training content development.`;

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center">
          <FileText className="w-4 h-4 mr-2 text-blue-600" />
          Content Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Document Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{fileName}</span>
            <span className="text-blue-600">{readingTime} min read</span>
          </div>
          <p className="text-sm text-blue-800 mt-2">{summary}</p>
        </div>

        {/* Key Topics */}
        {detectedTopics.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Tag className="w-3 h-3 mr-1" />
              Key Topics
            </h4>
            <div className="flex flex-wrap gap-2">
              {detectedTopics.map((topic, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-blue-50 text-xs"
                >
                  {topic}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Click topics to include/exclude in training generation
            </p>
          </div>
        )}

        {/* Simple Recommendations */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-green-800 mb-2">Quick Recommendations</h4>
          <ul className="text-xs text-green-700 space-y-1">
            <li>• Suggested training length: {Math.max(10, Math.min(30, readingTime * 2))} minutes</li>
            <li>• Recommended questions: {Math.max(3, Math.min(15, Math.floor(words / 200)))}</li>
            <li>• Content difficulty: {words > 2000 ? 'Intermediate' : 'Basic'}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleContentSummary;
