import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GameControls from './GameControls';
import { GameProvider } from '@/contexts';
import * as gameHooks from '@/hooks/useGame';

// Mock the useGameWithWordSelection hook
jest.mock('@/hooks/useGame', () => {
  const originalModule = jest.requireActual('@/hooks/useGame');
  
  return {
    ...originalModule,
    useGameWithWordSelection: jest.fn(),
  };
});

describe('GameControls', () => {
  const mockGameHook = {
    status: 'idle',
    score: 0,
    wordsGuessed: 0,
    wordsSkipped: 0,
    currentWord: {
      id: 'test-1',
      word: 'example',
      definition: 'A thing that serves as a pattern',
      difficulty: 'easy',
    },
    difficulty: 'all',
    sessionStats: {
      totalGames: 2,
      highScore: 10,
      averageScore: 8,
      totalWordsGuessed: 16,
      totalWordsSkipped: 4,
      bestStreak: 5
    },
    scoreHistory: [],
    skippedWords: [],
    currentStreak: 0,
    longestStreak: 0,
    maxSkipsPerGame: 5,
    hasSavedSession: false,
    startGame: jest.fn(),
    pauseGame: jest.fn(),
    resumeGame: jest.fn(),
    endGame: jest.fn(),
    resetGame: jest.fn(),
    continueSession: jest.fn(),
    handleCorrectGuess: jest.fn(),
    handleSkipWord: jest.fn(),
    getNextWord: jest.fn(),
    setDifficulty: jest.fn(),
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    (gameHooks.useGameWithWordSelection as jest.Mock).mockReturnValue(mockGameHook);
  });
  
  test('renders idle state with start button', () => {
    render(
      <GameProvider>
        <GameControls />
      </GameProvider>
    );
    
    expect(screen.getByText('Guess the Word Game')).toBeInTheDocument();
    expect(screen.getByText('Select Difficulty:')).toBeInTheDocument();
    expect(screen.getByTestId('start-button')).toBeInTheDocument();
  });
  
  test('shows continue session option when a saved session exists', () => {
    (gameHooks.useGameWithWordSelection as jest.Mock).mockReturnValue({
      ...mockGameHook,
      hasSavedSession: true,
    });
    
    render(
      <GameProvider>
        <GameControls />
      </GameProvider>
    );
    
    expect(screen.getByText('You have a saved session')).toBeInTheDocument();
    expect(screen.getByTestId('continue-session-button')).toBeInTheDocument();
  });
  
  test('calls continueSession when continue button is clicked', () => {
    (gameHooks.useGameWithWordSelection as jest.Mock).mockReturnValue({
      ...mockGameHook,
      hasSavedSession: true,
    });
    
    render(
      <GameProvider>
        <GameControls />
      </GameProvider>
    );
    
    fireEvent.click(screen.getByTestId('continue-session-button'));
    expect(mockGameHook.continueSession).toHaveBeenCalled();
  });
  
  test('calls startGame when start button is clicked', () => {
    render(
      <GameProvider>
        <GameControls />
      </GameProvider>
    );
    
    fireEvent.click(screen.getByTestId('start-button'));
    expect(mockGameHook.startGame).toHaveBeenCalled();
  });
  
  test('changes difficulty when selector is changed', () => {
    render(
      <GameProvider>
        <GameControls />
      </GameProvider>
    );
    
    fireEvent.change(screen.getByLabelText('Select Difficulty:'), { target: { value: 'medium' } });
    expect(mockGameHook.setDifficulty).toHaveBeenCalledWith('medium');
  });
  
  test('renders active game state with score and controls', () => {
    (gameHooks.useGameWithWordSelection as jest.Mock).mockReturnValue({
      ...mockGameHook,
      status: 'active',
      score: 5,
      wordsGuessed: 5,
    });
    
    render(
      <GameProvider>
        <GameControls />
      </GameProvider>
    );
    
    expect(screen.getByTestId('score-display')).toHaveTextContent('5');
    expect(screen.getByTestId('words-guessed-display')).toHaveTextContent('5');
    expect(screen.getByTestId('skip-button')).toBeInTheDocument();
    expect(screen.getByTestId('pause-button')).toBeInTheDocument();
    expect(screen.getByTestId('end-button')).toBeInTheDocument();
  });
  
  test('calls handleSkipWord when skip button is clicked', () => {
    (gameHooks.useGameWithWordSelection as jest.Mock).mockReturnValue({
      ...mockGameHook,
      status: 'active',
    });
    
    render(
      <GameProvider>
        <GameControls />
      </GameProvider>
    );
    
    fireEvent.click(screen.getByTestId('skip-button'));
    expect(mockGameHook.handleSkipWord).toHaveBeenCalled();
  });
  
  test('renders paused state with resume button', () => {
    (gameHooks.useGameWithWordSelection as jest.Mock).mockReturnValue({
      ...mockGameHook,
      status: 'paused',
    });
    
    render(
      <GameProvider>
        <GameControls />
      </GameProvider>
    );
    
    expect(screen.getByText('Game Paused')).toBeInTheDocument();
    expect(screen.getByTestId('resume-button')).toBeInTheDocument();
    expect(screen.getByTestId('end-game-button')).toBeInTheDocument();
  });
  
  test('renders completed state with game stats', () => {
    (gameHooks.useGameWithWordSelection as jest.Mock).mockReturnValue({
      ...mockGameHook,
      status: 'completed',
      score: 8,
      wordsGuessed: 8,
      wordsSkipped: 2,
      longestStreak: 0,
    });
    
    render(
      <GameProvider>
        <GameControls />
      </GameProvider>
    );
    
    expect(screen.getByText('Game Complete!')).toBeInTheDocument();
    expect(screen.getByTestId('final-score')).toHaveTextContent('8');
    expect(screen.getByTestId('final-words-guessed')).toHaveTextContent('8');
    expect(screen.getByTestId('longest-streak')).toHaveTextContent('0');
    expect(screen.getByTestId('high-score')).toHaveTextContent('10');
    expect(screen.getByTestId('play-again-button')).toBeInTheDocument();
    
    // Check for session stats that were added
    expect(screen.getByTestId('total-games')).toHaveTextContent('2');
    expect(screen.getByTestId('average-score')).toHaveTextContent('8');
    expect(screen.getByTestId('total-words-guessed')).toHaveTextContent('16');
    expect(screen.getByTestId('best-streak')).toHaveTextContent('5');
  });
  
  test('calls startGame when play again button is clicked', () => {
    (gameHooks.useGameWithWordSelection as jest.Mock).mockReturnValue({
      ...mockGameHook,
      status: 'completed',
    });
    
    render(
      <GameProvider>
        <GameControls />
      </GameProvider>
    );
    
    fireEvent.click(screen.getByTestId('play-again-button'));
    expect(mockGameHook.startGame).toHaveBeenCalled();
  });
}); 