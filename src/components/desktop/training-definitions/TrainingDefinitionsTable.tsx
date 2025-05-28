import React, { useState } from 'react';
import { PencilIcon, ArchiveBoxIcon, ClockIcon } from "@heroicons/react/24/outline";
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TrainingDefinitionWithLatestVersion } from '@/types/training-definitions';
import { useNavigate } from 'react-router-dom';
import VersionHistoryModal from './VersionHistoryModal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TrainingDefinitionsTableProps {
  definitions: TrainingDefinitionWithLatestVersion[];
  loading: boolean;
  onRefresh: () => void;
}

const TrainingDefinitionsTable: React.FC<TrainingDefinitionsTableProps> = ({
  definitions,
  loading,
  onRefresh
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [selectedDefinitionId, setSelectedDefinitionId] = useState<string>('');
  const [selectedDefinitionTitle, setSelectedDefinitionTitle] = useState<string>('');
  const [archiving, setArchiving] = useState<string | null>(null);

  const handleEdit = (definition: TrainingDefinitionWithLatestVersion) => {
    navigate(`/desktop/training-definitions/builder/${definition.id}`);
  };

  const handleVersionHistory = (definition: TrainingDefinitionWithLatestVersion) => {
    setSelectedDefinitionId(definition.id);
    setSelectedDefinitionTitle(definition.title);
    setShowVersionHistory(true);
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

  const handleCreateNewVersion = (sourceVersionId: string) => {
    onRefresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-oppr-blue"></div>
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
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {definitions.length > 0 ? (
            definitions.map((definition) => (
              <TableRow key={definition.id}>
                <TableCell className="font-medium">{definition.title}</TableCell>
                <TableCell>{definition.description}</TableCell>
                <TableCell>
                  {definition.latest_version ? (
                    definition.latest_version.status
                  ) : (
                    'No version'
                  )}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVersionHistory(definition)}
                      title="View version history"
                    >
                      <ClockIcon className="w-4 h-4" />
                    </Button>

                    {definition.latest_version?.status === 'archived' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnarchive(definition)}
                        disabled={archiving === definition.id}
                        title="Unarchive definition"
                      >
                        <ArchiveBoxIcon className="w-4 h-4" />
                      </Button>
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
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
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
    </div>
  );
};

export default TrainingDefinitionsTable;
