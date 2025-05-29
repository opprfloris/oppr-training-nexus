
import React, { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useFloorPlans } from '@/hooks/useFloorPlans';
import { TrainingProjectMarker } from '@/types/training-projects';
import MachineSelectionModal from './MachineSelectionModal';

interface FloorPlanViewerProps {
  floorPlanId: string;
  projectId: string;
  markers: TrainingProjectMarker[];
  onMarkersChange: () => void;
}

interface MachineQREntity {
  id: string;
  machine_id: string;
  qr_identifier: string;
  qr_name: string;
  machine_type: string | null;
  brand: string | null;
  location_description: string | null;
}

const FloorPlanViewer: React.FC<FloorPlanViewerProps> = ({
  floorPlanId,
  projectId,
  markers,
  onMarkersChange
}) => {
  const { getImageUrl } = useFloorPlans();
  const [showMachineModal, setShowMachineModal] = useState(false);
  const [pendingMarkerPosition, setPendingMarkerPosition] = useState<{ x: number; y: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    if (!imageRef.current || saving) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    console.log('Image clicked at:', { x, y });
    setPendingMarkerPosition({ x, y });
    setShowMachineModal(true);
  };

  const handleMachineSelect = async (machine: MachineQREntity) => {
    if (!pendingMarkerPosition) return;

    try {
      setSaving(true);
      const newPinNumber = markers.length + 1;

      console.log('Adding marker:', {
        projectId,
        machineId: machine.id,
        pinNumber: newPinNumber,
        position: pendingMarkerPosition
      });

      const { error } = await supabase
        .from('training_project_markers')
        .insert({
          training_project_id: projectId,
          machine_qr_entity_id: machine.id,
          pin_number: newPinNumber,
          x_position: pendingMarkerPosition.x,
          y_position: pendingMarkerPosition.y,
          sequence_order: newPinNumber
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Marker added successfully"
      });

      onMarkersChange();
      setPendingMarkerPosition(null);
      setShowMachineModal(false);
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

  const handleMarkerDrag = async (markerId: string, event: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || saving) return;

    event.preventDefault();
    const rect = imageRef.current.getBoundingClientRect();

    const handleMouseMove = (e: MouseEvent) => {
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

      const markerElement = document.getElementById(`marker-${markerId}`);
      if (markerElement) {
        markerElement.style.left = `${x}%`;
        markerElement.style.top = `${y}%`;
      }
    };

    const handleMouseUp = async (e: MouseEvent) => {
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

      try {
        setSaving(true);
        const { error } = await supabase
          .from('training_project_markers')
          .update({ x_position: x, y_position: y })
          .eq('id', markerId);

        if (error) throw error;
        onMarkersChange();
      } catch (error) {
        console.error('Error updating marker position:', error);
        toast({
          title: "Error",
          description: "Failed to update marker position",
          variant: "destructive"
        });
      } finally {
        setSaving(false);
      }

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Construct the correct image URL - check if floorPlanId already includes the path prefix
  const imageUrl = floorPlanId.startsWith('floor-plan-images/') 
    ? getImageUrl(floorPlanId)
    : getImageUrl(`floor-plan-images/${floorPlanId}`);

  return (
    <>
      <div className="relative bg-gray-100 rounded-lg overflow-hidden border">
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Floor Plan"
          className="w-full h-auto cursor-crosshair"
          onClick={handleImageClick}
          onError={(e) => {
            console.error('Error loading floor plan image:', e);
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        
        {/* Markers overlay */}
        {markers.map((marker) => (
          <div
            key={marker.id}
            id={`marker-${marker.id}`}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move hover:scale-110 transition-transform z-10"
            style={{
              left: `${marker.x_position}%`,
              top: `${marker.y_position}%`
            }}
            onMouseDown={(e) => handleMarkerDrag(marker.id, e)}
            title={`Marker ${marker.pin_number}: ${marker.machine_qr_entity?.qr_name || 'Unknown'}`}
          >
            <div className="w-8 h-8 bg-oppr-blue text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white">
              {marker.sequence_order || marker.pin_number}
            </div>
          </div>
        ))}

        {/* Pending marker (while placing) */}
        {pendingMarkerPosition && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-pulse z-20"
            style={{
              left: `${pendingMarkerPosition.x}%`,
              top: `${pendingMarkerPosition.y}%`
            }}
          >
            <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white">
              ?
            </div>
          </div>
        )}

        {saving && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          </div>
        )}
      </div>

      <MachineSelectionModal
        isOpen={showMachineModal}
        onClose={() => {
          setShowMachineModal(false);
          setPendingMarkerPosition(null);
        }}
        onMachineSelect={handleMachineSelect}
      />
    </>
  );
};

export default FloorPlanViewer;
