
import React, { useState } from 'react';
import { PencilIcon, ArchiveBoxIcon, ClockIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TrainingDefinitionWithLatestVersion } from '@/types/training-definitions';
import { useNavigate } from 'react-router-dom';
import VersionHistoryModal from './VersionHistoryModal';
import PreviewModal from './PreviewModal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface TrainingDefinitionsTableProps {
  definitions: TrainingDefinitionWithLatestVersion[];
  loading: boolean;
  onRefresh: () => void;
  showDeleteAction: boolean;
}

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'draft':
        return 'outline';
      case 'published':
        return 'default';
      case 'archived':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'text-amber-600 border-amber-200 bg-amber-50';
      case 'published':
        return 'text-green-600 border-green-200 bg-green-50';
      case 'archived':
        return 'text-gray-600 border-gray-200 bg-gray-50';
      default:
        return '';
    }
  };

  return (
    <Badge 
      variant={getStatusVariant(status)}
      className={getStatusColor(status)}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const TrainingDefinitionsTable: React.FC<TrainingDefinitionsTableProps> = ({
  definitions,
  loading,
  onRefresh,
  showDeleteAction
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedDefinitionId, setSelectedDefinitionId] = useState<string>('');
  const [selectedDefinitionTitle, setSelectedDefinitionTitle] = useState<string>('');
  const [selectedPreviewSteps, setSelectedPreviewSteps] = useState<any[]>([]);
  const [selectedPreviewTitle, setSelectedPreviewTitle] = useState<string>('');
  const [archiving, setArchiving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleEdit = (definition: TrainingDefinitionWithLatestVersion) => {
    navigate(`/desktop/training-definitions/${definition.id}`);
  };

  const handleVersionHistory = (definition: TrainingDefinitionWithLatestVersion) => {
    setSelectedDefinitionId(definition.id);
    setSelectedDefinitionTitle(definition.title);
    setShowVersionHistory(true);
  };

  const handlePreview = (definition: TrainingDefinitionWithLatestVersion) => {
    const steps = definition.latest_version?.steps_json || [];
    setSelectedPreviewSteps(steps);
    setSelectedPreviewTitle(definition.title);
    setShowPreview(true);
  };

  const handleArchive = async (definition: TrainingDefinitionWithLatestVersion) => {
    if (!definition.latest_version) return;

    try {
      setArchiving(definition.id);
      
      const { error } = await supabase
        .from('training_definition_versions')
        .update({ status: 'archived' })
        .eq('id', definition.latest_version.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${definition.title} has been archived`,
      });

      onRefresh();
    } catch (error) {
      console.error('Error archiving definition:', error);
      toast({
        title: "Error",
        description: "Failed to archive definition",
        variant: "destructive"
      });
    } finally {
      setArchiving(null);
    }
  };

  const handleUnarchive = async (definition: TrainingDefinitionWithLatestVersion) => {
    if (!definition.latest_version) return;

    try {
      setArchiving(definition.id);
      
      const { error } = await supabase
        .from('training_definition_versions')
        .update({ status: 'published' })
        .eq('id', definition.latest_version.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${definition.title} has been unarchived`,
      });

      onRefresh();
    } catch (error) {
      console.error('Error unarchiving definition:', error);
      toast({
        title: "Error",
        description: "Failed to unarchive definition",
        variant: "destructive"
      });
    } finally {
      setArchiving(null);
    }
  };

  const handleDelete = async (definition: TrainingDefinitionWithLatestVersion) => {
    const confirmMessage = definition.latest_version?.status === 'draft' 
      ? `Are you sure you want to delete the draft "${definition.title}"? This action cannot be undone.`
      : `Are you sure you want to permanently delete "${definition.title}"? This action cannot be undone.`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      setDeleting(definition.id);
      
      // Delete all versions first
      const { error: versionsError } = await supabase
        .from('training_definition_versions')
        .delete()
        .eq('training_definition_id', definition.id);

      if (versionsError) throw versionsError;

      // Delete the definition
      const { error: defError } = await supabase
        .from('training_definitions')
        .delete()
        .eq('id', definition.id);

      if (defError) throw defError;

      const successMessage = definition.latest_version?.status === 'draft'
        ? `Draft "${definition.title}" has been deleted`
        : `${definition.title} has been permanently deleted`;

      toast({
        title: "Success",
        description: successMessage,
      });

      onRefresh();
    } catch (error) {
      console.error('Error deleting definition:', error);
      toast({
        title: "Error",
        description: "Failed to delete definition",
        variant: "destructive"
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleCreateNewVersion = (sourceVersionId: string) => {
    onRefresh();
  };

  const getCreatorName = (definition: TrainingDefinitionWithLatestVersion) => {
    const profile = (definition as any).profiles;
    if (profile) {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email;
    }
    return 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableCaption>A list of your training definitions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Steps</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {definitions.length > 0 ? (
            definitions.map((definition) => (
              <TableRow key={definition.id}>
                <TableCell className="font-medium">{definition.title}</TableCell>
                <TableCell className="max-w-xs truncate">{definition.description}</TableCell>
                <TableCell>
                  {definition.latest_version ? (
                    <StatusBadge status={definition.latest_version.status} />
                  ) : (
                    <Badge variant="outline" className="text-gray-500">No version</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {definition.latest_version ? (
                    <span className="text-sm text-gray-600">
                      v{definition.latest_version.version_number}
                    </span>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  {definition.latest_version ? (
                    <span className="text-sm text-gray-600">
                      {definition.latest_version.steps_json.length} steps
                    </span>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {getCreatorName(definition)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {format(new Date(definition.updated_at), 'MMM d, yyyy')}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePreview(definition)}
                      title="Preview definition"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVersionHistory(definition)}
                      title="View version history"
                    >
                      <ClockIcon className="w-4 h-4" />
                    </Button>

                    {definition.latest_version?.status === 'archived' ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUnarchive(definition)}
                          disabled={archiving === definition.id}
                          title="Unarchive definition"
                        >
                          <ArchiveBoxIcon className="w-4 h-4" />
                        </Button>
                        
                        {showDeleteAction && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(definition)}
                            disabled={deleting === definition.id}
                            title="Delete definition permanently"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(definition)}
                          title="Edit definition"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Button>

                        {definition.latest_version?.status === 'published' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleArchive(definition)}
                            disabled={archiving === definition.id}
                            title="Archive definition"
                          >
                            <ArchiveBoxIcon className="w-4 h-4" />
                          </Button>
                        )}

                        {definition.latest_version?.status === 'draft' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(definition)}
                            disabled={deleting === definition.id}
                            title="Delete draft"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No training definitions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <VersionHistoryModal
        isOpen={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
        definitionId={selectedDefinitionId}
        definitionTitle={selectedDefinitionTitle}
        onCreateNewVersion={handleCreateNewVersion}
      />

      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        steps={selectedPreviewSteps}
        title={selectedPreviewTitle}
      />
    </div>
  );
};

export default TrainingDefinitionsTable;
