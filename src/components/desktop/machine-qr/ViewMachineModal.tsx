
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MachineQREntity } from '@/types/machine-qr';
import { QRCodeDisplay } from './QRCodeDisplay';
import { MachineDetailsTab } from './MachineDetailsTab';
import { PrintQRCodeButton } from './PrintQRCodeButton';

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

  const handleQRCodeGenerated = (url: string) => {
    setQrCodeUrl(url);
  };

  if (!entity) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Machine Details: {entity.qr_name}</span>
            <PrintQRCodeButton entity={entity} qrCodeUrl={qrCodeUrl} />
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="qrcode" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="qrcode">QR Code</TabsTrigger>
            <TabsTrigger value="details">Details & Usage</TabsTrigger>
          </TabsList>

          <TabsContent value="qrcode" className="space-y-6">
            <QRCodeDisplay entity={entity} onQRCodeGenerated={handleQRCodeGenerated} />
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <MachineDetailsTab entity={entity} />
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
