
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from './StatCard';
import { ProjectActivityFeed } from './ProjectActivityFeed';
import { 
  TrendingUpIcon, 
  UsersIcon, 
  ClockIcon, 
  CheckCircleIcon,
  AlertTriangleIcon,
  BarChart3Icon 
} from 'lucide-react';
import { ActivityItem } from '@/types/training-projects';

interface StatisticsTabProps {
  projectId: string;
}

export const StatisticsTab: React.FC<StatisticsTabProps> = ({ projectId }) => {
  // Mock data - in real implementation, this would come from API calls
  const overallStats = [
    {
      title: "Completion Rate",
      value: "78%",
      icon: <TrendingUpIcon className="w-5 h-5" />,
      trend: { value: 12, positive: true }
    },
    {
      title: "Active Operators",
      value: "24",
      icon: <UsersIcon className="w-5 h-5" />,
      trend: { value: 3, positive: true }
    },
    {
      title: "Avg. Completion Time",
      value: "2.4h",
      icon: <ClockIcon className="w-5 h-5" />,
      trend: { value: 8, positive: false }
    },
    {
      title: "Success Rate",
      value: "92%",
      icon: <CheckCircleIcon className="w-5 h-5" />,
      trend: { value: 5, positive: true }
    }
  ];

  const operatorPerformance = [
    { name: "John Smith", completions: 15, avgScore: 94, lastActivity: "2024-01-15" },
    { name: "Sarah Johnson", completions: 12, avgScore: 89, lastActivity: "2024-01-14" },
    { name: "Mike Wilson", completions: 18, avgScore: 96, lastActivity: "2024-01-15" },
    { name: "Emma Davis", completions: 9, avgScore: 87, lastActivity: "2024-01-13" }
  ];

  const contentPerformance = [
    { step: "Safety Briefing", completionRate: 98, avgTime: "12 min", issues: 2 },
    { step: "Machine Setup", completionRate: 85, avgTime: "18 min", issues: 8 },
    { step: "Quality Check", completionRate: 92, avgTime: "15 min", issues: 4 },
    { step: "Documentation", completionRate: 76, avgTime: "22 min", issues: 12 }
  ];

  const recentActivities: ActivityItem[] = [
    {
      id: "1",
      type: "completion",
      description: "completed Machine Setup training",
      user: { name: "John Smith", avatar: undefined },
      timestamp: "2024-01-15T10:30:00Z"
    },
    {
      id: "2", 
      type: "assignment",
      description: "was assigned to Quality Check training",
      user: { name: "Sarah Johnson", avatar: undefined },
      timestamp: "2024-01-15T09:15:00Z"
    },
    {
      id: "3",
      type: "content_change",
      description: "updated Safety Briefing content",
      user: { name: "Manager Admin", avatar: undefined },
      timestamp: "2024-01-14T16:45:00Z"
    },
    {
      id: "4",
      type: "status_change",
      description: "changed project status to Active",
      user: { name: "Manager Admin", avatar: undefined },
      timestamp: "2024-01-14T14:20:00Z"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overall Statistics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {overallStats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
            />
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3Icon className="w-5 h-5" />
              Completion Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Chart visualization would go here</p>
            </div>
          </CardContent>
        </Card>

        {/* Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUpIcon className="w-5 h-5" />
              Score Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Score distribution chart would go here</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operator Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Operator Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-2">Operator</th>
                    <th className="text-left pb-2">Completions</th>
                    <th className="text-left pb-2">Avg Score</th>
                    <th className="text-left pb-2">Last Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {operatorPerformance.map((operator, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 font-medium">{operator.name}</td>
                      <td className="py-2">{operator.completions}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          operator.avgScore >= 90 
                            ? 'bg-green-100 text-green-800' 
                            : operator.avgScore >= 80 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {operator.avgScore}%
                        </span>
                      </td>
                      <td className="py-2 text-gray-500">
                        {new Date(operator.lastActivity).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Content Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Content Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-2">Training Step</th>
                    <th className="text-left pb-2">Completion</th>
                    <th className="text-left pb-2">Avg Time</th>
                    <th className="text-left pb-2">Issues</th>
                  </tr>
                </thead>
                <tbody>
                  {contentPerformance.map((content, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 font-medium">{content.step}</td>
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${content.completionRate}%` }}
                            ></div>
                          </div>
                          <span className="text-xs">{content.completionRate}%</span>
                        </div>
                      </td>
                      <td className="py-2">{content.avgTime}</td>
                      <td className="py-2">
                        {content.issues > 0 && (
                          <div className="flex items-center gap-1 text-orange-600">
                            <AlertTriangleIcon className="w-4 h-4" />
                            <span>{content.issues}</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProjectActivityFeed activities={recentActivities} />
        </div>
        
        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Today's Completions</span>
                <span className="font-semibold">8</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">This Week</span>
                <span className="font-semibold">45</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="font-semibold">178</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Recent Issues</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangleIcon className="w-4 h-4 text-orange-500" />
                  <span>Machine Setup delays</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangleIcon className="w-4 h-4 text-red-500" />
                  <span>Documentation incomplete</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
