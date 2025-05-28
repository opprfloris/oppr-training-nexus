
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TrainingDefinitionVersion, StepBlock } from '@/types/training-definitions';
import { EyeIcon, PlusIcon } from "@heroicons/react/24/outline";
import { format } from 'date-fns';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  definitionId: string;
  definitionTitle: string;
  onCreateNewVersion?: (sourceVersionId: string) => void;
}

// Type guard for safe conversion
const isStepBlockArray = (value: any): value is StepBlock[] => {
  return Array.isArray(value) && value.every((item: any) => 
    item && 
    typeof item === 'object' && 
    typeof item.id === 'string' &&
    typeof item.type === 'string' &&
    typeof item.order === 'number' &&
    item.config !== undefined
  );
};

const safeConvertToStepBlocks = (value: any): StepBlock[] => {
  if (isStepBlockArray(value)) {
    return value;
  }
  return [];
};

const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  definitionId,
  definitionTitle,
  onCreateNewVersion
}) => {
  const [versions, setVersions] = useState<TrainingDefinitionVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<TrainingDefinitionVersion | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchVersions();
    }
  }, [isOpen, definitionId]);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('training_definition_versions')
        .select('*')
        .eq('training_definition_id', definitionId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const typedVersions: TrainingDefinitionVersion[] = data?.map(version => ({
        ...version,
        steps_json: safeConvertToStepBlocks(version.steps_json)
      })) || [];

      setVersions(typedVersions);
    } catch (error) {
      console.error('Error fetching versions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch version history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewVersion = async (sourceVersion: TrainingDefinitionVersion) => {
    try {
      const { data: newVersion, error } = await supabase
        .from('training_definition_versions')
        .insert({
          training_definition_id: definitionId,
          version_number: 'draft',
          status: 'draft' as const,
          steps_json: sourceVersion.steps_json as any,
          version_notes: `Created from version ${sourceVersion.version_number}`
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: `New draft version created from ${sourceVersion.version_number}`,
      });

      if (onCreateNewVersion) {
        onCreateNewVersion(newVersion.id);
      }
      
      onClose();
    } catch (error) {
      console.error('Error creating new version:', error);
      toast({
        title: "Error",
        description: "Failed to create new version",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (showPreview && selectedVersion) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Preview: {definitionTitle} (Version {selectedVersion.version_number})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button 
              variant="outline" 
              onClick={() => setShowPreview(false)}
            >
              ← Back to Version History
            </Button>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Steps Preview</h3>
              {selectedVersion.steps_json.length === 0 ? (
                <p className="text-gray-500">No steps in this version</p>
              ) : (
                <div className="space-y-2">
                  {selectedVersion.steps_json.map((step, index) => (
                    <div key={step.id} className="border-l-4 border-blue-200 pl-3 py-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Step {index + 1}</span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {step.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {step.type === 'information' && (step.config as any).content?.substring(0, 100)}
                        {step.type === 'goto' && (step.config as any).instructions?.substring(0, 100)}
                        {step.type === 'question' && (step.config as any).question_text?.substring(0, 100)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Version History: {definitionTitle}</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {versions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No versions found</p>
            ) : (
              versions.map((version) => (
                <div key={version.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">Version {version.version_number}</h3>
                          <Badge className={getStatusColor(version.status)}>
                            {version.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Created: {format(new Date(version.created_at), 'MMM d, yyyy HH:mm')}
                        </p>
                        {version.published_at && (
                          <p className="text-sm text-gray-600">
                            Published: {format(new Date(version.published_at), 'MMM d, yyyy HH:mm')}
                          </p>
                        )}
                        {version.version_notes && (
                          <p className="text-sm text-gray-700 mt-2">{version.version_notes}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {version.steps_json.length} steps
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedVersion(version);
                          setShowPreview(true);
                        }}
                      >
                        <EyeIcon className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      
                      {version.status === 'published' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCreateNewVersion(version)}
                        >
                          <PlusIcon className="w-4 h-4 mr-1" />
                          New Version
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VersionHistoryModal;
