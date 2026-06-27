import { useEffect, useState } from 'react';

export default function CountdownTimer({ expiry }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calc = () => {
      const diff = new Date(expiry) - new Date();
      if (diff <= 0) { setTimeLeft('Expired'); return; }
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`);
    };
    calc();
    const timer = setInterval(calc, 1000);
    return () => clearInterval(timer);
  }, [expiry]);

  return <span className="text-sm font-mono text-orange-600">{timeLeft}</span>;
}