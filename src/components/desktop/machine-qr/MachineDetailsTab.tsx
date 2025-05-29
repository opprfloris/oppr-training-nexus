
import React from 'react';
import { MachineQREntity } from '@/types/machine-qr';

interface MachineDetailsTabProps {
  entity: MachineQREntity;
}

export const MachineDetailsTab: React.FC<MachineDetailsTabProps> = ({ entity }) => {
  // Mock usage data - in a real implementation, this would come from the backend
  const mockUsageData = [
    { projectName: "Q3 Production Line Safety Refresher", markerInfo: "Marker Pin #1: ES-01" },
    { projectName: "New Employee Onboarding", markerInfo: "Marker Pin #3: PUMP-01" },
  ];

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-4">
        <h4 className="font-semibold text-lg">Machine Information</h4>
        <div className="space-y-2">
          <div>
            <label className="text-sm font-medium text-gray-600">Machine ID</label>
            <p className="font-mono text-sm">{entity.machine_id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">QR Identifier</label>
            <p className="font-mono text-sm">{entity.qr_identifier}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Name</label>
            <p>{entity.qr_name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Type</label>
            <p>{entity.machine_type || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Brand</label>
            <p>{entity.brand || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Location</label>
            <p>{entity.location_description || '-'}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-lg">Usage Information</h4>
        {entity.usage_count > 0 ? (
          <div className="space-y-3">
            <p className="text-sm font-medium">Used in {entity.usage_count} training project(s):</p>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {mockUsageData.map((usage, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-sm">{usage.projectName}</div>
                  <div className="text-xs text-gray-600">{usage.markerInfo}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Not currently used in any training projects.</p>
        )}
        
        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600">
            Created: {new Date(entity.created_at).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">
            Last Updated: {new Date(entity.updated_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};
