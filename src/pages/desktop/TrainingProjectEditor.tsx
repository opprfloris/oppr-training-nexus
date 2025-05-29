
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TrainingProject, TrainingProjectMarker, mapDatabaseToTrainingProject, TrainingProjectContent, TrainingProjectOperatorAssignment, TrainingProjectCollaborator } from '@/types/training-projects';
import { ProjectBreadcrumb } from '@/components/desktop/training-projects/ProjectBreadcrumb';
import { ProjectHeader } from '@/components/desktop/training-projects/ProjectHeader';
import { ProjectOverviewTab } from '@/components/desktop/training-projects/ProjectOverviewTab';
import { FloorPlanMarkerTab } from '@/components/desktop/training-projects/FloorPlanMarkerTab';
import { ContentAssemblyTab } from '@/components/desktop/training-projects/ContentAssemblyTab';
import { UserAccessTab } from '@/components/desktop/training-projects/UserAccessTab';
import { ParametersActivationTab } from '@/components/desktop/training-projects/ParametersActivationTab';
import { StatisticsTab } from '@/components/desktop/training-projects/StatisticsTab';

const TrainingProjectEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<TrainingProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [markers, setMarkers] = useState<TrainingProjectMarker[]>([]);
  const [contents, setContents] = useState<TrainingProjectContent[]>([]);
  const [operators, setOperators] = useState<TrainingProjectOperatorAssignment[]>([]);
  const [collaborators, setCollaborators] = useState<TrainingProjectCollaborator[]>([]);

  useEffect(() => {
    if (id) {
      loadProject();
      loadMarkers();
      loadContents();
      loadOperators();
      loadCollaborators();
    }
  }, [id]);

  const loadProject = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('training_projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      const mappedProject = mapDatabaseToTrainingProject(data);
      setProject(mappedProject);
    } catch (error) {
      console.error('Error loading training project:', error);
      toast({
        title: "Error",
        description: "Failed to load training project",
        variant: "destructive"
      });
      navigate('/desktop/training-projects');
    } finally {
      setLoading(false);
    }
  };

  const loadMarkers = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('training_project_markers')
        .select(`
          *,
          machine_qr_entity:machine_qr_entities(*)
        `)
        .eq('training_project_id', id)
        .order('sequence_order', { ascending: true });

      if (error) throw error;
      setMarkers(data || []);
    } catch (error) {
      console.error('Error loading markers:', error);
    }
  };

  const loadContents = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
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
        .eq('training_project_id', id);

      if (error) throw error;
      setContents(data || []);
    } catch (error) {
      console.error('Error loading contents:', error);
    }
  };

  const loadOperators = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('training_project_operator_assignments')
        .select(`
          *,
          operator:profiles(
            first_name,
            last_name,
            email,
            department
          )
        `)
        .eq('training_project_id', id);

      if (error) throw error;
      setOperators(data || []);
    } catch (error) {
      console.error('Error loading operators:', error);
    }
  };

  const loadCollaborators = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('training_project_collaborators')
        .select(`
          *,
          collaborator:profiles(
            first_name,
            last_name,
            email,
            department
          )
        `)
        .eq('training_project_id', id);

      if (error) throw error;
      setCollaborators(data || []);
    } catch (error) {
      console.error('Error loading collaborators:', error);
    }
  };

  const handleSave = async () => {
    if (!project) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('training_projects')
        .update({
          name: project.name,
          description: project.description,
          color_code: project.color_code,
          icon: project.icon,
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Training project saved successfully",
      });
    } catch (error) {
      console.error('Error saving training project:', error);
      toast({
        title: "Error",
        description: "Failed to save training project",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFloorPlanSelect = async (floorPlanId: string) => {
    if (!project) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('training_projects')
        .update({
          floor_plan_image_id: floorPlanId,
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id);

      if (error) throw error;

      setProject({ ...project, floor_plan_image_id: floorPlanId });
      
      toast({
        title: "Success",
        description: "Floor plan selected successfully",
      });
    } catch (error) {
      console.error('Error selecting floor plan:', error);
      toast({
        title: "Error",
        description: "Failed to select floor plan",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleProjectUpdate = async (updates: Partial<TrainingProject>) => {
    if (!project) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('training_projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id);

      if (error) throw error;

      setProject({ ...project, ...updates });
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Training project not found</p>
        <Button 
          variant="outline" 
          onClick={() => navigate('/desktop/training-projects')}
          className="mt-4"
        >
          Back to Training Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <ProjectBreadcrumb projectId={project.project_id} activeTab={activeTab} />
      
      <ProjectHeader project={project} saving={saving} onSave={handleSave} />

      <div className="oppr-card">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b px-8">
            <TabsList className="grid w-full grid-cols-6 bg-transparent h-auto p-0">
              <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-oppr-blue rounded-none pb-4">
                Overview
              </TabsTrigger>
              <TabsTrigger value="floor-plan" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-oppr-blue rounded-none pb-4">
                Floor Plan & Markers
              </TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-oppr-blue rounded-none pb-4">
                Content Assembly
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-oppr-blue rounded-none pb-4">
                User Access
              </TabsTrigger>
              <TabsTrigger value="parameters" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-oppr-blue rounded-none pb-4">
                Parameters & Activation
              </TabsTrigger>
              <TabsTrigger value="statistics" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-oppr-blue rounded-none pb-4">
                Statistics
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-0 p-8">
            <ProjectOverviewTab 
              project={project}
              markers={markers}
              contents={contents}
              operators={operators}
              collaborators={collaborators}
            />
          </TabsContent>

          <TabsContent value="floor-plan" className="mt-0 p-8">
            <FloorPlanMarkerTab
              project={project}
              markers={markers}
              onFloorPlanSelect={handleFloorPlanSelect}
              onMarkersChange={loadMarkers}
              saving={saving}
            />
          </TabsContent>

          <TabsContent value="content" className="mt-0 p-8">
            <ContentAssemblyTab
              project={project}
              markers={markers}
              onContentChange={loadContents}
            />
          </TabsContent>

          <TabsContent value="users" className="mt-0 p-8">
            <UserAccessTab
              project={project}
              onAccessChange={() => {
                loadOperators();
                loadCollaborators();
              }}
            />
          </TabsContent>

          <TabsContent value="parameters" className="mt-0 p-8">
            <ParametersActivationTab
              project={project}
              onProjectUpdate={handleProjectUpdate}
              saving={saving}
            />
          </TabsContent>

          <TabsContent value="statistics" className="mt-0 p-8">
            <StatisticsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TrainingProjectEditor;
