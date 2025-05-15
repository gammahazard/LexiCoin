// utils/word.ts

export const WORD_LIST = [
    'galaxy', 'rocket', 'magnet', 'legend', 'humane', 'fusion',
    'goblet', 'jungle', 'luxury', 'napkin', 'oxygen', 'pepper',
    'quartz', 'refine', 'spiral', 'turkey', 'unfold', 'violet',
    'wander', 'zodiac', 'kitten', 'bottle', 'planet', 'window',
    'bright', 'stream', 'puzzle', 'animal', 'bridge', 'circle',
    'dreamy', 'energy', 'fabric', 'gentle', 'honest', 'insect',
    'jumper', 'kernel', 'laptop', 'museum', 'noodle', 'object',
    'pirate', 'quieto', 'rabbit', 'shield', 'ticket', 'united',
    'victor', 'wonder', 'xenial', 'yellow', 'zenith'
  ];
  
  export function getRandomWord(): string {
    return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
  }
  
  export function getDailyWord(): string {
    const today = new Date().toISOString().split('T')[0];
    const seed = [...today].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return WORD_LIST[seed % WORD_LIST.length];
  }
  