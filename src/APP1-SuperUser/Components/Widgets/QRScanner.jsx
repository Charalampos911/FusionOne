import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function CameraQRScanner({ onScanSuccess }) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const html5QrcodeRef = useRef(null);

  const startCamera = async () => {
    setError(null);
    const html5Qrcode = new Html5Qrcode('qr-reader');
    html5QrcodeRef.current = html5Qrcode;

    try {
      await html5Qrcode.start(
        { facingMode: 'environment' }, // Prefers rear camera on mobile
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          stopCamera();
          onScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Frame-by-frame parse errors ignored
        }
      );
      setIsScanning(true);
    } catch (err) {
      setError('Unable to access camera. Please allow camera permissions.');
      console.error('Camera start error:', err);
    }
  };

  const stopCamera = async () => {
    if (html5QrcodeRef.current && html5QrcodeRef.current.isScanning) {
      try {
        await html5QrcodeRef.current.stop();
        html5QrcodeRef.current.clear();
        setIsScanning(false);
      } catch (err) {
        console.error('Failed to stop camera:', err);
      }
    }
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
      <div 
        id="qr-reader" 
        style={{ 
          width: '100%', 
          minHeight: isScanning ? '300px' : '0px', 
          backgroundColor: '#000',
          borderRadius: '8px',
          overflow: 'hidden'
        }} 
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!isScanning ? (
        <button 
          onClick={startCamera}
          style={{ padding: '12px 24px', fontSize: '16px', marginTop: '10px', cursor: 'pointer' }}
        >
          Open Camera to Scan
        </button>
      ) : (
        <button 
          onClick={stopCamera}
          style={{ padding: '10px 20px', fontSize: '14px', marginTop: '10px', cursor: 'pointer' }}
        >
          Stop Camera
        </button>
      )}
    </div>
  );
}