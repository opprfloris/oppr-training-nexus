
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'completion' | 'assignment' | 'content_change' | 'status_change';
  description: string;
  user: {
    name: string;
    avatarUrl?: string;
  };
  timestamp: string;
}

interface ProjectActivityFeedProps {
  activities: ActivityItem[];
}

export const ProjectActivityFeed: React.FC<ProjectActivityFeedProps> = ({ activities }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 py-2">
              <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {activity.user.avatarUrl ? (
                  <img
                    src={activity.user.avatarUrl}
                    alt={activity.user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-500">
                    {activity.user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user.name}</span>{' '}
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500">
                  {format(new Date(activity.timestamp), 'MMM d, yyyy • h:mm a')}
                </p>
              </div>
            </div>
          ))}
          
          {activities.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
