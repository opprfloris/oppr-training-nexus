
export interface TrainingProject {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  color_code: string;
  icon: string;
  status: 'draft' | 'published' | 'active' | 'stopped' | 'archived';
  floor_plan_image_id: string | null;
  start_date: string | null;
  end_date: string | null;
  pass_fail_threshold: number;
  max_retake_attempts: number;
  recommended_completion_time: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TrainingProjectMarker {
  id: string;
  training_project_id: string;
  machine_qr_entity_id: string;
  pin_number: number;
  x_position: number;
  y_position: number;
  sequence_order: number | null;
  created_at: string;
  machine_qr_entity?: {
    machine_id: string;
    qr_identifier: string;
    qr_name: string;
    machine_type: string | null;
    brand: string | null;
    location_description: string | null;
  };
}

export interface TrainingProjectContent {
  id: string;
  training_project_id: string;
  marker_id: string;
  training_definition_version_id: string | null;
  sequence_order: number;
  created_at: string;
  training_definition_version?: {
    id: string;
    version_number: string;
    status: 'draft' | 'published' | 'archived';
    training_definition: {
      title: string;
    };
  };
}

export interface TrainingProjectOperatorAssignment {
  id: string;
  training_project_id: string;
  operator_id: string;
  assigned_at: string;
  assigned_by: string;
  operator?: {
    first_name: string | null;
    last_name: string | null;
    email: string;
    department: string | null;
    role: string | null;
  };
}

export interface TrainingProjectCollaborator {
  id: string;
  training_project_id: string;
  collaborator_id: string;
  assigned_at: string;
  assigned_by: string;
  collaborator?: {
    first_name: string | null;
    last_name: string | null;
    email: string;
    department: string | null;
    role: string | null;
  };
}

export interface ReadinessCheck {
  floorPlanAndMarkers: boolean;
  allTrainingDefinitionsPublished: boolean;
  learnerAssigned: boolean;
  passFailThresholdSet: boolean;
}

export interface ProgressData {
  learnerId: string;
  learnerName: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  score: number;
  lastActivity: string;
}

// Stats-related interfaces
export interface ProjectStat {
  name: string;
  value: number;
  trend?: {
    value: number;
    isUp: boolean;
  };
}

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  user: {
    name: string;
    avatar?: string;
  };
  timestamp: string;
}

// Valid project statuses as a union type
export type ProjectStatus = 'draft' | 'published' | 'active' | 'stopped' | 'archived';

// Valid progress statuses as a union type  
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed' | 'failed';

// Helper function to convert database response to TrainingProject
export const mapDatabaseToTrainingProject = (dbProject: any): TrainingProject => {
  return {
    id: dbProject.id,
    project_id: dbProject.project_id,
    name: dbProject.name,
    description: dbProject.description,
    color_code: dbProject.color_code || '#3a7ca5',
    icon: dbProject.icon || 'folder',
    status: dbProject.status as ProjectStatus,
    floor_plan_image_id: dbProject.floor_plan_image_id,
    start_date: dbProject.start_date,
    end_date: dbProject.end_date,
    pass_fail_threshold: dbProject.pass_fail_threshold || 80,
    max_retake_attempts: dbProject.max_retake_attempts || 3,
    recommended_completion_time: dbProject.recommended_completion_time,
    created_by: dbProject.created_by,
    created_at: dbProject.created_at,
    updated_at: dbProject.updated_at,
  };
};
