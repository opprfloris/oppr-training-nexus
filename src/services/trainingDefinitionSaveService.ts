
import { supabase } from '@/integrations/supabase/client';
import { StepBlock, TrainingDefinition, TrainingDefinitionVersion } from '@/types/training-definitions';

export interface SaveDraftParams {
  title: string;
  description: string;
  steps: StepBlock[];
  isNewDefinition: boolean;
  definition?: TrainingDefinition | null;
  version?: TrainingDefinitionVersion | null;
}

export interface SaveDraftResult {
  definition: TrainingDefinition;
  version: TrainingDefinitionVersion;
  isNew: boolean;
}

export const saveDraft = async (params: SaveDraftParams): Promise<SaveDraftResult> => {
  const { title, description, steps, isNewDefinition, definition, version } = params;

  if (isNewDefinition) {
    // Create new training definition with version 0.1 (draft)
    const { data: newDef, error: defError } = await supabase
      .from('training_definitions')
      .insert({
        title: title.trim(),
        description: description.trim() || null,
        created_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (defError) throw defError;

    const { data: newVersion, error: versionError } = await supabase
      .from('training_definition_versions')
      .insert({
        training_definition_id: newDef.id,
        version_number: '0.1',
        status: 'draft' as const,
        steps_json: steps as any
      })
      .select()
      .single();

    if (versionError) throw versionError;

    const typedNewVersion: TrainingDefinitionVersion = {
      ...newVersion,
      steps_json: steps
    };

    return {
      definition: newDef,
      version: typedNewVersion,
      isNew: true
    };
  } else {
    // Update existing definition
    if (definition) {
      const { error: defError } = await supabase
        .from('training_definitions')
        .update({
          title: title.trim(),
          description: description.trim() || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', definition.id);

      if (defError) throw defError;
    }

    // Update or create version
    if (version) {
      const { error: versionError } = await supabase
        .from('training_definition_versions')
        .update({
          steps_json: steps as any
        })
        .eq('id', version.id);

      if (versionError) throw versionError;
    }

    return {
      definition: definition!,
      version: version!,
      isNew: false
    };
  }
};
