
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ProjectBreadcrumb } from '@/components/desktop/training-projects/ProjectBreadcrumb';
import { ProjectHeader } from '@/components/desktop/training-projects/ProjectHeader';
import { ProjectOverviewTab } from '@/components/desktop/training-projects/ProjectOverviewTab';
import { FloorPlanMarkerTab } from '@/components/desktop/training-projects/FloorPlanMarkerTab';
import { ContentAssemblyTab } from '@/components/desktop/training-projects/ContentAssemblyTab';
import { UserAccessTab } from '@/components/desktop/training-projects/UserAccessTab';
import { ParametersActivationTab } from '@/components/desktop/training-projects/ParametersActivationTab';
import { StatisticsTab } from '@/components/desktop/training-projects/StatisticsTab';
import { supabase } from '@/integrations/supabase/client';
import type { TrainingProject, TrainingProjectMarker } from '@/types/training-projects';

const TrainingProjectEditor = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<TrainingProject | null>(null);
  const [markers, setMarkers] = useState<TrainingProjectMarker[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProject(id);
      fetchMarkers(id);
    }
  }, [id]);

  const fetchProject = async (projectId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('training_projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) {
        console.error('Error fetching project:', error);
        return;
      }

      // Ensure status is properly typed
      const typedProject: TrainingProject = {
        ...data,
        status: data.status as 'draft' | 'scheduled' | 'active' | 'stopped' | 'archived'
      };

      setProject(typedProject);
    } finally {
      setLoading(false);
    }
  };

  const fetchMarkers = async (projectId: string) => {
    try {
      const { data, error } = await supabase
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
        .eq('training_project_id', projectId);

      if (error) {
        console.error('Error fetching markers:', error);
        return;
      }

      setMarkers(data || []);
    } catch (error) {
      console.error('Error fetching training project markers:', error);
    }
  };

  const handleSave = async (updatedProject: TrainingProject) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('training_projects')
        .update(updatedProject)
        .eq('id', updatedProject.id);

      if (error) {
        console.error('Error updating project:', error);
      } else {
        setProject(updatedProject);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleProjectUpdate = (updatedProject: TrainingProject) => {
    setProject(updatedProject);
  };

  const handleFloorPlanSelect = async (floorPlanId: string) => {
    if (!project) return;
    
    const updatedProject = { ...project, floor_plan_image_id: floorPlanId };
    await handleSave(updatedProject);
  };

  const handleMarkersChange = () => {
    if (project?.id) {
      fetchMarkers(project.id);
    }
  };

  const handleContentChange = () => {
    // Refresh content when needed
    console.log('Content changed');
  };

  const handleAccessChange = () => {
    // Refresh access when needed
    console.log('Access changed');
  };

  const handleParametersUpdate = async (updates: Partial<TrainingProject>) => {
    if (!project) return;
    
    const updatedProject = { ...project, ...updates };
    await handleSave(updatedProject);
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
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Project not found</h2>
        <p className="text-gray-600">The training project you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <ProjectBreadcrumb 
        projectId={project.id} 
        activeTab={activeTab}
      />
      
      <div className="flex-1 overflow-hidden">
        <ProjectHeader 
          project={project}
          saving={saving}
          onSave={handleSave}
        />
        
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="floor-plan">Floor Plan</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="parameters">Parameters</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <ProjectOverviewTab project={project} />
            </TabsContent>

            <TabsContent value="floor-plan" className="mt-6">
              <FloorPlanMarkerTab 
                project={project}
                markers={markers}
                onFloorPlanSelect={handleFloorPlanSelect}
                onMarkersChange={handleMarkersChange}
                saving={saving}
              />
            </TabsContent>

            <TabsContent value="content" className="mt-6">
              <ContentAssemblyTab 
                project={project}
                markers={markers}
                onContentChange={handleContentChange}
              />
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <UserAccessTab 
                project={project}
                onAccessChange={handleAccessChange}
              />
            </TabsContent>

            <TabsContent value="parameters" className="mt-6">
              <ParametersActivationTab 
                project={project}
                saving={saving}
                onProjectUpdate={handleParametersUpdate}
              />
            </TabsContent>

            <TabsContent value="statistics" className="mt-6">
              <StatisticsTab project={project} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TrainingProjectEditor;
