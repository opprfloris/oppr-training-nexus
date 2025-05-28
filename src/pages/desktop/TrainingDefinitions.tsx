
import React, { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import TrainingDefinitionsTable from '@/components/desktop/training-definitions/TrainingDefinitionsTable';
import { TrainingDefinition, TrainingDefinitionWithLatestVersion } from '@/types/training-definitions';

const TrainingDefinitions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [definitions, setDefinitions] = useState<TrainingDefinitionWithLatestVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchDefinitions();
  }, [searchTerm, statusFilter]);

  const fetchDefinitions = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('training_definitions')
        .select(`
          *,
          training_definition_versions (
            id,
            version_number,
            status,
            created_at,
            published_at
          )
        `)
        .order('updated_at', { ascending: false });

      // Add search filter
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Process the data to get latest versions and apply status filter
      const processedDefinitions = data?.map(def => {
        const versions = def.training_definition_versions || [];
        const latestVersion = versions.reduce((latest, current) => {
          if (!latest) return current;
          return new Date(current.created_at) > new Date(latest.created_at) ? current : latest;
        }, null);

        return {
          ...def,
          latest_version: latestVersion
        };
      }).filter(def => {
        if (statusFilter === 'all') return true;
        return def.latest_version?.status === statusFilter;
      }) || [];

      setDefinitions(processedDefinitions);
    } catch (error) {
      console.error('Error fetching training definitions:', error);
      toast({
        title: "Error",
        description: "Failed to load training definitions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigate('/desktop/training-definitions/builder/new');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Training Definitions</h1>
          <p className="text-gray-600">Manage your reusable training content and procedures</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="oppr-button-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>New Definition</span>
        </button>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between space-x-4 mb-6">
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search by Title or Description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oppr-blue focus:border-transparent"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
            Status:
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-oppr-blue focus:border-transparent"
          >
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Training Definitions Table */}
      <TrainingDefinitionsTable 
        definitions={definitions}
        loading={loading}
        onRefresh={fetchDefinitions}
      />
    </div>
  );
};

export default TrainingDefinitions;
