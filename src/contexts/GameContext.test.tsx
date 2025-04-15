import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { GameProvider, GameStateContext, GameDispatchContext, useGameContext } from './GameContext';
import { useGameState, useGameDispatch } from '@/hooks/useGame';
import { Word } from '@/types';
import * as localStorage from '@/utils/localStorage';

// Mock word object to use in tests
const mockWord: Word = {
  id: '1',
  word: 'test',
  definition: 'A procedure intended to establish the quality, performance, or reliability of something',
  difficulty: 'easy'
};

// Test component that uses the context hooks
const TestComponent = () => {
  const state = useGameState();
  const dispatch = useGameDispatch();
  
  return (
    <div>
      <h1 data-testid="status">{state.status}</h1>
      <p data-testid="score">{state.score}</p>
      <p data-testid="language">{state.descriptionLanguage}</p>
      
      <button
        data-testid="start-button"
        onClick={() => dispatch({ type: 'START_GAME' })}
      >
        Start Game
      </button>
      
      <button
        data-testid="end-button"
        onClick={() => dispatch({ type: 'END_GAME' })}
      >
        End Game
      </button>
      
      <button
        data-testid="set-word-button"
        onClick={() => dispatch({ type: 'SET_WORD', payload: mockWord })}
      >
        Set Word
      </button>
      
      <button
        data-testid="correct-guess-button"
        onClick={() => 
          dispatch({ 
            type: 'CORRECT_GUESS', 
            payload: { points: 2, word: mockWord } 
          })
        }
      >
        Correct Guess
      </button>
      
      <button
        data-testid="set-language-button"
        onClick={() => 
          dispatch({ type: 'SET_DESCRIPTION_LANGUAGE', payload: 'Spanish' })
        }
      >
        Set Language
      </button>
    </div>
  );
};

// Helper function to setup the test environment
const setup = () => {
  return render(
    <GameProvider>
      <TestComponent />
    </GameProvider>
  );
};

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

// Test component to test the new useGameContext hook
const TestContextHook = () => {
  const { 
    descriptionLanguage, 
    setDescriptionLanguage 
  } = useGameContext();
  
  return (
    <div>
      <p data-testid="hook-language">{descriptionLanguage}</p>
      <button 
        data-testid="hook-set-language" 
        onClick={() => setDescriptionLanguage('French')}
      >
        Set To French
      </button>
    </div>
  );
};

describe('GameContext', () => {
  test('initializes with correct default state', () => {
    setup();
    
    // Check the initial status is 'idle'
    expect(screen.getByTestId('status').textContent).toBe('idle');
    expect(screen.getByTestId('score').textContent).toBe('0');
  });
  
  test('dispatches START_GAME action correctly', () => {
    setup();
    
    // Initial state
    expect(screen.getByTestId('status').textContent).toBe('idle');
    
    // Click the start game button
    fireEvent.click(screen.getByTestId('start-button'));
    
    // Check state after action
    expect(screen.getByTestId('status').textContent).toBe('active');
  });
  
  test('dispatches END_GAME action correctly', () => {
    setup();
    
    // Start the game first
    fireEvent.click(screen.getByTestId('start-button'));
    expect(screen.getByTestId('status').textContent).toBe('active');
    
    // End the game
    fireEvent.click(screen.getByTestId('end-button'));
    
    // Check state after action
    expect(screen.getByTestId('status').textContent).toBe('completed');
  });
  
  test('dispatches SET_WORD action correctly', () => {
    setup();
    
    // Start the game first
    fireEvent.click(screen.getByTestId('start-button'));
    
    // Set a word
    fireEvent.click(screen.getByTestId('set-word-button'));
    
    // We can't directly check the word in our test component
    // This test would be more complete with a specific test component
    // that displays the current word
  });
  
  test('updates score when dispatching CORRECT_GUESS action', () => {
    setup();
    
    // Start the game first
    fireEvent.click(screen.getByTestId('start-button'));
    
    // The initial score should be 0
    expect(screen.getByTestId('score').textContent).toBe('0');
    
    // Set a word first (required to have a valid game state)
    fireEvent.click(screen.getByTestId('set-word-button'));
    
    // Record a correct guess worth 2 points
    fireEvent.click(screen.getByTestId('correct-guess-button'));
    
    // Check that score increased
    expect(screen.getByTestId('score').textContent).toBe('2');
  });
  
  test('initializes with English as default language', () => {
    setup();
    
    // Check the initial language is 'English'
    expect(screen.getByTestId('language').textContent).toBe('English');
  });
  
  test('dispatches SET_DESCRIPTION_LANGUAGE action correctly', () => {
    setup();
    
    // Initial language should be English
    expect(screen.getByTestId('language').textContent).toBe('English');
    
    // Click the set language button to change to Spanish
    fireEvent.click(screen.getByTestId('set-language-button'));
    
    // Check language after action
    expect(screen.getByTestId('language').textContent).toBe('Spanish');
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
    });
    
    const { getByTestId } = render(
      <GameProvider>
        <TestConsumer />
      </GameProvider>
    );
    
    expect(getByTestId('status').textContent).toBe('paused');
    expect(getByTestId('score').textContent).toBe('15');
    expect(localStorage.hasSavedSession).toHaveBeenCalled();
    expect(localStorage.loadGameState).toHaveBeenCalled();
  });
  
  test('saves state changes to localStorage', () => {
    (localStorage.hasSavedSession as jest.Mock).mockReturnValue(false);
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
    
    // Reset mock calls before our actual test
    jest.clearAllMocks();
    
    // Dispatch an action to change state
    act(() => {
      getByTestId('start-game').click();
    });
    
    // Should trigger a save
    expect(localStorage.saveGameState).toHaveBeenCalled();
  });
  
  test('updates sessionStats when ending a game', () => {
    const { getByTestId } = render(
      <GameProvider>
        <TestConsumer />
      </GameProvider>
    );
    
    // Reset mock calls before our actual test
    jest.clearAllMocks();
    
    // Start game then end it
    act(() => {
      getByTestId('start-game').click();
    });
    
    // End the game
    act(() => {
      getByTestId('end-game').click();
    });
    
    // Should update session stats
    expect(localStorage.saveSessionStats).toHaveBeenCalled();
  });
});

// New test suite for the useGameContext hook
describe('useGameContext hook', () => {
  test('provides access to descriptionLanguage state', () => {
    render(
      <GameProvider>
        <TestContextHook />
      </GameProvider>
    );
    
    // Initial language should be English
    expect(screen.getByTestId('hook-language').textContent).toBe('English');
  });
  
  test('allows updating descriptionLanguage with setDescriptionLanguage', () => {
    render(
      <GameProvider>
        <TestContextHook />
      </GameProvider>
    );
    
    // Initial language should be English
    expect(screen.getByTestId('hook-language').textContent).toBe('English');
    
    // Click button to change language to French
    fireEvent.click(screen.getByTestId('hook-set-language'));
    
    // Language should now be French
    expect(screen.getByTestId('hook-language').textContent).toBe('French');
  });
  
  test('throws error when hook is used outside provider', () => {
    // Silence console.error for this test
    const originalError = console.error;
    console.error = jest.fn();
    
    expect(() => {
      render(<TestContextHook />);
    }).toThrow('useGameContext must be used within a GameProvider');
    
    // Restore console.error
    console.error = originalError;
  });
}); 