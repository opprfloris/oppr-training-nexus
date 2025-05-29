
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrainingProject, TrainingProjectMarker, TrainingProjectContent, TrainingProjectOperatorAssignment, TrainingProjectCollaborator } from '@/types/training-projects';
import { StatCard } from './StatCard';
import { format } from 'date-fns';
import { useFloorPlans } from '@/hooks/useFloorPlans';
import { CalendarDaysIcon, CheckCircleIcon, ClockIcon, UserGroupIcon, BookOpenIcon } from '@heroicons/react/24/outline';

interface ProjectOverviewTabProps {
  project: TrainingProject;
  markers?: TrainingProjectMarker[];
  contents?: TrainingProjectContent[];
  operators?: TrainingProjectOperatorAssignment[];
  collaborators?: TrainingProjectCollaborator[];
}

export const ProjectOverviewTab: React.FC<ProjectOverviewTabProps> = ({
  project,
  markers = [],
  contents = [],
  operators = [],
  collaborators = []
}) => {
  const { getImageUrl } = useFloorPlans();

  // Calculate project stats
  const totalMarkers = markers.length;
  const totalOperators = operators.length;
  const totalCollaborators = collaborators.length;
  const totalContent = contents.length;
  const readiness = calculateReadiness(project, markers, contents, operators);
  
  // Format dates for display
  const formattedStartDate = project.start_date ? format(new Date(project.start_date), 'MMM d, yyyy') : 'Not scheduled';
  const formattedEndDate = project.end_date ? format(new Date(project.end_date), 'MMM d, yyyy') : 'Not scheduled';
  const formattedCreatedDate = format(new Date(project.created_at), 'MMM d, yyyy');

  return (
    <div className="space-y-8">
      <h3 className="text-lg font-medium">Project Overview</h3>
      
      {/* Project Header Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
              <p className="mt-2 text-gray-600">{project.description || 'No description provided'}</p>
              <div className="mt-4 flex gap-2">
                <Badge className="bg-gray-200 text-gray-800 hover:bg-gray-300">
                  ID: {project.project_id}
                </Badge>
                <Badge className={getBadgeColorByStatus(project.status)}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
              </div>
            </div>
            <div 
              className="h-12 w-12 rounded-md flex items-center justify-center"
              style={{ backgroundColor: project.color_code }}
            >
              <span className="text-white text-xl">{project.icon.charAt(0).toUpperCase()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Stats and Project Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Markers"
          value={totalMarkers}
          icon={<CheckCircleIcon className="h-5 w-5" />}
          description="Machine QRs with training content"
        />
        <StatCard
          title="Total Content"
          value={totalContent}
          icon={<BookOpenIcon className="h-5 w-5" />}
          description="Training definitions assigned"
        />
        <StatCard
          title="Project Readiness"
          value={`${readiness}%`}
          icon={<CheckCircleIcon className="h-5 w-5" />}
          description="Overall project completion status"
        />
      </div>
      
      {/* Project Timeline and Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timeline Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CalendarDaysIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm font-medium">Start Date</span>
                </div>
                <span className="text-sm">{formattedStartDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CalendarDaysIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm font-medium">End Date</span>
                </div>
                <span className="text-sm">{formattedEndDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm font-medium">Recommended Time</span>
                </div>
                <span className="text-sm">{project.recommended_completion_time || 'Not specified'}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CalendarDaysIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm font-medium">Created On</span>
                </div>
                <span className="text-sm">{formattedCreatedDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Training Parameters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Training Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Pass/Fail Threshold</span>
                <span className="text-sm">{project.pass_fail_threshold}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Max Retake Attempts</span>
                <span className="text-sm">{project.max_retake_attempts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Assigned Operators</span>
                <span className="text-sm">{totalOperators}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Collaborators</span>
                <span className="text-sm">{totalCollaborators}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Floor Plan Preview and Team */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Floor Plan */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Floor Plan</CardTitle>
          </CardHeader>
          <CardContent>
            {project.floor_plan_image_id ? (
              <div className="aspect-[16/9] rounded-md overflow-hidden bg-gray-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm text-gray-500">Floor Plan Preview</p>
                </div>
                {/* Floor plan would be displayed here if we had access to the image */}
              </div>
            ) : (
              <div className="aspect-[16/9] rounded-md bg-gray-100 flex items-center justify-center">
                <p className="text-sm text-gray-500">No floor plan assigned</p>
              </div>
            )}
            <p className="mt-2 text-sm text-gray-600">
              {totalMarkers} marker{totalMarkers !== 1 ? 's' : ''} placed on floor plan
            </p>
          </CardContent>
        </Card>
        
        {/* Team */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Operators ({totalOperators})</h4>
                <div className="flex flex-wrap gap-2">
                  {operators.length > 0 ? operators.map((operator, index) => (
                    <Badge key={index} variant="outline" className="flex items-center px-2 py-1">
                      <UserGroupIcon className="h-3 w-3 mr-1" />
                      {operator.operator?.first_name} {operator.operator?.last_name}
                    </Badge>
                  )) : (
                    <p className="text-sm text-gray-500">No operators assigned</p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Collaborators ({totalCollaborators})</h4>
                <div className="flex flex-wrap gap-2">
                  {collaborators.length > 0 ? collaborators.map((collab, index) => (
                    <Badge key={index} variant="outline" className="flex items-center px-2 py-1">
                      <UserGroupIcon className="h-3 w-3 mr-1" />
                      {collab.collaborator?.first_name} {collab.collaborator?.last_name}
                    </Badge>
                  )) : (
                    <p className="text-sm text-gray-500">No collaborators assigned</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper function to calculate project readiness percentage
function calculateReadiness(
  project: TrainingProject,
  markers: TrainingProjectMarker[],
  contents: TrainingProjectContent[],
  operators: TrainingProjectOperatorAssignment[]
): number {
  const checks = [
    project.floor_plan_image_id !== null, // Has floor plan
    markers.length > 0, // Has markers
    contents.length > 0, // Has content
    operators.length > 0, // Has operators
    project.pass_fail_threshold > 0, // Has pass/fail threshold
  ];
  
  const completedChecks = checks.filter(Boolean).length;
  return Math.round((completedChecks / checks.length) * 100);
}

// Helper function to get badge color based on status
function getBadgeColorByStatus(status: string): string {
  switch (status) {
    case 'draft':
      return 'bg-gray-200 text-gray-800 hover:bg-gray-300';
    case 'scheduled':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'active':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'stopped':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    case 'archived':
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    default:
      return 'bg-gray-200 text-gray-800 hover:bg-gray-300';
  }
}
