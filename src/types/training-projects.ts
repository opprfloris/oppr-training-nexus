
export interface TrainingProject {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  color_code: string;
  icon: string;
  status: 'draft' | 'scheduled' | 'active' | 'stopped' | 'archived';
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
  };
}

export interface ReadinessCheck {
  floorPlanAndMarkers: boolean;
  allTrainingDefinitionsPublished: boolean;
  learnerAssigned: boolean;
  passFailThresholdSet: boolean;
}
