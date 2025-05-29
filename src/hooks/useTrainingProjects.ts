
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
      
      // Debug: Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('🔍 DEBUG: Current user:', user?.id || 'NOT AUTHENTICATED');
      if (authError) {
        console.error('🚨 DEBUG: Auth error:', authError);
      }

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

      if (error) {
        console.error('🚨 DEBUG: Fetch error:', error);
        throw error;
      }
      
      console.log('✅ DEBUG: Fetched projects:', data?.length || 0);
      
      // Map database response to our TypeScript interface
      const mappedProjects = (data || []).map(mapDatabaseToTrainingProject);
      setProjects(mappedProjects);
    } catch (error) {
      console.error('🚨 DEBUG: Error fetching training projects:', error);
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
      console.log('🔍 DEBUG: Starting project creation...');
      
      // Step 1: Check authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('🔍 DEBUG: Auth check - User ID:', user?.id || 'NOT AUTHENTICATED');
      
      if (authError) {
        console.error('🚨 DEBUG: Auth error:', authError);
        throw new Error('Authentication error: ' + authError.message);
      }
      
      if (!user) {
        console.error('🚨 DEBUG: No authenticated user found');
        throw new Error('You must be logged in to create a training project');
      }

      // Step 2: Test the generate_project_id function
      console.log('🔍 DEBUG: Calling generate_project_id function...');
      const { data: projectId, error: rpcError } = await supabase.rpc('generate_project_id', { prefix: 'AMS' });
      
      if (rpcError) {
        console.error('🚨 DEBUG: RPC error:', rpcError);
        throw new Error('Failed to generate project ID: ' + rpcError.message);
      }
      
      console.log('✅ DEBUG: Generated project ID:', projectId);

      // Step 3: Insert the project
      console.log('🔍 DEBUG: Inserting project with data:', {
        project_id: projectId,
        name,
        description: description || null,
        created_by: user.id
      });

      const { data, error } = await supabase
        .from('training_projects')
        .insert({
          project_id: projectId,
          name,
          description: description || null,
          created_by: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('🚨 DEBUG: Insert error:', error);
        console.error('🚨 DEBUG: Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('✅ DEBUG: Project created successfully:', data);

      toast({
        title: "Success",
        description: "Training project created successfully",
      });

      await fetchProjects();
    } catch (error: any) {
      console.error('🚨 DEBUG: Error creating training project:', error);
      
      // Provide more specific error messages
      let errorMessage = "Failed to create training project";
      
      if (error.message?.includes('authentication')) {
        errorMessage = "Please log in to create a training project";
      } else if (error.message?.includes('project_id')) {
        errorMessage = "Failed to generate project ID. Please try again.";
      } else if (error.code === '23505') {
        errorMessage = "A project with this ID already exists. Please try again.";
      } else if (error.code === '42501') {
        errorMessage = "You don't have permission to create projects. Please check your login.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      console.log('🔍 DEBUG: Deleting project:', id);
      
      const { error } = await supabase
        .from('training_projects')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('🚨 DEBUG: Delete error:', error);
        throw error;
      }

      console.log('✅ DEBUG: Project deleted successfully');

      toast({
        title: "Success",
        description: "Training project deleted successfully",
      });

      await fetchProjects();
    } catch (error) {
      console.error('🚨 DEBUG: Error deleting training project:', error);
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
