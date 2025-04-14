import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SessionSummary from './SessionSummary';
import { useGameState } from '@/hooks/useGame';

// Mock the useGameState hook
jest.mock('@/hooks/useGame', () => ({
  useGameState: jest.fn(),
}));

describe('SessionSummary', () => {
  const mockGame = {
    score: 42,
    wordsGuessed: 15,
    wordsSkipped: 5,
    longestStreak: 8,
    sessionStats: {
      totalGames: 10,
      highScore: 75,
      averageScore: 35.5,
      totalWordsGuessed: 150,
      totalWordsSkipped: 30,
      bestStreak: 12,
    },
  };
  
  const mockOnStartNewGame = jest.fn();
  
  beforeEach(() => {
    (useGameState as jest.Mock).mockReturnValue(mockGame);
    jest.clearAllMocks();
  });
  
  test('renders session summary with correct data', () => {
    render(<SessionSummary onStartNewGame={mockOnStartNewGame} />);
    
    // Check current game stats
    expect(screen.getByText('Session Summary')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument(); // Score
    expect(screen.getByText('8')).toBeInTheDocument(); // Best Streak (longestStreak)
    expect(screen.getByText('15')).toBeInTheDocument(); // Words Guessed
    expect(screen.getByText('5')).toBeInTheDocument(); // Words Skipped
    
    // Check all-time stats
    expect(screen.getByText('All-time Stats')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument(); // Games Played
    expect(screen.getByText('75')).toBeInTheDocument(); // High Score
    expect(screen.getByText('36')).toBeInTheDocument(); // Average Score (rounded)
    expect(screen.getByText('12')).toBeInTheDocument(); // Best Streak
  });
  
  test('calls onStartNewGame when button is clicked', () => {
    render(<SessionSummary onStartNewGame={mockOnStartNewGame} />);
    
    const button = screen.getByText('Start New Game');
    fireEvent.click(button);
    
    expect(mockOnStartNewGame).toHaveBeenCalledTimes(1);
  });
}); 