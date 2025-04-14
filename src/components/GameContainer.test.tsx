import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import GameContainer from './GameContainer';
import { GameProvider } from '@/contexts';
import * as gameHooks from '@/hooks';

// Mock the useGameWithWordSelection hook
jest.mock('@/hooks', () => ({
  useGameWithWordSelection: jest.fn(),
}));

// Set up a mock for setTimeout
jest.useFakeTimers();

describe('GameContainer', () => {
  const mockGame = {
    status: 'active',
    currentWord: {
      id: 'test-word-1',
      word: 'example',
      definition: 'A thing that serves as a pattern',
      difficulty: 'medium',
    },
    score: 0,
    wordsGuessed: 0,
    wordsSkipped: 0,
    currentStreak: 0,
    longestStreak: 0,
    maxSkipsPerGame: 5,
    handleCorrectGuess: jest.fn(),
    handleSkipWord: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (gameHooks.useGameWithWordSelection as jest.Mock).mockReturnValue(mockGame);
  });

  test('renders game content with current word', () => {
    act(() => {
      render(
        <GameProvider>
          <GameContainer />
        </GameProvider>
      );
    });
    
    expect(screen.getByTestId('word-definition')).toHaveTextContent('A thing that serves as a pattern');
  });

  test('shows skip message and calls handleSkipWord when skip button is clicked', () => {
    act(() => {
      render(
        <GameProvider>
          <GameContainer />
        </GameProvider>
      );
    });
    
    // Find and click the skip button
    const skipButton = screen.getByTestId('skip-button');
    act(() => {
      fireEvent.click(skipButton);
    });
    
    // Check that the skip message is shown
    // There's a span with class "word" containing the word that was skipped
    expect(screen.getByText('example')).toBeInTheDocument();
    
    // Check that the handleSkipWord function was called
    expect(mockGame.handleSkipWord).toHaveBeenCalled();
    
    // After 2 seconds, the message should disappear
    act(() => {
      jest.advanceTimersByTime(2000);
    });
  });
}); 