
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
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setPendingMarkerPosition({ x, y });
    setShowMachineModal(true);
  };

  const handleMachineSelect = async (machine: MachineQREntity) => {
    if (!pendingMarkerPosition) return;

    try {
      setSaving(true);
      const newPinNumber = markers.length + 1;

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
    if (!imageRef.current) return;

    const startX = event.clientX;
    const startY = event.clientY;
    const rect = imageRef.current.getBoundingClientRect();

    const handleMouseMove = (e: MouseEvent) => {
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      // Update marker position visually (you might want to add state for this)
      const markerElement = document.getElementById(`marker-${markerId}`);
      if (markerElement) {
        markerElement.style.left = `${Math.max(0, Math.min(100, x))}%`;
        markerElement.style.top = `${Math.max(0, Math.min(100, y))}%`;
      }
    };

    const handleMouseUp = async (e: MouseEvent) => {
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

      try {
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
      }

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <>
      <div className="relative bg-gray-100 rounded-lg overflow-hidden border">
        <img
          ref={imageRef}
          src={getImageUrl(`floor-plan-images/${floorPlanId}`)}
          alt="Floor Plan"
          className="w-full h-auto cursor-crosshair"
          onClick={handleImageClick}
          onError={(e) => {
            console.error('Error loading floor plan image');
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        
        {/* Markers overlay */}
        {markers.map((marker) => (
          <div
            key={marker.id}
            id={`marker-${marker.id}`}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move hover:scale-110 transition-transform"
            style={{
              left: `${marker.x_position}%`,
              top: `${marker.y_position}%`
            }}
            onMouseDown={(e) => handleMarkerDrag(marker.id, e)}
            title={`Marker ${marker.pin_number}`}
          >
            <div className="w-8 h-8 bg-oppr-blue text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white">
              {marker.pin_number}
            </div>
          </div>
        ))}

        {/* Pending marker (while placing) */}
        {pendingMarkerPosition && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
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
