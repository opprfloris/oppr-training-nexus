
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckCircleIcon, ChevronDownIcon, ChevronRightIcon, ClockIcon } from '@heroicons/react/24/outline';

interface WorkflowStepProps {
  step: {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    estimatedTime: string;
    keyFeatures: string[];
    actionButton: {
      label: string;
      onClick: () => void;
    };
  };
  stepNumber: number;
  isCompleted: boolean;
  onComplete: () => void;
}

export const WorkflowStep: React.FC<WorkflowStepProps> = ({ 
  step, 
  stepNumber, 
  isCompleted, 
  onComplete 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = step.icon;

  return (
    <Card className={`transition-all duration-200 ${isCompleted ? 'border-green-200 bg-green-50' : 'hover:shadow-md'}`}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-green-100 text-green-600' : 'bg-oppr-blue text-white'
                }`}>
                  {isCompleted ? (
                    <CheckCircleIcon className="w-6 h-6" />
                  ) : (
                    <span className="font-bold">{stepNumber}</span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <Icon className="w-6 h-6 text-oppr-blue" />
                  <div>
                    <CardTitle className="text-left">{step.title}</CardTitle>
                    <CardDescription className="text-left">{step.description}</CardDescription>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <ClockIcon className="w-3 h-3" />
                  <span>{step.estimatedTime}</span>
                </Badge>
                {isExpanded ? (
                  <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Key Features:</h4>
                <ul className="space-y-2">
                  {step.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex flex-col justify-between">
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Ready to get started?</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Click the button below to navigate to this section and begin the process.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    onClick={step.actionButton.onClick}
                    className="w-full"
                  >
                    {step.actionButton.label}
                  </Button>
                  {!isCompleted && (
                    <Button 
                      variant="outline" 
                      onClick={onComplete}
                      className="w-full"
                    >
                      Mark as Complete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
