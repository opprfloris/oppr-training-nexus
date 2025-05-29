
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronUpIcon, ChevronDownIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { TrainingProject, TrainingProjectMarker } from '@/types/training-projects';
import { TrainingDefinitionSelector } from './TrainingDefinitionSelector';
import { TrainingFlowOverview } from './TrainingFlowOverview';
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

  const getMarkerName = (markerId: string) => {
    const marker = markers.find(m => m.id === markerId);
    return marker ? `Pin ${marker.pin_number} - ${marker.machine_qr_entity?.qr_name || 'Unknown'}` : 'Unknown Marker';
  };

  const getTrainingDefinitionId = (content: MarkerContent) => {
    return content.training_definition_version?.training_definition?.title || 'No Definition';
  };

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
        projectId={project.id}
        markers={markers}
        markerContents={markerContents}
      />

      {/* Marker Content Assignment */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-gray-900">Training Content by Marker</h4>
          <Button
            onClick={() => setShowDefinitionSelector(true)}
            className="bg-[#3a7ca5] hover:bg-[#2f6690]"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Assign Content
          </Button>
        </div>

        <div className="space-y-4">
          {markers.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <p>No markers found. Please add markers in the Floor Plan & Markers tab first.</p>
            </div>
          ) : (
            markers.map(marker => {
              const assignedContents = markerContents.filter(c => c.marker_id === marker.id);
              
              return (
                <Card key={marker.id} className="border">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">
                        Pin {marker.pin_number} - {marker.machine_qr_entity?.qr_name}
                      </CardTitle>
                      <Badge variant="outline">
                        {assignedContents.length} Definition(s)
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {assignedContents.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        <p>No training content assigned</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedMarkerId(marker.id);
                            setShowDefinitionSelector(true);
                          }}
                          className="mt-2"
                        >
                          <PlusIcon className="w-4 h-4 mr-1" />
                          Assign Content
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {assignedContents.map(content => (
                          <div key={content.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">
                                {content.training_definition_version?.training_definition?.title || 'Unknown Definition'}
                              </p>
                              <p className="text-sm text-gray-600">
                                Version {content.training_definition_version?.version_number} • 
                                Status: {content.training_definition_version?.status}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveContent(content.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedMarkerId(marker.id);
                            setShowDefinitionSelector(true);
                          }}
                          className="w-full mt-2"
                        >
                          <PlusIcon className="w-4 h-4 mr-1" />
                          Add More Content
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
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
          selectedMarkerId={selectedMarkerId}
        />
      )}
    </div>
  );
};
