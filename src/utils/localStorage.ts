'use client';

import { GameState, DescriptionLanguage } from '@/contexts/GameContext';

// Keys for localStorage
export const STORAGE_KEYS = {
  SESSION_STATE: 'guessTheWord_sessionState',
  SESSION_STATS: 'guessTheWord_sessionStats',
  LANGUAGE_PREFERENCE: 'guessTheWord_languagePreference',
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
      difficulty: GameState['difficulty'];
      maxSkipsPerGame: number;
      descriptionLanguage: DescriptionLanguage;
    } = {
      status: state.status,
      score: state.score,
      wordsGuessed: state.wordsGuessed,
      wordsSkipped: state.wordsSkipped,
      currentStreak: state.currentStreak,
      longestStreak: state.longestStreak,
      difficulty: state.difficulty,
      maxSkipsPerGame: state.maxSkipsPerGame,
      descriptionLanguage: state.descriptionLanguage,
    };
    
    localStorage.setItem(STORAGE_KEYS.SESSION_STATE, JSON.stringify(stateToSave));
    
    // Also save language preference separately for persistent access
    saveLanguagePreference(state.descriptionLanguage);
  } catch (error) {
    console.error('Failed to save game state to localStorage:', error);
  }
};

/**
 * Save the language preference separately
 */
export const saveLanguagePreference = (language: DescriptionLanguage): void => {
  if (!isBrowser) return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE_PREFERENCE, language);
  } catch (error) {
    console.error('Failed to save language preference to localStorage:', error);
  }
};

/**
 * Load the saved language preference
 */
export const loadLanguagePreference = (): DescriptionLanguage => {
  if (!isBrowser) return 'English';
  
  try {
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE_PREFERENCE);
    if (savedLanguage === 'English' || savedLanguage === 'Swedish') {
      return savedLanguage;
    }
    return 'English'; // Default to English if no valid preference is found
  } catch (error) {
    console.error('Failed to load language preference from localStorage:', error);
    return 'English';
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
    
    const parsedState = JSON.parse(savedState);
    
    // Ensure descriptionLanguage is valid
    if (parsedState.descriptionLanguage !== 'English' && parsedState.descriptionLanguage !== 'Swedish') {
      parsedState.descriptionLanguage = loadLanguagePreference();
    }
    
    return parsedState;
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