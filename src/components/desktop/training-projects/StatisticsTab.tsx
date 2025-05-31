import React from 'react';
import { ProjectStat, ProgressData, ProgressStatus } from '@/types/training-projects';

interface StatisticsTabProps {
  project: {
    id: string;
    name: string;
  };
}

const StatisticsTab = ({ project }: StatisticsTabProps) => {
  // Mock data - this will be replaced with real data from Supabase
  const stats: ProjectStat[] = [
    {
      name: "Total Learners",
      value: 24,
      trend: { value: 12, isUp: true }
    },
    {
      name: "Completed",
      value: 18,
      trend: { value: 8, isUp: true }
    },
    {
      name: "In Progress",
      value: 4,
      trend: { value: 2, isUp: false }
    },
    {
      name: "Not Started",
      value: 2,
      trend: { value: 4, isUp: false }
    },
    {
      name: "Average Score",
      value: 87,
      trend: { value: 3, isUp: true }
    },
    {
      name: "Completion Rate",
      value: 75,
      trend: { value: 5, isUp: true }
    }
  ];

  const progressData: ProgressData[] = [
    {
      learnerId: "1",
      learnerName: "John Smith",
      status: "completed" as ProgressStatus,
      progress: 100,
      score: 92,
      lastActivity: "2024-01-15"
    },
    {
      learnerId: "2",
      learnerName: "Sarah Johnson",
      status: "in_progress" as ProgressStatus,
      progress: 75,
      score: 0,
      lastActivity: "2024-01-14"
    },
    {
      learnerId: "3",
      learnerName: "Mike Wilson",
      status: "completed" as ProgressStatus,
      progress: 100,
      score: 88,
      lastActivity: "2024-01-13"
    },
    {
      learnerId: "4",
      learnerName: "Emily Davis",
      status: "not_started" as ProgressStatus,
      progress: 0,
      score: 0,
      lastActivity: "2024-01-10"
    }
  ];

  const activityData = [
    {
      id: "1",
      type: "assignment",
      description: "assigned the training project to John Smith",
      user: { name: "Alice Johnson", avatar: "https://example.com/avatar1.jpg" },
      timestamp: "2024-01-16T10:30:00"
    },
    {
      id: "2",
      type: "completion",
      description: "completed the training project",
      user: { name: "John Smith", avatar: "https://example.com/avatar1.jpg" },
      timestamp: "2024-01-15T16:45:00"
    },
    {
      id: "3",
      type: "update",
      description: "updated the training project description",
      user: { name: "David Lee", avatar: "https://example.com/avatar2.jpg" },
      timestamp: "2024-01-14T09:12:00"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-800">{stat.name}</h3>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            {stat.trend && (
              <div className={`text-sm ${stat.trend.isUp ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend.isUp ? '▲' : '▼'} {stat.trend.value}%
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Learner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Activity
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {progressData.map((data) => (
              <tr key={data.learnerId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {data.learnerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {data.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {data.progress}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {data.score}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {data.lastActivity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <ul className="space-y-3">
          {activityData.map((activity) => (
            <li key={activity.id} className="flex items-center space-x-3">
              <img src={activity.user.avatar} alt="User Avatar" className="w-8 h-8 rounded-full" />
              <div>
                <p className="text-sm font-medium text-gray-900">{activity.user.name} {activity.description}</p>
                <p className="text-xs text-gray-500">{activity.timestamp}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StatisticsTab;
