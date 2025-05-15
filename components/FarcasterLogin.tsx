'use client';

import { NeynarAuthButton, SIWN_variant } from '@neynar/react';

export default function FarcasterLogin() {
  return (
    <div style={{ marginTop: '2rem' }}>
      <NeynarAuthButton label="Login with Farcaster" variant={SIWN_variant.FARCASTER} />
    </div>
  );
}