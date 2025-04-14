'use client';

import { Word } from '@/types';

// Keys for localStorage
export const STORAGE_KEYS = {
  SESSION_STATE: 'guesser-game-state',
  SESSION_STATS: 'guesser-session-stats',
};

// Helper functions for checking if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

/**
 * Interface for the game state that we want to persist
 */
export interface PersistedGameState {
  status: 'idle' | 'active' | 'paused' | 'completed';
  score: number;
  wordsGuessed: number;
  wordsSkipped: number;
  currentStreak: number;
  longestStreak: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'all';
  maxSkipsPerGame: number;
}

/**
 * Interface for session statistics
 */
export interface SessionStats {
  totalGames: number;
  highScore: number;
  averageScore: number;
  totalWordsGuessed: number;
  totalWordsSkipped: number;
  bestStreak: number;
}

/**
 * Save the current game state to localStorage
 */
export function saveGameState(state: { 
  status: 'idle' | 'active' | 'paused' | 'completed';
  score: number;
  wordsGuessed: number;
  wordsSkipped: number;
  currentStreak: number;
  longestStreak: number;
  skippedWords: Word[];
  difficulty: 'easy' | 'medium' | 'hard' | 'all';
  maxSkipsPerGame: number;
}): void {
  if (!isBrowser) return;
  
  try {
    // Only save the parts we want to persist
    const stateToSave: PersistedGameState = {
      status: state.status,
      score: state.score,
      wordsGuessed: state.wordsGuessed,
      wordsSkipped: state.wordsSkipped,
      currentStreak: state.currentStreak,
      longestStreak: state.longestStreak,
      difficulty: state.difficulty,
      maxSkipsPerGame: state.maxSkipsPerGame,
    };
    
    localStorage.setItem(STORAGE_KEYS.SESSION_STATE, JSON.stringify(stateToSave));
  } catch (error) {
    console.error('Failed to save game state to localStorage:', error);
  }
}

/**
 * Save session statistics to localStorage
 */
export function saveSessionStats(sessionStats: SessionStats): void {
  if (!isBrowser) return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.SESSION_STATS, JSON.stringify(sessionStats));
  } catch (error) {
    console.error('Failed to save session stats to localStorage:', error);
  }
}

/**
 * Load the saved game state from localStorage
 */
export function loadGameState(): PersistedGameState | null {
  if (!isBrowser) return null;
  
  try {
    const savedState = localStorage.getItem(STORAGE_KEYS.SESSION_STATE);
    return savedState ? JSON.parse(savedState) : null;
  } catch (error) {
    console.error('Failed to load game state from localStorage:', error);
    return null;
  }
}

/**
 * Load saved session statistics from localStorage
 */
export function loadSessionStats(): SessionStats | null {
  if (!isBrowser) return null;
  
  try {
    const savedStats = localStorage.getItem(STORAGE_KEYS.SESSION_STATS);
    return savedStats ? JSON.parse(savedStats) : null;
  } catch (error) {
    console.error('Failed to load session stats from localStorage:', error);
    return null;
  }
}

/**
 * Clear the current game state from localStorage
 */
export function clearGameState(): void {
  if (!isBrowser) return;
  
  try {
    localStorage.removeItem(STORAGE_KEYS.SESSION_STATE);
  } catch (error) {
    console.error('Failed to clear game state from localStorage:', error);
  }
}

/**
 * Check if a saved session exists
 */
export function hasSavedSession(): boolean {
  if (!isBrowser) return false;
  
  return !!localStorage.getItem(STORAGE_KEYS.SESSION_STATE);
} 