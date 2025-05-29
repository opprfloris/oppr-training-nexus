
import React, { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tag, RefreshCw, AlertCircle } from 'lucide-react';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import { useAISettings } from '@/contexts/AISettingsContext';

interface SimpleContentSummaryProps {
  content: string;
  fileName: string;
}

const SimpleContentSummary: React.FC<SimpleContentSummaryProps> = ({ content, fileName }) => {
  const { analysis, isLoading, error, analyzeDocument, regenerateAnalysis } = useAIAnalysis();
  const { config } = useAISettings();

  // Trigger analysis when component mounts or content changes
  useEffect(() => {
    if (content && fileName) {
      console.log('Content changed, starting analysis...');
      analyzeDocument(content, fileName);
    }
  }, [content, fileName, analyzeDocument]);

  // Simple content analysis for basic stats (as fallback info)
  const words = content.split(/\s+/).length;
  const readingTime = Math.ceil(words / 200);
  
  // Extract basic topics using simple keyword matching for badges
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
    .slice(0, 6);

  const handleRegenerate = async () => {
    console.log('User requested analysis regeneration');
    await regenerateAnalysis();
  };

  return (
    <div className="mt-4 space-y-4">
      {/* AI Status and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${config.apiKey ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-xs text-gray-600">
            {config.apiKey ? `AI Analysis (${config.model})` : 'Basic Analysis Only'}
          </span>
          {error && (
            <div className="flex items-center space-x-1 text-amber-600">
              <AlertCircle className="w-3 h-3" />
              <span className="text-xs">Using fallback analysis</span>
            </div>
          )}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRegenerate}
          disabled={isLoading}
          className="flex items-center space-x-1"
        >
          <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="text-xs">
            {isLoading ? 'Analyzing...' : 'Regenerate'}
          </span>
        </Button>
      </div>

      {/* Analysis Results */}
      <div className="prose prose-sm max-w-none">
        {isLoading ? (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">Analyzing document with AI...</span>
          </div>
        ) : (
          <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
            {analysis || 'No analysis available'}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-amber-800">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">AI Analysis Error</span>
          </div>
          <p className="text-xs text-amber-700 mt-1">{error}</p>
        </div>
      )}

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
