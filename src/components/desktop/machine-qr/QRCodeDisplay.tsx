
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { MachineQREntity } from '@/types/machine-qr';

interface QRCodeDisplayProps {
  entity: MachineQREntity;
  onQRCodeGenerated: (url: string) => void;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ entity, onQRCodeGenerated }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    generateQRCode();
  }, [entity]);

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
      onQRCodeGenerated(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  return (
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
  );
};
