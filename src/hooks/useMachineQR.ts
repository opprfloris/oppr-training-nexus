
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MachineQREntity, MachineQRCreateData, MachineQRUpdateData } from '@/types/machine-qr';

export const useMachineQR = () => {
  const [entities, setEntities] = useState<MachineQREntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const { toast } = useToast();

  const fetchEntities = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('machine_qr_entities')
        .select('*')
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      setEntities(data || []);
    } catch (error) {
      console.error('Error fetching machine QR entities:', error);
      toast({
        title: 'Error',
        description: 'Failed to load machine QR entities',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createEntity = async (entityData: MachineQRCreateData): Promise<boolean> => {
    try {
      // First generate a unique QR identifier
      const { data: qrData, error: qrError } = await supabase
        .rpc('generate_qr_identifier');

      if (qrError) throw qrError;

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('machine_qr_entities')
        .insert({
          ...entityData,
          qr_identifier: qrData,
          created_by: userData.user.id,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Machine QR entity created with ID: ${qrData}`,
      });

      await fetchEntities();
      return true;
    } catch (error) {
      console.error('Error creating machine QR entity:', error);
      toast({
        title: 'Error',
        description: 'Failed to create machine QR entity',
        variant: 'destructive',
      });
      return false;
    }
  };

  const bulkCreateEntities = async (entityDataArray: MachineQRCreateData[]): Promise<boolean> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      let successCount = 0;
      let errorCount = 0;

      // Process entities in batches to avoid rate limiting
      const batchSize = 10;
      for (let i = 0; i < entityDataArray.length; i += batchSize) {
        const batch = entityDataArray.slice(i, i + batchSize);
        
        // Process each entity in the batch
        const batchPromises = batch.map(async (entityData) => {
          try {
            // Generate QR identifier for each entity
            const { data: qrData, error: qrError } = await supabase
              .rpc('generate_qr_identifier');

            if (qrError) throw qrError;

            const { error } = await supabase
              .from('machine_qr_entities')
              .insert({
                ...entityData,
                qr_identifier: qrData,
                created_by: userData.user.id,
              });

            if (error) throw error;
            successCount++;
            return true;
          } catch (error) {
            console.error('Error creating entity in bulk operation:', error);
            errorCount++;
            return false;
          }
        });

        // Wait for all entities in this batch to be processed
        await Promise.all(batchPromises);
      }

      if (errorCount === 0) {
        toast({
          title: 'Success',
          description: `Bulk upload complete: ${successCount} entities created successfully`,
        });
      } else {
        toast({
          title: 'Partial Success',
          description: `${successCount} entities created, ${errorCount} failed`,
          variant: 'destructive',
        });
      }

      await fetchEntities();
      return successCount > 0;
    } catch (error) {
      console.error('Error in bulk create operation:', error);
      toast({
        title: 'Error',
        description: 'Bulk upload failed',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateEntity = async (id: string, updates: MachineQRUpdateData): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('machine_qr_entities')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Machine QR entity updated successfully',
      });

      await fetchEntities();
      return true;
    } catch (error) {
      console.error('Error updating machine QR entity:', error);
      toast({
        title: 'Error',
        description: 'Failed to update machine QR entity',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteEntity = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('machine_qr_entities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Machine QR entity deleted successfully',
      });

      await fetchEntities();
      return true;
    } catch (error) {
      console.error('Error deleting machine QR entity:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete machine QR entity',
        variant: 'destructive',
      });
      return false;
    }
  };

  const filteredEntities = entities.filter(entity => {
    const matchesSearch = searchTerm === '' || 
      entity.machine_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.qr_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.qr_identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entity.brand && entity.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (entity.machine_type && entity.machine_type.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === '' || entity.machine_type === typeFilter;
    const matchesLocation = locationFilter === '' || 
      (entity.location_description && entity.location_description.includes(locationFilter));

    return matchesSearch && matchesType && matchesLocation;
  });

  useEffect(() => {
    fetchEntities();
  }, []);

  return {
    entities: filteredEntities,
    loading,
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    locationFilter,
    setLocationFilter,
    createEntity,
    bulkCreateEntities,
    updateEntity,
    deleteEntity,
    refreshEntities: fetchEntities,
  };
};
