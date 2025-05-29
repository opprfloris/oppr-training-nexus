
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, FileText, Target, TrendingUp, AlertTriangle, BookOpen, Clock, Users } from 'lucide-react';

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
    riskLevel?: 'low' | 'medium' | 'high';
  }[];
  learningObjectives: string[];
  estimatedDuration: number; // in minutes
  targetAudience: string[];
  criticalPoints: string[];
  prerequisiteKnowledge: string[];
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
    
    // Enhanced complexity analysis
    const complexity: 'basic' | 'intermediate' | 'advanced' = 
      avgWordsPerSentence > 20 ? 'advanced' :
      avgWordsPerSentence > 12 ? 'intermediate' : 'basic';

    // Enhanced topic patterns with risk assessment
    const topicPatterns = [
      { pattern: /safety|hazard|risk|protection|emergency|incident|accident|danger/gi, topic: 'Safety & Risk Management', weight: 0.95, riskLevel: 'high' as const },
      { pattern: /equipment|machine|tool|device|apparatus|instrument|machinery/gi, topic: 'Equipment & Machinery', weight: 0.85, riskLevel: 'medium' as const },
      { pattern: /quality|standard|specification|requirement|compliance|audit/gi, topic: 'Quality & Standards', weight: 0.8, riskLevel: 'medium' as const },
      { pattern: /procedure|process|workflow|method|protocol|step|instruction/gi, topic: 'Procedures & Processes', weight: 0.75, riskLevel: 'low' as const },
      { pattern: /maintenance|repair|service|inspection|calibration|upkeep/gi, topic: 'Maintenance & Service', weight: 0.7, riskLevel: 'medium' as const },
      { pattern: /training|education|skill|competency|certification|learning/gi, topic: 'Training & Development', weight: 0.6, riskLevel: 'low' as const },
      { pattern: /documentation|record|report|log|file|document/gi, topic: 'Documentation & Records', weight: 0.65, riskLevel: 'low' as const },
      { pattern: /regulation|law|legal|compliance|regulatory|policy/gi, topic: 'Regulatory Compliance', weight: 0.85, riskLevel: 'high' as const },
      { pattern: /chemical|toxic|substance|material|waste|contamination/gi, topic: 'Chemical Safety', weight: 0.9, riskLevel: 'high' as const },
      { pattern: /electrical|voltage|power|current|circuit|shock/gi, topic: 'Electrical Safety', weight: 0.88, riskLevel: 'high' as const }
    ];

    const keyTopics: string[] = [];
    const contentSections: { section: string; importance: number; questionPotential: number; riskLevel?: 'low' | 'medium' | 'high' }[] = [];

    topicPatterns.forEach(({ pattern, topic, weight, riskLevel }) => {
      const matches = text.match(pattern);
      if (matches && matches.length >= 2) {
        keyTopics.push(topic);
        
        const density = matches.length / words * 1000;
        const questionPotential = Math.min(100, density * weight * 50);
        
        contentSections.push({
          section: topic,
          importance: weight * 100,
          questionPotential,
          riskLevel
        });
      }
    });

    contentSections.sort((a, b) => b.importance - a.importance);

    // Enhanced question count calculation
    const baseQuestions = Math.max(3, Math.min(25, Math.floor(words / 150)));
    const complexityMultiplier = complexity === 'advanced' ? 1.4 : complexity === 'intermediate' ? 1.2 : 1.0;
    const riskMultiplier = contentSections.some(s => s.riskLevel === 'high') ? 1.3 : 1.0;
    const suggestedQuestionCount = Math.round(baseQuestions * complexityMultiplier * riskMultiplier);

    // Enhanced difficulty assessment
    const technicalTerms = text.match(/\b[A-Z]{2,}\b|\b\w+tion\b|\b\w+ment\b|\b\w+ical\b/g)?.length || 0;
    const technicalDensity = technicalTerms / words;
    const safetyKeywords = text.match(/safety|hazard|risk|emergency|danger|critical|warning/gi)?.length || 0;
    
    const estimatedDifficulty: 'easy' | 'medium' | 'hard' = 
      (complexity === 'advanced' && technicalDensity > 0.05) || safetyKeywords > 10 ? 'hard' :
      complexity === 'intermediate' || technicalDensity > 0.03 || safetyKeywords > 5 ? 'medium' : 'easy';

    // Reading level calculation
    const readingLevel = Math.max(6, Math.min(18, 
      0.39 * avgWordsPerSentence + 11.8 * (text.match(/[aeiou]/gi)?.length || 0) / words - 15.59
    ));

    // Extract learning objectives
    const learningObjectives = [
      `Understand key ${keyTopics[0] || 'operational'} principles`,
      `Apply ${keyTopics[1] || 'safety'} procedures correctly`,
      `Demonstrate competency in ${keyTopics[2] || 'standard'} practices`
    ].filter(Boolean);

    // Estimate training duration
    const readingTime = Math.ceil(words / 200); // 200 words per minute
    const questionTime = suggestedQuestionCount * 2; // 2 minutes per question
    const reviewTime = Math.ceil((readingTime + questionTime) * 0.3); // 30% review time
    const estimatedDuration = readingTime + questionTime + reviewTime;

    // Identify target audience
    const targetAudience = [];
    if (text.match(/new|beginner|introduction|basic/gi)) targetAudience.push('New Employees');
    if (text.match(/advanced|expert|specialized|technical/gi)) targetAudience.push('Experienced Staff');
    if (text.match(/supervisor|manager|lead|oversight/gi)) targetAudience.push('Supervisors');
    if (text.match(/safety|emergency|risk/gi)) targetAudience.push('All Personnel');
    if (targetAudience.length === 0) targetAudience.push('General Staff');

    // Extract critical points
    const criticalPoints = [];
    const criticalPatterns = [
      /must|required|mandatory|critical|essential|vital/gi,
      /never|always|immediately|urgent|emergency/gi,
      /warning|caution|danger|hazard|risk/gi
    ];
    
    criticalPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches && matches.length >= 3) {
        criticalPoints.push(`High frequency of ${pattern.source.split('|')[0]} terms detected`);
      }
    });

    // Identify prerequisites
    const prerequisiteKnowledge = [];
    if (text.match(/basic|fundamental|foundation/gi)) prerequisiteKnowledge.push('Basic operational knowledge');
    if (text.match(/safety|emergency/gi)) prerequisiteKnowledge.push('Safety orientation completion');
    if (text.match(/equipment|machine|tool/gi)) prerequisiteKnowledge.push('Equipment familiarization');
    if (prerequisiteKnowledge.length === 0) prerequisiteKnowledge.push('No specific prerequisites');

    return {
      complexity,
      keyTopics: keyTopics.slice(0, 8),
      suggestedQuestionCount,
      estimatedDifficulty,
      readingLevel,
      contentSections: contentSections.slice(0, 10),
      learningObjectives,
      estimatedDuration,
      targetAudience,
      criticalPoints: criticalPoints.slice(0, 3),
      prerequisiteKnowledge
    };
  };

  const analysis = analyzeContent(content);

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

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center">
          <Brain className="w-4 h-4 mr-2 text-purple-600" />
          Enhanced Content Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enhanced Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Complexity</span>
              <Badge className={getComplexityColor(analysis.complexity)}>
                {analysis.complexity}
              </Badge>
            </div>
            <p className="text-xs text-gray-600">Content sophistication</p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Difficulty</span>
              <Badge className={getDifficultyColor(analysis.estimatedDifficulty)}>
                {analysis.estimatedDifficulty}
              </Badge>
            </div>
            <p className="text-xs text-gray-600">Training challenge level</p>
          </div>

          <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Duration</span>
              <div className="flex items-center text-sm font-medium">
                <Clock className="w-3 h-3 mr-1" />
                {analysis.estimatedDuration}min
              </div>
            </div>
            <p className="text-xs text-gray-600">Estimated completion time</p>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Questions</span>
              <div className="flex items-center text-sm font-medium">
                <Target className="w-3 h-3 mr-1" />
                {analysis.suggestedQuestionCount}
              </div>
            </div>
            <p className="text-xs text-gray-600">Recommended assessments</p>
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-indigo-800 mb-3 flex items-center">
            <BookOpen className="w-4 h-4 mr-2" />
            Learning Objectives
          </h4>
          <ul className="space-y-1">
            {analysis.learningObjectives.map((objective, index) => (
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
              {analysis.targetAudience.map((audience, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {audience}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Prerequisites</h4>
            <div className="text-xs text-gray-600 space-y-1">
              {analysis.prerequisiteKnowledge.map((prereq, index) => (
                <div key={index} className="flex items-start">
                  <span className="mr-1">•</span>
                  {prereq}
                </div>
              ))}
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

        {/* Enhanced Content Sections Analysis */}
        {analysis.contentSections.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3">Content Section Analysis</h4>
            <div className="space-y-3">
              {analysis.contentSections.slice(0, 6).map((section, index) => (
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
        )}

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

        {/* Enhanced AI Recommendations */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-3">AI Training Recommendations</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <ul className="text-xs text-blue-700 space-y-2">
              <li>• Prioritize {analysis.keyTopics[0] || 'core concepts'} for learning objectives</li>
              <li>• Create {Math.ceil(analysis.suggestedQuestionCount * 0.4)} {analysis.estimatedDifficulty} difficulty questions</li>
              <li>• Include practical scenarios and real-world applications</li>
              {analysis.complexity === 'advanced' && (
                <li>• Break complex concepts into digestible information blocks</li>
              )}
            </ul>
            <ul className="text-xs text-blue-700 space-y-2">
              <li>• Estimated training time: {analysis.estimatedDuration} minutes</li>
              <li>• Target reading level: Grade {Math.round(analysis.readingLevel)}</li>
              {analysis.contentSections.some(s => s.riskLevel === 'high') && (
                <li>• Emphasize safety-critical content with interactive assessments</li>
              )}
              <li>• Consider progressive difficulty based on learner feedback</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartContentAnalyzer;
