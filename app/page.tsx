'use client';

import { useNeynarContext, NeynarProfileCard } from '@neynar/react';
import FarcasterLogin from '../components/FarcasterLogin';
import WordleGame from '../components/WordleGame';

export default function Home() {
  const { user } = useNeynarContext();

  if (!user) {
    return (
      <main style={{ padding: '2rem' }}>
        <h1>Welcome to LexiCoin</h1>
        <FarcasterLogin />
      </main>
    );
  }

  return (
    <main style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h1>Welcome, {user.display_name || `@${user.username}`}</h1>
        <NeynarProfileCard fid={user.fid} />
      </div>
      <WordleGame />
    </main>
  );
}
