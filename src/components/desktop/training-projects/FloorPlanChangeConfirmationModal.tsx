
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface FloorPlanChangeConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  markerCount: number;
}

const FloorPlanChangeConfirmationModal: React.FC<FloorPlanChangeConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  markerCount
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-amber-500" />
            <DialogTitle>Change Floor Plan?</DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-600 mb-4">
            Changing the floor plan will remove all existing markers from this training project.
          </p>
          
          {markerCount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-amber-800 font-medium">
                {markerCount} marker{markerCount !== 1 ? 's' : ''} will be permanently deleted.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-amber-600 hover:bg-amber-700">
            Continue & Delete Markers
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FloorPlanChangeConfirmationModal;
