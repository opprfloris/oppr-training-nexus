
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResourceHubCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  primaryAction: {
    label: string;
    onClick: () => void;
  };
  secondaryAction: {
    label: string;
    onClick: () => void;
  };
}

export const ResourceHubCard: React.FC<ResourceHubCardProps> = ({
  title,
  description,
  icon: Icon,
  primaryAction,
  secondaryAction
}) => {
  return (
    <div className="oppr-card p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-oppr-blue/10 rounded-lg flex items-center justify-center mr-4">
            <Icon className="w-6 h-6 text-oppr-blue" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>
      
      <div className="flex gap-3">
        <Button 
          onClick={primaryAction.onClick}
          className="flex-1"
          variant="default"
        >
          {primaryAction.label}
        </Button>
        <Button 
          onClick={secondaryAction.onClick}
          variant="outline"
          className="flex-1"
        >
          {secondaryAction.label}
        </Button>
      </div>
    </div>
  );
};
