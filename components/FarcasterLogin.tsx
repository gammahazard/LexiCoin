'use client';

import { useEffect, useState } from 'react';
import { NeynarAuthButton, SIWN_variant } from '@neynar/react';
import styles from './WordleGame.module.css';

export default function FarcasterLogin() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={styles.gameContainer}>
      <div className={styles.logoTitleWrapper}>
        <div className={styles.logo}>
          <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="48" stroke="#F1C40F" strokeWidth="4" fill="black" />
            <text x="50%" y="55%" textAnchor="middle" fill="#F1C40F" fontSize="28" fontWeight="bold" dy=".3em">
              ₿
            </text>
          </svg>
        </div>
        <div className={styles.title}>LexiCoin</div>
      </div>

      <p className={styles.description}>
        Guess the correct word within 6 tries. Play the daily challenge to earn points and compete, or just practise!
      </p>

      {loading ? (
        <div style={{ marginTop: '1rem', color: 'var(--text)', fontSize: '1rem' }}>
          Logging into previous session...
        </div>
      ) : (
        <NeynarAuthButton
          label="Login with Farcaster"
          variant={SIWN_variant.FARCASTER}
        />
      )}
    </div>
  );
}
