'use client';

import { NeynarAuthButton } from '@neynar/react';

export default function FarcasterLogin() {
  return (
    <div style={{ marginTop: '2rem' }}>
      <NeynarAuthButton label="Login with Farcaster" variant="farcaster" />
    </div>
  );
}
