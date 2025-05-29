
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectHeader } from '@/components/desktop/training-projects/ProjectHeader';
import { ProjectBreadcrumb } from '@/components/desktop/training-projects/ProjectBreadcrumb';
import { FloorPlanMarkerTab } from '@/components/desktop/training-projects/FloorPlanMarkerTab';
import { ContentAssemblyTab } from '@/components/desktop/training-projects/ContentAssemblyTab';
import { UserAccessTab } from '@/components/desktop/training-projects/UserAccessTab';
import { ParametersActivationTab } from '@/components/desktop/training-projects/ParametersActivationTab';
import { ProjectOverviewTab } from '@/components/desktop/training-projects/ProjectOverviewTab';
import { StatisticsTab } from '@/components/desktop/training-projects/StatisticsTab';
import { useToast } from '@/hooks/use-toast';
import { 
  TrainingProject, 
  TrainingProjectMarker, 
  TrainingProjectContent, 
  TrainingProjectOperatorAssignment, 
  TrainingProjectCollaborator,
  mapDatabaseToTrainingProject 
} from '@/types/training-projects';

const TrainingProjectEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [project, setProject] = useState<TrainingProject | null>(null);
  const [markers, setMarkers] = useState<TrainingProjectMarker[]>([]);
  const [content, setContent] = useState<TrainingProjectContent[]>([]);
  const [operators, setOperators] = useState<TrainingProjectOperatorAssignment[]>([]);
  const [collaborators, setCollaborators] = useState<TrainingProjectCollaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      fetchProjectData();
    }
  }, [id]);

  const fetchProjectData = async () => {
    if (!id) return;

    setLoading(true);
    try {
      // Fetch project data
      const { data: projectData, error: projectError } = await supabase
        .from('training_projects')
        .select('*')
        .eq('id', id)
        .single();

      if (projectError) throw projectError;
      if (projectData) {
        setProject(mapDatabaseToTrainingProject(projectData));
      }

      // Fetch markers with machine data
      const { data: markersData, error: markersError } = await supabase
        .from('training_project_markers')
        .select(`
          *,
          machine_qr_entity:machine_qr_entities(*)
        `)
        .eq('training_project_id', id)
        .order('sequence_order', { ascending: true });

      if (markersError) throw markersError;
      setMarkers(markersData || []);

      // Fetch content with training definition data
      const { data: contentData, error: contentError } = await supabase
        .from('training_project_content')
        .select(`
          *,
          training_definition_version:training_definition_versions(
            id,
            version_number,
            status,
            training_definition:training_definitions(title)
          )
        `)
        .eq('training_project_id', id)
        .order('sequence_order', { ascending: true });

      if (contentError) throw contentError;
      setContent(contentData || []);

      // Fetch operators with profile data - fix the ambiguous relationship
      const { data: operatorsData, error: operatorsError } = await supabase
        .from('training_project_operator_assignments')
        .select(`
          *,
          operator:profiles!training_project_operator_assignments_operator_id_fkey(
            first_name,
            last_name,
            email,
            department
          )
        `)
        .eq('training_project_id', id);

      if (operatorsError) throw operatorsError;
      setOperators(operatorsData || []);

      // Fetch collaborators with profile data - fix the ambiguous relationship
      const { data: collaboratorsData, error: collaboratorsError } = await supabase
        .from('training_project_collaborators')
        .select(`
          *,
          collaborator:profiles!training_project_collaborators_collaborator_id_fkey(
            first_name,
            last_name,
            email,
            department
          )
        `)
        .eq('training_project_id', id);

      if (collaboratorsError) throw collaboratorsError;
      setCollaborators(collaboratorsData || []);

    } catch (error) {
      console.error('Error fetching project data:', error);
      toast({
        title: "Error",
        description: "Failed to load project data. Please try again.",
        variant: "destructive",
      });
      navigate('/desktop/training-projects');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectUpdate = (updatedProject: TrainingProject) => {
    setProject(updatedProject);
  };

  const handleMarkersUpdate = (updatedMarkers: TrainingProjectMarker[]) => {
    setMarkers(updatedMarkers);
  };

  const handleContentUpdate = (updatedContent: TrainingProjectContent[]) => {
    setContent(updatedContent);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-oppr-blue"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Project Not Found</h3>
          <p className="text-gray-500">The requested project could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <ProjectBreadcrumb projectName={project.name} />
      
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-shrink-0">
          <ProjectHeader project={project} onProjectUpdate={handleProjectUpdate} />
        </div>

        <div className="flex-1 overflow-hidden">
          <Card className="h-full">
            <CardContent className="p-0 h-full">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <div className="flex-shrink-0 px-6 pt-4">
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="floor-plan">Floor Plan & Markers</TabsTrigger>
                    <TabsTrigger value="content">Content Assembly</TabsTrigger>
                    <TabsTrigger value="user-access">User Access</TabsTrigger>
                    <TabsTrigger value="parameters">Parameters & Activation</TabsTrigger>
                    <TabsTrigger value="statistics">Statistics</TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-auto px-6 pb-6">
                  <TabsContent value="overview" className="mt-4 h-full">
                    <ProjectOverviewTab 
                      project={project}
                      markers={markers}
                      content={content}
                      operators={operators}
                      collaborators={collaborators}
                    />
                  </TabsContent>

                  <TabsContent value="floor-plan" className="mt-4 h-full">
                    <FloorPlanMarkerTab
                      projectId={project.id}
                      markers={markers}
                      onMarkersUpdate={handleMarkersUpdate}
                    />
                  </TabsContent>

                  <TabsContent value="content" className="mt-4 h-full">
                    <ContentAssemblyTab
                      projectId={project.id}
                      markers={markers}
                      content={content}
                      onContentUpdate={handleContentUpdate}
                    />
                  </TabsContent>

                  <TabsContent value="user-access" className="mt-4 h-full">
                    <UserAccessTab
                      projectId={project.id}
                      operators={operators}
                      collaborators={collaborators}
                    />
                  </TabsContent>

                  <TabsContent value="parameters" className="mt-4 h-full">
                    <ParametersActivationTab
                      project={project}
                      onProjectUpdate={handleProjectUpdate}
                    />
                  </TabsContent>

                  <TabsContent value="statistics" className="mt-4 h-full">
                    <StatisticsTab projectId={project.id} />
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrainingProjectEditor;
