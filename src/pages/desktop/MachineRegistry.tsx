
import React, { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMachineQR } from '@/hooks/useMachineQR';
import { MachineQRTable } from '@/components/desktop/machine-qr/MachineQRTable';
import { AddMachineQRModal } from '@/components/desktop/machine-qr/AddMachineQRModal';
import { EditMachineQRModal } from '@/components/desktop/machine-qr/EditMachineQRModal';
import { ViewMachineModal } from '@/components/desktop/machine-qr/ViewMachineModal';
import { BulkUploadModal } from '@/components/desktop/machine-qr/BulkUploadModal';
import { ColumnVisibilitySettings, defaultVisibility, ColumnVisibility } from '@/components/desktop/machine-qr/ColumnVisibilitySettings';
import { MachineQREntity } from '@/types/machine-qr';

const MachineRegistry = () => {
  const {
    entities,
    loading,
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    locationFilter,
    setLocationFilter,
    createEntity,
    bulkCreateEntities,
    updateEntity,
    deleteEntity,
  } = useMachineQR();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<MachineQREntity | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(defaultVisibility);

  useEffect(() => {
    // Load saved column visibility settings from localStorage
    const savedVisibility = localStorage.getItem('machineQRColumnVisibility');
    if (savedVisibility) {
      try {
        setColumnVisibility(JSON.parse(savedVisibility));
      } catch (error) {
        console.error('Error loading column visibility settings:', error);
        // Use default if parsing fails
        setColumnVisibility(defaultVisibility);
      }
    }
  }, []);

  const handleEdit = (entity: MachineQREntity) => {
    setSelectedEntity(entity);
    setShowEditModal(true);
  };

  const handleView = (entity: MachineQREntity) => {
    setSelectedEntity(entity);
    setShowViewModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this machine QR entity?')) {
      await deleteEntity(id);
    }
  };

  // Get unique machine types and locations for filters
  const uniqueTypes = Array.from(new Set(entities.map(e => e.machine_type).filter(Boolean)));
  const uniqueLocations = Array.from(new Set(
    entities.map(e => e.location_description).filter(Boolean)
      .map(loc => loc?.split(',')[0]?.trim()) // Take first part before comma
      .filter(Boolean)
  ));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Machine & QR Registry</h1>
          <p className="text-gray-600">Manage equipment catalog and QR code assignments</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            className="flex items-center space-x-2"
            variant="outline"
            onClick={() => setShowBulkUploadModal(true)}
          >
            <ArrowUpTrayIcon className="w-5 h-5" />
            <span>Bulk Upload</span>
          </Button>
          <Button 
            className="oppr-button-primary flex items-center space-x-2"
            onClick={() => setShowAddModal(true)}
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add New Machine+QR</span>
          </Button>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center space-x-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative max-w-md">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search by Machine ID, QR Name, Brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Machine Type Filter */}
        <div className="min-w-0">
          <Label htmlFor="type-filter" className="sr-only">Machine Type</Label>
          <select
            id="type-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oppr-blue focus:border-transparent"
          >
            <option value="">All Types</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div className="min-w-0">
          <Label htmlFor="location-filter" className="sr-only">Location Group</Label>
          <select
            id="location-filter"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oppr-blue focus:border-transparent"
          >
            <option value="">All Locations</option>
            {uniqueLocations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        {/* Column Visibility */}
        <ColumnVisibilitySettings 
          visibility={columnVisibility}
          onVisibilityChange={setColumnVisibility}
        />
      </div>

      {/* Machine QR Table */}
      <MachineQRTable
        entities={entities}
        loading={loading}
        columnVisibility={columnVisibility}
        onEdit={handleEdit}
        onViewUsage={handleView}
        onDelete={handleDelete}
      />

      {/* Modals */}
      <AddMachineQRModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={createEntity}
      />

      <EditMachineQRModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedEntity(null);
        }}
        entity={selectedEntity}
        onUpdate={updateEntity}
      />

      <ViewMachineModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedEntity(null);
        }}
        entity={selectedEntity}
      />

      <BulkUploadModal
        isOpen={showBulkUploadModal}
        onClose={() => setShowBulkUploadModal(false)}
        onBulkCreate={bulkCreateEntities}
      />
    </div>
  );
};

export default MachineRegistry;
