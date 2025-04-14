/**
 * Integration tests for localStorage utilities with game state
 */

import {
  STORAGE_KEYS,
  saveGameState,
  saveSessionStats,
  loadGameState,
  loadSessionStats,
  clearGameState,
  hasSavedSession
} from './localStorage';
import { GameState } from '@/contexts/GameContext';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get store() { return store; }, // Use getter to always return current store
  };
})();

// Replace the global localStorage with our mock
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Reset localStorage mock before each test
beforeEach(() => {
  localStorageMock.clear();
  jest.clearAllMocks();
});

// Sample game state for testing
const createSampleGameState = (): Partial<GameState> => ({
  status: 'active',
  score: 10,
  wordsGuessed: 5,
  wordsSkipped: 2,
  currentStreak: 3,
  longestStreak: 5,
  difficulty: 'medium',
  maxSkipsPerGame: 5,
  currentWord: {
    id: 'test-1',
    word: 'example',
    definition: 'A thing that serves as a pattern',
    difficulty: 'medium',
  },
  skippedWords: [
    {
      id: 'test-2',
      word: 'difficult',
      definition: 'Not easy',
      difficulty: 'hard',
    }
  ],
  scoreHistory: [
    {
      word: 'simple',
      pointsEarned: 1,
      difficulty: 'easy',
      timestamp: 1617984000000,
    },
    {
      word: 'complex',
      pointsEarned: 3,
      difficulty: 'hard',
      timestamp: 1617984060000,
    }
  ],
  sessionStats: {
    totalGames: 5,
    highScore: 25,
    averageScore: 15,
    totalWordsGuessed: 30,
    totalWordsSkipped: 10,
    bestStreak: 8,
  }
});

describe('localStorage integration tests', () => {
  test('saveGameState only saves necessary parts of state', () => {
    const sampleState = createSampleGameState();
    saveGameState(sampleState);
    
    // Get the saved state from localStorage
    const savedStateString = localStorageMock.getItem(STORAGE_KEYS.SESSION_STATE);
    const savedState = savedStateString ? JSON.parse(savedStateString) : null;
    
    // Check that only the necessary parts were saved
    expect(savedState).toHaveProperty('status', 'active');
    expect(savedState).toHaveProperty('score', 10);
    expect(savedState).toHaveProperty('wordsGuessed', 5);
    expect(savedState).toHaveProperty('wordsSkipped', 2);
    expect(savedState).toHaveProperty('currentStreak', 3);
    expect(savedState).toHaveProperty('longestStreak', 5);
    expect(savedState).toHaveProperty('difficulty', 'medium');
    expect(savedState).toHaveProperty('maxSkipsPerGame', 5);
    
    // Check that large arrays and currentWord are NOT saved
    expect(savedState).not.toHaveProperty('currentWord');
    expect(savedState).not.toHaveProperty('skippedWords');
    expect(savedState).not.toHaveProperty('scoreHistory');
  });
  
  test('saveSessionStats saves all session statistics', () => {
    const sampleState = createSampleGameState();
    saveSessionStats(sampleState.sessionStats!);
    
    // Get the saved stats from localStorage
    const savedStatsString = localStorageMock.getItem(STORAGE_KEYS.SESSION_STATS);
    const savedStats = savedStatsString ? JSON.parse(savedStatsString) : null;
    
    // Check that all stats were saved
    expect(savedStats).toEqual({
      totalGames: 5,
      highScore: 25,
      averageScore: 15,
      totalWordsGuessed: 30,
      totalWordsSkipped: 10,
      bestStreak: 8,
    });
  });
  
  test('loadGameState correctly loads saved state', () => {
    // Save a state first
    const sampleState = createSampleGameState();
    saveGameState(sampleState);
    
    // Clear the mock calls
    jest.clearAllMocks();
    
    // Load the state
    const loadedState = loadGameState();
    
    // Check that localStorage.getItem was called
    expect(localStorageMock.getItem).toHaveBeenCalledWith(STORAGE_KEYS.SESSION_STATE);
    
    // Check that the loaded state matches what we saved
    expect(loadedState).toHaveProperty('status', 'active');
    expect(loadedState).toHaveProperty('score', 10);
    expect(loadedState).toHaveProperty('difficulty', 'medium');
  });
  
  test('loadSessionStats correctly loads saved stats', () => {
    // Save stats first
    const sampleState = createSampleGameState();
    saveSessionStats(sampleState.sessionStats!);
    
    // Clear the mock calls
    jest.clearAllMocks();
    
    // Load the stats
    const loadedStats = loadSessionStats();
    
    // Check that localStorage.getItem was called
    expect(localStorageMock.getItem).toHaveBeenCalledWith(STORAGE_KEYS.SESSION_STATS);
    
    // Check that the loaded stats match what we saved
    expect(loadedStats).toEqual({
      totalGames: 5,
      highScore: 25,
      averageScore: 15,
      totalWordsGuessed: 30,
      totalWordsSkipped: 10,
      bestStreak: 8,
    });
  });
  
  test('hasSavedSession checks for existence of session state', () => {
    // Initially there should be no saved session
    expect(hasSavedSession()).toBe(false);
    
    // Save a state
    const sampleState = createSampleGameState();
    saveGameState(sampleState);
    
    // Now there should be a saved session
    expect(hasSavedSession()).toBe(true);
    
    // Clear the state
    clearGameState();
    
    // Now there should be no saved session again
    expect(hasSavedSession()).toBe(false);
  });
  
  test('clearGameState removes only game state and not session stats', () => {
    // Save both state and stats
    const sampleState = createSampleGameState();
    saveGameState(sampleState);
    saveSessionStats(sampleState.sessionStats!);
    
    // Clear the game state
    clearGameState();
    
    // Game state should be gone
    expect(localStorageMock.getItem(STORAGE_KEYS.SESSION_STATE)).toBeNull();
    
    // But session stats should still exist
    expect(localStorageMock.getItem(STORAGE_KEYS.SESSION_STATS)).not.toBeNull();
  });
  
  test('handles corrupted localStorage data gracefully', () => {
    // Set corrupted data in localStorage
    localStorageMock.setItem(STORAGE_KEYS.SESSION_STATE, 'not valid json');
    localStorageMock.setItem(STORAGE_KEYS.SESSION_STATS, '{also not valid');
    
    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Try to load the corrupted data
    const loadedState = loadGameState();
    const loadedStats = loadSessionStats();
    
    // Should return null for both
    expect(loadedState).toBeNull();
    expect(loadedStats).toBeNull();
    
    // Should log errors
    expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    
    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
  
  test('handles missing localStorage data gracefully', () => {
    // Don't set any data
    
    // Try to load non-existent data
    const loadedState = loadGameState();
    const loadedStats = loadSessionStats();
    
    // Should return null for both
    expect(loadedState).toBeNull();
    expect(loadedStats).toBeNull();
  });
});