import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import GameContainer from './GameContainer';
import { GameProvider } from '@/contexts';
import * as gameHooks from '@/hooks';

// Mock the SessionSummary component
jest.mock('./SessionSummary', () => {
  return jest.fn().mockImplementation(({ onStartNewGame }) => (
    <div data-testid="session-summary">
      <button data-testid="new-game-button" onClick={onStartNewGame}>
        Start New Game
      </button>
    </div>
  ));
});

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
    resetGame: jest.fn(),
    startGame: jest.fn(),
    endGame: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (gameHooks.useGameWithWordSelection as jest.Mock).mockReturnValue(mockGame);
  });

  test('renders game content with current word', () => {
    render(
      <GameProvider>
        <GameContainer />
      </GameProvider>
    );
    
    // Check if the definition is rendered
    expect(screen.getByText(/A thing that serves as a pattern/i)).toBeInTheDocument();
  });

  test('shows skip message and calls handleSkipWord when skip button is clicked', () => {
    render(
      <GameProvider>
        <GameContainer />
      </GameProvider>
    );
    
    // Find and click the skip button
    const skipButton = screen.getByTestId('skip-button');
    fireEvent.click(skipButton);
    
    // Check that the skip message is shown
    expect(screen.getByText(/Skipped word: "example"/i)).toBeInTheDocument();
    
    // Check that the handleSkipWord function was called
    expect(mockGame.handleSkipWord).toHaveBeenCalled();
    
    // After 2 seconds, the message should disappear
    act(() => {
      jest.advanceTimersByTime(2000);
    });
  });
  
  test('renders start game button in idle state', () => {
    (gameHooks.useGameWithWordSelection as jest.Mock).mockReturnValue({
      ...mockGame,
      status: 'idle',
      currentWord: null,
    });
    
    render(
      <GameProvider>
        <GameContainer />
      </GameProvider>
    );
    
    const startButton = screen.getByText('Start Game');
    expect(startButton).toBeInTheDocument();
    
    fireEvent.click(startButton);
    expect(mockGame.startGame).toHaveBeenCalled();
  });
  
  test('renders session summary when game is completed', () => {
    (gameHooks.useGameWithWordSelection as jest.Mock).mockReturnValue({
      ...mockGame,
      status: 'completed',
    });
    
    render(
      <GameProvider>
        <GameContainer />
      </GameProvider>
    );
    
    expect(screen.getByTestId('session-summary')).toBeInTheDocument();
  });
  
  test('resets and starts new game when button is clicked in session summary', () => {
    (gameHooks.useGameWithWordSelection as jest.Mock).mockReturnValue({
      ...mockGame,
      status: 'completed',
    });
    
    render(
      <GameProvider>
        <GameContainer />
      </GameProvider>
    );
    
    const newGameButton = screen.getByTestId('new-game-button');
    fireEvent.click(newGameButton);
    
    expect(mockGame.resetGame).toHaveBeenCalled();
    expect(mockGame.startGame).toHaveBeenCalled();
  });
  
  test('shows game controls only in active or paused state', () => {
    // Test active state
    (gameHooks.useGameWithWordSelection as jest.Mock).mockReturnValue({
      ...mockGame,
      status: 'active',
    });
    
    const { rerender } = render(
      <GameProvider>
        <GameContainer />
      </GameProvider>
    );
    
    expect(screen.getByTestId('skip-button')).toBeInTheDocument();
    
    // Test completed state - should not show controls
    (gameHooks.useGameWithWordSelection as jest.Mock).mockReturnValue({
      ...mockGame,
      status: 'completed',
    });
    
    rerender(
      <GameProvider>
        <GameContainer />
      </GameProvider>
    );
    
    expect(screen.queryByTestId('skip-button')).not.toBeInTheDocument();
  });
}); 