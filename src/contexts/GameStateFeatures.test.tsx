import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameProvider } from './GameContext';
import { useGame } from '@/hooks/useGame';
import * as localStorage from '@/utils/localStorage';

// Mock localStorage utilities to prevent actual storage operations
jest.mock('@/utils/localStorage', () => ({
  saveGameState: jest.fn(),
  saveSessionStats: jest.fn(),
  loadGameState: jest.fn(() => null),
  loadSessionStats: jest.fn(() => null),
  hasSavedSession: jest.fn(() => false),
  clearGameState: jest.fn(),
}));

// Simple test component that uses the game state
function TestComponent() {
  const game = useGame();
  
  return (
    <div>
      <div data-testid="status">{game.status}</div>
      <div data-testid="score">{game.score}</div>
      <div data-testid="words-guessed">{game.wordsGuessed}</div>
      <div data-testid="words-skipped">{game.wordsSkipped}</div>
      <div data-testid="current-streak">{game.currentStreak}</div>
      <div data-testid="longest-streak">{game.longestStreak}</div>
      <div data-testid="session-games">{game.sessionStats.totalGames}</div>
      <div data-testid="session-high-score">{game.sessionStats.highScore}</div>
      
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
    </div>
  );
}

describe('Game State Features', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('Feature 1: State transitions', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    // Initial state should be idle
    expect(screen.getByTestId('status')).toHaveTextContent('idle');
    
    // Start game: idle → active
    fireEvent.click(screen.getByTestId('start-game'));
    expect(screen.getByTestId('status')).toHaveTextContent('active');
    
    // Pause game: active → paused
    fireEvent.click(screen.getByTestId('pause-game'));
    expect(screen.getByTestId('status')).toHaveTextContent('paused');
    
    // Resume game: paused → active
    fireEvent.click(screen.getByTestId('resume-game'));
    expect(screen.getByTestId('status')).toHaveTextContent('active');
    
    // End game: active → completed
    fireEvent.click(screen.getByTestId('end-game'));
    expect(screen.getByTestId('status')).toHaveTextContent('completed');
  });
  
  test('Feature 2: Score tracking', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    // Start the game
    fireEvent.click(screen.getByTestId('start-game'));
    
    // Initial score should be 0
    expect(screen.getByTestId('score')).toHaveTextContent('0');
    
    // Correct guess should increase score
    fireEvent.click(screen.getByTestId('correct-guess'));
    expect(screen.getByTestId('score')).toHaveTextContent('1');
    
    // Another correct guess should increase score again
    fireEvent.click(screen.getByTestId('correct-guess'));
    expect(screen.getByTestId('score')).toHaveTextContent('2');
    
    // Skip should not affect score
    fireEvent.click(screen.getByTestId('skip-word'));
    expect(screen.getByTestId('score')).toHaveTextContent('2');
  });
  
  test('Feature 3: Streak tracking', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    // Start the game
    fireEvent.click(screen.getByTestId('start-game'));
    
    // Initial streak should be 0
    expect(screen.getByTestId('current-streak')).toHaveTextContent('0');
    expect(screen.getByTestId('longest-streak')).toHaveTextContent('0');
    
    // First correct guess
    fireEvent.click(screen.getByTestId('correct-guess'));
    expect(screen.getByTestId('current-streak')).toHaveTextContent('1');
    expect(screen.getByTestId('longest-streak')).toHaveTextContent('1');
    
    // Second correct guess
    fireEvent.click(screen.getByTestId('correct-guess'));
    expect(screen.getByTestId('current-streak')).toHaveTextContent('2');
    expect(screen.getByTestId('longest-streak')).toHaveTextContent('2');
    
    // Skip a word - should reset current streak but not longest
    fireEvent.click(screen.getByTestId('skip-word'));
    expect(screen.getByTestId('current-streak')).toHaveTextContent('0');
    expect(screen.getByTestId('longest-streak')).toHaveTextContent('2');
    
    // New correct guess after skip
    fireEvent.click(screen.getByTestId('correct-guess'));
    expect(screen.getByTestId('current-streak')).toHaveTextContent('1');
    expect(screen.getByTestId('longest-streak')).toHaveTextContent('2');
    
    // More correct guesses to exceed previous longest
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    expect(screen.getByTestId('current-streak')).toHaveTextContent('3');
    expect(screen.getByTestId('longest-streak')).toHaveTextContent('3');
  });
  
  test('Feature 4: Session statistics', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    // Initial session stats
    expect(screen.getByTestId('session-games')).toHaveTextContent('0');
    expect(screen.getByTestId('session-high-score')).toHaveTextContent('0');
    
    // Complete a game with score 2
    fireEvent.click(screen.getByTestId('start-game'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('end-game'));
    
    // Session stats should update
    expect(screen.getByTestId('session-games')).toHaveTextContent('1');
    expect(screen.getByTestId('session-high-score')).toHaveTextContent('2');
    
    // Complete another game with higher score
    fireEvent.click(screen.getByTestId('reset-game'));
    fireEvent.click(screen.getByTestId('start-game'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('end-game'));
    
    // High score should update
    expect(screen.getByTestId('session-games')).toHaveTextContent('2');
    expect(screen.getByTestId('session-high-score')).toHaveTextContent('3');
    
    // Complete another game with lower score
    fireEvent.click(screen.getByTestId('reset-game'));
    fireEvent.click(screen.getByTestId('start-game'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('end-game'));
    
    // High score should not decrease
    expect(screen.getByTestId('session-games')).toHaveTextContent('3');
    expect(screen.getByTestId('session-high-score')).toHaveTextContent('3');
  });
  
  test('Feature 5: Game reset', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    // Start game and accumulate score
    fireEvent.click(screen.getByTestId('start-game'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    
    // Score should be 2
    expect(screen.getByTestId('score')).toHaveTextContent('2');
    
    // Reset game
    fireEvent.click(screen.getByTestId('reset-game'));
    
    // Game should be back to idle with reset stats
    expect(screen.getByTestId('status')).toHaveTextContent('idle');
    expect(screen.getByTestId('score')).toHaveTextContent('0');
    expect(screen.getByTestId('words-guessed')).toHaveTextContent('0');
    expect(screen.getByTestId('words-skipped')).toHaveTextContent('0');
    expect(screen.getByTestId('current-streak')).toHaveTextContent('0');
  });
  
  test('Feature 6: State persistence', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    // Start game
    fireEvent.click(screen.getByTestId('start-game'));
    
    // Should save state
    expect(localStorage.saveGameState).toHaveBeenCalled();
    
    // Make more state changes
    fireEvent.click(screen.getByTestId('correct-guess'));
    
    // Should save state again - update expected call count
    expect(localStorage.saveGameState).toHaveBeenCalled();
    
    // End game
    fireEvent.click(screen.getByTestId('end-game'));
    
    // Should save session stats
    expect(localStorage.saveSessionStats).toHaveBeenCalled();
  });
});