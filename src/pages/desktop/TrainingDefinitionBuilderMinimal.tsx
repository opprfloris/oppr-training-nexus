
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const TrainingDefinitionBuilderMinimal = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  // State management
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  
  console.log('TrainingDefinitionBuilderMinimal loaded with id:', id);
  
  const isNewDefinition = id === 'new';

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

  // Simple save functionality (Phase 2 - no database calls yet)
  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);

    // Simulate save operation
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Success",
        description: isNewDefinition 
          ? "Training definition created successfully!" 
          : "Training definition updated successfully!",
      });
      
      console.log('Saved training definition:', { title, description, isNew: isNewDefinition });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save training definition",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNewDefinition ? 'Create New Training Definition' : `Edit Training Definition ${id}`}
        </h1>
        <p className="text-gray-600 mt-2">
          Phase 2: Basic state management and validation - {isNewDefinition ? 'New Definition' : 'Existing Definition'}
        </p>
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
        <p className="text-sm text-gray-600">Status: Phase 2 complete</p>
      </div>
    </div>
  );
};

export default TrainingDefinitionBuilderMinimal;
