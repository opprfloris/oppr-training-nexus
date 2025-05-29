
import { useMemo } from 'react';

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
  estimatedDuration: number;
  targetAudience: string[];
  criticalPoints: string[];
  prerequisiteKnowledge: string[];
}

export const useContentAnalysis = (content: string): ContentAnalysis => {
  return useMemo(() => {
    const words = content.split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).length;
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
      const matches = content.match(pattern);
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
    const technicalTerms = content.match(/\b[A-Z]{2,}\b|\b\w+tion\b|\b\w+ment\b|\b\w+ical\b/g)?.length || 0;
    const technicalDensity = technicalTerms / words;
    const safetyKeywords = content.match(/safety|hazard|risk|emergency|danger|critical|warning/gi)?.length || 0;
    
    const estimatedDifficulty: 'easy' | 'medium' | 'hard' = 
      (complexity === 'advanced' && technicalDensity > 0.05) || safetyKeywords > 10 ? 'hard' :
      complexity === 'intermediate' || technicalDensity > 0.03 || safetyKeywords > 5 ? 'medium' : 'easy';

    // Reading level calculation
    const readingLevel = Math.max(6, Math.min(18, 
      0.39 * avgWordsPerSentence + 11.8 * (content.match(/[aeiou]/gi)?.length || 0) / words - 15.59
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
    if (content.match(/new|beginner|introduction|basic/gi)) targetAudience.push('New Employees');
    if (content.match(/advanced|expert|specialized|technical/gi)) targetAudience.push('Experienced Staff');
    if (content.match(/supervisor|manager|lead|oversight/gi)) targetAudience.push('Supervisors');
    if (content.match(/safety|emergency|risk/gi)) targetAudience.push('All Personnel');
    if (targetAudience.length === 0) targetAudience.push('General Staff');

    // Extract critical points
    const criticalPoints = [];
    const criticalPatterns = [
      /must|required|mandatory|critical|essential|vital/gi,
      /never|always|immediately|urgent|emergency/gi,
      /warning|caution|danger|hazard|risk/gi
    ];
    
    criticalPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches && matches.length >= 3) {
        criticalPoints.push(`High frequency of ${pattern.source.split('|')[0]} terms detected`);
      }
    });

    // Identify prerequisites
    const prerequisiteKnowledge = [];
    if (content.match(/basic|fundamental|foundation/gi)) prerequisiteKnowledge.push('Basic operational knowledge');
    if (content.match(/safety|emergency/gi)) prerequisiteKnowledge.push('Safety orientation completion');
    if (content.match(/equipment|machine|tool/gi)) prerequisiteKnowledge.push('Equipment familiarization');
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
  }, [content]);
};
