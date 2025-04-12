import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { GameProvider } from '@/contexts';
import { useGameWithWordSelection } from './useGame';
import { Word } from '@/types';

// Mock useWordSelection
jest.mock('./useWordSelection', () => ({
  useWordSelection: jest.fn(() => ({
    currentWord: {
      id: 'test-1',
      word: 'example',
      definition: 'A thing that serves as a pattern',
      difficulty: 'easy',
    },
    getNextWord: jest.fn(() => {
      return {
        id: 'test-2',
        word: 'test',
        definition: 'A procedure for critical evaluation',
        difficulty: 'easy',
      };
    }),
    wordList: [
      {
        id: 'test-1',
        word: 'example',
        definition: 'A thing that serves as a pattern',
        difficulty: 'easy',
      },
      {
        id: 'test-2',
        word: 'test',
        definition: 'A procedure for critical evaluation',
        difficulty: 'easy',
      },
    ],
  })),
}));

// Test component that uses the integrated hook
function IntegratedGameComponent() {
  const game = useGameWithWordSelection();
  
  return (
    <div>
      <div data-testid="status">{game.status}</div>
      <div data-testid="score">{game.score}</div>
      <div data-testid="current-word">{game.currentWord?.word || 'No word'}</div>
      <div data-testid="difficulty">{game.difficulty}</div>
      <button data-testid="start-game" onClick={game.startGame}>Start Game</button>
      <button data-testid="correct-guess" onClick={() => game.handleCorrectGuess(1)}>Correct Guess</button>
      <button data-testid="skip-word" onClick={game.handleSkipWord}>Skip Word</button>
      <button data-testid="next-word" onClick={game.getNextWord}>Next Word</button>
      <button data-testid="set-difficulty" onClick={() => game.setDifficulty('medium')}>Set Medium</button>
    </div>
  );
}

describe('useGameWithWordSelection', () => {
  test('integrates game state with word selection', () => {
    render(
      <GameProvider>
        <IntegratedGameComponent />
      </GameProvider>
    );
    
    // Check initial state
    expect(screen.getByTestId('status')).toHaveTextContent('idle');
    expect(screen.getByTestId('current-word')).toHaveTextContent('example');
  });
  
  test('starts game and loads initial word', () => {
    render(
      <GameProvider>
        <IntegratedGameComponent />
      </GameProvider>
    );
    
    // Start the game
    fireEvent.click(screen.getByTestId('start-game'));
    
    // Check game is active and has a word
    expect(screen.getByTestId('status')).toHaveTextContent('active');
    expect(screen.getByTestId('current-word')).toHaveTextContent('example');
  });
  
  test('handles correct guess', () => {
    const { getByTestId } = render(
      <GameProvider>
        <IntegratedGameComponent />
      </GameProvider>
    );
    
    // Start game and make a correct guess
    fireEvent.click(getByTestId('start-game'));
    fireEvent.click(getByTestId('correct-guess'));
    
    // Score should increase and a new word should be loaded
    expect(getByTestId('score')).toHaveTextContent('1');
  });
  
  test('handles skipping a word', () => {
    const { getByTestId } = render(
      <GameProvider>
        <IntegratedGameComponent />
      </GameProvider>
    );
    
    // Start game and skip a word
    fireEvent.click(getByTestId('start-game'));
    fireEvent.click(getByTestId('skip-word'));
    
    // Should record skip and advance to next word
    expect(getByTestId('score')).toHaveTextContent('0'); // No score increase
  });
  
  test('updates difficulty', () => {
    const { getByTestId } = render(
      <GameProvider>
        <IntegratedGameComponent />
      </GameProvider>
    );
    
    // Change difficulty
    fireEvent.click(getByTestId('set-difficulty'));
    
    // Difficulty should be updated
    expect(getByTestId('difficulty')).toHaveTextContent('medium');
  });
  
  test('game loop - full cycle', () => {
    const { getByTestId } = render(
      <GameProvider>
        <IntegratedGameComponent />
      </GameProvider>
    );
    
    // Start the game
    fireEvent.click(getByTestId('start-game'));
    
    // Make a correct guess
    fireEvent.click(getByTestId('correct-guess'));
    expect(getByTestId('score')).toHaveTextContent('1');
    
    // Skip a word
    fireEvent.click(getByTestId('skip-word'));
    
    // Make another correct guess
    fireEvent.click(getByTestId('correct-guess'));
    expect(getByTestId('score')).toHaveTextContent('2');
  });
}); 