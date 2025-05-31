
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export interface SkillsMatrixOperator {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  department: string | null;
  role: string;
  avatar_url: string | null;
}

export interface SkillsMatrixTrainingProject {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
}

export interface SkillsMatrixProgress {
  operator_id: string;
  training_project_id: string;
  status: 'not_started' | 'in_progress' | 'passed' | 'failed' | 'expired';
  score: number | null;
  progress_percentage: number;
  attempt_count: number;
  max_attempts: number | null;
  completed_at: string | null;
  last_attempt_at: string | null;
}

export interface SkillsMatrixFilters {
  department?: string;
  role?: string;
  trainingProject?: string;
  status?: string;
  search?: string;
}

export const skillsMatrixService = {
  async getOperators(filters: SkillsMatrixFilters = {}) {
    let query = supabase
      .from('profiles')
      .select('id, first_name, last_name, email, department, role, avatar_url')
      .order('last_name', { ascending: true });

    if (filters.department && filters.department !== 'all') {
      query = query.eq('department', filters.department);
    }

    if (filters.role && filters.role !== 'all') {
      query = query.eq('role', filters.role);
    }

    if (filters.search) {
      query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data as SkillsMatrixOperator[];
  },

  async getTrainingProjects(filters: SkillsMatrixFilters = {}) {
    let query = supabase
      .from('training_projects')
      .select('id, project_id, name, description')
      .order('name', { ascending: true });

    if (filters.trainingProject && filters.trainingProject !== 'all') {
      query = query.eq('id', filters.trainingProject);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data as SkillsMatrixTrainingProject[];
  },

  async getOperatorProgress(operatorIds: string[], trainingProjectIds: string[], statusFilter?: string) {
    let query = supabase
      .from('operator_training_progress')
      .select('*')
      .in('operator_id', operatorIds)
      .in('training_project_id', trainingProjectIds);

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data as SkillsMatrixProgress[];
  },

  async getDepartments() {
    const { data, error } = await supabase
      .from('profiles')
      .select('department')
      .not('department', 'is', null);

    if (error) throw error;
    
    const departments = [...new Set(data.map(item => item.department))].filter(Boolean);
    return departments as string[];
  },

  async exportMatrixData(operators: SkillsMatrixOperator[], trainingProjects: SkillsMatrixTrainingProject[], progressData: SkillsMatrixProgress[]) {
    const csvData = operators.map(operator => {
      const row: any = {
        'Full Name': `${operator.first_name || ''} ${operator.last_name || ''}`.trim(),
        'Email': operator.email,
        'Department': operator.department || '',
        'Role': operator.role
      };

      trainingProjects.forEach(project => {
        const progress = progressData.find(p => 
          p.operator_id === operator.id && p.training_project_id === project.id
        );
        
        if (progress) {
          const statusText = progress.status === 'passed' 
            ? `Passed (${progress.score}%) - ${progress.completed_at ? new Date(progress.completed_at).toLocaleDateString() : 'N/A'}`
            : progress.status === 'failed'
            ? `Failed (${progress.score}%, Attempts: ${progress.attempt_count}/${progress.max_attempts}) - ${progress.last_attempt_at ? new Date(progress.last_attempt_at).toLocaleDateString() : 'N/A'}`
            : progress.status === 'in_progress'
            ? `In Progress (${progress.progress_percentage}%)`
            : progress.status.charAt(0).toUpperCase() + progress.status.slice(1).replace('_', ' ');
          
          row[`${project.project_id} - ${project.name}`] = statusText;
        } else {
          row[`${project.project_id} - ${project.name}`] = 'Not Started';
        }
      });

      return row;
    });

    return csvData;
  }
};
