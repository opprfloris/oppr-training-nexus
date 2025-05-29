
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useFloorPlans } from '@/hooks/useFloorPlans';
import { FloorPlanUploadModal } from '@/components/desktop/floor-plans/FloorPlanUploadModal';
import { PhotoIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

interface FloorPlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFloorPlanSelect: (floorPlanId: string) => void;
  selectedFloorPlanId: string | null;
}

const FloorPlanSelectionModal: React.FC<FloorPlanSelectionModalProps> = ({
  isOpen,
  onClose,
  onFloorPlanSelect,
  selectedFloorPlanId
}) => {
  const { floorPlans, loading, uploadFloorPlan, uploading, getImageUrl } = useFloorPlans();
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleFloorPlanSelect = (floorPlanId: string) => {
    onFloorPlanSelect(floorPlanId);
    onClose();
  };

  const handleUpload = async (uploadData: any) => {
    const success = await uploadFloorPlan(uploadData);
    if (success) {
      setShowUploadModal(false);
    }
    return success;
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Select Floor Plan</DialogTitle>
              <Button
                onClick={() => setShowUploadModal(true)}
                variant="outline"
                size="sm"
              >
                <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
                Upload New
              </Button>
            </div>
          </DialogHeader>

          {floorPlans.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-sm font-medium text-gray-900 mb-2">No floor plans available</h3>
              <p className="text-sm text-gray-500 mb-4">Upload a floor plan to get started</p>
              <Button onClick={() => setShowUploadModal(true)} variant="outline">
                <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
                Upload Floor Plan
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {floorPlans.map((floorPlan) => (
                <div
                  key={floorPlan.id}
                  className={`relative border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedFloorPlanId === floorPlan.id
                      ? 'border-oppr-blue bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleFloorPlanSelect(floorPlan.id)}
                >
                  <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                    <img
                      src={getImageUrl(floorPlan.file_path)}
                      alt={floorPlan.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-full h-full flex items-center justify-center">
                      <PhotoIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  <h5 className="font-medium text-gray-900 truncate text-sm">{floorPlan.name}</h5>
                  {floorPlan.description && (
                    <p className="text-xs text-gray-500 truncate">{floorPlan.description}</p>
                  )}
                  {floorPlan.width && floorPlan.height && (
                    <p className="text-xs text-gray-400 mt-1">
                      {floorPlan.width} × {floorPlan.height}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <FloorPlanUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
        uploading={uploading}
      />
    </>
  );
};

export default FloorPlanSelectionModal;
