
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';

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

  // Generate simple summary using localStorage prompt
  const savedPrompt = localStorage.getItem('ai-analysis-prompt');
  const defaultPrompt = `Analyze this training document and provide a simple, helpful summary.

Focus on:
- Main topics and themes
- Key learning points
- Suggested training approach
- Content difficulty level

Keep the response concise and actionable for training developers.`;

  const analysisPrompt = savedPrompt || defaultPrompt;

  // Simple analysis output
  const analysisText = `**Document Analysis: ${fileName}**

This document contains approximately ${words} words (${readingTime} minute read) and covers ${detectedTopics.length > 0 ? detectedTopics.slice(0, 2).join(' and ') : 'various topics'}. 

The content appears to be ${words > 2000 ? 'comprehensive and detailed' : words > 1000 ? 'moderately detailed' : 'concise and focused'}, making it ${words > 1500 ? 'suitable for intermediate to advanced training' : 'appropriate for basic to intermediate training'}.

**Recommended Training Configuration:**
- Training length: ${Math.max(10, Math.min(30, readingTime * 2))} minutes
- Number of questions: ${Math.max(3, Math.min(15, Math.floor(words / 200)))}
- Difficulty level: ${words > 2000 ? 'Intermediate' : 'Basic'}

${detectedTopics.length > 0 ? `**Key Topics Detected:**
${detectedTopics.map(topic => `• ${topic}`).join('\n')}` : ''}

*Note: This analysis uses a basic keyword matching approach. For more detailed analysis, configure your AI settings with an API key.*`;

  return (
    <div className="mt-4 space-y-4">
      {/* Simple text output */}
      <div className="prose prose-sm max-w-none">
        <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
          {analysisText}
        </div>
      </div>

      {/* Key Topics as clickable badges */}
      {detectedTopics.length > 0 && (
        <div className="border-t pt-4">
          <div className="flex items-center space-x-2 mb-2">
            <Tag className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">Topics (click to include/exclude):</span>
          </div>
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
        </div>
      )}
    </div>
  );
};

export default SimpleContentSummary;
