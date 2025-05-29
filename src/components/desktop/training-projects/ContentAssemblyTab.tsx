
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, DocumentTextIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { TrainingProject, TrainingProjectMarker, TrainingProjectContent } from '@/types/training-projects';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
          Assign training definitions to each marker in your project. Define the sequence and content for each training station.
        </p>
      </div>

      <div className="space-y-4">
        {sortedMarkers.map((marker, index) => {
          const markerContent = content.filter(c => c.marker_id === marker.id);
          
          return (
            <div key={marker.id} className="border rounded-lg p-6 bg-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-medium">
                    {marker.sequence_order || marker.pin_number}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {marker.machine_qr_entity?.qr_name || `Marker ${marker.pin_number}`}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {marker.machine_qr_entity?.machine_id} • {marker.machine_qr_entity?.machine_type}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Assign Training
                </Button>
              </div>

              {markerContent.length > 0 ? (
                <div className="space-y-3">
                  {markerContent.map((contentItem) => (
                    <div key={contentItem.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                      <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {contentItem.training_definition_version?.training_definition?.title || 'Untitled Training'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Version {contentItem.training_definition_version?.version_number} • 
                          <Badge variant="outline" className="ml-2">
                            {contentItem.training_definition_version?.status}
                          </Badge>
                        </p>
                      </div>
                      <ArrowRightIcon className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-md border-2 border-dashed border-gray-200">
                  <DocumentTextIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">No training content assigned</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
