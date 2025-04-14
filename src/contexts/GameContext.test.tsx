import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { GameProvider, GameStateContext, GameDispatchContext } from './GameContext';
import { useGameState, useGameDispatch, useGame } from '@/hooks/useGame';
import { Word } from '@/types';
import * as localStorage from '@/utils/localStorage';

// Mock word object to use in tests
const mockWord: Word = {
  id: 'test-1',
  word: 'example',
  definition: 'A thing that serves as a pattern',
  difficulty: 'easy',
};

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
      <button 
        data-testid="correct-guess" 
        onClick={() => game.correctGuess(1, mockWord)}
      >
        Correct Guess
      </button>
      <button data-testid="skip-word" onClick={game.skipWord}>Skip Word</button>
    </div>
  );
}

// Mock localStorage utilities
jest.mock('@/utils/localStorage', () => ({
  saveGameState: jest.fn(),
  saveSessionStats: jest.fn(),
  loadGameState: jest.fn(),
  loadSessionStats: jest.fn(),
  hasSavedSession: jest.fn(),
  clearGameState: jest.fn(),
}));

// Test component to access context values
const TestConsumer = () => {
  const state = React.useContext(GameStateContext);
  const dispatch = React.useContext(GameDispatchContext);
  
  // Expose context values for testing
  return (
    <div>
      <div data-testid="status">{state?.status}</div>
      <div data-testid="score">{state?.score}</div>
      <button 
        data-testid="start-game" 
        onClick={() => dispatch?.({ type: 'START_GAME' })}
      >
        Start Game
      </button>
      <button 
        data-testid="end-game" 
        onClick={() => dispatch?.({ type: 'END_GAME' })}
      >
        End Game
      </button>
    </div>
  );
};

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

describe('GameProvider with localStorage integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (localStorage.hasSavedSession as jest.Mock).mockReturnValue(false);
  });
  
  test('initializes with default state when no saved session exists', () => {
    const { getByTestId } = render(
      <GameProvider>
        <TestConsumer />
      </GameProvider>
    );
    
    expect(getByTestId('status').textContent).toBe('idle');
    expect(getByTestId('score').textContent).toBe('0');
    expect(localStorage.hasSavedSession).toHaveBeenCalled();
  });
  
  test('loads saved state when saved session exists', () => {
    (localStorage.hasSavedSession as jest.Mock).mockReturnValue(true);
    (localStorage.loadGameState as jest.Mock).mockReturnValue({
      status: 'active',
      score: 15,
      wordsGuessed: 5,
      difficulty: 'medium',
    });
    (localStorage.loadSessionStats as jest.Mock).mockReturnValue({
      totalGames: 2,
      highScore: 25,
      averageScore: 20,
      totalWordsGuessed: 10,
      totalWordsSkipped: 5,
      bestStreak: 4
    });
    
    const { getByTestId } = render(
      <GameProvider>
        <TestConsumer />
      </GameProvider>
    );
    
    expect(getByTestId('status').textContent).toBe('active');
    expect(getByTestId('score').textContent).toBe('15');
    expect(localStorage.hasSavedSession).toHaveBeenCalled();
    expect(localStorage.loadGameState).toHaveBeenCalled();
    expect(localStorage.loadSessionStats).toHaveBeenCalled();
  });
  
  test('saves state changes to localStorage', () => {
    const { getByTestId } = render(
      <GameProvider>
        <TestConsumer />
      </GameProvider>
    );
    
    // Initial render should not trigger a save
    expect(localStorage.saveGameState).not.toHaveBeenCalled();
    
    // Dispatch an action to change state
    act(() => {
      getByTestId('start-game').click();
    });
    
    // After state change, should save to localStorage
    expect(localStorage.saveGameState).toHaveBeenCalled();
    expect(localStorage.saveSessionStats).toHaveBeenCalled();
  });
  
  test('updates sessionStats when ending a game', () => {
    const { getByTestId } = render(
      <GameProvider>
        <TestConsumer />
      </GameProvider>
    );
    
    // Start game then end it
    act(() => {
      getByTestId('start-game').click();
    });
    
    // Clear mocks after starting game
    jest.clearAllMocks();
    
    act(() => {
      getByTestId('end-game').click();
    });
    
    // Should save session stats after ending game
    expect(localStorage.saveSessionStats).toHaveBeenCalled();
  });
}); 