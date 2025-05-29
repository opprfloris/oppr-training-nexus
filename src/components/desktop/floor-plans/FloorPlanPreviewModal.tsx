
import React, { useState } from 'react';
import { XMarkIcon, MagnifyingGlassPlusIcon, MagnifyingGlassMinusIcon } from "@heroicons/react/24/outline";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { FloorPlanImage } from '@/types/floor-plans';

interface FloorPlanPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  floorPlan: FloorPlanImage | null;
  imageUrl: string;
}

export const FloorPlanPreviewModal: React.FC<FloorPlanPreviewModalProps> = ({
  isOpen,
  onClose,
  floorPlan,
  imageUrl,
}) => {
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!floorPlan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">{floorPlan.name}</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              title="Zoom Out"
            >
              <MagnifyingGlassMinusIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetZoom}
              title="Reset Zoom"
              className="text-xs px-2"
            >
              {Math.round(zoom * 100)}%
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              title="Zoom In"
            >
              <MagnifyingGlassPlusIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              title="Close"
            >
              <XMarkIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Image Container */}
        <div 
          className="relative overflow-hidden bg-gray-100 flex-1"
          style={{ height: '70vh' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className={`absolute inset-0 flex items-center justify-center ${
              isDragging ? 'cursor-grabbing' : zoom > 1 ? 'cursor-grab' : 'cursor-default'
            }`}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
            }}
          >
            <img
              src={imageUrl}
              alt={floorPlan.name}
              className="max-w-full max-h-full object-contain select-none"
              draggable={false}
            />
          </div>
        </div>

        {/* Footer with details */}
        {floorPlan.description && (
          <div className="p-4 border-t bg-gray-50">
            <p className="text-sm text-gray-600">{floorPlan.description}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
