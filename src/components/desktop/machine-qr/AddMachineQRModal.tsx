
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MachineQRCreateData } from '@/types/machine-qr';

interface AddMachineQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: MachineQRCreateData) => Promise<boolean>;
}

export const AddMachineQRModal: React.FC<AddMachineQRModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState<MachineQRCreateData>({
    machine_id: '',
    qr_name: '',
    machine_type: '',
    location_description: '',
    brand: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.machine_id.trim() || !formData.qr_name.trim()) {
      return;
    }

    setSaving(true);
    const success = await onAdd({
      machine_id: formData.machine_id.trim(),
      qr_name: formData.qr_name.trim(),
      machine_type: formData.machine_type?.trim() || undefined,
      location_description: formData.location_description?.trim() || undefined,
      brand: formData.brand?.trim() || undefined,
    });

    if (success) {
      setFormData({
        machine_id: '',
        qr_name: '',
        machine_type: '',
        location_description: '',
        brand: '',
      });
      onClose();
    }
    setSaving(false);
  };

  const handleClose = () => {
    setFormData({
      machine_id: '',
      qr_name: '',
      machine_type: '',
      location_description: '',
      brand: '',
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Machine + QR Entity</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Machine ID */}
          <div className="space-y-2">
            <Label htmlFor="machine-id">Machine ID *</Label>
            <Input
              id="machine-id"
              value={formData.machine_id}
              onChange={(e) => setFormData(prev => ({ ...prev, machine_id: e.target.value }))}
              placeholder="e.g., P-101 or P-101-A for sub-component"
              required
            />
          </div>

          {/* QR Name */}
          <div className="space-y-2">
            <Label htmlFor="qr-name">QR Name / Label *</Label>
            <Input
              id="qr-name"
              value={formData.qr_name}
              onChange={(e) => setFormData(prev => ({ ...prev, qr_name: e.target.value }))}
              placeholder="e.g., Main Coolant Pump - Emergency Stop"
              required
            />
          </div>

          {/* Machine Type */}
          <div className="space-y-2">
            <Label htmlFor="machine-type">Machine Type</Label>
            <Input
              id="machine-type"
              value={formData.machine_type}
              onChange={(e) => setFormData(prev => ({ ...prev, machine_type: e.target.value }))}
              placeholder="e.g., Pump, CNC Mill, Safety Barrier"
            />
          </div>

          {/* Location Description */}
          <div className="space-y-2">
            <Label htmlFor="location-description">Location Description</Label>
            <textarea
              id="location-description"
              value={formData.location_description}
              onChange={(e) => setFormData(prev => ({ ...prev, location_description: e.target.value }))}
              placeholder="e.g., Assembly Line 1, North End, by Pillar J7"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Brand */}
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
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
              onClick={handleClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.machine_id.trim() || !formData.qr_name.trim() || saving}
              className="oppr-button-primary"
            >
              {saving ? 'Saving & Generating QR...' : 'Save & Generate QR'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
