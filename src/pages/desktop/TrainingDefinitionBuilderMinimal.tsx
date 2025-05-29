
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TrainingDefinition, TrainingDefinitionVersion, StepBlock } from '@/types/training-definitions';
import { fetchDefinitionAndVersion } from '@/services/trainingDefinitionService';
import { saveDraft } from '@/services/trainingDefinitionSaveService';
import BuilderHeader from '@/components/desktop/training-definitions/BuilderHeader';
import BuilderControls from '@/components/desktop/training-definitions/BuilderControls';
import BlockPalette from '@/components/desktop/training-definitions/BlockPalette';
import FlowCanvas from '@/components/desktop/training-definitions/FlowCanvas';
import BlockConfiguration from '@/components/desktop/training-definitions/BlockConfiguration';
import { createNewBlock } from '@/utils/blockUtils';

const TrainingDefinitionBuilderMinimal = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // State management
  const [definition, setDefinition] = useState<TrainingDefinition | null>(null);
  const [version, setVersion] = useState<TrainingDefinitionVersion | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<StepBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  console.log('TrainingDefinitionBuilderMinimal render - id:', id, 'pathname:', location.pathname);
  
  // Determine if this is a new definition
  const isNewDefinition = id === 'new' || location.pathname.includes('/new') || !id;

  // Load existing definition if editing
  useEffect(() => {
    console.log('useEffect triggered - id:', id, 'isNewDefinition:', isNewDefinition);
    
    if (isNewDefinition) {
      console.log('This is a new definition, setting loading to false');
      setLoading(false);
      return;
    }

    if (id && id !== 'new') {
      console.log('Loading existing definition with id:', id);
      loadDefinition();
    } else {
      console.log('No valid id provided, setting loading to false');
      setLoading(false);
    }
  }, [id, isNewDefinition]);

  const loadDefinition = async () => {
    if (!id || id === 'new') {
      console.log('loadDefinition called but id is invalid:', id);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching definition for id:', id);
      const { definition: defData, version: versionData, steps: stepsData } = await fetchDefinitionAndVersion(id);
      
      console.log('Definition loaded:', defData);
      console.log('Version loaded:', versionData);
      console.log('Steps loaded:', stepsData);
      
      setDefinition(defData);
      setTitle(defData.title);
      setDescription(defData.description || '');
      setVersion(versionData);
      setSteps(stepsData);

    } catch (error) {
      console.error('Error loading training definition:', error);
      toast({
        title: "Error",
        description: "Failed to load training definition",
        variant: "destructive"
      });
      navigate('/desktop/training-definitions');
    } finally {
      console.log('Setting loading to false in loadDefinition finally block');
      setLoading(false);
    }
  };

  // Basic validation
  const validateForm = () => {
    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a title for the training definition",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  // Save functionality using the updated steps
  const handleSave = async () => {
    if (!validateForm()) return;

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
        // Navigate to the editor with the new ID
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

  // Step management functions
  const addStep = (blockType: 'information' | 'goto' | 'question') => {
    const newOrder = steps.length;
    const newBlock = createNewBlock(blockType, newOrder);
    setSteps([...steps, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const updateStep = (stepId: string, updatedConfig: any) => {
    setSteps(steps.map(step => 
      step.id === stepId 
        ? { ...step, config: updatedConfig }
        : step
    ));
  };

  const deleteStep = (stepId: string) => {
    const filteredSteps = steps.filter(step => step.id !== stepId);
    // Reorder remaining steps
    const reorderedSteps = filteredSteps.map((step, index) => ({
      ...step,
      order: index
    }));
    setSteps(reorderedSteps);
    
    // Clear selection if deleted step was selected
    if (selectedBlockId === stepId) {
      setSelectedBlockId(null);
    }
  };

  const reorderSteps = (startIndex: number, endIndex: number) => {
    const newSteps = [...steps];
    const [movedStep] = newSteps.splice(startIndex, 1);
    newSteps.splice(endIndex, 0, movedStep);
    
    // Update order numbers
    newSteps.forEach((step, index) => {
      step.order = index;
    });

    setSteps(newSteps);
  };

  const applyAIFlow = (blocks: StepBlock[]) => {
    setSteps(blocks);
    if (blocks.length > 0) {
      setSelectedBlockId(blocks[0].id);
    }
  };

  console.log('Current loading state:', loading);

  if (loading) {
    return (
      <div className="h-full flex flex-col p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const selectedBlock = selectedBlockId ? steps.find(step => step.id === selectedBlockId) : null;

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNewDefinition ? 'Create New Training Definition' : `Edit Training Definition`}
        </h1>
        <p className="text-gray-600 mt-2">
          Phase 5A: Advanced step configuration with visual flow canvas
        </p>
        {version && (
          <p className="text-sm text-gray-500 mt-1">
            Current version: {version.version_number} ({version.status})
          </p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <BuilderHeader
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
        />

        <BuilderControls
          saving={saving}
          onSaveDraft={handleSave}
          title={title}
          steps={steps}
          definitionId={definition?.id}
          currentVersion={version?.version_number}
          onPublishSuccess={loadDefinition}
        />
      </div>

      {/* Main Builder Layout */}
      <div className="flex-1 grid grid-cols-12 gap-6">
        {/* Left Panel - Block Palette */}
        <div className="col-span-3">
          <BlockPalette 
            onAddBlock={addStep}
            onApplyAIFlow={applyAIFlow}
          />
        </div>

        {/* Center Panel - Flow Canvas */}
        <div className="col-span-5">
          <FlowCanvas
            steps={steps}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            onDeleteBlock={deleteStep}
            onReorderBlocks={reorderSteps}
          />
        </div>

        {/* Right Panel - Block Configuration */}
        <div className="col-span-4">
          <BlockConfiguration
            block={selectedBlock || null}
            onUpdateConfig={updateStep}
          />
        </div>
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-2">Debug Info:</h3>
        <p className="text-sm text-gray-600">Route ID: {id}</p>
        <p className="text-sm text-gray-600">Pathname: {location.pathname}</p>
        <p className="text-sm text-gray-600">Is New: {isNewDefinition ? 'Yes' : 'No'}</p>
        <p className="text-sm text-gray-600">Loading: {loading ? 'Yes' : 'No'}</p>
        <p className="text-sm text-gray-600">Title: {title || 'Not set'}</p>
        <p className="text-sm text-gray-600">Description: {description || 'Not set'}</p>
        <p className="text-sm text-gray-600">Definition ID: {definition?.id || 'None'}</p>
        <p className="text-sm text-gray-600">Version: {version?.version_number || 'None'}</p>
        <p className="text-sm text-gray-600">Steps Count: {steps.length}</p>
        <p className="text-sm text-gray-600">Selected Block: {selectedBlockId || 'None'}</p>
        <p className="text-sm text-gray-600">Status: Phase 5A complete - Advanced step configuration</p>
      </div>
    </div>
  );
};

export default TrainingDefinitionBuilderMinimal;
