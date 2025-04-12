import { words } from '@/data';
import { Word } from '@/types';

// Define the return type for improved guess validation
export interface GuessResult {
  isCorrect: boolean;
  message: string;
  hintLevel: 'none' | 'mild' | 'strong';
}

/**
 * Sanitizes user input by:
 * - Trimming whitespace
 * - Removing special characters if specified
 * - Truncating to max length if specified
 */
export const sanitizeInput = (
  input: string, 
  options: { 
    removeSpecialChars?: boolean;
    maxLength?: number;
  } = {}
): string => {
  if (!input) return '';
  
  let result = input.trim();
  
  // Remove special characters if requested
  if (options.removeSpecialChars) {
    result = result.replace(/[^\w\s]/gi, '');
  }
  
  // Truncate if requested
  if (options.maxLength && result.length > options.maxLength) {
    result = result.substring(0, options.maxLength);
  }
  
  return result;
};

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
   * Basic check if a guess matches a word (case-insensitive)
   * Legacy function for backward compatibility
   */
  checkGuess: (guess: string | null | undefined, word: Word | null | undefined): boolean => {
    // Handle null/undefined inputs
    if (!guess || !word) {
      return false;
    }
    
    // Remove leading/trailing whitespace and perform case-insensitive comparison
    return guess.trim().toLowerCase() === word.word.toLowerCase();
  },

  /**
   * Enhanced version of checkGuess that provides detailed feedback
   * 
   * @param guess - The user's guess
   * @param word - The word to check against
   * @returns GuessResult with match status and feedback
   */
  validateGuess: (guess: string | null | undefined, word: Word | null | undefined): GuessResult => {
    // Handle null/undefined word
    if (!word) {
      return {
        isCorrect: false,
        message: 'Please enter a valid guess.',
        hintLevel: 'none'
      };
    }

    // Handle null/undefined guess
    if (guess === null || guess === undefined) {
      return {
        isCorrect: false,
        message: 'Please enter a valid guess.',
        hintLevel: 'none'
      };
    }

    const cleanGuess = sanitizeInput(guess);
    
    // Handle empty guesses after trimming
    if (cleanGuess === '') {
      return {
        isCorrect: false,
        message: 'Please enter a word.',
        hintLevel: 'none'
      };
    }

    // Handle extremely long inputs (over 50 characters)
    if (guess.length > 50) {
      return {
        isCorrect: false,
        message: 'Your answer is too long. Please try a shorter word.',
        hintLevel: 'none'
      };
    }

    // Check for numeric-only inputs
    if (/^\d+$/.test(cleanGuess)) {
      return {
        isCorrect: false,
        message: 'Please enter a word, not just numbers.',
        hintLevel: 'none'
      };
    }

    // Check for special characters
    if (/[^\w\s]/.test(cleanGuess)) {
      return {
        isCorrect: false,
        message: 'Your answer contains special characters. Try using only letters.',
        hintLevel: 'none'
      };
    }

    const correctWord = word.word.toLowerCase();
    const guessLower = cleanGuess.toLowerCase();
    
    // Check for exact match
    if (guessLower === correctWord) {
      return {
        isCorrect: true,
        message: 'Correct! Well done!',
        hintLevel: 'none'
      };
    }
    
    // Provide length difference hints
    const lengthDiff = correctWord.length - guessLower.length;
    if (lengthDiff > 0) {
      return {
        isCorrect: false,
        message: `Not quite. Your answer is too short - try a ${correctWord.length}-letter word.`,
        hintLevel: 'mild'
      };
    } else if (lengthDiff < 0) {
      return {
        isCorrect: false,
        message: `Not quite. Your answer is too long - try a ${correctWord.length}-letter word.`,
        hintLevel: 'mild'
      };
    }
    
    // Provide first/last letter hints
    return {
      isCorrect: false,
      message: `Incorrect. The word starts with "${correctWord[0]}" and ends with "${correctWord[correctWord.length - 1]}".`,
      hintLevel: 'strong'
    };
  }
};

export default wordService; 