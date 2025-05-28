
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, FileText, Target, TrendingUp } from 'lucide-react';

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

interface SmartContentAnalyzerProps {
  content: string;
  fileName: string;
}

const SmartContentAnalyzer: React.FC<SmartContentAnalyzerProps> = ({ content, fileName }) => {
  const analyzeContent = (text: string): ContentAnalysis => {
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).length;
    const avgWordsPerSentence = words / sentences;
    
    // Analyze complexity based on sentence length, vocabulary, and structure
    const complexity: 'basic' | 'intermediate' | 'advanced' = 
      avgWordsPerSentence > 20 ? 'advanced' :
      avgWordsPerSentence > 12 ? 'intermediate' : 'basic';

    // Enhanced topic extraction with importance scoring
    const topicPatterns = [
      { pattern: /safety|hazard|risk|protection|emergency|incident/gi, topic: 'Safety & Risk Management', weight: 0.9 },
      { pattern: /equipment|machine|tool|device|apparatus|instrument/gi, topic: 'Equipment & Machinery', weight: 0.8 },
      { pattern: /quality|standard|specification|requirement|compliance/gi, topic: 'Quality & Standards', weight: 0.85 },
      { pattern: /procedure|process|workflow|method|protocol/gi, topic: 'Procedures & Processes', weight: 0.75 },
      { pattern: /maintenance|repair|service|inspection|calibration/gi, topic: 'Maintenance & Service', weight: 0.7 },
      { pattern: /training|education|skill|competency|certification/gi, topic: 'Training & Development', weight: 0.6 },
      { pattern: /documentation|record|report|log|documentation/gi, topic: 'Documentation & Records', weight: 0.65 },
      { pattern: /regulation|law|legal|compliance|audit/gi, topic: 'Regulatory Compliance', weight: 0.8 }
    ];

    const keyTopics: string[] = [];
    const contentSections: { section: string; importance: number; questionPotential: number }[] = [];

    topicPatterns.forEach(({ pattern, topic, weight }) => {
      const matches = text.match(pattern);
      if (matches && matches.length >= 2) {
        keyTopics.push(topic);
        
        // Calculate question potential based on content density and importance
        const density = matches.length / words * 1000; // per 1000 words
        const questionPotential = Math.min(100, density * weight * 50);
        
        contentSections.push({
          section: topic,
          importance: weight * 100,
          questionPotential
        });
      }
    });

    // Sort by importance
    contentSections.sort((a, b) => b.importance - a.importance);

    // Suggest question count based on content length and complexity
    const baseQuestions = Math.max(3, Math.min(20, Math.floor(words / 200)));
    const complexityMultiplier = complexity === 'advanced' ? 1.3 : complexity === 'intermediate' ? 1.1 : 0.9;
    const suggestedQuestionCount = Math.round(baseQuestions * complexityMultiplier);

    // Estimate difficulty based on complexity and technical content
    const technicalTerms = text.match(/\b[A-Z]{2,}\b|\b\w+tion\b|\b\w+ment\b/g)?.length || 0;
    const technicalDensity = technicalTerms / words;
    
    const estimatedDifficulty: 'easy' | 'medium' | 'hard' = 
      complexity === 'advanced' && technicalDensity > 0.05 ? 'hard' :
      complexity === 'intermediate' || technicalDensity > 0.03 ? 'medium' : 'easy';

    // Reading level (simplified Flesch-Kincaid approximation)
    const readingLevel = Math.max(6, Math.min(18, 
      0.39 * avgWordsPerSentence + 11.8 * (text.match(/[aeiou]/gi)?.length || 0) / words - 15.59
    ));

    return {
      complexity,
      keyTopics: keyTopics.slice(0, 6), // Top 6 topics
      suggestedQuestionCount,
      estimatedDifficulty,
      readingLevel,
      contentSections: contentSections.slice(0, 8) // Top 8 sections
    };
  };

  const analysis = analyzeContent(content);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'basic': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center">
          <Brain className="w-4 h-4 mr-2" />
          Smart Content Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Complexity</span>
              <Badge className={getComplexityColor(analysis.complexity)}>
                {analysis.complexity}
              </Badge>
            </div>
            <p className="text-xs text-gray-600">Content sophistication level</p>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Difficulty</span>
              <Badge className={getDifficultyColor(analysis.estimatedDifficulty)}>
                {analysis.estimatedDifficulty}
              </Badge>
            </div>
            <p className="text-xs text-gray-600">Suggested question difficulty</p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="font-medium">{analysis.suggestedQuestionCount} questions</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="w-4 h-4 text-green-600" />
              <span>Grade {Math.round(analysis.readingLevel)} level</span>
            </div>
          </div>
        </div>

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

        {/* Content Sections Analysis */}
        {analysis.contentSections.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3">Content Section Analysis</h4>
            <div className="space-y-2">
              {analysis.contentSections.slice(0, 4).map((section, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium">{section.section}</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">
                        {Math.round(section.questionPotential)}% potential
                      </span>
                    </div>
                  </div>
                  <Progress value={section.questionPotential} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-blue-800 mb-2">AI Recommendations</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Focus on {analysis.keyTopics[0]} for primary learning objectives</li>
            <li>• Create {Math.ceil(analysis.suggestedQuestionCount * 0.4)} {analysis.estimatedDifficulty} difficulty questions</li>
            <li>• Include practical scenarios based on identified procedures</li>
            {analysis.complexity === 'advanced' && (
              <li>• Consider breaking complex concepts into digestible information blocks</li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartContentAnalyzer;
