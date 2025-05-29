
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatCard } from './StatCard';
import { ProjectActivityFeed } from './ProjectActivityFeed';
import { ChartContainer } from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { UsersIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';

// Sample data - in a real application, this would come from API calls
const performanceData = [
  { name: 'Week 1', completion: 65, average: 78 },
  { name: 'Week 2', completion: 72, average: 81 },
  { name: 'Week 3', completion: 78, average: 80 },
  { name: 'Week 4', completion: 85, average: 84 },
];

const completionStatusData = [
  { name: 'Completed', value: 68, color: '#4ade80' },
  { name: 'In Progress', value: 22, color: '#60a5fa' },
  { name: 'Not Started', value: 10, color: '#f87171' },
];

const operatorPerformanceData = [
  { name: 'John D.', score: 92, attempts: 1 },
  { name: 'Sarah M.', score: 88, attempts: 1 },
  { name: 'Robert K.', score: 76, attempts: 2 },
  { name: 'Lisa T.', score: 85, attempts: 1 },
  { name: 'David W.', score: 79, attempts: 2 },
];

const sampleActivities = [
  {
    id: '1',
    type: 'completion',
    description: 'completed the training with a score of 92%',
    user: { name: 'John Doe' },
    timestamp: '2025-05-28T14:30:00Z',
  },
  {
    id: '2',
    type: 'assignment',
    description: 'was assigned to the training project',
    user: { name: 'Sarah Miller' },
    timestamp: '2025-05-27T10:15:00Z',
  },
  {
    id: '3',
    type: 'content_change',
    description: 'updated training content on QR marker #3',
    user: { name: 'Admin User' },
    timestamp: '2025-05-26T16:45:00Z',
  },
  {
    id: '4',
    type: 'status_change',
    description: 'changed project status from "Draft" to "Active"',
    user: { name: 'Admin User' },
    timestamp: '2025-05-25T09:00:00Z',
  },
];

export const StatisticsTab: React.FC = () => {
  const [timeframe, setTimeframe] = useState('month');
  
  // Calculate summary metrics
  const completionRate = 68; // Percentage of operators who completed
  const averageScore = 84; // Average score across all completions
  const averageTime = '45 mins'; // Average completion time
  const failRate = 12; // Percentage of failed attempts
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-medium">Project Statistics</h3>
        
        <div className="mt-3 sm:mt-0">
          <Tabs defaultValue="month" className="w-[400px]" onValueChange={setTimeframe}>
            <TabsList>
              <TabsTrigger value="week">Last Week</TabsTrigger>
              <TabsTrigger value="month">Last Month</TabsTrigger>
              <TabsTrigger value="quarter">Last Quarter</TabsTrigger>
              <TabsTrigger value="all">All Time</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Completion Rate"
          value={`${completionRate}%`}
          icon={<UsersIcon className="h-5 w-5" />}
          trend={{ value: 5, positive: true }}
        />
        <StatCard
          title="Average Score"
          value={`${averageScore}%`}
          icon={<CheckCircleIcon className="h-5 w-5" />}
          trend={{ value: 2, positive: true }}
        />
        <StatCard
          title="Average Time"
          value={averageTime}
          icon={<ClockIcon className="h-5 w-5" />}
          trend={{ value: 3, positive: false }}
        />
        <StatCard
          title="Failure Rate"
          value={`${failRate}%`}
          icon={<XCircleIcon className="h-5 w-5" />}
          trend={{ value: 2, positive: true }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Over Time */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Performance Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-80" config={{ completion: { color: '#4ade80' }, average: { color: '#60a5fa' } }}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completion" fill="var(--color-completion, #4ade80)" name="Completion %" />
                <Bar dataKey="average" fill="var(--color-average, #60a5fa)" name="Average Score %" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        {/* Completion Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Completion Status</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ChartContainer className="h-80 w-full" config={{}}>
              <PieChart>
                <Pie
                  data={completionStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {completionStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Operator Performance and Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operator Performance Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Top Performer Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="pb-2 font-medium">Operator</th>
                    <th className="pb-2 font-medium">Score</th>
                    <th className="pb-2 font-medium">Attempts</th>
                  </tr>
                </thead>
                <tbody>
                  {operatorPerformanceData.map((operator, i) => (
                    <tr key={i} className="border-b border-gray-100 last:border-0">
                      <td className="py-3">{operator.name}</td>
                      <td className="py-3">{operator.score}%</td>
                      <td className="py-3">{operator.attempts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Activity Feed */}
        <ProjectActivityFeed activities={sampleActivities} />
      </div>
      
      {/* Content Performance */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Content Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <span className="font-medium">QR Marker #1: Machine Operation Basics</span>
                <span className="text-sm">Avg. Score: 86%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '86%' }}></div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <span className="font-medium">QR Marker #2: Safety Procedures</span>
                <span className="text-sm">Avg. Score: 92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <span className="font-medium">QR Marker #3: Maintenance Protocol</span>
                <span className="text-sm">Avg. Score: 74%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '74%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
