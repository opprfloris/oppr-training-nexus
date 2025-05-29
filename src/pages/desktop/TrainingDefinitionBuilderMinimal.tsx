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
import VersionHistoryModal from '@/components/desktop/training-definitions/VersionHistoryModal';
import { createNewBlock } from '@/utils/blockUtils';
import { Button } from '@/components/ui/button';
import { ClockIcon, DocumentTextIcon, MenuIcon, XIcon } from '@heroicons/react/24/outline';

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
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  
  // Mobile UI state
  const [mobileActivePanel, setMobileActivePanel] = useState<'palette' | 'canvas' | 'config'>('canvas');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
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
    
    // On mobile, switch to config panel when adding a block
    if (window.innerWidth < 1024) {
      setMobileActivePanel('config');
    }
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
    const reorderedSteps = filteredSteps.map((step, index) => ({
      ...step,
      order: index
    }));
    setSteps(reorderedSteps);
    
    if (selectedBlockId === stepId) {
      setSelectedBlockId(null);
    }
  };

  const reorderSteps = (startIndex: number, endIndex: number) => {
    const newSteps = [...steps];
    const [movedStep] = newSteps.splice(startIndex, 1);
    newSteps.splice(endIndex, 0, movedStep);
    
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

  const handlePublishSuccess = () => {
    loadDefinition();
  };

  const handleCreateNewVersion = (sourceVersionId: string) => {
    loadDefinition();
    setShowVersionHistory(false);
  };

  console.log('Current loading state:', loading);

  if (loading) {
    return (
      <div className="h-full flex flex-col p-4 lg:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const selectedBlock = selectedBlockId ? steps.find(step => step.id === selectedBlockId) : null;

  // Mobile Panel Navigation
  const MobilePanelNavigation = () => (
    <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex space-x-1">
        <Button
          variant={mobileActivePanel === 'palette' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMobileActivePanel('palette')}
          className="flex-1"
        >
          Blocks
        </Button>
        <Button
          variant={mobileActivePanel === 'canvas' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMobileActivePanel('canvas')}
          className="flex-1"
        >
          Flow ({steps.length})
        </Button>
        <Button
          variant={mobileActivePanel === 'config' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMobileActivePanel('config')}
          className="flex-1"
          disabled={!selectedBlock}
        >
          Config
        </Button>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Enhanced Header with Mobile Menu */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </Button>
            
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                {isNewDefinition ? 'Create New Training Definition' : `Edit Training Definition`}
              </h1>
              <p className="text-sm lg:text-base text-gray-600 mt-1">
                Phase 5C: UI Polish & Mobile Responsiveness
              </p>
              {version && (
                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mt-2">
                  <p className="text-xs lg:text-sm text-gray-500">
                    Current version: {version.version_number} ({version.status})
                  </p>
                  {version.published_at && (
                    <p className="text-xs lg:text-sm text-green-600">
                      Published: {new Date(version.published_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Version Management Controls */}
          <div className={`${showMobileMenu ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row items-start lg:items-center space-y-2 lg:space-y-0 lg:space-x-3 absolute lg:relative top-full lg:top-auto left-0 lg:left-auto right-0 lg:right-auto bg-white lg:bg-transparent border-b lg:border-b-0 border-gray-200 p-4 lg:p-0 z-10`}>
            {definition && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowVersionHistory(true)}
                className="w-full lg:w-auto flex items-center justify-center space-x-2"
              >
                <ClockIcon className="w-4 h-4" />
                <span>Version History</span>
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/desktop/training-definitions')}
              className="w-full lg:w-auto flex items-center justify-center space-x-2"
            >
              <DocumentTextIcon className="w-4 h-4" />
              <span>Back to List</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Builder Header */}
      <div className="bg-white border-b border-gray-200 p-4 lg:p-6">
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
          onPublishSuccess={handlePublishSuccess}
        />
      </div>

      {/* Mobile Panel Navigation */}
      <MobilePanelNavigation />

      {/* Enhanced Main Builder Layout - Responsive */}
      <div className="flex-1 overflow-hidden">
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6 h-full p-6">
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

        {/* Mobile Layout - Single Panel */}
        <div className="lg:hidden h-full p-4">
          {mobileActivePanel === 'palette' && (
            <div className="h-full">
              <BlockPalette 
                onAddBlock={addStep}
                onApplyAIFlow={applyAIFlow}
              />
            </div>
          )}

          {mobileActivePanel === 'canvas' && (
            <div className="h-full">
              <FlowCanvas
                steps={steps}
                selectedBlockId={selectedBlockId}
                onSelectBlock={(blockId) => {
                  setSelectedBlockId(blockId);
                  if (blockId) {
                    setMobileActivePanel('config');
                  }
                }}
                onDeleteBlock={deleteStep}
                onReorderBlocks={reorderSteps}
              />
            </div>
          )}

          {mobileActivePanel === 'config' && (
            <div className="h-full">
              <BlockConfiguration
                block={selectedBlock || null}
                onUpdateConfig={updateStep}
              />
            </div>
          )}
        </div>
      </div>

      {/* Version History Modal */}
      {definition && (
        <VersionHistoryModal
          isOpen={showVersionHistory}
          onClose={() => setShowVersionHistory(false)}
          definitionId={definition.id}
          definitionTitle={definition.title}
          onCreateNewVersion={handleCreateNewVersion}
        />
      )}

      {/* Enhanced Debug Info - Responsive */}
      <div className="bg-gray-50 border-t border-gray-200 p-3 lg:p-4">
        <details className="group">
          <summary className="cursor-pointer font-medium text-gray-900 text-sm lg:text-base">
            Debug Info & Status
          </summary>
          <div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-2 text-xs lg:text-sm text-gray-600">
            <div>
              <p>Route ID: {id}</p>
              <p>Pathname: {location.pathname}</p>
              <p>Is New: {isNewDefinition ? 'Yes' : 'No'}</p>
              <p>Loading: {loading ? 'Yes' : 'No'}</p>
              <p>Mobile Panel: {mobileActivePanel}</p>
            </div>
            <div>
              <p>Title: {title || 'Not set'}</p>
              <p>Description: {description || 'Not set'}</p>
              <p>Definition ID: {definition?.id || 'None'}</p>
              <p>Version: {version?.version_number || 'None'}</p>
              <p>Steps Count: {steps.length}</p>
              <p>Selected Block: {selectedBlockId || 'None'}</p>
            </div>
          </div>
          <p className="text-xs lg:text-sm text-green-600 font-medium mt-2">
            Status: Phase 5C complete - UI Polish & Mobile Responsiveness
          </p>
        </details>
      </div>
    </div>
  );
};

export default TrainingDefinitionBuilderMinimal;
