
import React, { useState } from 'react';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { CreateProjectModal } from '@/components/desktop/training-projects/CreateProjectModal';
import TrainingProjectsTable from '@/components/desktop/training-projects/TrainingProjectsTable';
import { useTrainingProjects } from '@/hooks/useTrainingProjects';

const TrainingProjects = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { projects, loading, createProject, deleteProject } = useTrainingProjects();

  const handleCreateProject = async (name: string, description?: string) => {
    const newProject = await createProject(name, description);
    return newProject;
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.project_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Training Projects Management</h1>
          <p className="text-gray-600">Organize and deploy training programs to your teams</p>
        </div>
        <button 
          className="oppr-button-primary flex items-center space-x-2"
          onClick={() => setShowCreateModal(true)}
        >
          <PlusIcon className="w-5 h-5" />
          <span>Create New Training Project</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative max-w-md">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oppr-blue focus:border-transparent"
          />
        </div>
        <button className="oppr-button-secondary flex items-center space-x-2">
          <FunnelIcon className="w-5 h-5" />
          <span>Filter</span>
        </button>
      </div>

      {/* Projects Table */}
      {filteredProjects.length > 0 || loading ? (
        <div className="oppr-card">
          <TrainingProjectsTable 
            projects={filteredProjects}
            loading={loading}
            onDelete={deleteProject}
          />
        </div>
      ) : (
        /* Empty State */
        <div className="oppr-card p-8 text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">📋</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No matching projects found' : 'No Training Projects Yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Try adjusting your search terms or create a new project'
              : 'Create your first training project to start organizing training programs'
            }
          </p>
          <button 
            className="oppr-button-primary"
            onClick={() => setShowCreateModal(true)}
          >
            Create Training Project
          </button>
        </div>
      )}

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
};

export default TrainingProjects;
