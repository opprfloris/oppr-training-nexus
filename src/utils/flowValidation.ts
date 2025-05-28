
import { StepBlock, QuestionBlockConfig } from '@/types/training-definitions';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  score: number;
}

export interface FlowMetrics {
  totalQuestions: number;
  totalPoints: number;
  averagePoints: number;
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  questionTypeDistribution: {
    multiple_choice: number;
    text_input: number;
    numerical_input: number;
    voice_input: number;
  };
  mandatoryQuestions: number;
  informationBlocks: number;
  gotoBlocks: number;
  estimatedDuration: number; // in minutes
}

export interface LearningObjective {
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  coverage: number; // percentage
  questionCount: number;
}

export const analyzeFlowMetrics = (steps: StepBlock[]): FlowMetrics => {
  const questions = steps.filter(step => step.type === 'question');
  const informationBlocks = steps.filter(step => step.type === 'information').length;
  const gotoBlocks = steps.filter(step => step.type === 'goto').length;

  const totalPoints = questions.reduce((sum, step) => {
    const config = step.config as QuestionBlockConfig;
    return sum + (config.points || 0);
  }, 0);

  const difficultyDistribution = { easy: 0, medium: 0, hard: 0 };
  const questionTypeDistribution = { multiple_choice: 0, text_input: 0, numerical_input: 0, voice_input: 0 };
  let mandatoryQuestions = 0;

  questions.forEach(step => {
    const config = step.config as QuestionBlockConfig;
    
    // Estimate difficulty based on points and question complexity
    const points = config.points || 0;
    if (points <= 5) difficultyDistribution.easy++;
    else if (points <= 10) difficultyDistribution.medium++;
    else difficultyDistribution.hard++;

    questionTypeDistribution[config.question_type]++;
    
    if (config.mandatory) mandatoryQuestions++;
  });

  // Estimate duration: 1 min per info block, 2-5 min per question based on difficulty
  const estimatedDuration = informationBlocks * 1 + 
    difficultyDistribution.easy * 2 + 
    difficultyDistribution.medium * 3 + 
    difficultyDistribution.hard * 5 +
    gotoBlocks * 2;

  return {
    totalQuestions: questions.length,
    totalPoints,
    averagePoints: questions.length > 0 ? totalPoints / questions.length : 0,
    difficultyDistribution,
    questionTypeDistribution,
    mandatoryQuestions,
    informationBlocks,
    gotoBlocks,
    estimatedDuration
  };
};

export const extractLearningObjectives = (steps: StepBlock[]): LearningObjective[] => {
  const objectives: Map<string, LearningObjective> = new Map();
  
  steps.forEach(step => {
    if (step.type === 'question') {
      const config = step.config as QuestionBlockConfig;
      const questionText = config.question_text.toLowerCase();
      
      // Extract topics from question text (enhanced pattern matching)
      const topicPatterns = [
        { pattern: /safety|hazard|protection|ppe|emergency/i, topic: 'Safety Protocols' },
        { pattern: /equipment|machine|tool|operation|maintenance/i, topic: 'Equipment Operation' },
        { pattern: /quality|standard|specification|compliance/i, topic: 'Quality Control' },
        { pattern: /procedure|process|workflow|step/i, topic: 'Procedures' },
        { pattern: /documentation|record|report|log/i, topic: 'Documentation' },
        { pattern: /regulation|law|rule|policy/i, topic: 'Compliance' },
        { pattern: /training|learning|skill|knowledge/i, topic: 'Training' },
        { pattern: /communication|team|collaboration/i, topic: 'Communication' }
      ];

      let topicFound = false;
      for (const { pattern, topic } of topicPatterns) {
        if (pattern.test(questionText)) {
          const points = config.points || 0;
          const difficulty = points <= 5 ? 'easy' : points <= 10 ? 'medium' : 'hard';
          
          if (objectives.has(topic)) {
            const existing = objectives.get(topic)!;
            existing.questionCount++;
            existing.coverage = Math.min(100, existing.coverage + 20); // Increase coverage
          } else {
            objectives.set(topic, {
              topic,
              difficulty,
              coverage: 20,
              questionCount: 1
            });
          }
          topicFound = true;
          break;
        }
      }

      // If no specific topic found, categorize as general
      if (!topicFound) {
        const topic = 'General Knowledge';
        const points = config.points || 0;
        const difficulty = points <= 5 ? 'easy' : points <= 10 ? 'medium' : 'hard';
        
        if (objectives.has(topic)) {
          const existing = objectives.get(topic)!;
          existing.questionCount++;
          existing.coverage = Math.min(100, existing.coverage + 15);
        } else {
          objectives.set(topic, {
            topic,
            difficulty,
            coverage: 15,
            questionCount: 1
          });
        }
      }
    }
  });

  return Array.from(objectives.values());
};

