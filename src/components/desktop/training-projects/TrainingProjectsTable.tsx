
import React, { useState } from 'react';
import { PencilIcon, TrashIcon, EyeIcon, PlayIcon } from "@heroicons/react/24/outline";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrainingProject } from '@/types/training-projects';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface TrainingProjectsTableProps {
  projects: TrainingProject[];
  loading: boolean;
  onDelete: (id: string) => void;
}

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'draft':
        return 'outline';
      case 'scheduled':
        return 'secondary';
      case 'active':
        return 'default';
      case 'stopped':
        return 'destructive';
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
      case 'scheduled':
        return 'text-blue-600 border-blue-200 bg-blue-50';
      case 'active':
        return 'text-green-600 border-green-200 bg-green-50';
      case 'stopped':
        return 'text-red-600 border-red-200 bg-red-50';
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

const TrainingProjectsTable: React.FC<TrainingProjectsTableProps> = ({
  projects,
  loading,
  onDelete
}) => {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleEdit = (project: TrainingProject) => {
    navigate(`/desktop/training-projects/${project.id}`);
  };

  const handleDelete = async (project: TrainingProject) => {
    if (!confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(project.id);
      await onDelete(project.id);
    } finally {
      setDeleting(null);
    }
  };

  const getCreatorName = (project: any) => {
    const profile = project.profiles;
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project Name</TableHead>
          <TableHead>Project ID</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created By</TableHead>
          <TableHead>Created Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.length > 0 ? (
          projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.name}</TableCell>
              <TableCell className="font-mono text-sm">{project.project_id}</TableCell>
              <TableCell className="max-w-xs truncate">{project.description || '-'}</TableCell>
              <TableCell>
                <StatusBadge status={project.status} />
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">
                  {getCreatorName(project)}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">
                  {format(new Date(project.created_at), 'MMM d, yyyy')}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(project)}
                    title="Edit project"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>

                  {project.status === 'draft' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(project)}
                      disabled={deleting === project.id}
                      title="Delete project"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center">
              No training projects found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TrainingProjectsTable;
