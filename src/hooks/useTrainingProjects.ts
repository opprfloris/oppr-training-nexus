
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TrainingProject, mapDatabaseToTrainingProject } from '@/types/training-projects';

export const useTrainingProjects = () => {
  const [projects, setProjects] = useState<TrainingProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('training_projects')
        .select(`
          *,
          profiles:created_by (
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map database response to our TypeScript interface
      const mappedProjects = (data || []).map(mapDatabaseToTrainingProject);
      setProjects(mappedProjects);
    } catch (error) {
      console.error('Error fetching training projects:', error);
      toast({
        title: "Error",
        description: "Failed to load training projects",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (name: string, description?: string): Promise<void> => {
    try {
      const { data: projectId } = await supabase.rpc('generate_project_id', { prefix: 'AMS' });
      
      const { data, error } = await supabase
        .from('training_projects')
        .insert({
          project_id: projectId,
          name,
          description: description || null,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Training project created successfully",
      });

      await fetchProjects();
    } catch (error) {
      console.error('Error creating training project:', error);
      toast({
        title: "Error",
        description: "Failed to create training project",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('training_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Training project deleted successfully",
      });

      await fetchProjects();
    } catch (error) {
      console.error('Error deleting training project:', error);
      toast({
        title: "Error",
        description: "Failed to delete training project",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    fetchProjects,
    createProject,
    deleteProject
  };
};
