import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TrainingDefinition, TrainingDefinitionVersion } from '@/types/training-definitions';
import { fetchDefinitionAndVersion } from '@/services/trainingDefinitionService';
import { saveDraft } from '@/services/trainingDefinitionSaveService';
import BuilderHeader from '@/components/desktop/training-definitions/BuilderHeader';
import BuilderControls from '@/components/desktop/training-definitions/BuilderControls';
import EnhancedHeader from '@/components/desktop/training-definitions/EnhancedHeader';
import MobileNavigation from '@/components/desktop/training-definitions/MobileNavigation';
import BuilderLayout from '@/components/desktop/training-definitions/BuilderLayout';
import VersionManagement from '@/components/desktop/training-definitions/VersionManagement';
import DebugInfo from '@/components/desktop/training-definitions/DebugInfo';
import AdvancedValidation from '@/components/desktop/training-definitions/AdvancedValidation';
import AutoSaveIndicator from '@/components/desktop/training-definitions/AutoSaveIndicator';
import { useStepManagement } from '@/hooks/useStepManagement';

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  
  // Mobile UI state - updated type
  const [mobileActivePanel, setMobileActivePanel] = useState<'palette' | 'canvas' | 'config' | 'validation'>('canvas');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Step management using custom hook
  const {
    steps,
    setSteps,
    selectedBlockId,
    setSelectedBlockId,
    selectedBlock,
    addStep,
    updateStep,
    deleteStep,
    reorderSteps,
    applyAIFlow
  } = useStepManagement();
  
  console.log('TrainingDefinitionBuilderMinimal render - id:', id, 'pathname:', location.pathname);
  
  // Determine if this is a new definition
  const isNewDefinition = id === 'new' || location.pathname.includes('/new') || !id;

  // Track changes for auto-save indication
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [title, description, steps]);

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

  const handleAddStep = (blockType: 'information' | 'goto' | 'question') => {
    const newPanel = addStep(blockType);
    if (newPanel && window.innerWidth < 1024) {
      setMobileActivePanel(newPanel);
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

  return (
    <div className="h-full flex flex-col">
      {/* Enhanced Header with Mobile Menu */}
      <EnhancedHeader
        isNewDefinition={isNewDefinition}
        definition={definition}
        version={version}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        setShowVersionHistory={setShowVersionHistory}
      />

      {/* Enhanced Builder Header */}
      <div className="bg-white border-b border-gray-200 p-4 lg:p-6">
        <BuilderHeader
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
        />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <BuilderControls
            saving={saving}
            onSaveDraft={handleSave}
            title={title}
            steps={steps}
            definitionId={definition?.id}
            currentVersion={version?.version_number}
            onPublishSuccess={handlePublishSuccess}
          />
          
          <div className="flex items-center space-x-4">
            <AutoSaveIndicator
              hasUnsavedChanges={hasUnsavedChanges}
              saving={saving}
            />
            
            <button
              onClick={() => setShowValidation(!showValidation)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {showValidation ? 'Hide' : 'Show'} Validation
            </button>
          </div>
        </div>
      </div>

      {/* Validation Panel (collapsible) */}
      {showValidation && (
        <div className="border-b border-gray-200 p-4 lg:p-6 bg-gray-50">
          <AdvancedValidation
            steps={steps}
            title={title}
            description={description}
          />
        </div>
      )}

      {/* Mobile Panel Navigation */}
      <MobileNavigation
        mobileActivePanel={mobileActivePanel}
        setMobileActivePanel={setMobileActivePanel}
        steps={steps}
        selectedBlock={selectedBlock}
      />

      {/* Enhanced Main Builder Layout - Responsive */}
      <BuilderLayout
        mobileActivePanel={mobileActivePanel}
        setMobileActivePanel={setMobileActivePanel}
        steps={steps}
        selectedBlock={selectedBlock}
        selectedBlockId={selectedBlockId}
        title={title}
        description={description}
        onAddBlock={handleAddStep}
        onSelectBlock={setSelectedBlockId}
        onDeleteBlock={deleteStep}
        onReorderBlocks={reorderSteps}
        onUpdateConfig={updateStep}
        onApplyAIFlow={applyAIFlow}
      />

      {/* Version History Modal */}
      <VersionManagement
        definition={definition}
        showVersionHistory={showVersionHistory}
        setShowVersionHistory={setShowVersionHistory}
        onCreateNewVersion={handleCreateNewVersion}
      />

      {/* Enhanced Debug Info - Responsive */}
      <DebugInfo
        id={id}
        pathname={location.pathname}
        isNewDefinition={isNewDefinition}
        loading={loading}
        mobileActivePanel={mobileActivePanel}
        title={title}
        description={description}
        definition={definition}
        version={version}
        steps={steps}
        selectedBlockId={selectedBlockId}
      />
    </div>
  );
};

export default TrainingDefinitionBuilderMinimal;
