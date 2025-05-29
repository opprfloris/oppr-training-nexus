
import React from 'react';
import { Button } from '@/components/ui/button';

export const StatisticsTab: React.FC = () => {
  return (
    <div className="space-y-8">
      <h3 className="text-lg font-medium">Project Statistics</h3>
      <div className="text-center py-16 bg-gray-50 rounded-lg">
        <Button className="bg-oppr-blue hover:bg-oppr-blue/90 mb-4">
          View Project Statistics Dashboard
        </Button>
        <p className="text-sm text-gray-500">
          Navigate to the project-specific performance dashboard
        </p>
      </div>
    </div>
  );
};
