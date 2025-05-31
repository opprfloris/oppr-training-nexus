
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import type { TrainingProject } from '@/types/training-projects';
import { ClockIcon, UserIcon, TrophyIcon, ArrowTrendingUpIcon, PlayIcon, StopIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface StatisticsTabProps {
  project: TrainingProject;
}

interface ProjectStats {
  totalLearners: number;
  completedLearners: number;
  averageScore: number;
  totalMarkers: number;
  totalContent: number;
  activationHistory: ActivityItem[];
  progressData: ProgressData[];
}

interface ActivityItem {
  id: string;
  type: 'activation' | 'stop' | 'assignment' | 'completion' | 'content_change';
  description: string;
  timestamp: string;
  user?: string;
  details?: any;
}

interface ProgressData {
  learnerId: string;
  learnerName: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  score?: number;
  lastActivity: string;
}

export const StatisticsTab: React.FC<StatisticsTabProps> = ({ project }) => {
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjectStatistics();
  }, [project.id]);

  const loadProjectStatistics = async () => {
    try {
      setLoading(true);

      // Load learner assignments
      const { data: learners } = await supabase
        .from('training_project_operator_assignments')
        .select(`
          *,
          operator:profiles!operator_id(
            first_name,
            last_name,
            email,
            role
          )
        `)
        .eq('training_project_id', project.id);

      // Load training progress
      const { data: progress } = await supabase
        .from('operator_training_progress')
        .select('*')
        .eq('training_project_id', project.id);

      // Load markers
      const { data: markers } = await supabase
        .from('training_project_markers')
        .select('id')
        .eq('training_project_id', project.id);

      // Load content
      const { data: content } = await supabase
        .from('training_project_content')
        .select('id')
        .eq('training_project_id', project.id);

      // Calculate statistics
      const totalLearners = learners?.length || 0;
      const completedLearners = progress?.filter(p => p.status === 'completed').length || 0;
      const averageScore = progress?.length > 0 
        ? Math.round(progress.reduce((sum, p) => sum + (p.score || 0), 0) / progress.length)
        : 0;

      // Generate progress data
      const progressData: ProgressData[] = (learners || []).map(learner => {
        const learnerProgress = progress?.find(p => p.operator_id === learner.operator_id);
        return {
          learnerId: learner.operator_id,
          learnerName: `${learner.operator?.first_name} ${learner.operator?.last_name}`,
          status: learnerProgress?.status || 'not_started',
          progress: learnerProgress?.progress_percentage || 0,
          score: learnerProgress?.score || undefined,
          lastActivity: learnerProgress?.last_attempt_at || learner.assigned_at
        };
      });

      // Generate mock activity history (in real app, this would come from audit logs)
      const activationHistory: ActivityItem[] = [
        {
          id: '1',
          type: 'activation',
          description: `Project created in ${project.status} status`,
          timestamp: project.created_at,
          user: 'Project Creator'
        },
        ...(project.status === 'active' ? [{
          id: '2',
          type: 'activation' as const,
          description: 'Project activated',
          timestamp: new Date().toISOString(),
          user: 'Training Manager'
        }] : []),
        ...(project.status === 'stopped' ? [{
          id: '3',
          type: 'stop' as const,
          description: 'Project stopped',
          timestamp: new Date().toISOString(),
          user: 'Training Manager'
        }] : [])
      ];

      setStats({
        totalLearners,
        completedLearners,
        averageScore,
        totalMarkers: markers?.length || 0,
        totalContent: content?.length || 0,
        activationHistory,
        progressData
      });

    } catch (error) {
      console.error('Error loading project statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <ClockIcon className="w-4 h-4 text-blue-600" />;
      case 'failed':
        return <StopIcon className="w-4 h-4 text-red-600" />;
      default:
        return <PlayIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'activation':
        return <PlayIcon className="w-4 h-4 text-green-600" />;
      case 'stop':
        return <StopIcon className="w-4 h-4 text-red-600" />;
      case 'assignment':
        return <UserIcon className="w-4 h-4 text-blue-600" />;
      case 'completion':
        return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
      default:
        return <ClockIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Unable to load project statistics</p>
      </div>
    );
  }

  const completionRate = stats.totalLearners > 0 
    ? Math.round((stats.completedLearners / stats.totalLearners) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Project Statistics</h3>
        <p className="text-gray-600">
          Real-time analytics and performance metrics for your training project.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <UserIcon className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Learners</p>
                <p className="text-2xl font-bold">{stats.totalLearners}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrophyIcon className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold">{completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <ArrowTrendingUpIcon className="w-5 h-5 text-purple-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold">{stats.averageScore}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="w-5 h-5 text-indigo-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-600">Training Steps</p>
                <p className="text-2xl font-bold">{stats.totalContent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Completion Rate</span>
                <span>{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Completed</p>
                <p className="font-semibold text-green-600">{stats.completedLearners}</p>
              </div>
              <div>
                <p className="text-gray-600">Remaining</p>
                <p className="font-semibold text-gray-800">{stats.totalLearners - stats.completedLearners}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Project Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {stats.activationHistory.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="flex-shrink-0 mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                      {activity.user && ` • ${activity.user}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learner Progress Detail */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Learner Progress Detail</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.progressData.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {stats.progressData.map((learner) => (
                <div key={learner.learnerId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1">
                    {getStatusIcon(learner.status)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{learner.learnerName}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex-1">
                          <Progress value={learner.progress} className="h-1.5" />
                        </div>
                        <span className="text-xs text-gray-500">{learner.progress}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {learner.score !== undefined && (
                      <span className="text-sm font-medium text-gray-700">{learner.score}%</span>
                    )}
                    <Badge className={`text-xs ${getStatusColor(learner.status)}`}>
                      {learner.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <UserIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No learner progress data available</p>
              <p className="text-xs text-gray-400 mt-1">Progress will appear once learners start training</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
