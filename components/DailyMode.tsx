'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './WordleGame.module.css';
import { getDailyWord, WORD_LIST } from '../utils/word';

const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 6;
const MAX_TIME_SECONDS = 420;

export default function DailyMode({ user, setMode, setHasPlayed }: {
  user: any;
  setMode: (mode: null) => void;
  setHasPlayed: (played: boolean) => void;
}) {
  const [targetWord, setTargetWord] = useState(getDailyWord().toLowerCase());
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(MAX_TIME_SECONDS);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [endReason, setEndReason] = useState<"win" | "giveup" | "timeout" | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setMessage(`Time's up! The word was ${targetWord.toUpperCase()}`);
          setGameOver(true);
          setFinalScore(0);
          setEndReason("timeout");
          submitScore(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetWord]);

  const submitScore = async (score: number) => {
    const username = user?.display_name || user?.username || 'guest';
    try {
      await fetch('https://api.gummybera.com:8443/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, score, mode: 'daily' })
      });
      setHasPlayed(true);
    } catch (err) {
      console.error('Score submission failed:', err);
    }
  };

  const submitGuess = () => {
    const guessLower = currentGuess.toLowerCase();
    if (guessLower.length !== WORD_LENGTH) return;
    if (!WORD_LIST.includes(guessLower)) {
      setMessage('Not in word list');
      return;
    }

    const newGuesses = [...guesses, currentGuess.toUpperCase()];
    setGuesses(newGuesses);
    setCurrentGuess('');
    setMessage('');

    if (guessLower === targetWord) {
      const attemptBonus = (MAX_ATTEMPTS - newGuesses.length) * 50;
      const speedBonus = Math.floor(timeLeft / 10);
      const score = 100 + attemptBonus + speedBonus;
      setFinalScore(score);
      setEndReason("win");
      setMessage(`You win! Score: ${score}`);
      setGameOver(true);
      submitScore(score);
    } else if (newGuesses.length === MAX_ATTEMPTS) {
      setMessage(`Game Over. The word was ${targetWord.toUpperCase()}`);
      setFinalScore(0);
      setEndReason("timeout");
      setGameOver(true);
      submitScore(0);
    }
  };

  const handleClick = (key: string) => {
    if (gameOver) return;
    if (key === 'ENTER') {
      if (currentGuess.length === WORD_LENGTH) submitGuess();
    } else if (key === 'DELETE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + key.toUpperCase());
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (window.innerWidth <= 768) return;
    const key = e.key.toUpperCase();
    handleClick(key === 'BACKSPACE' ? 'DELETE' : key);
  }, [currentGuess, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const getTileStatus = (letter: string, index: number, guess: string) => {
    if (!guess) return '';
    if (letter === targetWord[index]) return styles.correct;
    else if (targetWord.includes(letter)) return styles.present;
    return styles.absent;
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.timer}>
        Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
      </div>

      <div className={styles.grid}>
        {[...Array(MAX_ATTEMPTS)].map((_, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {[...Array(WORD_LENGTH)].map((_, colIndex) => {
              const guess = guesses[rowIndex];
              const letter = guess?.[colIndex] || (rowIndex === guesses.length ? currentGuess[colIndex] || '' : '');
              const status = guess ? getTileStatus(letter.toLowerCase(), colIndex, guess.toLowerCase()) : '';
              return (
                <div key={colIndex} className={`${styles.cell} ${status}`.trim()}>
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <p className={styles.message}>{message}</p>

      <div className={styles.keyboard}>
        {[
          ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
          ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
          ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
        ].map((row, i) => (
          <div key={i} className={styles.keyRow}>
            {row.map(key => (
              <button key={key} className={styles.key} onClick={() => handleClick(key)} disabled={gameOver}>
                {key}
              </button>
            ))}
            {i === 2 && (
              <>
                <button className={styles.keySpecial} onClick={() => handleClick('DELETE')} disabled={gameOver}>←</button>
                <button className={`${styles.keySpecial} ${currentGuess.length === WORD_LENGTH ? styles.active : ''}`}
                        onClick={() => handleClick('ENTER')} disabled={gameOver || currentGuess.length !== WORD_LENGTH}>
                  ↵
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      <button className={styles.submitButton} onClick={() => handleClick('ENTER')} disabled={gameOver || currentGuess.length !== WORD_LENGTH}>
        Submit
      </button>

      <button className={styles.giveUpButton} onClick={() => {
        if (gameOver) return;
        if (confirm('Are you sure you want to give up?')) {
          setGameOver(true);
          setMessage(`You gave up. The word was ${targetWord.toUpperCase()}`);
          setFinalScore(0);
          setEndReason("giveup");
          submitScore(0);
        }
      }}>
        Give Up
      </button>

      <button className={styles.menu} onClick={() => setMode(null)}>Main Menu</button>

      {gameOver && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            {endReason === 'win' ? (
              <>
                <h2>You win!</h2>
                <p>Score: {finalScore}</p>
              </>
            ) : (
              <>
                <h2>{endReason === 'timeout' ? "Time's up!" : "You gave up."}</h2>
                <p>The word was: {targetWord.toUpperCase()}</p>
                <p>Score: 0</p>
              </>
            )}
            <button onClick={() => setMode(null)}>Return to Main Menu</button>
          </div>
        </div>
      )}
    </div>
  );
}
