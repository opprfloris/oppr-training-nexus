
import React, { useState, useMemo } from 'react';
import { CloudArrowUpIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FloorPlanCard } from '@/components/desktop/floor-plans/FloorPlanCard';
import { FloorPlanUploadModal } from '@/components/desktop/floor-plans/FloorPlanUploadModal';
import { FloorPlanEditModal } from '@/components/desktop/floor-plans/FloorPlanEditModal';
import { FloorPlanPreviewModal } from '@/components/desktop/floor-plans/FloorPlanPreviewModal';
import { useFloorPlans } from '@/hooks/useFloorPlans';
import { FloorPlanImage } from '@/types/floor-plans';

const FloorPlans = () => {
  const {
    floorPlans,
    loading,
    uploading,
    uploadFloorPlan,
    updateFloorPlan,
    deleteFloorPlan,
    getImageUrl,
  } = useFloorPlans();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'name-asc' | 'name-desc'>('date-desc');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingFloorPlan, setEditingFloorPlan] = useState<FloorPlanImage | null>(null);
  const [previewFloorPlan, setPreviewFloorPlan] = useState<FloorPlanImage | null>(null);

  // Filter and sort floor plans
  const filteredAndSortedFloorPlans = useMemo(() => {
    let filtered = floorPlans.filter(fp =>
      fp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (fp.description && fp.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'date-desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [floorPlans, searchQuery, sortBy]);

  const handleDelete = async (floorPlan: FloorPlanImage) => {
    const confirmMessage = floorPlan.usage_count > 0
      ? `"${floorPlan.name}" is currently used in ${floorPlan.usage_count} training project(s). Are you sure you want to delete it? This action cannot be undone.`
      : `Are you sure you want to delete "${floorPlan.name}"? This action cannot be undone.`;

    if (confirm(confirmMessage)) {
      await deleteFloorPlan(floorPlan);
    }
  };

  const handleReplace = (floorPlan: FloorPlanImage) => {
    // For now, just show a message. This could be implemented as a separate modal
    alert('Replace image functionality will be implemented in a future update.');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading floor plans...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Floor Plan Library</h1>
          <p className="text-gray-600">Manage facility layouts and spatial references for training</p>
        </div>
        <Button 
          className="oppr-button-primary flex items-center space-x-2"
          onClick={() => setShowUploadModal(true)}
        >
          <CloudArrowUpIcon className="w-5 h-5" />
          <span>Upload New Floor Plan</span>
        </Button>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between mb-6 space-x-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search floor plans by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <label htmlFor="sort" className="text-sm text-gray-600">Sort by:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="date-desc">Date Uploaded (Newest First)</option>
            <option value="date-asc">Date Uploaded (Oldest First)</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Floor Plans Grid */}
      {filteredAndSortedFloorPlans.length === 0 ? (
        <div className="oppr-card p-8 text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">🏗️</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No Floor Plans Found' : 'No Floor Plans Uploaded'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery 
              ? `No floor plans match "${searchQuery}". Try adjusting your search terms.`
              : 'Upload facility layouts to provide spatial context for your training programs'
            }
          </p>
          {!searchQuery && (
            <Button 
              className="oppr-button-primary"
              onClick={() => setShowUploadModal(true)}
            >
              Upload Floor Plan
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedFloorPlans.map((floorPlan) => (
            <FloorPlanCard
              key={floorPlan.id}
              floorPlan={floorPlan}
              imageUrl={getImageUrl(floorPlan.file_path)}
              onEdit={() => setEditingFloorPlan(floorPlan)}
              onPreview={() => setPreviewFloorPlan(floorPlan)}
              onDelete={() => handleDelete(floorPlan)}
              onReplace={() => handleReplace(floorPlan)}
            />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <FloorPlanUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={uploadFloorPlan}
        uploading={uploading}
      />

      {/* Edit Modal */}
      <FloorPlanEditModal
        isOpen={!!editingFloorPlan}
        onClose={() => setEditingFloorPlan(null)}
        floorPlan={editingFloorPlan}
        imageUrl={editingFloorPlan ? getImageUrl(editingFloorPlan.file_path) : ''}
        onUpdate={updateFloorPlan}
      />

      {/* Preview Modal */}
      <FloorPlanPreviewModal
        isOpen={!!previewFloorPlan}
        onClose={() => setPreviewFloorPlan(null)}
        floorPlan={previewFloorPlan}
        imageUrl={previewFloorPlan ? getImageUrl(previewFloorPlan.file_path) : ''}
      />
    </div>
  );
};

export default FloorPlans;
