
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PlusIcon, TrashIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { TrainingProjectMarker } from '@/types/training-projects';

interface MachineQREntity {
  id: string;
  machine_id: string;
  qr_identifier: string;
  qr_name: string;
  machine_type: string | null;
  brand: string | null;
}

interface MarkerManagementProps {
  projectId: string;
  floorPlanId: string | null;
}

const MarkerManagement: React.FC<MarkerManagementProps> = ({
  projectId,
  floorPlanId
}) => {
  const [markers, setMarkers] = useState<TrainingProjectMarker[]>([]);
  const [machines, setMachines] = useState<MachineQREntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadMarkers();
    loadMachines();
  }, [projectId]);

  const loadMarkers = async () => {
    try {
      const { data, error } = await supabase
        .from('training_project_markers')
        .select(`
          *,
          machine_qr_entity:machine_qr_entities(*)
        `)
        .eq('training_project_id', projectId)
        .order('pin_number', { ascending: true });

      if (error) throw error;
      setMarkers(data || []);
    } catch (error) {
      console.error('Error loading markers:', error);
      toast({
        title: "Error",
        description: "Failed to load markers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMachines = async () => {
    try {
      const { data, error } = await supabase
        .from('machine_qr_entities')
        .select('*')
        .order('qr_name', { ascending: true });

      if (error) throw error;
      setMachines(data || []);
    } catch (error) {
      console.error('Error loading machines:', error);
    }
  };

  const addMarker = async () => {
    if (!floorPlanId) {
      toast({
        title: "No Floor Plan Selected",
        description: "Please select a floor plan first",
        variant: "destructive"
      });
      return;
    }

    try {
      setSaving(true);
      const newPinNumber = markers.length + 1;
      
      const { error } = await supabase
        .from('training_project_markers')
        .insert({
          training_project_id: projectId,
          machine_qr_entity_id: machines[0]?.id || '',
          pin_number: newPinNumber,
          x_position: 50, // Default center position
          y_position: 50,
          sequence_order: newPinNumber
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Marker added successfully"
      });
      
      await loadMarkers();
    } catch (error) {
      console.error('Error adding marker:', error);
      toast({
        title: "Error",
        description: "Failed to add marker",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteMarker = async (markerId: string) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('training_project_markers')
        .delete()
        .eq('id', markerId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Marker deleted successfully"
      });
      
      await loadMarkers();
    } catch (error) {
      console.error('Error deleting marker:', error);
      toast({
        title: "Error",
        description: "Failed to delete marker",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const updateMarker = async (markerId: string, updates: Partial<TrainingProjectMarker>) => {
    try {
      const { error } = await supabase
        .from('training_project_markers')
        .update(updates)
        .eq('id', markerId);

      if (error) throw error;
      await loadMarkers();
    } catch (error) {
      console.error('Error updating marker:', error);
      toast({
        title: "Error",
        description: "Failed to update marker",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-medium text-gray-900">Training Markers</h4>
        <Button 
          onClick={addMarker}
          disabled={saving || !floorPlanId || machines.length === 0}
          size="sm"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Marker
        </Button>
      </div>

      {!floorPlanId && (
        <div className="text-center py-8 bg-yellow-50 rounded-lg border border-yellow-200">
          <MapPinIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-sm text-yellow-700">Please select a floor plan to manage markers</p>
        </div>
      )}

      {machines.length === 0 && (
        <div className="text-center py-8 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-700">No machines available. Please add machines to the registry first.</p>
        </div>
      )}

      {markers.length === 0 && floorPlanId && machines.length > 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-sm font-medium text-gray-900 mb-2">No markers added yet</h3>
          <p className="text-sm text-gray-500 mb-4">Add markers to define training locations</p>
          <Button onClick={addMarker} disabled={saving}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add First Marker
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {markers.map((marker) => (
            <div key={marker.id} className="oppr-card p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-oppr-blue text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {marker.pin_number}
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Marker {marker.pin_number}</h5>
                    <p className="text-sm text-gray-500">
                      Position: {marker.x_position}%, {marker.y_position}%
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteMarker(marker.id)}
                  disabled={saving}
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Machine/QR</Label>
                  <select
                    value={marker.machine_qr_entity_id}
                    onChange={(e) => updateMarker(marker.id, { machine_qr_entity_id: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-oppr-blue focus:border-transparent"
                  >
                    {machines.map((machine) => (
                      <option key={machine.id} value={machine.id}>
                        {machine.qr_name} ({machine.qr_identifier})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Sequence Order</Label>
                  <Input
                    type="number"
                    min="1"
                    value={marker.sequence_order || marker.pin_number}
                    onChange={(e) => updateMarker(marker.id, { sequence_order: parseInt(e.target.value) })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarkerManagement;
