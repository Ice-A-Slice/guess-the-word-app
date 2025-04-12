import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { GameProvider, GameStateContext, GameDispatchContext } from './GameContext';
import { useGameState, useGameDispatch, useGame } from '@/hooks/useGame';

// Test component that uses the game context
function TestComponent() {
  const game = useGame();
  
  return (
    <div>
      <div data-testid="status">{game.status}</div>
      <div data-testid="score">{game.score}</div>
      <div data-testid="words-guessed">{game.wordsGuessed}</div>
      <div data-testid="words-skipped">{game.wordsSkipped}</div>
      <button data-testid="start-game" onClick={game.startGame}>Start Game</button>
      <button data-testid="end-game" onClick={game.endGame}>End Game</button>
      <button data-testid="correct-guess" onClick={() => game.correctGuess(1)}>Correct Guess</button>
      <button data-testid="skip-word" onClick={game.skipWord}>Skip Word</button>
    </div>
  );
}

describe('GameContext', () => {
  test('provides initial state to children', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    expect(screen.getByTestId('status')).toHaveTextContent('idle');
    expect(screen.getByTestId('score')).toHaveTextContent('0');
    expect(screen.getByTestId('words-guessed')).toHaveTextContent('0');
    expect(screen.getByTestId('words-skipped')).toHaveTextContent('0');
  });
  
  test('starts game when startGame is called', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    fireEvent.click(screen.getByTestId('start-game'));
    
    expect(screen.getByTestId('status')).toHaveTextContent('active');
  });
  
  test('increases score and words guessed when correctGuess is called', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    // Start the game first
    fireEvent.click(screen.getByTestId('start-game'));
    
    // Register a correct guess
    fireEvent.click(screen.getByTestId('correct-guess'));
    
    expect(screen.getByTestId('score')).toHaveTextContent('1');
    expect(screen.getByTestId('words-guessed')).toHaveTextContent('1');
  });
  
  test('increases words skipped when skipWord is called', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    // Start the game first
    fireEvent.click(screen.getByTestId('start-game'));
    
    // Skip a word
    fireEvent.click(screen.getByTestId('skip-word'));
    
    expect(screen.getByTestId('words-skipped')).toHaveTextContent('1');
  });
  
  test('ends game and updates session stats when endGame is called', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    // Start the game
    fireEvent.click(screen.getByTestId('start-game'));
    
    // Register some scores
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('correct-guess'));
    fireEvent.click(screen.getByTestId('skip-word'));
    
    // End the game
    fireEvent.click(screen.getByTestId('end-game'));
    
    expect(screen.getByTestId('status')).toHaveTextContent('completed');
  });
});

// Test the custom hooks
describe('Game hooks', () => {
  test('useGameState throws error when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const TestHook = () => {
      useGameState();
      return null;
    };
    
    expect(() => {
      render(<TestHook />);
    }).toThrow('useGameState must be used within a GameProvider');
    
    consoleError.mockRestore();
  });
  
  test('useGameDispatch throws error when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const TestHook = () => {
      useGameDispatch();
      return null;
    };
    
    expect(() => {
      render(<TestHook />);
    }).toThrow('useGameDispatch must be used within a GameProvider');
    
    consoleError.mockRestore();
  });
  
  test('useGame provides state and action creators', () => {
    let gameHook: ReturnType<typeof useGame>;
    
    const TestHook = () => {
      gameHook = useGame();
      return null;
    };
    
    render(
      <GameProvider>
        <TestHook />
      </GameProvider>
    );
    
    // Check that state properties are available
    expect(gameHook!.status).toBe('idle');
    expect(gameHook!.score).toBe(0);
    
    // Check that action creators are available
    expect(typeof gameHook!.startGame).toBe('function');
    expect(typeof gameHook!.correctGuess).toBe('function');
    expect(typeof gameHook!.skipWord).toBe('function');
  });
}); 