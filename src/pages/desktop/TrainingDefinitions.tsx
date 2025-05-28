
import React, { useState, useEffect } from 'react';
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TrainingDefinitionWithLatestVersion, StepBlock } from '@/types/training-definitions';
import TrainingDefinitionsTable from '@/components/desktop/training-definitions/TrainingDefinitionsTable';
import { useNavigate } from 'react-router-dom';

// Type guard to safely convert Json to StepBlock[]
const isStepBlockArray = (value: any): value is StepBlock[] => {
  return Array.isArray(value) && value.every((item: any) => 
    item && 
    typeof item === 'object' && 
    typeof item.id === 'string' &&
    typeof item.type === 'string' &&
    typeof item.order === 'number' &&
    item.config !== undefined
  );
};

const safeConvertToStepBlocks = (value: any): StepBlock[] => {
  if (isStepBlockArray(value)) {
    return value;
  }
  return [];
};

const TrainingDefinitions = () => {
  const [definitions, setDefinitions] = useState<TrainingDefinitionWithLatestVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();
  const navigate = useNavigate();

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
          training_definition_versions!inner (
            id,
            version_number,
            status,
            created_at,
            published_at,
            training_definition_id,
            version_notes,
            steps_json
          )
        `)
        .order('created_at', { ascending: false });

      // Apply search filter
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform the data to match our interface
      const transformedData: TrainingDefinitionWithLatestVersion[] = data?.map(def => {
        // Get the latest version for each definition
        const latestVersion = def.training_definition_versions
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

        if (latestVersion) {
          // Safely convert steps_json to StepBlock[]
          const steps_json = safeConvertToStepBlocks(latestVersion.steps_json);

          return {
            ...def,
            latest_version: {
              ...latestVersion,
              steps_json
            }
          };
        }

        return {
          ...def,
          latest_version: null
        };
      }).filter(def => {
        // Apply status filter
        if (statusFilter === 'all') return true;
        return def.latest_version?.status === statusFilter;
      }) || [];

      setDefinitions(transformedData);

    } catch (error) {
      console.error('Error fetching training definitions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch training definitions",
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
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Training Definitions</h1>
        <p className="text-gray-600 mt-1">
          Create and manage reusable training content templates
        </p>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between">
        <Button 
          onClick={handleCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          New Definition
        </Button>

        <div className="flex items-center space-x-4">
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search */}
          <Input
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80"
          />
        </div>
      </div>

      {/* Table */}
      <TrainingDefinitionsTable 
        definitions={definitions}
        loading={loading}
        onRefresh={fetchDefinitions}
      />
    </div>
  );
};

export default TrainingDefinitions;
