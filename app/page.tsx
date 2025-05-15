'use client';

import { useState, useEffect } from 'react';
import { useNeynarContext, NeynarProfileCard } from '@neynar/react';
import FarcasterLogin from '../components/FarcasterLogin';
import WordleGame from '../components/WordleGame';

export default function Home() {
  const { user } = useNeynarContext();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [dailyScore, setDailyScore] = useState<number | null>(null);
  const [timeToReset, setTimeToReset] = useState(0);

  // ✅ Sync user to DB when logged in
  useEffect(() => {
    if (!user || !user.display_name || !user.fid) return;

    const username = user.display_name.trim();
    const fid = user.fid;

    if (!username) return;

    fetch('https://api.gummybera.com:8443/api/update-username', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, fid })
    })
      .then(() => {
        console.log('[Sync] User created/confirmed in DB:', username);
      })
      .catch(err => {
        console.error('Failed to sync user to DB:', err);
      });
  }, [user]);

  // ⏱️ Timer for daily reset
  useEffect(() => {
    const now = new Date();
    const nextReset = new Date(now);
    nextReset.setUTCHours(0, 0, 0, 0);
    nextReset.setUTCDate(now.getUTCDate() + 1);
    setTimeToReset(Math.floor((nextReset.getTime() - now.getTime()) / 1000));

    const interval = setInterval(() => {
      setTimeToReset((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 📊 Fetch daily score
  useEffect(() => {
    if (user?.display_name) {
      fetch(`https://api.gummybera.com:8443/api/daily-status?username=${encodeURIComponent(user.display_name)}`)
        .then(res => res.json())
        .then(data => {
          if (data.hasPlayed && typeof data.score === 'number') {
            setDailyScore(data.score);
          }
        })
        .catch(err => console.error('Failed to fetch daily score:', err));
    }
  }, [user]);

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const hours = Math.floor(timeToReset / 3600);
  const minutes = Math.floor((timeToReset % 3600) / 60);
  const seconds = timeToReset % 60;

  if (!user) {
    return (
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <FarcasterLogin />
      </main>
    );
  }

  return (
    <main style={{ padding: '1rem', textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1rem' }}>Welcome, {user.display_name}</h1>
      <div style={{ marginBottom: '1rem', maxWidth: '100%' }}>
        <NeynarProfileCard fid={user.fid} />
      </div>

      <div style={{ margin: '1rem 0' }}>
        <button
          onClick={() => setShowHowToPlay(true)}
          style={{
            backgroundColor: '#3498db',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '0.6rem 1rem',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          ? How to Play
        </button>
      </div>

      <WordleGame />

      {dailyScore !== null && (
        <p style={{ color: '#aaa', fontSize: '1rem', marginTop: '1rem' }}>
          You've already played today. Your score was: <strong>{dailyScore}</strong><br />
          Next reset in: {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </p>
      )}

      <div style={{ marginTop: '2rem' }}>
        <button
          onClick={() => setShowConfirm(true)}
          style={{
            backgroundColor: '#e74c3c',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '0.8rem 1.2rem',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Logout
        </button>
      </div>

      {showConfirm && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: '#222',
            padding: '2rem',
            borderRadius: '10px',
            textAlign: 'center',
            color: '#fff',
            width: '90%',
            maxWidth: '300px'
          }}>
            <p style={{ marginBottom: '1rem' }}>Are you sure you want to logout?</p>
            <button
              onClick={logout}
              style={{
                backgroundColor: '#e74c3c',
                border: 'none',
                color: '#fff',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                marginRight: '1rem',
                cursor: 'pointer'
              }}
            >
              Yes, Logout
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              style={{
                backgroundColor: '#555',
                border: 'none',
                color: '#fff',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showHowToPlay && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: '#222',
            padding: '1.5rem',
            borderRadius: '10px',
            color: '#fff',
            maxWidth: '400px',
            textAlign: 'left',
            width: '90%'
          }}>
            <h2 style={{ marginBottom: '0.75rem', color: 'var(--accent)' }}>How to Play</h2>
            <ul style={{ paddingLeft: '1.2rem' }}>
              <li>You have 6 tries to guess the 6-letter word.</li>
              <li>Type your guess using the on-screen keyboard.</li>
              <li>Each guess must be a valid English word.</li>
              <li>Correct letters turn <span style={{ color: 'var(--correct)' }}>green</span>.</li>
              <li>Correct letters in the wrong position turn <span style={{ color: 'var(--present)' }}>yellow</span>.</li>
              <li>Incorrect letters turn <span style={{ color: 'var(--absent)' }}>gray</span>.</li>
              <li>Daily Challenge can only be played once per day and gives you points.</li>
              <li>Practice Mode allows unlimited plays but doesn’t earn points.</li>
            </ul>
            <button
              onClick={() => setShowHowToPlay(false)}
              style={{
                marginTop: '1rem',
                backgroundColor: 'var(--accent)',
                border: 'none',
                color: '#000',
                padding: '0.6rem 1.2rem',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
