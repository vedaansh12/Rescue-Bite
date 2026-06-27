import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function QRScanner({ onScan }) {
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: 250 });
    scanner.render((decodedText) => {
      onScan(decodedText);
      scanner.clear();
    }, (err) => {});
    scannerRef.current = scanner;
    return () => { scanner.clear(); };
  }, []);

  return <div id="reader" className="w-full max-w-sm mx-auto" />;
}