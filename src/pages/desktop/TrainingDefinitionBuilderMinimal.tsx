
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TrainingDefinition, TrainingDefinitionVersion } from '@/types/training-definitions';
import { fetchDefinitionAndVersion } from '@/services/trainingDefinitionService';
import { saveDraft } from '@/services/trainingDefinitionSaveService';

const TrainingDefinitionBuilderMinimal = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State management
  const [definition, setDefinition] = useState<TrainingDefinition | null>(null);
  const [version, setVersion] = useState<TrainingDefinitionVersion | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  console.log('TrainingDefinitionBuilderMinimal loaded with id:', id);
  
  const isNewDefinition = id === 'new';

  // Load existing definition if editing
  useEffect(() => {
    if (isNewDefinition) {
      setLoading(false);
      return;
    }

    if (id) {
      loadDefinition();
    }
  }, [id, isNewDefinition]);

  const loadDefinition = async () => {
    if (!id || id === 'new') return;

    try {
      setLoading(true);
      const { definition: defData, version: versionData } = await fetchDefinitionAndVersion(id);
      
      setDefinition(defData);
      setTitle(defData.title);
      setDescription(defData.description || '');
      setVersion(versionData);

    } catch (error) {
      console.error('Error loading training definition:', error);
      toast({
        title: "Error",
        description: "Failed to load training definition",
        variant: "destructive"
      });
      navigate('/desktop/training-definitions');
    } finally {
      setLoading(false);
    }
  };

  // Basic validation
  const validateForm = () => {
    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a title for the training definition",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  // Real database save functionality (Phase 3)
  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);

      const result = await saveDraft({
        title,
        description,
        steps: [], // Empty steps for now - will add in Phase 4
        isNewDefinition,
        definition,
        version
      });

      setDefinition(result.definition);
      setVersion(result.version);

      if (result.isNew) {
        toast({
          title: "Success",
          description: "Training definition created and saved as draft (v0.1)",
        });
        // Navigate to the editor with the new ID
        navigate(`/desktop/training-definitions/${result.definition.id}`, { replace: true });
      } else {
        toast({
          title: "Success",
          description: "Draft saved successfully",
        });
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error",
        description: "Failed to save draft",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNewDefinition ? 'Create New Training Definition' : `Edit Training Definition`}
        </h1>
        <p className="text-gray-600 mt-2">
          Phase 3: Database integration - {isNewDefinition ? 'New Definition' : 'Existing Definition'}
        </p>
        {version && (
          <p className="text-sm text-gray-500 mt-1">
            Current version: {version.version_number} ({version.status})
          </p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              placeholder="Enter training definition title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-4">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-2">Debug Info:</h3>
        <p className="text-sm text-gray-600">Route ID: {id}</p>
        <p className="text-sm text-gray-600">Is New: {isNewDefinition ? 'Yes' : 'No'}</p>
        <p className="text-sm text-gray-600">Title: {title || 'Not set'}</p>
        <p className="text-sm text-gray-600">Description: {description || 'Not set'}</p>
        <p className="text-sm text-gray-600">Definition ID: {definition?.id || 'None'}</p>
        <p className="text-sm text-gray-600">Version: {version?.version_number || 'None'}</p>
        <p className="text-sm text-gray-600">Status: Phase 3 complete - Database integrated</p>
      </div>
    </div>
  );
};

export default TrainingDefinitionBuilderMinimal;
