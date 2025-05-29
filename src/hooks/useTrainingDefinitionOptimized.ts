
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TrainingDefinition, TrainingDefinitionVersion, StepBlock } from '@/types/training-definitions';
import { fetchDefinitionAndVersion } from '@/services/trainingDefinitionService';
import { saveDraft } from '@/services/trainingDefinitionSaveService';
import { debounce } from 'lodash';

export const useTrainingDefinitionOptimized = () => {
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const isNewDefinition = useMemo(() => id === 'new', [id]);

  // Debounced auto-save
  const debouncedSave = useCallback(
    debounce(async (data: { title: string; description: string; steps: StepBlock[] }) => {
      if (!data.title.trim() || !hasUnsavedChanges) return;
      
      try {
        await saveDraft({
          title: data.title,
          description: data.description,
          steps: data.steps,
          isNewDefinition,
          definition,
          version
        });
        setHasUnsavedChanges(false);
        console.log('Auto-saved successfully');
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 2000),
    [isNewDefinition, definition, version, hasUnsavedChanges]
  );

  // Track changes for auto-save
  useEffect(() => {
    if (!loading && !isNewDefinition) {
      debouncedSave({ title, description, steps });
    }
  }, [title, description, steps, debouncedSave, loading, isNewDefinition]);

  useEffect(() => {
    if (isNewDefinition) {
      setLoading(false);
      return;
    }

    if (id && id !== 'new') {
      loadDefinition();
    } else {
      setLoading(false);
    }
  }, [id, isNewDefinition]);

  const loadDefinition = async () => {
    if (!id || id === 'new') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { definition: defData, version: versionData, steps: stepsData } = await fetchDefinitionAndVersion(id);
      
      setDefinition(defData);
      setTitle(defData.title);
      setDescription(defData.description || '');
      setVersion(versionData);
      setSteps(stepsData);
      setHasUnsavedChanges(false);

    } catch (error) {
      console.error('Error loading training definition:', error);
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

  const handleManualSave = async () => {
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

      const result = await saveDraft({
        title,
        description,
        steps,
        isNewDefinition,
        definition,
        version
      });

      setDefinition(result.definition);
      setVersion(result.version);
      setHasUnsavedChanges(false);

      if (result.isNew) {
        toast({
          title: "Success",
          description: "Training definition created and saved as draft (v0.1)",
        });
        navigate(`/desktop/training-definitions/${result.definition.id}`, { replace: true });
      } else {
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

  const updateTitle = useCallback((newTitle: string) => {
    setTitle(newTitle);
    setHasUnsavedChanges(true);
  }, []);

  const updateDescription = useCallback((newDescription: string) => {
    setDescription(newDescription);
    setHasUnsavedChanges(true);
  }, []);

  const updateSteps = useCallback((newSteps: StepBlock[]) => {
    setSteps(newSteps);
    setHasUnsavedChanges(true);
  }, []);

  return {
    definition,
    version,
    title,
    description,
    steps,
    loading,
    saving,
    hasUnsavedChanges,
    isNewDefinition,
    updateTitle,
    updateDescription,
    updateSteps,
    handleManualSave,
    loadDefinition
  };
};