export const validateTrainingFlow = (steps: StepBlock[], title: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  if (steps.length === 0) {
    errors.push('Training flow is empty. Add at least one block to create a valid training.');
    return { isValid: false, errors, warnings, suggestions, score: 0 };
  }

  const metrics = analyzeFlowMetrics(steps);
  const objectives = extractLearningObjectives(steps);

  // Critical validations (errors)
  if (!title.trim()) {
    errors.push('Training title is required.');
    score -= 20;
  }

  if (metrics.totalQuestions === 0) {
    errors.push('Training must contain at least one question block.');
    score -= 30;
  }

  if (metrics.mandatoryQuestions === 0 && metrics.totalQuestions > 0) {
    warnings.push('Consider marking at least one question as mandatory for assessment purposes.');
    score -= 5;
  }

  // Flow structure validation
  const questionBlocks = steps.filter(step => step.type === 'question');
  questionBlocks.forEach((step, index) => {
    const config = step.config as QuestionBlockConfig;
    
    if (!config.question_text.trim()) {
      errors.push(`Question ${index + 1} is missing question text.`);
      score -= 10;
    }

    if (config.question_type === 'multiple_choice') {
      if (!config.options || config.options.length < 2) {
        errors.push(`Question ${index + 1}: Multiple choice questions need at least 2 options.`);
        score -= 15;
      }
      if (config.correct_option === undefined && config.options && config.options.length > 0) {
        warnings.push(`Question ${index + 1}: No correct answer specified for multiple choice question.`);
        score -= 5;
      }
    }

    if (!config.points || config.points <= 0) {
      warnings.push(`Question ${index + 1}: Consider assigning points for assessment scoring.`);
      score -= 3;
    }
  });

  // Difficulty distribution validation
  const totalQuestions = metrics.totalQuestions;
  if (totalQuestions > 0) {
    const easyPercentage = (metrics.difficultyDistribution.easy / totalQuestions) * 100;
    const mediumPercentage = (metrics.difficultyDistribution.medium / totalQuestions) * 100;
    const hardPercentage = (metrics.difficultyDistribution.hard / totalQuestions) * 100;

    if (totalQuestions >= 5) {
      if (easyPercentage > 70) {
        suggestions.push('Consider adding more challenging questions to improve learning outcomes.');
        score -= 5;
      }
      if (hardPercentage > 50) {
        warnings.push('High proportion of difficult questions may overwhelm learners.');
        score -= 5;
      }
      if (mediumPercentage < 30 && totalQuestions >= 8) {
        suggestions.push('Consider adding more medium-difficulty questions for balanced progression.');
        score -= 3;
      }
    }
  }

  // Learning objectives coverage
  if (objectives.length === 0) {
    warnings.push('No clear learning objectives detected. Consider adding topic-specific questions.');
    score -= 10;
  } else if (objectives.length === 1 && objectives[0].topic === 'General Knowledge') {
    suggestions.push('Consider adding questions that target specific learning objectives and skills.');
    score -= 5;
  }

  // Duration validation
  if (metrics.estimatedDuration < 5) {
    warnings.push('Training duration may be too short for effective learning.');
    score -= 5;
  } else if (metrics.estimatedDuration > 45) {
    warnings.push('Training duration may be too long. Consider breaking into smaller modules.');
    score -= 5;
  }

  // Question type diversity
  const questionTypes = Object.values(metrics.questionTypeDistribution).filter(count => count > 0).length;
  if (questionTypes === 1 && totalQuestions >= 5) {
    suggestions.push('Consider using different question types to engage learners and test various skills.');
    score -= 5;
  }

  // Advanced suggestions for improvement
  if (metrics.informationBlocks === 0 && totalQuestions > 0) {
    suggestions.push('Consider adding information blocks to provide context and learning materials.');
    score -= 5;
  }

  if (objectives.some(obj => obj.coverage < 50)) {
    suggestions.push('Some learning objectives have low coverage. Consider adding more questions for these topics.');
    score -= 3;
  }

  const isValid = errors.length === 0;
  score = Math.max(0, Math.min(100, score));

  return {
    isValid,
    errors,
    warnings,
    suggestions,
    score
  };
};

export const generateOptimizationSuggestions = (steps: StepBlock[]): string[] => {
  const suggestions: string[] = [];
  const metrics = analyzeFlowMetrics(steps);
  const objectives = extractLearningObjectives(steps);

  // Difficulty progression suggestions
  if (metrics.totalQuestions >= 3) {
    const questions = steps.filter(step => step.type === 'question');
    const questionPoints = questions.map(step => (step.config as QuestionBlockConfig).points || 0);
    
    // Check if difficulty increases progressively
    let isProgressive = true;
    for (let i = 1; i < questionPoints.length; i++) {
      if (questionPoints[i] < questionPoints[i - 1]) {
        isProgressive = false;
        break;
      }
    }

    if (!isProgressive && questions.length >= 4) {
      suggestions.push('Consider arranging questions in progressive difficulty order (easy to hard) for better learning flow.');
    }
  }

  // Content balance suggestions
  const infoToQuestionRatio = metrics.informationBlocks / Math.max(1, metrics.totalQuestions);
  if (infoToQuestionRatio < 0.3 && metrics.totalQuestions >= 5) {
    suggestions.push('Consider adding more information blocks to provide adequate context and learning materials.');
  }

  // Assessment coverage suggestions
  const coverageGaps = objectives.filter(obj => obj.coverage < 60);
  if (coverageGaps.length > 0) {
    suggestions.push(`Improve coverage for: ${coverageGaps.map(obj => obj.topic).join(', ')} by adding more targeted questions.`);
  }

  return suggestions;
};
