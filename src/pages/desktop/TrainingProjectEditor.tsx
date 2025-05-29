
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CheckBadgeIcon, PlayIcon } from "@heroicons/react/24/outline";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TrainingProject, mapDatabaseToTrainingProject } from '@/types/training-projects';

const TrainingProjectEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<TrainingProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('training_projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Map database response to our TypeScript interface
      const mappedProject = mapDatabaseToTrainingProject(data);
      setProject(mappedProject);
    } catch (error) {
      console.error('Error loading training project:', error);
      toast({
        title: "Error",
        description: "Failed to load training project",
        variant: "destructive"
      });
      navigate('/desktop/training-projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!project) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('training_projects')
        .update({
          name: project.name,
          description: project.description,
          color_code: project.color_code,
          icon: project.icon,
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Training project saved successfully",
      });
    } catch (error) {
      console.error('Error saving training project:', error);
      toast({
        title: "Error",
        description: "Failed to save training project",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      draft: 'text-amber-600 border-amber-200 bg-amber-50',
      scheduled: 'text-blue-600 border-blue-200 bg-blue-50',
      active: 'text-green-600 border-green-200 bg-green-50',
      stopped: 'text-red-600 border-red-200 bg-red-50',
      archived: 'text-gray-600 border-gray-200 bg-gray-50',
    };

    return (
      <Badge variant="outline" className={colors[status as keyof typeof colors] || ''}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Training project not found</p>
        <Button 
          variant="outline" 
          onClick={() => navigate('/desktop/training-projects')}
          className="mt-4"
        >
          Back to Training Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <button 
          onClick={() => navigate('/desktop/training-projects')}
          className="hover:text-gray-900 flex items-center space-x-1"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Training Projects</span>
        </button>
        <span>/</span>
        <span className="text-gray-900">{project.project_id}</span>
        <span>/</span>
        <span className="text-gray-900">Edit</span>
        <span>/</span>
        <span className="text-gray-900 capitalize">{activeTab.replace('-', ' & ')}</span>
      </div>

      {/* Project Header */}
      <div className="oppr-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              {getStatusBadge(project.status)}
            </div>
            <p className="text-gray-600 mb-1">ID: {project.project_id}</p>
            {project.description && (
              <p className="text-gray-600">{project.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Draft Project'}
            </Button>
            <Button variant="outline" size="sm">
              <CheckBadgeIcon className="w-4 h-4 mr-2" />
              Readiness Check
            </Button>
            <Button className="bg-oppr-blue hover:bg-oppr-blue/90">
              <PlayIcon className="w-4 h-4 mr-2" />
              Activate Project
            </Button>
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <div className="oppr-card">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b px-6">
            <TabsList className="grid w-full grid-cols-6 bg-transparent h-auto p-0">
              <TabsTrigger value="settings" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-oppr-blue rounded-none pb-3">
                Settings & Shell
              </TabsTrigger>
              <TabsTrigger value="floor-plan" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-oppr-blue rounded-none pb-3">
                Floor Plan & Markers
              </TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-oppr-blue rounded-none pb-3">
                Content Assembly
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-oppr-blue rounded-none pb-3">
                User Access
              </TabsTrigger>
              <TabsTrigger value="parameters" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-oppr-blue rounded-none pb-3">
                Parameters & Activation
              </TabsTrigger>
              <TabsTrigger value="statistics" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-oppr-blue rounded-none pb-3">
                Statistics
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="settings" className="mt-0 p-6">
            <div className="space-y-8">
              <h3 className="text-lg font-medium">Project Settings & Shell</h3>
              <div className="grid gap-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Training Project ID
                  </label>
                  <input
                    type="text"
                    value={project.project_id}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Training Project Name *
                  </label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => setProject({ ...project, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-oppr-blue focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={project.description || ''}
                    onChange={(e) => setProject({ ...project, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-oppr-blue focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color Code
                    </label>
                    <input
                      type="color"
                      value={project.color_code}
                      onChange={(e) => setProject({ ...project, color_code: e.target.value })}
                      className="w-full h-12 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon
                    </label>
                    <input
                      type="text"
                      value={project.icon}
                      onChange={(e) => setProject({ ...project, icon: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-oppr-blue focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="floor-plan" className="mt-0 p-6">
            <div className="space-y-8">
              <h3 className="text-lg font-medium">Floor Plan & Markers</h3>
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-lg mb-2">Floor plan and marker management will be implemented here</p>
                <p className="text-sm text-gray-500">
                  This will include floor plan selection/upload and interactive marker placement
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="mt-0 p-6">
            <div className="space-y-8">
              <h3 className="text-lg font-medium">Content Assembly</h3>
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-lg mb-2">Content assembly interface will be implemented here</p>
                <p className="text-sm text-gray-500">
                  This will include marker sequencing and training definition assignment
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-0 p-6">
            <div className="space-y-8">
              <h3 className="text-lg font-medium">User Access</h3>
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-lg mb-2">User assignment interface will be implemented here</p>
                <p className="text-sm text-gray-500">
                  This will include operator and collaborator assignment
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="parameters" className="mt-0 p-6">
            <div className="space-y-8">
              <h3 className="text-lg font-medium">Parameters & Activation</h3>
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-lg mb-2">Parameters and activation controls will be implemented here</p>
                <p className="text-sm text-gray-500">
                  This will include activation period, success criteria, and readiness checks
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="statistics" className="mt-0 p-6">
            <div className="space-y-8">
              <h3 className="text-lg font-medium">Project Statistics</h3>
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <Button className="bg-oppr-blue hover:bg-oppr-blue/90 mb-4">
                  View Project Statistics Dashboard
                </Button>
                <p className="text-sm text-gray-500">
                  Navigate to the project-specific performance dashboard
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TrainingProjectEditor;
