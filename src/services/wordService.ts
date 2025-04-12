import { words } from '@/data';
import { Word } from '@/types';

/**
 * Service for word-related operations
 */
const wordService = {
  /**
   * Get all words
   */
  getAllWords: (): Word[] => {
    return words;
  },

  /**
   * Get words by difficulty level
   */
  getWordsByDifficulty: (difficulty: 'easy' | 'medium' | 'hard' | 'all'): Word[] => {
    if (difficulty === 'all') {
      return words;
    }
    return words.filter(word => word.difficulty === difficulty);
  },

  /**
   * Get words by category
   */
  getWordsByCategory: (categoryId: string): Word[] => {
    return words.filter(word => word.category === categoryId);
  },

  /**
   * Get a random word
   */
  getRandomWord: (): Word => {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  },

  /**
   * Get a random word with specific difficulty
   */
  getRandomWordByDifficulty: (difficulty: 'easy' | 'medium' | 'hard' | 'all'): Word => {
    const filteredWords = difficulty === 'all' 
      ? words 
      : words.filter(word => word.difficulty === difficulty);
    
    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    return filteredWords[randomIndex];
  },

  /**
   * Check if a guess matches a word (case-insensitive)
   */
  checkGuess: (guess: string, word: Word): boolean => {
    return guess.trim().toLowerCase() === word.word.toLowerCase();
  }
};

export default wordService; 