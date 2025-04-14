/**
 * Tests for localStorage utilities
 */

import {
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
const sampleGameState: Partial<GameState> = {
  status: 'active',
  currentWord: {
    id: '1',
    word: 'test',
    definition: 'A procedure for critical evaluation',
    difficulty: 'easy',
  },
  score: 10,
  wordsGuessed: 5,
  wordsSkipped: 2,
  currentStreak: 3,
  longestStreak: 3,
  skippedWords: [
    {
      id: '2',
      word: 'skipped',
      definition: 'Jumped over or omitted',
      difficulty: 'medium',
    }
  ],
  scoreHistory: [
    {
      word: 'apple',
      pointsEarned: 2,
      difficulty: 'easy',
      timestamp: 1619712000000,
    }
  ],
  sessionStats: {
    totalGames: 1,
    highScore: 10,
    averageScore: 10,
    totalWordsGuessed: 5,
    totalWordsSkipped: 2,
    bestStreak: 3,
  },
  maxSkipsPerGame: 5,
  difficulty: 'all',
  hasSavedSession: true,
};

describe('localStorage utilities', () => {
  test('saveGameState saves state to localStorage', () => {
    saveGameState(sampleGameState as GameState);
    
    expect(localStorageMock.setItem).toHaveBeenCalled();
    expect(JSON.parse(localStorageMock.setItem.mock.calls[0][1])).toEqual(
      expect.objectContaining({
        status: 'active',
        score: 10,
        wordsGuessed: 5,
      })
    );
  });
  
  test('saveSessionStats saves session stats to localStorage', () => {
    saveSessionStats(sampleGameState.sessionStats!);
    
    expect(localStorageMock.setItem).toHaveBeenCalled();
    expect(JSON.parse(localStorageMock.setItem.mock.calls[0][1])).toEqual(
      expect.objectContaining({
        totalGames: 1,
        highScore: 10,
        averageScore: 10,
      })
    );
  });
  
  test('loadGameState loads saved state from localStorage', () => {
    saveGameState(sampleGameState as GameState);
    const loadedState = loadGameState();
    
    expect(loadedState).toEqual(
      expect.objectContaining({
        status: 'active',
        score: 10,
        wordsGuessed: 5,
      })
    );
  });
  
  test('loadSessionStats loads saved session stats from localStorage', () => {
    saveSessionStats(sampleGameState.sessionStats!);
    const loadedStats = loadSessionStats();
    
    expect(loadedStats).toEqual(
      expect.objectContaining({
        totalGames: 1,
        highScore: 10,
        averageScore: 10,
      })
    );
  });
  
  test('clearGameState removes game state from localStorage', () => {
    saveGameState(sampleGameState as GameState);
    clearGameState();
    
    expect(localStorageMock.removeItem).toHaveBeenCalled();
    expect(loadGameState()).toBeNull();
  });
  
  test('hasSavedSession checks if there is a saved session', () => {
    expect(hasSavedSession()).toBe(false);
    
    saveGameState(sampleGameState as GameState);
    expect(hasSavedSession()).toBe(true);
    
    clearGameState();
    expect(hasSavedSession()).toBe(false);
  });
  
  test('handles localStorage errors gracefully', () => {
    // Mock an error when setting an item
    const errorMock = jest.spyOn(console, 'error').mockImplementation();
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage error');
    });
    
    // These should not throw errors, just log them
    expect(() => saveGameState(sampleGameState as GameState)).not.toThrow();
    expect(() => saveSessionStats(sampleGameState.sessionStats!)).not.toThrow();
    
    expect(errorMock).toHaveBeenCalledTimes(2);
    errorMock.mockRestore();
  });
}); 