'use client';

import { Word } from '@/types';
import { GameState } from '@/contexts/GameContext';

// Keys for localStorage
export const STORAGE_KEYS = {

  SESSION_STATE: 'guessTheWord_sessionState',
  SESSION_STATS: 'guessTheWord_sessionStats',
};

// Helper functions for checking if we're in a browser environment
const isBrowser = typeof window !== 'undefined';


/**
 * Save the current game state to localStorage
 */
export const saveGameState = (state: GameState): void => {
  if (!isBrowser) return;
  
  try {
    // We don't need to save everything, just the important parts
    const stateToSave: {
      status: GameState['status'];
      score: number;
      wordsGuessed: number;
      wordsSkipped: number;
      currentStreak: number;
      longestStreak: number;
      skippedWords: Word[];
      scoreHistory: GameState['scoreHistory'];
      difficulty: GameState['difficulty'];
      maxSkipsPerGame: number;
    } = {
      status: state.status,
      score: state.score,
      wordsGuessed: state.wordsGuessed,
      wordsSkipped: state.wordsSkipped,
      currentStreak: state.currentStreak,
      longestStreak: state.longestStreak,
      skippedWords: state.skippedWords,
      scoreHistory: state.scoreHistory,
      difficulty: state.difficulty,
      maxSkipsPerGame: state.maxSkipsPerGame,
    };
    
    localStorage.setItem(STORAGE_KEYS.SESSION_STATE, JSON.stringify(stateToSave));
  } catch (error) {
    console.error('Failed to save game state to localStorage:', error);
  }
};

/**
 * Save session statistics separately for long-term storage
 */
export const saveSessionStats = (sessionStats: GameState['sessionStats']): void => {
  if (!isBrowser) return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.SESSION_STATS, JSON.stringify(sessionStats));
  } catch (error) {
    console.error('Failed to save session stats to localStorage:', error);
  }
};

/**
 * Load the saved game state from localStorage
 */
export const loadGameState = (): Partial<GameState> | null => {
  if (!isBrowser) return null;
  
  try {
    const savedState = localStorage.getItem(STORAGE_KEYS.SESSION_STATE);
    if (!savedState) return null;
    
    return JSON.parse(savedState);
  } catch (error) {
    console.error('Failed to load game state from localStorage:', error);
    return null;
  }
};

/**
 * Load saved session statistics from localStorage
 */
export const loadSessionStats = (): GameState['sessionStats'] | null => {
  if (!isBrowser) return null;
  
  try {
    const savedStats = localStorage.getItem(STORAGE_KEYS.SESSION_STATS);
    if (!savedStats) return null;
    
    return JSON.parse(savedStats);
  } catch (error) {
    console.error('Failed to load session stats from localStorage:', error);
    return null;
  }
};

/**
 * Clear the current game state from localStorage
 */
export const clearGameState = (): void => {
  if (!isBrowser) return;
  
  try {
    localStorage.removeItem(STORAGE_KEYS.SESSION_STATE);
  } catch (error) {
    console.error('Failed to clear game state from localStorage:', error);
  }
};

/**
 * Check if there's a saved game session
 */
export const hasSavedSession = (): boolean => {
  if (!isBrowser) return false;
  
  return !!localStorage.getItem(STORAGE_KEYS.SESSION_STATE);
}; 