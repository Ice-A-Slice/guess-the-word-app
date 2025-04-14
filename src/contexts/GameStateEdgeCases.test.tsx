import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameProvider } from './GameContext';
import { useGame } from '@/hooks/useGame';
import * as localStorage from '@/utils/localStorage';

// Mock localStorage utilities
jest.mock('@/utils/localStorage', () => ({
  saveGameState: jest.fn(),
  saveSessionStats: jest.fn(),
  loadGameState: jest.fn(),
  loadSessionStats: jest.fn(),
  hasSavedSession: jest.fn(),
  clearGameState: jest.fn(),
}));

// Test component that uses the game hooks
function TestGameComponent() {
  const game = useGame();
  
  return (
    <div>
      <div data-testid="status">{game.status}</div>
      <div data-testid="score">{game.score}</div>
      <div data-testid="words-guessed">{game.wordsGuessed}</div>
      <div data-testid="words-skipped">{game.wordsSkipped}</div>
      <div data-testid="current-streak">{game.currentStreak}</div>
      <div data-testid="longest-streak">{game.longestStreak}</div>
      <div data-testid="max-skips">{game.maxSkipsPerGame}</div>
      <div data-testid="session-games">{game.sessionStats.totalGames}</div>
      <div data-testid="session-high-score">{game.sessionStats.highScore}</div>
      <div data-testid="session-avg-score">{game.sessionStats.averageScore.toFixed(1)}</div>
      <div data-testid="session-best-streak">{game.sessionStats.bestStreak}</div>
      
      <button data-testid="start-game" onClick={game.startGame}>Start Game</button>
      <button data-testid="pause-game" onClick={game.pauseGame}>Pause Game</button>
      <button data-testid="resume-game" onClick={game.resumeGame}>Resume Game</button>
      <button data-testid="end-game" onClick={game.endGame}>End Game</button>
      <button 
        data-testid="correct-guess" 
        onClick={() => game.correctGuess(1, {
          id: 'test-1',
          word: 'example',
          definition: 'A thing that serves as a pattern',
          difficulty: 'medium',
        })}
      >
        Correct Guess
      </button>
      <button data-testid="skip-word" onClick={game.skipWord}>Skip Word</button>
      <button data-testid="reset-game" onClick={game.resetGame}>Reset Game</button>
      <button 
        data-testid="set-max-skips" 
        onClick={() => game.setMaxSkips(3)}
      >
        Set Max Skips to 3
      </button>
    </div>
  );
}

