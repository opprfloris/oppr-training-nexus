
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FloorPlanImage } from '@/types/floor-plans';

interface FloorPlanEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  floorPlan: FloorPlanImage | null;
  imageUrl: string;
  onUpdate: (id: string, updates: { name: string; description?: string }) => Promise<boolean>;
}

export const FloorPlanEditModal: React.FC<FloorPlanEditModalProps> = ({
  isOpen,
  onClose,
  floorPlan,
  imageUrl,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (floorPlan) {
      setFormData({
        name: floorPlan.name,
        description: floorPlan.description || '',
      });
    }
  }, [floorPlan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!floorPlan || !formData.name.trim()) {
      return;
    }

    setUpdating(true);
    const success = await onUpdate(floorPlan.id, {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
    });

    if (success) {
      onClose();
    }
    setUpdating(false);
  };

  if (!floorPlan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Floor Plan Details - {floorPlan.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Thumbnail Preview */}
          <div className="space-y-2">
            <Label>Current Image</Label>
            <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={imageUrl}
                alt={floorPlan.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Floor Plan Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-name">Floor Plan Name *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Assembly Line 1 - Overview"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="e.g., Main production floor layout, updated Q1 2025"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
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
              disabled={!formData.name.trim() || updating}
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
