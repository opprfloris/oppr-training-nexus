
import React, { useState } from 'react';
import { StepBlock } from '@/types/training-definitions';
import { useTrainingDefinition } from '@/hooks/useTrainingDefinition';
import { createNewBlock } from '@/utils/blockUtils';
import BlockPalette from '@/components/desktop/training-definitions/BlockPalette';
import FlowCanvas from '@/components/desktop/training-definitions/FlowCanvas';
import BlockConfiguration from '@/components/desktop/training-definitions/BlockConfiguration';
import BuilderBreadcrumbs from '@/components/desktop/training-definitions/BuilderBreadcrumbs';
import BuilderHeader from '@/components/desktop/training-definitions/BuilderHeader';
import BuilderControls from '@/components/desktop/training-definitions/BuilderControls';

const TrainingDefinitionBuilder = () => {
  const {
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
  } = useTrainingDefinition();

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const addBlock = (blockType: 'information' | 'goto' | 'question') => {
    const newBlock = createNewBlock(blockType, steps.length);
    setSteps([...steps, newBlock]);
    setSelectedBlockId(newBlock.id);
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

  const handlePublishSuccess = () => {
    // Refetch the definition to get updated version info
    window.location.reload();
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
      <BuilderBreadcrumbs
        isNewDefinition={isNewDefinition}
        definition={definition}
        version={version}
      />

      <BuilderHeader
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
      />

      <BuilderControls
        saving={saving}
        onSaveDraft={handleSaveDraft}
        title={title}
        steps={steps}
        definitionId={definition?.id}
        currentVersion={version?.version_number}
        onPublishSuccess={handlePublishSuccess}
      />

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
