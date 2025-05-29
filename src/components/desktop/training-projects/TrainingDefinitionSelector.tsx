import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MagnifyingGlassIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TrainingDefinitionWithLatestVersion } from '@/types/training-definitions';

interface TrainingDefinitionSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (tdVersion: any) => void;
  projectId: string;
  markerId: string | null;
}

const TrainingDefinitionSelector: React.FC<TrainingDefinitionSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  projectId,
  markerId
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [trainingDefinitions, setTrainingDefinitions] = useState<TrainingDefinitionWithLatestVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadTrainingDefinitions();
    }
  }, [isOpen]);

  const loadTrainingDefinitions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('training_definitions')
        .select(`
          *,
          latest_version:training_definition_versions!training_definition_versions_training_definition_id_fkey(
            id,
            version_number,
            status,
            created_at,
            published_at,
            training_definition_id,
            version_notes,
            steps_json
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our type structure and filter to only show definitions with published versions
      const transformedData = (data || []).map(def => ({
        ...def,
        latest_version: Array.isArray(def.latest_version) && def.latest_version.length > 0 
          ? def.latest_version[0] 
          : null
      })).filter(def => 
        def.latest_version && def.latest_version.status === 'published'
      );

      setTrainingDefinitions(transformedData);
    } catch (error) {
      console.error('Error loading training definitions:', error);
      toast({
        title: "Error",
        description: "Failed to load training definitions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (definition: TrainingDefinitionWithLatestVersion) => {
    if (!markerId || !definition.latest_version) return;

    try {
      // Check if there's already content for this marker
      const { data: existingContent } = await supabase
        .from('training_project_content')
        .select('id')
        .eq('marker_id', markerId)
        .single();

      if (existingContent) {
        // Update existing content
        const { error } = await supabase
          .from('training_project_content')
          .update({
            training_definition_version_id: definition.latest_version.id
          })
          .eq('id', existingContent.id);

        if (error) throw error;
      } else {
        // Create new content entry
        const { error } = await supabase
          .from('training_project_content')
          .insert({
            training_project_id: projectId,
            marker_id: markerId,
            training_definition_version_id: definition.latest_version.id,
            sequence_order: 1 // This should be calculated based on marker sequence
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Training definition linked successfully"
      });

      onSelect(definition.latest_version);
    } catch (error) {
      console.error('Error linking training definition:', error);
      toast({
        title: "Error",
        description: "Failed to link training definition",
        variant: "destructive"
      });
    }
  };

  const filteredDefinitions = trainingDefinitions.filter(def =>
    def.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (def.description && def.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Training Definition</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search training definitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredDefinitions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'No training definitions found matching your search.' : 'No published training definitions available.'}
              </div>
            ) : (
              filteredDefinitions.map((definition) => (
                <div
                  key={definition.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleSelect(definition)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <DocumentTextIcon className="w-5 h-5 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{definition.title}</h4>
                        {definition.description && (
                          <p className="text-sm text-gray-600 mt-1">{definition.description}</p>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="default">
                            Version {definition.latest_version?.version_number}
                          </Badge>
                          <Badge variant="outline">
                            Published
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingDefinitionSelector;
