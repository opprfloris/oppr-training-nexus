
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FloorPlanImage, FloorPlanUploadData } from '@/types/floor-plans';
import { useToast } from '@/hooks/use-toast';

export const useFloorPlans = () => {
  const [floorPlans, setFloorPlans] = useState<FloorPlanImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const fetchFloorPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('floor_plan_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFloorPlans(data || []);
    } catch (error) {
      console.error('Error fetching floor plans:', error);
      toast({
        title: "Error",
        description: "Failed to load floor plans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadFloorPlan = async (uploadData: FloorPlanUploadData) => {
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Upload file to storage
      const fileExt = uploadData.file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadResult, error: uploadError } = await supabase.storage
        .from('floor-plan-images')
        .upload(fileName, uploadData.file);

      if (uploadError) throw uploadError;

      // Get image dimensions
      const img = new Image();
      const imageUrl = URL.createObjectURL(uploadData.file);
      
      const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
        img.onload = () => {
          resolve({ width: img.width, height: img.height });
          URL.revokeObjectURL(imageUrl);
        };
        img.src = imageUrl;
      });

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('floor_plan_images')
        .insert({
          name: uploadData.name,
          description: uploadData.description || null,
          file_path: uploadResult.path,
          file_type: uploadData.file.type,
          file_size: uploadData.file.size,
          width: dimensions.width,
          height: dimensions.height,
          created_by: user.id,
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Floor plan uploaded successfully",
      });

      await fetchFloorPlans();
      return true;
    } catch (error) {
      console.error('Error uploading floor plan:', error);
      toast({
        title: "Error",
        description: "Failed to upload floor plan",
        variant: "destructive",
      });
      return false;
    } finally {
      setUploading(false);
    }
  };

  const updateFloorPlan = async (id: string, updates: { name: string; description?: string }) => {
    try {
      const { error } = await supabase
        .from('floor_plan_images')
        .update({
          name: updates.name,
          description: updates.description || null,
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Floor plan updated successfully",
      });

      await fetchFloorPlans();
      return true;
    } catch (error) {
      console.error('Error updating floor plan:', error);
      toast({
        title: "Error",
        description: "Failed to update floor plan",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteFloorPlan = async (floorPlan: FloorPlanImage) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('floor-plan-images')
        .remove([floorPlan.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('floor_plan_images')
        .delete()
        .eq('id', floorPlan.id);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Floor plan deleted successfully",
      });

      await fetchFloorPlans();
      return true;
    } catch (error) {
      console.error('Error deleting floor plan:', error);
      toast({
        title: "Error",
        description: "Failed to delete floor plan",
        variant: "destructive",
      });
      return false;
    }
  };

  const getImageUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('floor-plan-images')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  useEffect(() => {
    fetchFloorPlans();
  }, []);

  return {
    floorPlans,
    loading,
    uploading,
    uploadFloorPlan,
    updateFloorPlan,
    deleteFloorPlan,
    getImageUrl,
    refetch: fetchFloorPlans,
  };
};
