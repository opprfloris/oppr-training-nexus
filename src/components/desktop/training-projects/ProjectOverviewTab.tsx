
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

      // Load learners (both operators and managers)
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
          const imageUrl = getImageUrl(floorPlan.file_path);
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
    <div className="space-y-6">
      {/* Project Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Markers"
          value={totalMarkers}
          icon={<CheckCircleIcon className="h-5 w-5" />}
          description="Machine QRs placed"
        />
        <StatCard
          title="Training Content"
          value={totalContent}
          icon={<BookOpenIcon className="h-5 w-5" />}
          description="Definitions assigned"
        />
        <StatCard
          title="Learners"
          value={totalLearners}
          icon={<UserGroupIcon className="h-5 w-5" />}
          description="Assigned to project"
        />
        <StatCard
          title="Readiness"
          value={`${readiness}%`}
          icon={<CheckCircleIcon className="h-5 w-5" />}
          description="Project completion"
        />
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Floor Plan */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Floor Plan & Markers</CardTitle>
          </CardHeader>
          <CardContent>
            {project.floor_plan_image_id && floorPlanUrl ? (
              <div className="space-y-3">
                <div className="aspect-[16/9] rounded-lg overflow-hidden bg-gray-100 relative group">
                  <img 
                    src={floorPlanUrl} 
                    alt="Floor plan"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button variant="secondary" size="sm">
                      <EyeIcon className="w-4 h-4 mr-2" />
                      View Full Size
                    </Button>
                  </div>
                  {/* Marker indicators */}
                  {totalMarkers > 0 && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {totalMarkers} marker{totalMarkers !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{totalMarkers} training markers placed</span>
                  <span>{totalContent} definitions assigned</span>
                </div>
              </div>
            ) : (
              <div className="aspect-[16/9] rounded-lg bg-gray-100 flex flex-col items-center justify-center">
                <BookOpenIcon className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">No floor plan assigned</p>
                <p className="text-xs text-gray-400">Add a floor plan to place training markers</p>
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
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {contents
                  .sort((a, b) => a.sequence_order - b.sequence_order)
                  .map((content) => (
                    <div key={content.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                          {content.sequence_order}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm text-gray-900 truncate">
                            {content.training_definition_version?.training_definition?.title || 'Untitled'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Version {content.training_definition_version?.version_number || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={content.training_definition_version?.status === 'published' ? 'default' : 'secondary'}
                        className="text-xs ml-2 flex-shrink-0"
                      >
                        {content.training_definition_version?.status || 'draft'}
                      </Badge>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpenIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No training definitions assigned</p>
                <p className="text-xs text-gray-400 mt-1">Add content in the Content tab</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Project Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center">
                  <CalendarDaysIcon className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm font-medium">Start Date</span>
                </div>
                <span className="text-sm text-gray-600">{formattedStartDate}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center">
                  <CalendarDaysIcon className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm font-medium">End Date</span>
                </div>
                <span className="text-sm text-gray-600">{formattedEndDate}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm font-medium">Est. Duration</span>
                </div>
                <span className="text-sm text-gray-600">{project.recommended_completion_time || 'Not specified'}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center">
                  <CalendarDaysIcon className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm font-medium">Created</span>
                </div>
                <span className="text-sm text-gray-600">{formattedCreatedDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Training Parameters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Training Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium">Pass Threshold</span>
                <Badge variant="outline">{project.pass_fail_threshold}%</Badge>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium">Max Retakes</span>
                <Badge variant="outline">{project.max_retake_attempts}</Badge>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium">Project Status</span>
                <Badge className={getBadgeColorByStatus(project.status)}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium">Project ID</span>
                <span className="text-sm text-gray-600 font-mono">{project.project_id}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Team Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Team Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Learners ({totalLearners})</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {learners.length > 0 ? learners.map((learner) => (
                  <div key={learner.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <UserGroupIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm font-medium truncate">
                        {learner.operator?.first_name} {learner.operator?.last_name}
                      </span>
                    </div>
                    <Badge className={`text-xs ${getRoleBadgeColor(learner.operator?.role || '')}`}>
                      {learner.operator?.role}
                    </Badge>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 italic">No learners assigned</p>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Collaborators ({totalCollaborators})</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {collaborators.length > 0 ? collaborators.map((collab) => (
                  <div key={collab.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <UserGroupIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm font-medium truncate">
                        {collab.collaborator?.first_name} {collab.collaborator?.last_name}
                      </span>
                    </div>
                    <Badge className={`text-xs ${getRoleBadgeColor(collab.collaborator?.role || '')}`}>
                      {collab.collaborator?.role}
                    </Badge>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 italic">No collaborators assigned</p>
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
    case 'published':
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
