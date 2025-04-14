import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useGameWithWordSelection } from './useGame';
import { GameProvider } from '@/contexts/GameContext';
import * as wordSelectionHook from './useWordSelection';
import { Word } from '@/types';

// Mock the useWordSelection hook
jest.mock('./useWordSelection');

// Wrapper component for the hook
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <GameProvider>{children}</GameProvider>
);

describe('useGameWithWordSelection', () => {
  // Sample words for testing
  const mockWords: Word[] = [
    {
      id: 'word-1',
      word: 'example',
      definition: 'A thing that serves as a pattern',
      difficulty: 'medium',
    },
    {
      id: 'word-2',
      word: 'complex',
      definition: 'Consisting of many different parts',
      difficulty: 'hard',
    },
    {
      id: 'word-3',
      word: 'simple',
      definition: 'Easy to understand',
      difficulty: 'easy',
    },
  ];

  // Mock implementation of useWordSelection
  const mockGetNextWord = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementation
    (wordSelectionHook.useWordSelection as jest.Mock).mockReturnValue({
      currentWord: mockWords[0],
      getNextWord: mockGetNextWord,
      history: [mockWords[0]],
      isLoading: false,
      error: null,
    });
  });

  test('initializes with current word from useWordSelection', () => {
    const { result } = renderHook(() => useGameWithWordSelection(), { wrapper });
    
    // Should have the current word from useWordSelection
    expect(result.current.currentWord).toEqual(mockWords[0]);
  });

  test('passes difficulty from game state to useWordSelection', () => {
    // First render with default difficulty
    renderHook(() => useGameWithWordSelection(), { wrapper });
    
    // Check that useWordSelection was called with the default difficulty
    expect(wordSelectionHook.useWordSelection).toHaveBeenCalledWith(
      expect.objectContaining({ difficulty: 'all' })
    );
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Now render with a specific difficulty
    renderHook(() => useGameWithWordSelection({ difficulty: 'hard' }), { wrapper });
    
    // Check that useWordSelection was called with the specified difficulty
    expect(wordSelectionHook.useWordSelection).toHaveBeenCalledWith(
      expect.objectContaining({ difficulty: 'hard' })
    );
  });

  test('updates game state when word changes', () => {
    // Setup mock to change current word
    (wordSelectionHook.useWordSelection as jest.Mock)
      .mockReturnValueOnce({
        currentWord: mockWords[0],
        getNextWord: mockGetNextWord,
        history: [mockWords[0]],
        isLoading: false,
        error: null,
      });
    
    const { result, rerender } = renderHook(() => useGameWithWordSelection(), { wrapper });
    
    // Initial state
    expect(result.current.currentWord).toEqual(mockWords[0]);
    
    // Change the mock for the next render
    (wordSelectionHook.useWordSelection as jest.Mock).mockReturnValue({
      currentWord: mockWords[1],
      getNextWord: mockGetNextWord,
      history: [mockWords[1], mockWords[0]],
      isLoading: false,
      error: null,
    });
    
    // Initial state
    expect(result.current.currentWord).toEqual(mockWords[0]);
    
    // Trigger a re-render to simulate word change
    rerender();
    
    // Game state should be updated with the new word
    expect(result.current.currentWord).toEqual(mockWords[1]);
  });

  test('handleCorrectGuess updates score and gets next word', () => {
    const { result } = renderHook(() => useGameWithWordSelection(), { wrapper });
    
    // Start the game
    act(() => {
      result.current.startGame();
    });
    
    // Initial score should be 0
    expect(result.current.score).toBe(0);
    
    // Call handleCorrectGuess
    act(() => {
      result.current.handleCorrectGuess(2); // 2 points
    });
    
    // Score should be updated
    expect(result.current.score).toBe(2);
    
    // getNextWord should have been called
    expect(mockGetNextWord).toHaveBeenCalled();
  });

  test('handleSkipWord increments skipped count and gets next word', () => {
    const { result } = renderHook(() => useGameWithWordSelection(), { wrapper });
    
    // Start the game
    act(() => {
      result.current.startGame();
    });
    
    // Initial skipped count should be 0
    expect(result.current.wordsSkipped).toBe(0);
    
    // Call handleSkipWord
    act(() => {
      result.current.handleSkipWord();
    });
    
    // Skipped count should be incremented
    expect(result.current.wordsSkipped).toBe(1);
    
    // getNextWord should have been called
    expect(mockGetNextWord).toHaveBeenCalled();
  });

  test('startGame gets first word if none exists', () => {
    // Mock no current word
    (wordSelectionHook.useWordSelection as jest.Mock).mockReturnValue({
      currentWord: null,
      getNextWord: mockGetNextWord,
      history: [],
      isLoading: false,
      error: null,
    });
    
    const { result } = renderHook(() => useGameWithWordSelection(), { wrapper });
    
    // Call startGame
    act(() => {
      result.current.startGame();
    });
    
    // getNextWord should have been called to get the first word
    expect(mockGetNextWord).toHaveBeenCalled();
  });

  test('resetGame resets game state and gets new word', () => {
    const { result } = renderHook(() => useGameWithWordSelection(), { wrapper });
    
    // Start the game and accumulate some score
    act(() => {
      result.current.startGame();
      result.current.handleCorrectGuess(2);
      result.current.handleCorrectGuess(3);
    });
    
    // Score should be 5
    expect(result.current.score).toBe(5);
    
    // Reset the game
    act(() => {
      result.current.resetGame();
    });
    
    // Score should be reset to 0
    expect(result.current.score).toBe(0);
    
    // getNextWord should have been called to get a new word
    expect(mockGetNextWord).toHaveBeenCalledTimes(3); // 2 correct guesses + 1 reset
  });

  test('setDifficulty updates game state difficulty', () => {
    const { result } = renderHook(() => useGameWithWordSelection(), { wrapper });
    
    // Default difficulty should be 'all'
    expect(result.current.difficulty).toBe('all');
    
    // Change difficulty
    act(() => {
      result.current.setDifficulty('hard');
    });
    
    // Difficulty should be updated
    expect(result.current.difficulty).toBe('hard');
  });

  test('handles multiple consecutive correct guesses', () => {
    const { result } = renderHook(() => useGameWithWordSelection(), { wrapper });
    
    // Start the game
    act(() => {
      result.current.startGame();
    });
    
    // Make multiple consecutive correct guesses
    act(() => {
      result.current.handleCorrectGuess(1);
      result.current.handleCorrectGuess(1);
      result.current.handleCorrectGuess(1);
      result.current.handleCorrectGuess(1);
      result.current.handleCorrectGuess(1);
    });
    
    // Score should be 5
    expect(result.current.score).toBe(5);
    
    // Current streak should be 5
    expect(result.current.currentStreak).toBe(5);
    
    // getNextWord should have been called 5 times
    expect(mockGetNextWord).toHaveBeenCalledTimes(5);
  });

  test('handles game state during component re-renders', () => {
    // Initial render
    const { result, rerender } = renderHook(() => useGameWithWordSelection(), { wrapper });
    
    // Start the game
    act(() => {
      result.current.startGame();
    });
    
    // Make a correct guess
    act(() => {
      result.current.handleCorrectGuess(2);
    });
    
    // Score should be 2
    expect(result.current.score).toBe(2);
    
    // Re-render the component
    rerender();
    
    // State should persist after re-render
    expect(result.current.score).toBe(2);
    expect(result.current.status).toBe('active');
  });

  test('excludes words from selection when specified', () => {
    // Reset mocks to ensure clean state
    jest.clearAllMocks();
    
    // Instead of testing the default difficulty, let's explicitly set it
    renderHook(
      () => useGameWithWordSelection({
        excludeWords: ['example', 'complex'],
        difficulty: 'all' // Explicitly set difficulty to 'all'
      }),
      { wrapper }
    );
    
    // Check that useWordSelection was called with the exclude list and explicit difficulty
    expect(wordSelectionHook.useWordSelection).toHaveBeenCalledWith(
      expect.objectContaining({
        excludeWords: ['example', 'complex'],
        difficulty: 'all'
      })
    );
  });
});