
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PencilSquareIcon,
  TrashIcon,
  ClockIcon,
  EyeIcon,
  PlayIcon,
  PauseIcon,
  ArchiveBoxIcon
} from "@heroicons/react/24/outline";
import { TrainingProject, ProjectStatus } from '@/types/training-projects';
import ConfirmationDialog from '../ConfirmationDialog';
import { useTrainingProjects } from '@/hooks/useTrainingProjects';

interface ProjectHeaderProps {
  project: TrainingProject;
  saving?: boolean;
  onSave?: () => Promise<void>;
  onProjectUpdate?: (updates: Partial<TrainingProject>) => void;
}

const ProjectHeader = ({ project, saving, onSave, onProjectUpdate }: ProjectHeaderProps) => {
  const navigate = useNavigate();
  const { deleteProject, updateProject } = useTrainingProjects();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (newStatus: ProjectStatus) => {
    try {
      await updateProject(project.id, { status: newStatus });
      if (onProjectUpdate) {
        onProjectUpdate({ status: newStatus });
      }
    } catch (error) {
      console.error('Failed to update project status:', error);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProject(project.id);
    } catch (error) {
      console.error('Failed to delete project:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'published': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'stopped': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: ProjectStatus) => {
    switch (status) {
      case 'draft': return <ClockIcon className="w-4 h-4" />;
      case 'published': return <EyeIcon className="w-4 h-4" />;
      case 'active': return <PlayIcon className="w-4 h-4" />;
      case 'stopped': return <PauseIcon className="w-4 h-4" />;
      case 'archived': return <ArchiveBoxIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
      <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
        <div className="ml-4 mt-2">
          <h3 className="text-lg font-medium leading-6 text-gray-900">{project.name}</h3>
        </div>
        <div className="ml-4 mt-2 flex-shrink-0">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {getStatusIcon(project.status)}
            <span className="ml-1">{project.status}</span>
          </span>
          <button
            type="button"
            onClick={() => navigate(`/desktop/training-projects/${project.id}/edit`)}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ml-2"
          >
            <PencilSquareIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteDialog(true)}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ml-2"
          >
            <TrashIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
            Delete
          </button>
          <ConfirmationDialog
            isOpen={showDeleteDialog}
            title="Delete Training Project"
            message={`Are you sure you want to delete ${project.name}? This action cannot be undone.`}
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteDialog(false)}
            isLoading={isDeleting}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
