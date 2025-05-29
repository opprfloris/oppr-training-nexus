
import React, { useState, useEffect } from 'react';
import { TrainingProject, TrainingProjectMarker } from '@/types/training-projects';
import TrainingDefinitionSelector from './TrainingDefinitionSelector';
import { TrainingFlowOverview } from './TrainingFlowOverview';
import { ContentAssemblyActions } from './ContentAssemblyActions';
import { MarkerContentList } from './MarkerContentList';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ContentAssemblyTabProps {
  project: TrainingProject;
  markers: TrainingProjectMarker[];
  onContentChange: () => void;
}

interface MarkerContent {
  id: string;
  marker_id: string;
  training_definition_version_id: string | null;
  sequence_order: number;
  training_definition_version?: {
    id: string;
    version_number: string;
    status: 'draft' | 'published' | 'archived';
    training_definition: {
      title: string;
    };
  };
}

export const ContentAssemblyTab: React.FC<ContentAssemblyTabProps> = ({
  project,
  markers,
  onContentChange
}) => {
  const [markerContents, setMarkerContents] = useState<MarkerContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDefinitionSelector, setShowDefinitionSelector] = useState(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadMarkerContents();
  }, [project.id, markers]);

  const loadMarkerContents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('training_project_content')
        .select(`
          *,
          training_definition_version:training_definition_versions(
            id,
            version_number,
            status,
            training_definition:training_definitions(title)
          )
        `)
        .eq('training_project_id', project.id)
        .order('sequence_order');

      if (error) throw error;
      setMarkerContents(data || []);
    } catch (error) {
      console.error('Error loading marker contents:', error);
      toast({
        title: "Error",
        description: "Failed to load training content assignments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignContent = async (markerId: string, trainingDefinitionVersionId: string) => {
    try {
      const nextSequenceOrder = Math.max(...markerContents.map(c => c.sequence_order), 0) + 1;
      
      const { error } = await supabase
        .from('training_project_content')
        .insert({
          training_project_id: project.id,
          marker_id: markerId,
          training_definition_version_id: trainingDefinitionVersionId,
          sequence_order: nextSequenceOrder
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Training content assigned successfully"
      });

      loadMarkerContents();
      onContentChange();
    } catch (error) {
      console.error('Error assigning content:', error);
      toast({
        title: "Error",
        description: "Failed to assign training content",
        variant: "destructive"
      });
    }
  };

  const handleRemoveContent = async (contentId: string) => {
    try {
      const { error } = await supabase
        .from('training_project_content')
        .delete()
        .eq('id', contentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Training content removed successfully"
      });

      loadMarkerContents();
      onContentChange();
    } catch (error) {
      console.error('Error removing content:', error);
      toast({
        title: "Error",
        description: "Failed to remove training content",
        variant: "destructive"
      });
    }
  };

  const handleOpenSelector = (markerId?: string) => {
    setSelectedMarkerId(markerId || null);
    setShowDefinitionSelector(true);
  };

  // Create sorted markers with sequence order for TrainingFlowOverview
  const sortedMarkers = markers
    .sort((a, b) => (a.sequence_order || 0) - (b.sequence_order || 0));

  // Transform markerContents to match TrainingProjectContent type
  const content = markerContents.map(mc => ({
    id: mc.id,
    training_project_id: project.id,
    marker_id: mc.marker_id,
    training_definition_version_id: mc.training_definition_version_id,
    sequence_order: mc.sequence_order,
    created_at: new Date().toISOString(),
    training_definition_version: mc.training_definition_version
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-2">Content Assembly</h3>
        <p className="text-gray-600">
          Assign training definitions to markers and configure the learning sequence.
        </p>
      </div>

      {/* Training Flow Overview */}
      <TrainingFlowOverview 
        sortedMarkers={sortedMarkers}
        content={content}
      />

      {/* Marker Content Assignment */}
      <div className="space-y-6">
        <ContentAssemblyActions onAssignContent={() => handleOpenSelector()} />
        
        <MarkerContentList
          markers={markers}
          markerContents={markerContents}
          onAssignContent={handleOpenSelector}
          onRemoveContent={handleRemoveContent}
        />
      </div>

      {/* Training Definition Selector Modal */}
      {showDefinitionSelector && (
        <TrainingDefinitionSelector
          isOpen={showDefinitionSelector}
          onClose={() => {
            setShowDefinitionSelector(false);
            setSelectedMarkerId(null);
          }}
          onSelect={(versionId) => {
            if (selectedMarkerId) {
              handleAssignContent(selectedMarkerId, versionId);
            }
            setShowDefinitionSelector(false);
            setSelectedMarkerId(null);
          }}
          projectId={project.id}
          markerId={selectedMarkerId}
        />
      )}
    </div>
  );
};
