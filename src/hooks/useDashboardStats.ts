
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  activeProjects: number;
  totalOperators: number;
  trainingDefinitions: number;
  machineEntities: number;
  opprDocs: number;
  recentActivities: RecentActivity[];
}

interface RecentActivity {
  id: string;
  type: 'project' | 'definition' | 'document' | 'machine';
  title: string;
  description: string;
  timestamp: string;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 0,
    totalOperators: 0,
    trainingDefinitions: 0,
    machineEntities: 0,
    opprDocs: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Fetch active training projects
      const { data: projects, error: projectsError } = await supabase
        .from('training_projects')
        .select('*')
        .eq('status', 'active');

      if (projectsError) throw projectsError;

      // Fetch total operators (users with role 'Operator')
      const { data: operators, error: operatorsError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'Operator');

      if (operatorsError) throw operatorsError;

      // Fetch training definitions
      const { data: definitions, error: definitionsError } = await supabase
        .from('training_definitions')
        .select('*');

      if (definitionsError) throw definitionsError;

      // Fetch machine QR entities
      const { data: machines, error: machinesError } = await supabase
        .from('machine_qr_entities')
        .select('*');

      if (machinesError) throw machinesError;

      // Fetch Oppr Docs
      const { data: docs, error: docsError } = await supabase
        .from('documents')
        .select('*');

      if (docsError) throw docsError;

      // Fetch recent activities (last 10 items across all types)
      const recentActivities: RecentActivity[] = [];

      // Recent projects
      const { data: recentProjects } = await supabase
        .from('training_projects')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (recentProjects) {
        recentProjects.forEach(project => {
          recentActivities.push({
            id: project.id,
            type: 'project',
            title: `New Training Project: ${project.name}`,
            description: `Project "${project.name}" was created`,
            timestamp: project.created_at
          });
        });
      }

      // Recent training definitions
      const { data: recentDefinitions } = await supabase
        .from('training_definitions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (recentDefinitions) {
        recentDefinitions.forEach(definition => {
          recentActivities.push({
            id: definition.id,
            type: 'definition',
            title: `New Training Definition: ${definition.title}`,
            description: `Training definition "${definition.title}" was created`,
            timestamp: definition.created_at
          });
        });
      }

      // Recent documents
      const { data: recentDocs } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(2);

      if (recentDocs) {
        recentDocs.forEach(doc => {
          recentActivities.push({
            id: doc.id,
            type: 'document',
            title: `New Document: ${doc.display_name}`,
            description: `Document "${doc.display_name}" was uploaded`,
            timestamp: doc.created_at
          });
        });
      }

      // Recent machines
      const { data: recentMachines } = await supabase
        .from('machine_qr_entities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(2);

      if (recentMachines) {
        recentMachines.forEach(machine => {
          recentActivities.push({
            id: machine.id,
            type: 'machine',
            title: `New Machine: ${machine.qr_name}`,
            description: `Machine "${machine.qr_name}" was registered`,
            timestamp: machine.created_at
          });
        });
      }

      // Sort activities by timestamp
      recentActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setStats({
        activeProjects: projects?.length || 0,
        totalOperators: operators?.length || 0,
        trainingDefinitions: definitions?.length || 0,
        machineEntities: machines?.length || 0,
        opprDocs: docs?.length || 0,
        recentActivities: recentActivities.slice(0, 10)
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return {
    stats,
    loading,
    refetch: fetchDashboardStats
  };
};
