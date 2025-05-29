
import React, { useState, useEffect } from 'react';
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [activeTab, setActiveTab] = useState('active');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDefinitions();
  }, [searchTerm]);

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

      // Fetch creator profiles separately to avoid relationship issues
      const creatorIds = [...new Set(data?.map(def => def.created_by).filter(Boolean))];
      let profiles: any[] = [];
      
      if (creatorIds.length > 0) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email')
          .in('id', creatorIds);
        
        if (profileError) {
          console.warn('Could not fetch creator profiles:', profileError);
        } else {
          profiles = profileData || [];
        }
      }

      // Transform the data to match our interface
      const transformedData: TrainingDefinitionWithLatestVersion[] = data?.map(def => {
        // Get the latest version for each definition
        const latestVersion = def.training_definition_versions
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

        // Find the creator profile
        const creatorProfile = profiles.find(p => p.id === def.created_by);

        if (latestVersion) {
          // Safely convert steps_json to StepBlock[]
          const steps_json = safeConvertToStepBlocks(latestVersion.steps_json);

          return {
            ...def,
            profiles: creatorProfile,
            latest_version: {
              ...latestVersion,
              steps_json
            }
          };
        }

        return {
          ...def,
          profiles: creatorProfile,
          latest_version: null
        };
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
    navigate('/desktop/training-definitions/new');
  };

  const activeDefinitions = definitions.filter(def => 
    def.latest_version?.status === 'draft' || def.latest_version?.status === 'published'
  );

  const archivedDefinitions = definitions.filter(def => 
    def.latest_version?.status === 'archived'
  );

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
          {/* Search */}
          <Input
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80"
          />
        </div>
      </div>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active ({activeDefinitions.length})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({archivedDefinitions.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-6">
          <TrainingDefinitionsTable 
            definitions={activeDefinitions}
            loading={loading}
            onRefresh={fetchDefinitions}
            showDeleteAction={false}
          />
        </TabsContent>
        
        <TabsContent value="archived" className="mt-6">
          <TrainingDefinitionsTable 
            definitions={archivedDefinitions}
            loading={loading}
            onRefresh={fetchDefinitions}
            showDeleteAction={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingDefinitions;
