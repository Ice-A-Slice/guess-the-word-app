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
   * 
   * @param guess - The user's guess
   * @param word - The word to check against
   * @returns true if the guess matches the word, false otherwise
   */
  checkGuess: (guess: string | null | undefined, word: Word | null | undefined): boolean => {
    // Handle null/undefined inputs
    if (!guess || !word) {
      return false;
    }
    
    // Remove leading/trailing whitespace and perform case-insensitive comparison
    return guess.trim().toLowerCase() === word.word.toLowerCase();
  }
};

export default wordService; 