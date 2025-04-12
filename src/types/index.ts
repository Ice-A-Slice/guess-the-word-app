/**
 * Type definitions for the application
 */

// Word type definition (based on data model from PRD)
export interface Word {
  id: string;
  word: string;
  definition: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category?: string;
}

// Game state type
export interface GameState {
  currentWord?: Word;
  score: number;
  wordsGuessed: number;
  wordsSkipped: number;
  isGameActive: boolean;
}

// User preference types
export interface UserPreferences {
  difficulty: 'easy' | 'medium' | 'hard' | 'all';
}

// Game statistics
export interface GameStatistics {
  totalGames: number;
  highScore: number;
  averageScore: number;
  totalWordsGuessed: number;
  totalWordsSkipped: number;
} 