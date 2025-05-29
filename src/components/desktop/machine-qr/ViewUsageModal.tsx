
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MachineQREntity } from '@/types/machine-qr';

interface ViewUsageModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: MachineQREntity | null;
}

export const ViewUsageModal: React.FC<ViewUsageModalProps> = ({
  isOpen,
  onClose,
  entity,
}) => {
  if (!entity) return null;

  // Mock usage data - in a real implementation, this would come from the backend
  const mockUsageData = [
    { projectName: "Q3 Production Line Safety Refresher", markerInfo: "Marker Pin #1: ES-01" },
    { projectName: "New Employee Onboarding", markerInfo: "Marker Pin #3: PUMP-01" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Usage of QR: {entity.qr_name}</DialogTitle>
          <p className="text-sm text-gray-600">ID: {entity.qr_identifier}</p>
        </DialogHeader>

        <div className="space-y-4">
          {entity.usage_count > 0 ? (
            <div className="space-y-3">
              <p className="text-sm font-medium">Used in {entity.usage_count} training project(s):</p>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {mockUsageData.map((usage, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-sm">{usage.projectName}</div>
                    <div className="text-xs text-gray-600">{usage.markerInfo}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">This QR entity is not currently used in any training projects.</p>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
