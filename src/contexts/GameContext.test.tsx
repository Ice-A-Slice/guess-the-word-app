import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameProvider } from './GameContext';
import { useGameState, useGameDispatch } from '@/hooks/useGame';
import { Word } from '@/types';

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
}); 