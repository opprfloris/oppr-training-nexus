
import React, { useMemo } from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { StepBlock } from '@/types/training-definitions';

interface AdvancedValidationProps {
  steps: StepBlock[];
  title: string;
  description: string;
}

interface ValidationResult {
  type: 'error' | 'warning' | 'success';
  message: string;
  stepId?: string;
}

const AdvancedValidation: React.FC<AdvancedValidationProps> = ({
  steps,
  title,
  description
}) => {
  const validationResults = useMemo(() => {
    const results: ValidationResult[] = [];

    // Title validation
    if (!title.trim()) {
      results.push({
        type: 'error',
        message: 'Title is required'
      });
    } else if (title.length < 3) {
      results.push({
        type: 'warning',
        message: 'Title should be at least 3 characters'
      });
    }

    // Steps validation
    if (steps.length === 0) {
      results.push({
        type: 'warning',
        message: 'No steps added yet'
      });
    }

    // Individual step validation
    steps.forEach((step, index) => {
      switch (step.type) {
        case 'information':
          const infoConfig = step.config as any;
          if (!infoConfig.content?.trim()) {
            results.push({
              type: 'error',
              message: `Step ${index + 1}: Information content is empty`,
              stepId: step.id
            });
          }
          break;

        case 'goto':
          const gotoConfig = step.config as any;
          if (!gotoConfig.instructions?.trim()) {
            results.push({
              type: 'error',
              message: `Step ${index + 1}: Go-to instructions are empty`,
              stepId: step.id
            });
          }
          break;

        case 'question':
          const questionConfig = step.config as any;
          if (!questionConfig.question_text?.trim()) {
            results.push({
              type: 'error',
              message: `Step ${index + 1}: Question text is empty`,
              stepId: step.id
            });
          }
          
          if (questionConfig.question_type === 'multiple_choice') {
            const options = questionConfig.options || [];
            if (options.length < 2) {
              results.push({
                type: 'error',
                message: `Step ${index + 1}: Multiple choice needs at least 2 options`,
                stepId: step.id
              });
            }
            
            if (questionConfig.correct_option === undefined || questionConfig.correct_option === null) {
              results.push({
                type: 'error',
                message: `Step ${index + 1}: No correct answer selected`,
                stepId: step.id
              });
            }
          }
          break;
      }
    });

    // Flow structure validation
    if (steps.length > 0) {
      const hasQuestions = steps.some(step => step.type === 'question');
      const hasInformation = steps.some(step => step.type === 'information');
      
      if (!hasInformation) {
        results.push({
          type: 'warning',
          message: 'Consider adding information blocks to explain concepts'
        });
      }
      
      if (steps.length > 20) {
        results.push({
          type: 'warning',
          message: 'Large training flows may be overwhelming for users'
        });
      }
    }

    return results;
  }, [steps, title, description]);

  const errorCount = validationResults.filter(r => r.type === 'error').length;
  const warningCount = validationResults.filter(r => r.type === 'warning').length;

  if (validationResults.length === 0) {
    return (
      <div className="oppr-card p-4 bg-green-50 border-green-200">
        <div className="flex items-center space-x-2 text-green-800">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">All validations passed</span>
        </div>
      </div>
    );
  }

  return (
    <div className="oppr-card p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Validation Results</h3>
      
      <div className="mb-4 flex space-x-4 text-sm">
        {errorCount > 0 && (
          <span className="flex items-center space-x-1 text-red-600">
            <XCircle className="w-4 h-4" />
            <span>{errorCount} error{errorCount !== 1 ? 's' : ''}</span>
          </span>
        )}
        {warningCount > 0 && (
          <span className="flex items-center space-x-1 text-yellow-600">
            <AlertTriangle className="w-4 h-4" />
            <span>{warningCount} warning{warningCount !== 1 ? 's' : ''}</span>
          </span>
        )}
      </div>

      <div className="space-y-2">
        {validationResults.map((result, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${
              result.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : result.type === 'warning'
                ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                : 'bg-green-50 border-green-200 text-green-800'
            }`}
          >
            <div className="flex items-start space-x-2">
              {result.type === 'error' && <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
              {result.type === 'warning' && <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
              {result.type === 'success' && <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
              <span className="text-sm">{result.message}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdvancedValidation;
