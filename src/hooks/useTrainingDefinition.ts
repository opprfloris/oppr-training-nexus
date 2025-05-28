
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TrainingDefinition, TrainingDefinitionVersion, StepBlock } from '@/types/training-definitions';

// Type guard to safely convert Json to StepBlock[]
const isStepBlockArray = (value: any): value is StepBlock[] => {
  return Array.isArray(value) && value.every((item: any) => 
    item && 
    typeof item === 'object' && 
    typeof item.id === 'string' &&
    typeof item.type === 'string' &&
    typeof item.order === 'number' &&
    item.config !== undefined
  );
};

const safeConvertToStepBlocks = (value: any): StepBlock[] => {
  if (isStepBlockArray(value)) {
    return value;
  }
  return [];
};

export const useTrainingDefinition = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [definition, setDefinition] = useState<TrainingDefinition | null>(null);
  const [version, setVersion] = useState<TrainingDefinitionVersion | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<StepBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isNewDefinition = id === 'new';

  useEffect(() => {
    if (isNewDefinition) {
      setLoading(false);
      return;
    }

    fetchDefinitionAndVersion();
  }, [id]);

  const fetchDefinitionAndVersion = async () => {
    if (!id) return;

    try {
      setLoading(true);

      // Fetch the training definition
      const { data: defData, error: defError } = await supabase
        .from('training_definitions')
        .select('*')
        .eq('id', id)
        .single();

      if (defError) throw defError;

      setDefinition(defData);
      setTitle(defData.title);
      setDescription(defData.description || '');

      // Fetch the latest draft version or latest version
      const { data: versionData, error: versionError } = await supabase
        .from('training_definition_versions')
        .select('*')
        .eq('training_definition_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (versionError) throw versionError;

      if (versionData) {
        const safeStepsJson = safeConvertToStepBlocks(versionData.steps_json);
        const typedVersion: TrainingDefinitionVersion = {
          ...versionData,
          steps_json: safeStepsJson
        };
        setVersion(typedVersion);
        setSteps(safeStepsJson);
      }

    } catch (error) {
      console.error('Error fetching training definition:', error);
      toast({
        title: "Error",
        description: "Failed to load training definition",
        variant: "destructive"
      });
      navigate('/desktop/training-definitions');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a title for the training definition",
        variant: "destructive"
      });
      return;
    }

    try {
      setSaving(true);

      if (isNewDefinition) {
        // Create new training definition and first version
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
            version_number: '1.0',
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

        setDefinition(newDef);
        setVersion(typedNewVersion);

        toast({
          title: "Success",
          description: "Training definition created and saved as draft",
        });

        // Navigate to the editor with the new ID
        navigate(`/desktop/training-definitions/builder/${newDef.id}`, { replace: true });
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

        toast({
          title: "Success",
          description: "Draft saved successfully",
        });
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error",
        description: "Failed to save draft",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    definition,
    version,
    title,
    setTitle,
    description,
    setDescription,
    steps,
    setSteps,
    loading,
    saving,
    isNewDefinition,
    handleSaveDraft
  };
};
