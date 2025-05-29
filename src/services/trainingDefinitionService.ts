
import { supabase } from '@/integrations/supabase/client';
import { TrainingDefinition, TrainingDefinitionVersion } from '@/types/training-definitions';
import { safeConvertToStepBlocks } from '@/utils/stepBlockValidation';

export const fetchDefinitionAndVersion = async (id: string) => {
  // Fetch the training definition
  const { data: defData, error: defError } = await supabase
    .from('training_definitions')
    .select('*')
    .eq('id', id)
    .single();

  if (defError) throw defError;

  // Fetch the latest draft version or latest version
  const { data: versionData, error: versionError } = await supabase
    .from('training_definition_versions')
    .select('*')
    .eq('training_definition_id', id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (versionError) throw versionError;

  let typedVersion: TrainingDefinitionVersion | null = null;
  if (versionData) {
    const safeStepsJson = safeConvertToStepBlocks(versionData.steps_json);
    typedVersion = {
      ...versionData,
      steps_json: safeStepsJson
    };
  }

  return {
    definition: defData as TrainingDefinition,
    version: typedVersion,
    steps: typedVersion?.steps_json || []
  };
};
