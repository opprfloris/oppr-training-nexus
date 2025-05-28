
import React from 'react';
import { 
  PencilSquareIcon, 
  CloudArrowUpIcon, 
  TrashIcon,
  DocumentMagnifyingGlassIcon,
  PlusCircleIcon,
  ArchiveBoxIcon,
  ArchiveBoxArrowDownIcon 
} from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrainingDefinitionWithLatestVersion } from '@/types/training-definitions';
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Draft</Badge>;
      case 'published':
        return <Badge variant="default" className="bg-green-100 text-green-800">Published</Badge>;
      case 'archived':
        return <Badge variant="outline" className="bg-gray-100 text-gray-600">Archived</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const truncateDescription = (description: string | null, maxLength = 100) => {
    if (!description) return 'No description';
    return description.length > maxLength 
      ? `${description.substring(0, maxLength)}...` 
      : description;
  };

  const handleEditDraft = (definitionId: string) => {
    navigate(`/desktop/training-definitions/builder/${definitionId}`);
  };

  const handlePublishVersion = async (definitionId: string) => {
    // TODO: Implement publish modal
    toast({
      title: "Coming Soon",
      description: "Publish functionality will be implemented next",
    });
  };

  const handleDeleteDraft = async (definitionId: string) => {
    if (!window.confirm('Are you sure you want to delete this draft? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('training_definitions')
        .delete()
        .eq('id', definitionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Training definition deleted successfully",
      });
      onRefresh();
    } catch (error) {
      console.error('Error deleting training definition:', error);
      toast({
        title: "Error",
        description: "Failed to delete training definition",
        variant: "destructive"
      });
    }
  };

  const handleViewVersions = (definitionId: string) => {
    // TODO: Implement versions modal
    toast({
      title: "Coming Soon",
      description: "Version management will be implemented next",
    });
  };

  const handleCreateNewVersion = (definitionId: string) => {
    navigate(`/desktop/training-definitions/builder/${definitionId}/new-version`);
  };

  const handleArchive = async (definitionId: string) => {
    // TODO: Implement archive functionality
    toast({
      title: "Coming Soon",
      description: "Archive functionality will be implemented next",
    });
  };

  if (loading) {
    return (
      <div className="oppr-card p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-oppr-blue mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading training definitions...</p>
      </div>
    );
  }

  if (definitions.length === 0) {
    return (
      <div className="oppr-card p-8 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">📖</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Training Definitions Found</h3>
        <p className="text-gray-600 mb-4">Click 'New Definition' to create one.</p>
        <Button 
          onClick={() => navigate('/desktop/training-definitions/builder/new')}
          className="oppr-button-primary"
        >
          New Definition
        </Button>
      </div>
    );
  }

  return (
    <div className="oppr-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer hover:text-oppr-blue">Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Latest Version</TableHead>
            <TableHead className="cursor-pointer hover:text-oppr-blue">Last Modified</TableHead>
            <TableHead className="cursor-pointer hover:text-oppr-blue">Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {definitions.map((definition) => (
            <TableRow key={definition.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{definition.title}</TableCell>
              <TableCell className="text-gray-600">
                {truncateDescription(definition.description)}
              </TableCell>
              <TableCell>
                {definition.latest_version 
                  ? getStatusBadge(definition.latest_version.status)
                  : <Badge variant="outline">No Version</Badge>
                }
              </TableCell>
              <TableCell>
                {definition.latest_version?.version_number || 'N/A'}
              </TableCell>
              <TableCell>{formatDate(definition.updated_at)}</TableCell>
              <TableCell>{formatDate(definition.created_at)}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {definition.latest_version?.status === 'draft' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditDraft(definition.id)}
                        title="Edit Draft"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePublishVersion(definition.id)}
                        title="Publish"
                      >
                        <CloudArrowUpIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDraft(definition.id)}
                        title="Delete Draft"
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  
                  {definition.latest_version?.status === 'published' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewVersions(definition.id)}
                        title="View Versions"
                      >
                        <DocumentMagnifyingGlassIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCreateNewVersion(definition.id)}
                        title="Create New Version"
                      >
                        <PlusCircleIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleArchive(definition.id)}
                        title="Archive"
                      >
                        <ArchiveBoxIcon className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  
                  {definition.latest_version?.status === 'archived' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewVersions(definition.id)}
                        title="View Versions"
                      >
                        <DocumentMagnifyingGlassIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleArchive(definition.id)}
                        title="Unarchive"
                      >
                        <ArchiveBoxArrowDownIcon className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TrainingDefinitionsTable;
