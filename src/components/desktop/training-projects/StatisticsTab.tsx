import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { TrainingProject } from '@/types/training-projects';

interface StatisticsTabProps {
  project: TrainingProject;
}

interface ActivityItem {
  id: string;
  type: 'completion' | 'assignment' | 'content_change';
  description: string;
  timestamp: string;
  user: string;
}

export const StatisticsTab: React.FC<StatisticsTabProps> = ({ project }) => {
  // Mock data for demonstration
  const completionRate = 75;
  const averageScore = 88;

  const activityItems = [
    {
      id: '1',
      type: 'completion' as const,
      description: 'User completed Step 1: Safety Overview',
      timestamp: '2024-01-15T10:30:00Z',
      user: 'John Doe'
    },
    {
      id: '2', 
      type: 'assignment' as const,
      description: 'Project assigned to Floor Team A',
      timestamp: '2024-01-15T09:00:00Z',
      user: 'Manager'
    },
    {
      id: '3',
      type: 'content_change' as const,
      description: 'Training content updated',
      timestamp: '2024-01-14T16:45:00Z',
      user: 'Content Admin'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Completion Rate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Progress value={completionRate} />
            <p className="text-sm text-gray-500">{completionRate}% of users have completed the training</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{averageScore}</div>
            <p className="text-sm text-gray-500">Average score achieved by users</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activityItems.map(item => (
            <div key={item.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{item.description}</p>
                <p className="text-sm text-gray-500">
                  {item.user} - {new Date(item.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
