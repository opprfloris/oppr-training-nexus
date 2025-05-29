
import React, { useState } from 'react';
import { PencilSquareIcon, EyeIcon, TrashIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { FloorPlanImage } from '@/types/floor-plans';

interface FloorPlanCardProps {
  floorPlan: FloorPlanImage;
  imageUrl: string;
  onEdit: () => void;
  onPreview: () => void;
  onDelete: () => void;
  onReplace: () => void;
}

export const FloorPlanCard: React.FC<FloorPlanCardProps> = ({
  floorPlan,
  imageUrl,
  onEdit,
  onPreview,
  onDelete,
  onReplace,
}) => {
  const [imageError, setImageError] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        {/* Thumbnail Image with proper aspect ratio */}
        <div className="mb-3 cursor-pointer" onClick={onPreview}>
          <AspectRatio ratio={4/3} className="bg-gray-100 rounded-lg overflow-hidden">
            {!imageError ? (
              <img
                src={imageUrl}
                alt={floorPlan.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-2xl">🏗️</span>
              </div>
            )}
          </AspectRatio>
        </div>

        {/* Floor Plan Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{floorPlan.name}</h3>

        {/* Description */}
        {floorPlan.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{floorPlan.description}</p>
        )}

        {/* Metadata */}
        <div className="space-y-1 text-xs text-gray-500 mb-4">
          <div>Uploaded: {formatDate(floorPlan.created_at)}</div>
          <div>Type: {floorPlan.file_type}</div>
          {floorPlan.width && floorPlan.height && (
            <div>Dimensions: {floorPlan.width} × {floorPlan.height}px</div>
          )}
          <div>Size: {formatFileSize(floorPlan.file_size)}</div>
          <div>Used in: {floorPlan.usage_count} training projects</div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              title="Edit Details"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <PencilSquareIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onReplace}
              title="Replace Image"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ArrowPathIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onPreview}
              title="Preview"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <EyeIcon className="w-4 h-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            title="Delete"
            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
