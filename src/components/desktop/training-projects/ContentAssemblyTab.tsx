
import React, { useState, useEffect } from 'react';
import { TrainingProject, TrainingProjectMarker, TrainingProjectContent } from '@/types/training-projects';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import MarkerSequenceEditor from './MarkerSequenceEditor';
import TrainingDefinitionSelector from './TrainingDefinitionSelector';
import { CurrentAssociationDisplay } from './CurrentAssociationDisplay';
import { TrainingDefinitionActions } from './TrainingDefinitionActions';
import { TrainingFlowOverview } from './TrainingFlowOverview';
import { EmptyMarkersState } from './EmptyMarkersState';
import { MarkerSelectionPrompt } from './MarkerSelectionPrompt';

interface ContentAssemblyTabProps {
  project: TrainingProject;
  markers: TrainingProjectMarker[];
  onContentChange: () => void;
}

export const ContentAssemblyTab: React.FC<ContentAssemblyTabProps> = ({
  project,
  markers,
  onContentChange
}) => {
  const [content, setContent] = useState<TrainingProjectContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [showTDSelector, setShowTDSelector] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
  }, [project.id]);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('training_project_content')
        .select(`
          *,
          training_definition_version:training_definition_versions(
            id,
            version_number,
            status,
            training_definition_id,
            training_definition:training_definitions(id, title)
          )
        `)
        .eq('training_project_id', project.id)
        .order('sequence_order', { ascending: true });

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error loading content:', error);
      toast({
        title: "Error",
        description: "Failed to load project content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sortedMarkers = [...markers].sort((a, b) => 
    (a.sequence_order || a.pin_number) - (b.sequence_order || b.pin_number)
  );

  const selectedMarker = selectedMarkerId ? markers.find(m => m.id === selectedMarkerId) : null;
  const selectedMarkerContent = selectedMarkerId ? 
    content.find(c => c.marker_id === selectedMarkerId) : null;

  const handleMarkerSelect = (markerId: string) => {
    setSelectedMarkerId(markerId);
  };

  const handleLinkExistingTD = () => {
    setShowTDSelector(true);
  };

  const handleCreateNewTD = () => {
    window.open(`/desktop/training-definitions/new?project=${project.id}&marker=${selectedMarkerId}`, '_blank');
  };

  const handleCopyTDAsDraft = () => {
    setShowTDSelector(true);
  };

  const handleEditDraftTD = () => {
    if (selectedMarkerContent?.training_definition_version) {
      const tdId = selectedMarkerContent.training_definition_version.training_definition_id;
      if (tdId) {
        window.open(`/desktop/training-definitions/${tdId}`, '_blank');
      }
    }
  };

  const handleUnlinkTD = async () => {
    if (!selectedMarkerId) return;

    try {
      const { error } = await supabase
        .from('training_project_content')
        .delete()
        .eq('marker_id', selectedMarkerId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Training definition unlinked successfully"
      });

      loadContent();
      onContentChange();
    } catch (error) {
      console.error('Error unlinking TD:', error);
      toast({
        title: "Error",
        description: "Failed to unlink training definition",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (markers.length === 0) {
    return <EmptyMarkersState />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Training Content Assembly</h3>
        <p className="text-gray-600">
          Define the sequence of markers and assign training definitions to create your complete training flow.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sub-Section 1: Define Marker Sequence */}
        <div className="space-y-4">
          <div>
            <h4 className="text-base font-medium text-gray-900 mb-2">Marker Sequence</h4>
            <p className="text-sm text-gray-600 mb-4">
              Define the order in which trainees will visit each marker.
            </p>
          </div>

          <MarkerSequenceEditor
            markers={sortedMarkers}
            content={content}
            selectedMarkerId={selectedMarkerId}
            onMarkerSelect={handleMarkerSelect}
            onSequenceChange={onContentChange}
          />
        </div>

        {/* Sub-Section 2: Assign/Create Training Definition */}
        <div className="space-y-4">
          <div>
            <h4 className="text-base font-medium text-gray-900 mb-2">Training Definition Assignment</h4>
            {selectedMarker ? (
              <p className="text-sm text-gray-600 mb-4">
                Selected Marker: Pin #{selectedMarker.sequence_order || selectedMarker.pin_number} - {selectedMarker.machine_qr_entity?.machine_id}
              </p>
            ) : (
              <p className="text-sm text-gray-600 mb-4">
                Select a marker from the sequence to assign training content.
              </p>
            )}
          </div>

          {selectedMarker ? (
            <div className="space-y-4">
              <CurrentAssociationDisplay selectedMarkerContent={selectedMarkerContent} />
              
              <TrainingDefinitionActions
                selectedMarkerContent={selectedMarkerContent}
                onLinkExistingTD={handleLinkExistingTD}
                onCreateNewTD={handleCreateNewTD}
                onCopyTDAsDraft={handleCopyTDAsDraft}
                onEditDraftTD={handleEditDraftTD}
                onUnlinkTD={handleUnlinkTD}
              />
            </div>
          ) : (
            <MarkerSelectionPrompt />
          )}
        </div>
      </div>

      <TrainingFlowOverview sortedMarkers={sortedMarkers} content={content} />

      <TrainingDefinitionSelector
        isOpen={showTDSelector}
        onClose={() => setShowTDSelector(false)}
        onSelect={(tdVersion) => {
          setShowTDSelector(false);
          loadContent();
          onContentChange();
        }}
        projectId={project.id}
        markerId={selectedMarkerId}
      />
    </div>
  );
};
