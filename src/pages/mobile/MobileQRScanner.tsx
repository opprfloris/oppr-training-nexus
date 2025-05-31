
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";

const MobileQRScanner = () => {
  const navigate = useNavigate();
  const [scanStatus, setScanStatus] = useState<'scanning' | 'detected' | 'validating' | 'success' | 'error'>('scanning');
  const [message, setMessage] = useState("Align QR code within the frame");

  // Simulate QR scanning process
  useEffect(() => {
    const timer = setTimeout(() => {
      setScanStatus('detected');
      setMessage('QR Code Detected!');
      
      setTimeout(() => {
        setScanStatus('validating');
        setMessage('Validating...');
        
        setTimeout(() => {
          setScanStatus('success');
          setMessage('Success! Proceeding to next step...');
          
          setTimeout(() => {
            navigate('/mobile/training-execution/123');
          }, 1500);
        }, 2000);
      }, 1000);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const getStatusColor = () => {
    switch (scanStatus) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'validating': return 'text-yellow-600';
      default: return 'text-white';
    }
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          <h1 className="text-white font-semibold">Scan QR Code</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Camera View Placeholder */}
      <div className="h-full flex items-center justify-center relative">
        {/* Simulated camera background */}
        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          
          {/* QR Code Viewfinder */}
          <div className="relative">
            <div className="w-64 h-64 border-4 border-white rounded-2xl relative">
              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-oppr-blue rounded-tl-lg"></div>
              <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-oppr-blue rounded-tr-lg"></div>
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-oppr-blue rounded-bl-lg"></div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-oppr-blue rounded-br-lg"></div>
              
              {/* Scanning animation */}
              {scanStatus === 'scanning' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-1 bg-oppr-blue animate-pulse"></div>
                </div>
              )}
              
              {/* Success checkmark */}
              {scanStatus === 'success' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl">✓</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Message */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-6">
        <div className="text-center">
          <p className={`text-lg font-semibold ${getStatusColor()}`}>
            {message}
          </p>
          
          {scanStatus === 'validating' && (
            <div className="mt-4 flex justify-center">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}
          
          {scanStatus === 'error' && (
            <button
              onClick={() => {
                setScanStatus('scanning');
                setMessage('Align QR code within the frame');
              }}
              className="mt-4 px-6 py-3 bg-oppr-blue text-white font-medium rounded-xl hover:bg-oppr-blue/90"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileQRScanner;
