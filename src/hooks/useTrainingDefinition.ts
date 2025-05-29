
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TrainingDefinition, TrainingDefinitionVersion, StepBlock } from '@/types/training-definitions';
import { fetchDefinitionAndVersion } from '@/services/trainingDefinitionService';
import { saveDraft } from '@/services/trainingDefinitionSaveService';

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

    loadDefinitionAndVersion();
  }, [id]);

  const loadDefinitionAndVersion = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const { definition: defData, version: versionData, steps: stepsData } = await fetchDefinitionAndVersion(id);
      
      setDefinition(defData);
      setTitle(defData.title);
      setDescription(defData.description || '');
      setVersion(versionData);
      setSteps(stepsData);

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

      if (result.isNew) {
        toast({
          title: "Success",
          description: "Training definition created and saved as draft (v0.1)",
        });
        // Navigate to the editor with the new ID - FIXED PATH
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
