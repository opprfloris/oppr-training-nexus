
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrainingProject, TrainingProjectMarker, TrainingProjectContent, TrainingProjectOperatorAssignment, TrainingProjectCollaborator } from '@/types/training-projects';
import { StatCard } from './StatCard';
import { format } from 'date-fns';
import { useFloorPlans } from '@/hooks/useFloorPlans';
import { supabase } from '@/integrations/supabase/client';
import { CalendarDaysIcon, CheckCircleIcon, ClockIcon, UserGroupIcon, BookOpenIcon, EyeIcon } from '@heroicons/react/24/outline';

interface ProjectOverviewTabProps {
  project: TrainingProject;
}

export const ProjectOverviewTab: React.FC<ProjectOverviewTabProps> = ({
  project
}) => {
  const { getImageUrl } = useFloorPlans();
  const [markers, setMarkers] = useState<TrainingProjectMarker[]>([]);
  const [contents, setContents] = useState<TrainingProjectContent[]>([]);
  const [learners, setLearners] = useState<TrainingProjectOperatorAssignment[]>([]);
  const [collaborators, setCollaborators] = useState<TrainingProjectCollaborator[]>([]);
  const [floorPlanUrl, setFloorPlanUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjectData();
  }, [project.id]);

  const loadProjectData = async () => {
    try {
      // Load markers
      const { data: markersData } = await supabase
        .from('training_project_markers')
        .select(`
          *,
          machine_qr_entity:machine_qr_entities(
            machine_id,
            qr_identifier,
            qr_name,
            machine_type,
            brand,
            location_description
          )
        `)
        .eq('training_project_id', project.id);

      // Load content
      const { data: contentData } = await supabase
        .from('training_project_content')
        .select(`
          *,
          training_definition_version:training_definition_versions(
            id,
            version_number,
            status,
            training_definition:training_definitions(
              title
            )
          )
        `)
        .eq('training_project_id', project.id);

      // Load learners
      const { data: learnersData } = await supabase
        .from('training_project_operator_assignments')
        .select(`
          *,
          operator:profiles!operator_id(
            first_name,
            last_name,
            email,
            department,
            role
          )
        `)
        .eq('training_project_id', project.id);

      // Load collaborators
      const { data: collaboratorsData } = await supabase
        .from('training_project_collaborators')
        .select(`
          *,
          collaborator:profiles!collaborator_id(
            first_name,
            last_name,
            email,
            department,
            role
          )
        `)
        .eq('training_project_id', project.id);

      setMarkers(markersData || []);
      setContents(contentData || []);
      setLearners(learnersData || []);
      setCollaborators(collaboratorsData || []);

      // Load floor plan image
      if (project.floor_plan_image_id) {
        const { data: floorPlan } = await supabase
          .from('floor_plan_images')
          .select('*')
          .eq('id', project.floor_plan_image_id)
          .single();
        
        if (floorPlan) {
          const imageUrl = getImageUrl(floorPlan);
          setFloorPlanUrl(imageUrl);
        }
      }
    } catch (error) {
      console.error('Error loading project data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate project stats
  const totalMarkers = markers.length;
  const totalLearners = learners.length;
  const totalCollaborators = collaborators.length;
  const totalContent = contents.length;
  const readiness = calculateReadiness(project, markers, contents, learners);
  
  // Format dates for display
  const formattedStartDate = project.start_date ? format(new Date(project.start_date), 'MMM d, yyyy') : 'Not scheduled';
  const formattedEndDate = project.end_date ? format(new Date(project.end_date), 'MMM d, yyyy') : 'Not scheduled';
  const formattedCreatedDate = format(new Date(project.created_at), 'MMM d, yyyy');

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Manager':
        return 'bg-purple-100 text-purple-800';
      case 'Operator':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
      
      {/* Floor Plan and Training Definitions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Floor Plan */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Floor Plan</CardTitle>
          </CardHeader>
          <CardContent>
            {project.floor_plan_image_id && floorPlanUrl ? (
              <div className="space-y-3">
                <div className="aspect-[16/9] rounded-md overflow-hidden bg-gray-100 relative">
                  <img 
                    src={floorPlanUrl} 
                    alt="Floor plan"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                    <Button variant="secondary" size="sm">
                      <EyeIcon className="w-4 h-4 mr-2" />
                      View Full Size
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {totalMarkers} marker{totalMarkers !== 1 ? 's' : ''} placed on floor plan
                </p>
              </div>
            ) : (
              <div className="aspect-[16/9] rounded-md bg-gray-100 flex items-center justify-center">
                <p className="text-sm text-gray-500">No floor plan assigned</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Training Definitions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Training Definitions</CardTitle>
          </CardHeader>
          <CardContent>
            {contents.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {contents
                  .sort((a, b) => a.sequence_order - b.sequence_order)
                  .map((content, index) => (
                    <div key={content.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                          {content.sequence_order}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 truncate">
                            {content.training_definition_version?.training_definition?.title || 'Untitled'}
                          </p>
                          <p className="text-xs text-gray-500">
                            v{content.training_definition_version?.version_number || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={content.training_definition_version?.status === 'published' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {content.training_definition_version?.status || 'N/A'}
                      </Badge>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpenIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No training definitions assigned</p>
              </div>
            )}
          </CardContent>
        </Card>
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
                <span className="text-sm font-medium">Assigned Learners</span>
                <span className="text-sm">{totalLearners}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Collaborators</span>
                <span className="text-sm">{totalCollaborators}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Team */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Learners ({totalLearners})</h4>
              <div className="flex flex-wrap gap-2">
                {learners.length > 0 ? learners.map((learner, index) => (
                  <div key={index} className="flex items-center space-x-1">
                    <Badge variant="outline" className="flex items-center px-2 py-1">
                      <UserGroupIcon className="h-3 w-3 mr-1" />
                      {learner.operator?.first_name} {learner.operator?.last_name}
                    </Badge>
                    <Badge className={`text-xs ${getRoleBadgeColor(learner.operator?.role || '')}`}>
                      {learner.operator?.role}
                    </Badge>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500">No learners assigned</p>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Collaborators ({totalCollaborators})</h4>
              <div className="flex flex-wrap gap-2">
                {collaborators.length > 0 ? collaborators.map((collab, index) => (
                  <div key={index} className="flex items-center space-x-1">
                    <Badge variant="outline" className="flex items-center px-2 py-1">
                      <UserGroupIcon className="h-3 w-3 mr-1" />
                      {collab.collaborator?.first_name} {collab.collaborator?.last_name}
                    </Badge>
                    <Badge className={`text-xs ${getRoleBadgeColor(collab.collaborator?.role || '')}`}>
                      {collab.collaborator?.role}
                    </Badge>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500">No collaborators assigned</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to calculate project readiness percentage
function calculateReadiness(
  project: TrainingProject,
  markers: TrainingProjectMarker[],
  contents: TrainingProjectContent[],
  learners: TrainingProjectOperatorAssignment[]
): number {
  const checks = [
    project.floor_plan_image_id !== null, // Has floor plan
    markers.length > 0, // Has markers
    contents.length > 0, // Has content
    learners.length > 0, // Has learners (operators or managers)
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
