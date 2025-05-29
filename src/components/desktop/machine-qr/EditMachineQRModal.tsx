
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MachineQREntity, MachineQRUpdateData } from '@/types/machine-qr';

interface EditMachineQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: MachineQREntity | null;
  onUpdate: (id: string, updates: MachineQRUpdateData) => Promise<boolean>;
}

export const EditMachineQRModal: React.FC<EditMachineQRModalProps> = ({
  isOpen,
  onClose,
  entity,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    machine_id: '',
    qr_name: '',
    machine_type: '',
    location_description: '',
    brand: '',
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (entity) {
      setFormData({
        machine_id: entity.machine_id,
        qr_name: entity.qr_name,
        machine_type: entity.machine_type || '',
        location_description: entity.location_description || '',
        brand: entity.brand || '',
      });
    }
  }, [entity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!entity || !formData.machine_id.trim() || !formData.qr_name.trim()) {
      return;
    }

    setUpdating(true);
    const success = await onUpdate(entity.id, {
      machine_id: formData.machine_id.trim(),
      qr_name: formData.qr_name.trim(),
      machine_type: formData.machine_type?.trim() || undefined,
      location_description: formData.location_description?.trim() || undefined,
      brand: formData.brand?.trim() || undefined,
    });

    if (success) {
      onClose();
    }
    setUpdating(false);
  };

  if (!entity) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Machine + QR Entity - {entity.machine_id} / {entity.qr_name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* QR Identifier (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="qr-identifier">QR Identifier (System Generated)</Label>
            <Input
              id="qr-identifier"
              value={entity.qr_identifier}
              readOnly
              className="bg-gray-100"
            />
          </div>

          {/* Machine ID */}
          <div className="space-y-2">
            <Label htmlFor="edit-machine-id">Machine ID *</Label>
            <Input
              id="edit-machine-id"
              value={formData.machine_id}
              onChange={(e) => setFormData(prev => ({ ...prev, machine_id: e.target.value }))}
              placeholder="e.g., P-101 or P-101-A for sub-component"
              required
            />
          </div>

          {/* QR Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-qr-name">QR Name / Label *</Label>
            <Input
              id="edit-qr-name"
              value={formData.qr_name}
              onChange={(e) => setFormData(prev => ({ ...prev, qr_name: e.target.value }))}
              placeholder="e.g., Main Coolant Pump - Emergency Stop"
              required
            />
          </div>

          {/* Machine Type */}
          <div className="space-y-2">
            <Label htmlFor="edit-machine-type">Machine Type</Label>
            <Input
              id="edit-machine-type"
              value={formData.machine_type}
              onChange={(e) => setFormData(prev => ({ ...prev, machine_type: e.target.value }))}
              placeholder="e.g., Pump, CNC Mill, Safety Barrier"
            />
          </div>

          {/* Location Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-location-description">Location Description</Label>
            <textarea
              id="edit-location-description"
              value={formData.location_description}
              onChange={(e) => setFormData(prev => ({ ...prev, location_description: e.target.value }))}
              placeholder="e.g., Assembly Line 1, North End, by Pillar J7"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Brand */}
          <div className="space-y-2">
            <Label htmlFor="edit-brand">Brand</Label>
            <Input
              id="edit-brand"
              value={formData.brand}
              onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
              placeholder="e.g., Siemens, KUKA"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.machine_id.trim() || !formData.qr_name.trim() || updating}
              className="oppr-button-primary"
            >
              {updating ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
