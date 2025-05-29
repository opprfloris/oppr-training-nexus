
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';

interface SimpleContentSummaryProps {
  content: string;
  fileName: string;
}

const SimpleContentSummary: React.FC<SimpleContentSummaryProps> = ({ content, fileName }) => {
  // Get the saved analysis prompt
  const savedPrompt = localStorage.getItem('ai-analysis-prompt');
  const defaultPrompt = `Analyze this training document and provide a simple, helpful summary.

Focus on:
- Main topics and themes
- Key learning points
- Suggested training approach
- Content difficulty level

Keep the response concise and actionable for training developers.`;

  const analysisPrompt = savedPrompt || defaultPrompt;

  // Simple content analysis for basic stats
  const words = content.split(/\s+/).length;
  const readingTime = Math.ceil(words / 200); // 200 words per minute
  
  // Extract basic topics using simple keyword matching for fallback
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

  // Generate analysis using the custom prompt
  const generateCustomAnalysis = () => {
    // This would be where we'd call the AI API with the custom prompt
    // For now, we'll show a more dynamic response based on the prompt structure
    const promptLines = analysisPrompt.split('\n').filter(line => line.trim());
    
    let analysisText = `**Document Analysis: ${fileName}**\n\n`;
    
    // Add basic document stats
    analysisText += `Document contains ${words} words (${readingTime} minute read).\n\n`;
    
    // Process the prompt to generate a more relevant response
    if (analysisPrompt.includes('summary') || analysisPrompt.includes('2 sentences')) {
      analysisText += `**Summary:**\n`;
      analysisText += `This document covers ${detectedTopics.length > 0 ? detectedTopics.slice(0, 2).join(' and ').toLowerCase() : 'operational procedures'} with ${words > 1000 ? 'detailed' : 'concise'} information. `;
      analysisText += `The content is ${words > 2000 ? 'comprehensive and suitable for advanced training' : words > 1000 ? 'moderately detailed for intermediate training' : 'focused and appropriate for basic training'}.\n\n`;
    }
    
    if (analysisPrompt.includes('equipment tags') || analysisPrompt.includes('equipment')) {
      analysisText += `**Equipment Tags Identified:**\n`;
      // Extract potential equipment tags (uppercase alphanumeric patterns)
      const equipmentTags = content.match(/[A-Z]{2,}-[A-Z0-9]{2,}/g) || [];
      if (equipmentTags.length > 0) {
        analysisText += equipmentTags.slice(0, 5).map(tag => `• ${tag}`).join('\n') + '\n\n';
      } else {
        analysisText += '• No specific equipment tags detected in document\n\n';
      }
    }
    
    if (analysisPrompt.includes('topics') || analysisPrompt.includes('themes')) {
      analysisText += `**Main Topics and Themes:**\n`;
      if (detectedTopics.length > 0) {
        analysisText += detectedTopics.map(topic => `• ${topic}`).join('\n') + '\n\n';
      } else {
        analysisText += '• General operational procedures\n\n';
      }
    }
    
    if (analysisPrompt.includes('learning points') || analysisPrompt.includes('key learning')) {
      analysisText += `**Key Learning Points:**\n`;
      analysisText += `• Understanding of ${detectedTopics.length > 0 ? detectedTopics[0].toLowerCase() : 'operational'} procedures\n`;
      analysisText += `• Practical application of documented processes\n`;
      analysisText += `• ${words > 1500 ? 'Advanced' : 'Basic'} operational knowledge\n\n`;
    }
    
    if (analysisPrompt.includes('training approach') || analysisPrompt.includes('suggested training')) {
      analysisText += `**Suggested Training Approach:**\n`;
      analysisText += `• Duration: ${Math.max(10, Math.min(30, readingTime * 2))} minutes\n`;
      analysisText += `• Format: ${words > 1000 ? 'Interactive workshop with hands-on practice' : 'Brief overview with practical examples'}\n`;
      analysisText += `• Assessment: ${Math.max(3, Math.min(15, Math.floor(words / 200)))} questions\n\n`;
    }
    
    if (analysisPrompt.includes('difficulty') || analysisPrompt.includes('Content difficulty')) {
      analysisText += `**Content Difficulty Level:**\n`;
      analysisText += `• ${words > 2000 ? 'Advanced' : words > 1000 ? 'Intermediate' : 'Basic'} level content\n`;
      analysisText += `• ${detectedTopics.includes('Safety') ? 'Safety-critical' : 'Standard operational'} procedures\n\n`;
    }
    
    analysisText += `*Analysis generated using custom prompt. Configure AI settings with an API key for enhanced analysis.*`;
    
    return analysisText;
  };

  const analysisResult = generateCustomAnalysis();

  return (
    <div className="mt-4 space-y-4">
      {/* Custom analysis output */}
      <div className="prose prose-sm max-w-none">
        <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
          {analysisResult}
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
