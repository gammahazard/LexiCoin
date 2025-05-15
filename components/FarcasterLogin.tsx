'use client';

import { useEffect, useState } from 'react';
import { NeynarAuthButton, SIWN_variant } from '@neynar/react';

export default function FarcasterLogin() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2500); // ~2.5 second delay
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
      {loading ? (
        <p style={{ color: '#aaa' }}>Logging into previous session if it exists...</p>
      ) : (
        <NeynarAuthButton label="Login with Farcaster" variant={SIWN_variant.FARCASTER} />
      )}
    </div>
  );
}
