
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/components/ui/badge';

interface ChecklistItem {
  id: string;
  label: string;
  estimated: string;
}

interface InteractiveChecklistProps {
  items: ChecklistItem[];
  completedItems: string[];
  onItemComplete: (itemId: string) => void;
}

export const InteractiveChecklist: React.FC<InteractiveChecklistProps> = ({
  items,
  completedItems,
  onItemComplete
}) => {
  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isCompleted = completedItems.includes(item.id);
        
        return (
          <div 
            key={item.id}
            className={`flex items-center justify-between p-3 border rounded-lg transition-all ${
              isCompleted 
                ? 'border-green-200 bg-green-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                isCompleted 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {isCompleted ? (
                  <CheckCircleIcon className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div>
                <span className={`font-medium ${isCompleted ? 'line-through text-green-700' : 'text-gray-900'}`}>
                  {item.label}
                </span>
                <div className="flex items-center space-x-1 mt-1">
                  <ClockIcon className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{item.estimated}</span>
                </div>
              </div>
            </div>
            
            {!isCompleted && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onItemComplete(item.id)}
              >
                Complete
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};
