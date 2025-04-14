/**
 * Tests for localStorage utilities
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
    store, // Expose store for testing

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
const sampleGameState = {
  status: 'active' as 'idle' | 'active' | 'paused' | 'completed',
  score: 10,
  wordsGuessed: 5,
  wordsSkipped: 2,
  currentStreak: 3,
  longestStreak: 5,
  difficulty: 'medium' as 'easy' | 'medium' | 'hard' | 'all',
  maxSkipsPerGame: 5,
};

// Sample session stats for testing
const sampleSessionStats = {
  totalGames: 5,
  highScore: 25,
  averageScore: 15,
  totalWordsGuessed: 30,
  totalWordsSkipped: 10,
  bestStreak: 8,
};

describe('localStorage utilities', () => {
  test('saveGameState saves state to localStorage', () => {
    saveGameState(sampleGameState);
    
    expect(localStorageMock.setItem).toHaveBeenCalled();
    expect(JSON.parse(localStorageMock.setItem.mock.calls[0][1])).toEqual({
      status: 'active',
      score: 10,
      wordsGuessed: 5,
      wordsSkipped: 2,
      currentStreak: 3,
      longestStreak: 5,
      difficulty: 'medium',
      maxSkipsPerGame: 5,
    });
  });
  
  test('saveSessionStats saves session stats to localStorage', () => {
    saveSessionStats(sampleSessionStats);
    
    expect(localStorageMock.setItem).toHaveBeenCalled();
    expect(JSON.parse(localStorageMock.setItem.mock.calls[0][1])).toEqual(
      sampleSessionStats
    );
  });
  
  test('loadGameState loads saved state from localStorage', () => {

    // First save some state
    localStorageMock.setItem(STORAGE_KEYS.SESSION_STATE, JSON.stringify(sampleGameState));
    
    const loadedState = loadGameState();
    
    expect(loadedState).toEqual(sampleGameState);
  });
  
  test('loadSessionStats loads saved session stats from localStorage', () => {
    // First save some stats
    localStorageMock.setItem(STORAGE_KEYS.SESSION_STATS, JSON.stringify(sampleSessionStats));
    
    const loadedStats = loadSessionStats();
    
    expect(loadedStats).toEqual(sampleSessionStats);
  });
  
  test('clearGameState removes game state from localStorage', () => {
    // First save some state
    localStorageMock.setItem(STORAGE_KEYS.SESSION_STATE, JSON.stringify(sampleGameState));
    
    clearGameState();
    
    expect(localStorageMock.removeItem).toHaveBeenCalled();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.SESSION_STATE);
  });
  
  test('hasSavedSession returns true when session exists', () => {
    localStorageMock.setItem(STORAGE_KEYS.SESSION_STATE, JSON.stringify(sampleGameState));
    
    expect(hasSavedSession()).toBe(true);
  });
  
  test('hasSavedSession returns false when no session exists', () => {
    expect(hasSavedSession()).toBe(false);
  });
  
  test('handles localStorage errors gracefully', () => {
    // Mock a localStorage error
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage error');
    });
    
    // These should not throw errors
    saveGameState(sampleGameState);
    saveSessionStats(sampleSessionStats);
    
    expect(console.error).toHaveBeenCalledTimes(2);
    
    // Restore console.error
    console.error = originalConsoleError;
  });
}); 