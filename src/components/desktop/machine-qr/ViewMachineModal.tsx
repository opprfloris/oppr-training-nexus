
import React, { useEffect, useState } from 'react';
import * as QRCode from 'qrcode';
import { Printer, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MachineQREntity } from '@/types/machine-qr';

interface ViewMachineModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: MachineQREntity | null;
}

export const ViewMachineModal: React.FC<ViewMachineModalProps> = ({
  isOpen,
  onClose,
  entity,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    if (entity && isOpen) {
      generateQRCode();
    }
  }, [entity, isOpen]);

  const generateQRCode = async () => {
    if (!entity) return;
    
    try {
      const qrData = JSON.stringify({
        machineId: entity.machine_id,
        qrId: entity.qr_identifier,
        name: entity.qr_name,
      });
      
      const url = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeUrl(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handlePrint = () => {
    if (!entity || !qrCodeUrl) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${entity.machine_id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              background: white;
            }
            .qr-container {
              text-align: center;
              border: 2px solid #000;
              padding: 20px;
              background: white;
              max-width: 400px;
            }
            .machine-id {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #000;
            }
            .qr-identifier {
              font-size: 16px;
              margin-bottom: 20px;
              color: #666;
              font-family: monospace;
            }
            .qr-code {
              margin: 20px 0;
            }
            .qr-name {
              font-size: 18px;
              margin-top: 15px;
              color: #000;
            }
            @media print {
              body { margin: 0; }
              .qr-container { border: 2px solid #000; }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <div class="machine-id">${entity.machine_id}</div>
            <div class="qr-identifier">${entity.qr_identifier}</div>
            <div class="qr-code">
              <img src="${qrCodeUrl}" alt="QR Code" />
            </div>
            <div class="qr-name">${entity.qr_name}</div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  if (!entity) return null;

  // Mock usage data - in a real implementation, this would come from the backend
  const mockUsageData = [
    { projectName: "Q3 Production Line Safety Refresher", markerInfo: "Marker Pin #1: ES-01" },
    { projectName: "New Employee Onboarding", markerInfo: "Marker Pin #3: PUMP-01" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Machine Details: {entity.qr_name}</span>
            <Button onClick={handlePrint} disabled={!qrCodeUrl} className="ml-4">
              <Printer className="w-4 h-4 mr-2" />
              Print QR Code
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="qrcode" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="qrcode">QR Code</TabsTrigger>
            <TabsTrigger value="details">Details & Usage</TabsTrigger>
          </TabsList>

          <TabsContent value="qrcode" className="space-y-6">
            <div className="flex flex-col items-center space-y-4 py-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">{entity.machine_id}</h3>
                <p className="text-lg text-gray-600 font-mono">{entity.qr_identifier}</p>
                <p className="text-lg">{entity.qr_name}</p>
              </div>
              
              {qrCodeUrl && (
                <div className="border-2 border-gray-300 p-4 rounded-lg bg-white">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code" 
                    className="mx-auto"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
              )}
              
              <p className="text-sm text-gray-500 text-center max-w-md">
                This QR code contains the machine identification data. Scan with the training app to access machine-specific content.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
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
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
