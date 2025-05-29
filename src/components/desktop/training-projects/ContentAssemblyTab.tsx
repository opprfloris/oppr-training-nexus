
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, DocumentTextIcon, ArrowRightIcon, LinkIcon, PencilIcon, UnlinkIcon, CopyIcon } from '@heroicons/react/24/outline';
import { TrainingProject, TrainingProjectMarker, TrainingProjectContent } from '@/types/training-projects';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import MarkerSequenceEditor from './MarkerSequenceEditor';
import TrainingDefinitionSelector from './TrainingDefinitionSelector';

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
            training_definition:training_definitions(title)
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
    // Navigate to TD builder with context
    window.open(`/desktop/training-definitions/new?project=${project.id}&marker=${selectedMarkerId}`, '_blank');
  };

  const handleCopyTDAsDraft = () => {
    // Similar to link existing but with copy flag
    setShowTDSelector(true);
  };

  const handleEditDraftTD = () => {
    if (selectedMarkerContent?.training_definition_version) {
      const tdId = selectedMarkerContent.training_definition_version.training_definition?.id;
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
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">📍</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Markers Added Yet</h3>
        <p className="text-gray-600 mb-4">
          You need to add markers to your floor plan before you can assign training content.
        </p>
        <p className="text-sm text-gray-500">
          Go to the "Floor Plan & Markers" tab to add markers first.
        </p>
      </div>
    );
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
              {/* Current Association Display */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Current Association:</span>
                </div>
                {selectedMarkerContent ? (
                  <div className="flex items-center space-x-3">
                    <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {selectedMarkerContent.training_definition_version?.training_definition?.title || 'Untitled Training'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Version {selectedMarkerContent.training_definition_version?.version_number} • 
                        <Badge 
                          variant={selectedMarkerContent.training_definition_version?.status === 'published' ? 'default' : 'secondary'} 
                          className="ml-2"
                        >
                          {selectedMarkerContent.training_definition_version?.status}
                        </Badge>
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No training definition assigned</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleLinkExistingTD}
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Link Existing Published TD...
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleCreateNewTD}
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create New Draft TD for this Marker...
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleCopyTDAsDraft}
                >
                  <CopyIcon className="w-4 h-4 mr-2" />
                  Copy Published TD as New Draft...
                </Button>

                {selectedMarkerContent?.training_definition_version?.status === 'draft' && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleEditDraftTD}
                  >
                    <PencilIcon className="w-4 h-4 mr-2" />
                    Edit Associated Draft TD
                  </Button>
                )}

                {selectedMarkerContent && (
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start"
                    onClick={handleUnlinkTD}
                  >
                    <UnlinkIcon className="w-4 h-4 mr-2" />
                    Unlink TD
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <DocumentTextIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">Select a marker to assign training content</p>
            </div>
          )}
        </div>
      </div>

      {/* Visual Flow Overview */}
      {sortedMarkers.length > 0 && (
        <div className="border-t pt-6">
          <h4 className="text-base font-medium text-gray-900 mb-4">Training Flow Overview</h4>
          <div className="flex items-center space-x-2 overflow-x-auto pb-4">
            {sortedMarkers.map((marker, index) => {
              const markerContent = content.find(c => c.marker_id === marker.id);
              return (
                <React.Fragment key={marker.id}>
                  <div className="flex-shrink-0 text-center">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-medium mb-2">
                      {marker.sequence_order || marker.pin_number}
                    </div>
                    <div className="text-xs text-gray-600 max-w-20 truncate">
                      {marker.machine_qr_entity?.machine_id}
                    </div>
                    {markerContent ? (
                      <Badge 
                        variant={markerContent.training_definition_version?.status === 'published' ? 'default' : 'secondary'} 
                        className="text-xs mt-1"
                      >
                        {markerContent.training_definition_version?.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs mt-1">No TD</Badge>
                    )}
                  </div>
                  {index < sortedMarkers.length - 1 && (
                    <ArrowRightIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      <TrainingDefinitionSelector
        isOpen={showTDSelector}
        onClose={() => setShowTDSelector(false)}
        onSelect={(tdVersion) => {
          // Handle TD selection logic here
          setShowTDSelector(false);
        }}
        projectId={project.id}
        markerId={selectedMarkerId}
      />
    </div>
  );
};
