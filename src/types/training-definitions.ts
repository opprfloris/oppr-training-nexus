
export interface TrainingDefinition {
  id: string;
  title: string;
  description: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TrainingDefinitionVersion {
  id: string;
  training_definition_id: string;
  version_number: string;
  status: 'draft' | 'published' | 'archived';
  version_notes: string | null;
  steps_json: StepBlock[];
  created_at: string;
  published_at: string | null;
}

export interface TrainingDefinitionWithLatestVersion extends TrainingDefinition {
  latest_version: TrainingDefinitionVersion | null;
}

export interface StepBlock {
  id: string;
  type: 'information' | 'goto' | 'question';
  order: number;
  config: InformationBlockConfig | GotoBlockConfig | QuestionBlockConfig;
}

export interface InformationBlockConfig {
  content: string;
  image_url?: string;
}

export interface GotoBlockConfig {
  instructions: string;
}

export interface QuestionBlockConfig {
  question_text: string;
  question_type: 'text_input' | 'numerical_input' | 'multiple_choice' | 'voice_input';
  ideal_answer?: string;
  options?: string[];
  correct_option?: number;
  hint?: string;
  points: number;
  mandatory: boolean;
  image_url?: string;
}
