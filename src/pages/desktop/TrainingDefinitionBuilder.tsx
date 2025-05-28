
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TrainingDefinition, TrainingDefinitionVersion, StepBlock } from '@/types/training-definitions';
import BlockPalette from '@/components/desktop/training-definitions/BlockPalette';
import FlowCanvas from '@/components/desktop/training-definitions/FlowCanvas';
import BlockConfiguration from '@/components/desktop/training-definitions/BlockConfiguration';

const TrainingDefinitionBuilder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [definition, setDefinition] = useState<TrainingDefinition | null>(null);
  const [version, setVersion] = useState<TrainingDefinitionVersion | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<StepBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
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
        setVersion(versionData);
        setSteps(versionData.steps_json || []);
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
            status: 'draft',
            steps_json: steps
          })
          .select()
          .single();

        if (versionError) throw versionError;

        setDefinition(newDef);
        setVersion(newVersion);

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
              steps_json: steps
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

  const handlePreview = () => {
    toast({
      title: "Coming Soon",
      description: "Preview functionality will be implemented next",
    });
  };

  const handlePublish = () => {
    toast({
      title: "Coming Soon",
      description: "Publish functionality will be implemented next",
    });
  };

  const addBlock = (blockType: 'information' | 'goto' | 'question') => {
    const newBlock: StepBlock = {
      id: `block_${Date.now()}`,
      type: blockType,
      order: steps.length,
      config: getDefaultBlockConfig(blockType)
    };

    setSteps([...steps, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const getDefaultBlockConfig = (blockType: string) => {
    switch (blockType) {
      case 'information':
        return { content: '' };
      case 'goto':
        return { instructions: '' };
      case 'question':
        return {
          question_text: '',
          question_type: 'text_input' as const,
          points: 1,
          mandatory: true
        };
      default:
        return {};
    }
  };

  const updateBlockConfig = (blockId: string, config: any) => {
    setSteps(steps.map(step => 
      step.id === blockId ? { ...step, config } : step
    ));
  };

  const deleteBlock = (blockId: string) => {
    setSteps(steps.filter(step => step.id !== blockId));
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  };

  const reorderBlocks = (startIndex: number, endIndex: number) => {
    const result = Array.from(steps);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    
    // Update order values
    const reorderedSteps = result.map((step, index) => ({
      ...step,
      order: index
    }));
    
    setSteps(reorderedSteps);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-oppr-blue"></div>
      </div>
    );
  }

  const selectedBlock = steps.find(step => step.id === selectedBlockId);

  return (
    <div className="h-full flex flex-col">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <button 
            onClick={() => navigate('/desktop/training-definitions')}
            className="hover:text-oppr-blue flex items-center space-x-1"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Training Definitions</span>
          </button>
          <span>></span>
          <span className="text-gray-900">
            {isNewDefinition ? 'New Training Definition' : definition?.title}
          </span>
          {!isNewDefinition && version && (
            <>
              <span>></span>
              <span className="text-gray-900">
                {version.status === 'draft' ? 'Edit Draft' : `Version ${version.version_number}`}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Header with Title and Description */}
      <div className="mb-6 space-y-4">
        <Input
          placeholder="Training Definition Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-semibold"
          required
        />
        <Textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button
            variant="outline"
            onClick={handlePreview}
          >
            <EyeIcon className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
        <Button
          onClick={handlePublish}
          className="oppr-button-primary"
          disabled={!title.trim() || steps.length === 0}
        >
          Publish Version
        </Button>
      </div>

      {/* Three-Panel Layout */}
      <div className="flex-1 flex space-x-6 min-h-0">
        {/* Left Panel - Block Palette */}
        <div className="w-64 flex-shrink-0">
          <BlockPalette onAddBlock={addBlock} />
        </div>

        {/* Center Panel - Flow Canvas */}
        <div className="flex-1 min-w-0">
          <FlowCanvas
            steps={steps}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            onDeleteBlock={deleteBlock}
            onReorderBlocks={reorderBlocks}
          />
        </div>

        {/* Right Panel - Block Configuration */}
        <div className="w-80 flex-shrink-0">
          <BlockConfiguration
            block={selectedBlock}
            onUpdateConfig={updateBlockConfig}
          />
        </div>
      </div>
    </div>
  );
};

export default TrainingDefinitionBuilder;
