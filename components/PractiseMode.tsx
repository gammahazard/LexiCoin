'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './WordleGame.module.css';
import { getRandomWord, WORD_LIST } from '../utils/word';

const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 6;

export default function PracticeMode({ setMode }: { setMode: (mode: null) => void }) {
  const [targetWord, setTargetWord] = useState(getRandomWord().toLowerCase());
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);

  const resetGame = () => {
    setTargetWord(getRandomWord().toLowerCase());
    setGuesses([]);
    setCurrentGuess('');
    setMessage('');
    setGameOver(false);
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
      setMessage('Correct!');
      setGameOver(true);
    } else if (newGuesses.length === MAX_ATTEMPTS) {
      setMessage(`Out of attempts! Word was ${targetWord.toUpperCase()}`);
      setGameOver(true);
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
              <button key={key} className={styles.key} onClick={() => handleClick(key)}>{key}</button>
            ))}
            {i === 2 && (
              <>
                <button className={styles.keySpecial} onClick={() => handleClick('DELETE')}>←</button>
                <button className={`${styles.keySpecial} ${currentGuess.length === WORD_LENGTH ? styles.active : ''}`}
                        onClick={() => handleClick('ENTER')} disabled={currentGuess.length !== WORD_LENGTH}>↵</button>
              </>
            )}
          </div>
        ))}
      </div>

      <button className={styles.submitButton} onClick={() => handleClick('ENTER')} disabled={currentGuess.length !== WORD_LENGTH}>
        Submit
      </button>

      <button className={styles.playAgain} onClick={resetGame}>New Word</button>
      <button className={styles.menu} onClick={() => setMode(null)}>Main Menu</button>
    </div>
  );
}
