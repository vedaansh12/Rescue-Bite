import { useEffect, useState } from 'react';
import API from '../services/api';
import { QRCodeSVG } from 'qrcode.react';
import CountdownTimer from '../components/CountdownTimer';
import Layout from '../components/Layout';

export default function MyClaimPage() {
  const [claim, setClaim] = useState(null);

  const fetchClaim = async () => {
    try {
      const { data } = await API.get('/claims/active');
      setClaim(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchClaim(); }, []);

  return (
    <Layout>
      <div className="p-4 max-w-lg mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Your <span className="text-green-400">Claim</span>
        </h2>
        {!claim ? (
          <div className="glass-card p-8 text-center text-gray-400">
            No active claim. Go grab a leftover pack!
          </div>
        ) : (
          <div className="glass-card p-6 text-center">
            <p className="text-xl font-semibold mb-2">{claim.pack?.description}</p>
            <p className="text-gray-400 mb-4">from {claim.pack?.canteen?.name}</p>
            <div className="bg-white p-4 rounded-lg inline-block mb-4">
              <QRCodeSVG value={claim.qrCodeData} size={180} />
            </div>
            <p className="text-sm text-gray-300 mb-2">Token: {claim.token}</p>
            <p className="text-sm font-medium">
              Collect by: <CountdownTimer expiry={claim.expiry} />
            </p>
            <p className="text-xs text-gray-500 mt-4">Show this QR to the canteen staff</p>
          </div>
        )}
      </div>
    </Layout>
  );
}