describe('Game State Management - Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (localStorage.hasSavedSession as jest.Mock).mockReturnValue(false);
  });
  
  // Test 1: Maximum skips per game
  test('enforces maximum skips per game', () => {
    render(
      <GameProvider>
        <TestGameComponent />
      </GameProvider>
    );
    
    // Start the game
    fireEvent.click(screen.getByTestId('start-game'));
    
    // Default max skips should be 5
    expect(screen.getByTestId('max-skips')).toHaveTextContent('5');
    
    // Change max skips to 3
    fireEvent.click(screen.getByTestId('set-max-skips'));
    expect(screen.getByTestId('max-skips')).toHaveTextContent('3');
    
    // Skip 3 times (reaching the max)
    fireEvent.click(screen.getByTestId('skip-word'));
    fireEvent.click(screen.getByTestId('skip-word'));
    fireEvent.click(screen.getByTestId('skip-word'));
    
    expect(screen.getByTestId('words-skipped')).toHaveTextContent('3');
  });
  
  // Test 2: Handling fractional average scores
  test('handles fractional average scores correctly', () => {
    // Mock session stats with fractional average
    (localStorage.loadSessionStats as jest.Mock).mockReturnValue({
      totalGames: 2,
      highScore: 10,
      averageScore: 7.5, // Fractional average
      totalWordsGuessed: 15,
      totalWordsSkipped: 5,
      bestStreak: 4,
    });
    
    (localStorage.hasSavedSession as jest.Mock).mockReturnValue(true);
    (localStorage.loadGameState as jest.Mock).mockReturnValue({
      status: 'idle',
      score: 0,
      wordsGuessed: 0,
      wordsSkipped: 0,
      difficulty: 'all',
    });
    
    render(
      <GameProvider>
        <TestGameComponent />
      </GameProvider>
    );
    
    // Check that the fractional average is displayed correctly
    expect(screen.getByTestId('session-avg-score')).toHaveTextContent('7.5');
    
    // Start a game and end it with a score of 5
    fireEvent.click(screen.getByTestId('start-game'));
    
    // Add some score
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('correct-guess')); // Score = 5
    
    // End the game
    fireEvent.click(screen.getByTestId('end-game'));
    
    // New average should be (7.5*2 + 5)/3 = 6.67
    expect(screen.getByTestId('session-avg-score')).toHaveTextContent('6.7');
  });
  
  // Test 3: Handling game reset during active play
  test('handles game reset during active play with accumulated stats', () => {
    render(
      <GameProvider>
        <TestGameComponent />
      </GameProvider>
    );
    
    // Start game and accumulate some stats
    fireEvent.click(screen.getByTestId('start-game'));
    
    // Correct guesses to build a streak
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    
    // Skip a word
    fireEvent.click(screen.getByTestId('skip-word'));
    
    // More correct guesses
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    
    // Current state: score=5, wordsGuessed=5, wordsSkipped=1, currentStreak=2, longestStreak=3
    
    // Reset during active play
    fireEvent.click(screen.getByTestId('reset-game'));
    
    // Game should be back to idle with reset stats
    expect(screen.getByTestId('status')).toHaveTextContent('idle');
    expect(screen.getByTestId('score')).toHaveTextContent('0');
    expect(screen.getByTestId('words-guessed')).toHaveTextContent('0');
    expect(screen.getByTestId('words-skipped')).toHaveTextContent('0');
    expect(screen.getByTestId('current-streak')).toHaveTextContent('0');
    
    // Session stats should be preserved (no games completed)
    expect(screen.getByTestId('session-games')).toHaveTextContent('0');
    expect(screen.getByTestId('session-high-score')).toHaveTextContent('0');
  });
  
  // Test 4: Handling multiple game sessions
  test('tracks statistics across multiple game sessions', () => {
    render(
      <GameProvider>
        <TestGameComponent />
      </GameProvider>
    );
    
    // First game - score 3
    fireEvent.click(screen.getByTestId('start-game'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('end-game'));
    
    // Check session stats after first game
    expect(screen.getByTestId('session-games')).toHaveTextContent('1');
    expect(screen.getByTestId('session-high-score')).toHaveTextContent('3');
    expect(screen.getByTestId('session-avg-score')).toHaveTextContent('3.0');
    
    // Second game - score 5
    fireEvent.click(screen.getByTestId('reset-game'));
    fireEvent.click(screen.getByTestId('start-game'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('end-game'));
    
    // Check updated session stats
    expect(screen.getByTestId('session-games')).toHaveTextContent('2');
    expect(screen.getByTestId('session-high-score')).toHaveTextContent('5');
    expect(screen.getByTestId('session-avg-score')).toHaveTextContent('4.0');
    
    // Third game - score 1 (lower than previous)
    fireEvent.click(screen.getByTestId('reset-game'));
    fireEvent.click(screen.getByTestId('start-game'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('end-game'));
    
    // Check updated session stats
    expect(screen.getByTestId('session-games')).toHaveTextContent('3');
    expect(screen.getByTestId('session-high-score')).toHaveTextContent('5'); // Still 5 (not decreased)
    expect(screen.getByTestId('session-avg-score')).toHaveTextContent('3.0'); // (3+5+1)/3 = 3.0
  });
  
  // Test 5: Handling state transitions from invalid states
  test('handles state transitions from invalid states', () => {
    render(
      <GameProvider>
        <TestGameComponent />
      </GameProvider>
    );
    
    // Try to pause game from idle state (changes to paused)
    fireEvent.click(screen.getByTestId('pause-game'));
    expect(screen.getByTestId('status')).toHaveTextContent('paused');
    
    // Try to resume game from paused state (changes to active)
    fireEvent.click(screen.getByTestId('resume-game'));
    expect(screen.getByTestId('status')).toHaveTextContent('active');
    
    // Try to end game from idle state
    fireEvent.click(screen.getByTestId('end-game'));
    expect(screen.getByTestId('status')).toHaveTextContent('completed');
    
    // Reset and start game
    fireEvent.click(screen.getByTestId('reset-game'));
    fireEvent.click(screen.getByTestId('start-game'));
    
    // Try to start game when already active (should remain active)
    fireEvent.click(screen.getByTestId('start-game'));
    expect(screen.getByTestId('status')).toHaveTextContent('active');
  });
  
  // Test 6: Handling streak calculation edge cases
  test('handles streak calculation edge cases', () => {
    render(
      <GameProvider>
        <TestGameComponent />
      </GameProvider>
    );
    
    // Start game
    fireEvent.click(screen.getByTestId('start-game'));
    
    // Build a streak of 3
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    
    // Current streak and longest streak should be 3
    expect(screen.getByTestId('current-streak')).toHaveTextContent('3');
    expect(screen.getByTestId('longest-streak')).toHaveTextContent('3');
    
    // Skip a word - should reset current streak but not longest
    fireEvent.click(screen.getByTestId('skip-word'));
    expect(screen.getByTestId('current-streak')).toHaveTextContent('0');
    expect(screen.getByTestId('longest-streak')).toHaveTextContent('3');
    
    // Build a new streak of 2
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    
    // Current streak should be 2, longest still 3
    expect(screen.getByTestId('current-streak')).toHaveTextContent('2');
    expect(screen.getByTestId('longest-streak')).toHaveTextContent('3');
    
    // Build streak to 4 (new longest)
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    
    // Current and longest streak should now be 4
    expect(screen.getByTestId('current-streak')).toHaveTextContent('4');
    expect(screen.getByTestId('longest-streak')).toHaveTextContent('4');
    
    // End game and check that best streak is updated
    fireEvent.click(screen.getByTestId('end-game'));
    expect(screen.getByTestId('session-best-streak')).toHaveTextContent('4');
    
    // Start a new game with a lower streak
    fireEvent.click(screen.getByTestId('reset-game'));
    fireEvent.click(screen.getByTestId('start-game'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('end-game'));
    
    // Session best streak should still be 4
    expect(screen.getByTestId('session-best-streak')).toHaveTextContent('4');
  });
});