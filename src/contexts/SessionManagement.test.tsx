import React from 'react';
import { render, act } from '@testing-library/react';
import { GameProvider, GameStateContext, GameDispatchContext } from './GameContext';
import * as localStorage from '@/utils/localStorage';

// Mock the localStorage utilities
jest.mock('@/utils/localStorage', () => ({
  saveGameState: jest.fn(),
  saveSessionStats: jest.fn(),
  loadGameState: jest.fn(),
  loadSessionStats: jest.fn(),
  clearGameState: jest.fn(),
  hasSavedSession: jest.fn(),
}));

// Test component that uses the context
const TestSessionConsumer = () => {
  const state = React.useContext(GameStateContext);
  const dispatch = React.useContext(GameDispatchContext);
  
  if (!state || !dispatch) {
    return <div>Context not available</div>;
  }
  
  return (
    <div>
      <div data-testid="status">{state.status}</div>
      <div data-testid="score">{state.score}</div>
      <div data-testid="has-saved-session">{state.hasSavedSession.toString()}</div>
      <button 
        data-testid="start-game" 
        onClick={() => dispatch({ type: 'START_GAME' })}
      >
        Start Game
      </button>
      <button 
        data-testid="continue-session" 
        onClick={() => dispatch({ type: 'CONTINUE_SESSION' })}
      >
        Continue Session
      </button>
      <button 
        data-testid="end-game" 
        onClick={() => dispatch({ type: 'END_GAME' })}
      >
        End Game
      </button>
    </div>
  );
};

describe('Session Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (localStorage.hasSavedSession as jest.Mock).mockReturnValue(false);
    (localStorage.loadGameState as jest.Mock).mockReturnValue(null);
    (localStorage.loadSessionStats as jest.Mock).mockReturnValue(null);
  });
  
  test('initializes with hasSavedSession = false by default', () => {
    const { getByTestId } = render(
      <GameProvider>
        <TestSessionConsumer />
      </GameProvider>
    );
    
    expect(getByTestId('has-saved-session').textContent).toBe('false');
  });
  
  test('loads saved session on mount if one exists', () => {
    // Mock a saved session
    (localStorage.hasSavedSession as jest.Mock).mockReturnValue(true);
    (localStorage.loadGameState as jest.Mock).mockReturnValue({
      status: 'active',
      score: 15,
      wordsGuessed: 3,
      hasSavedSession: true, // Include this in the returned state
    });
    
    const { getByTestId } = render(
      <GameProvider>
        <TestSessionConsumer />
      </GameProvider>
    );
    
    // Check that the score was loaded correctly
    expect(getByTestId('score').textContent).toBe('15');
    // Status should be paused after loading a saved session
    expect(getByTestId('status').textContent).toBe('paused');
  });
  
  test('loads session stats on mount if they exist', () => {
    // Mock saved session stats
    (localStorage.loadSessionStats as jest.Mock).mockReturnValue({
      totalGames: 5,
      highScore: 30,
      averageScore: 15,
      totalWordsGuessed: 25,
      totalWordsSkipped: 10,
      bestStreak: 8,
    });
    
    // We can't easily test the session stats from the context directly,
    // but we can verify that loadSessionStats was called
    render(
      <GameProvider>
        <TestSessionConsumer />
      </GameProvider>
    );
    
    expect(localStorage.loadSessionStats).toHaveBeenCalled();
  });
  
  test('clears localStorage when starting a new game', () => {
    const { getByTestId } = render(
      <GameProvider>
        <TestSessionConsumer />
      </GameProvider>
    );
    
    act(() => {
      getByTestId('start-game').click();
    });
    
    expect(localStorage.clearGameState).toHaveBeenCalled();
    expect(getByTestId('status').textContent).toBe('active');
    expect(getByTestId('has-saved-session').textContent).toBe('false');
  });
  
  test('continues saved session', () => {
    // Mock a saved session first
    (localStorage.hasSavedSession as jest.Mock).mockReturnValue(true);
    (localStorage.loadGameState as jest.Mock).mockReturnValue({
      status: 'paused',
      score: 15,
      hasSavedSession: true,
    });
    
    const { getByTestId } = render(
      <GameProvider>
        <TestSessionConsumer />
      </GameProvider>
    );
    
    // Should be in paused state initially
    expect(getByTestId('status').textContent).toBe('paused');
    
    // Now continue the session
    act(() => {
      getByTestId('continue-session').click();
    });
    
    // Should now be active and hasSavedSession should be false
    expect(getByTestId('status').textContent).toBe('active');
    expect(getByTestId('has-saved-session').textContent).toBe('false');
  });
  
  test('saves session stats when ending game', () => {
    const { getByTestId } = render(
      <GameProvider>
        <TestSessionConsumer />
      </GameProvider>
    );
    
    // Start a game first to set the status to active
    act(() => {
      getByTestId('start-game').click();
    });
    
    // Now end the game
    act(() => {
      getByTestId('end-game').click();
    });
    
    // Should have saved session stats and cleared game state
    expect(localStorage.saveSessionStats).toHaveBeenCalled();
    expect(localStorage.clearGameState).toHaveBeenCalled();
    expect(getByTestId('status').textContent).toBe('completed');
    expect(getByTestId('has-saved-session').textContent).toBe('false');
  });
}); 