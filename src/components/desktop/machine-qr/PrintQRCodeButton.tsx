
import React from 'react';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MachineQREntity } from '@/types/machine-qr';

interface PrintQRCodeButtonProps {
  entity: MachineQREntity;
  qrCodeUrl: string;
}

export const PrintQRCodeButton: React.FC<PrintQRCodeButtonProps> = ({ entity, qrCodeUrl }) => {
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

  return (
    <Button onClick={handlePrint} disabled={!qrCodeUrl} className="ml-4">
      <Printer className="w-4 h-4 mr-2" />
      Print QR Code
    </Button>
  );
};
