// WordleGame.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './WordleGame.module.css';
import { getDailyWord, getRandomWord, WORD_LIST } from '../utils/word';
import { useNeynarContext } from '@neynar/react';
import DailyMode from './DailyMode';
import PracticeMode from './PractiseMode';

const MAX_TIME_SECONDS = 420;

const WordleGame = () => {
  const { user } = useNeynarContext();
  const [mode, setMode] = useState<'daily' | 'practice' | null>(null);
  const [timeToReset, setTimeToReset] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    const now = new Date();
    const nextReset = new Date(now);
    nextReset.setUTCHours(0, 0, 0, 0);
    nextReset.setUTCDate(now.getUTCDate() + 1);
    setTimeToReset(Math.floor((nextReset.getTime() - now.getTime()) / 1000));
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeToReset(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user?.display_name) {
      fetch(`https://api.gummybera.com:8443/api/daily-status?username=${encodeURIComponent(user.display_name)}`)
        .then(res => res.json())
        .then(data => setHasPlayed(data.hasPlayed))
        .catch(err => console.error('Failed to check daily status:', err));
    }
  }, [user]);

  async function fetchLeaderboard() {
    try {
      const res = await fetch('https://api.gummybera.com:8443/api/leaderboard');
      const data = await res.json();
      setLeaderboard(data);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    }
  }

  const hours = Math.floor(timeToReset / 3600);
  const minutes = Math.floor((timeToReset % 3600) / 60);
  const seconds = timeToReset % 60;

  if (!mode) {
    return (
      <div className={styles.gameContainer}>
        <h2>Welcome, {user?.display_name || user?.username}!</h2>
        <button className={styles.playAgain} onClick={() => setMode('daily')} disabled={hasPlayed}>
          Start Daily Challenge
        </button>
        <button className={styles.menu} onClick={() => setMode('practice')}>
          Practice Mode
        </button>
        {hasPlayed && (
          <p className={styles.timer}>
            Next reset in: {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </p>
        )}
        {leaderboard.length > 0 && (
          <div className={styles.leaderboard}>
            <h2>Leaderboard</h2>
            <ul>
              {leaderboard.map((entry, i) => (
                <li key={i}>
                  {entry.username}: {entry.totalScore} pts (Played: {entry.gamesPlayed})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return mode === 'daily' ? (
    <DailyMode
      user={user}
      setMode={setMode}
      setHasPlayed={setHasPlayed}
    />
  ) : (
    <PracticeMode
      setMode={setMode}
    />
  );
};

export default WordleGame;
