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
    skippedWords: [
      { id: 'word1', word: 'esoteric', definition: 'Intended for or likely to be understood by only a small number of people', difficulty: 'hard' },
      { id: 'word2', word: 'ubiquitous', definition: 'Present, appearing, or found everywhere', difficulty: 'medium' },
      { id: 'word3', word: 'ephemeral', definition: 'Lasting for a very short time', difficulty: 'hard' },
    ],
    sessionStats: {
      totalGames: 10,
      highScore: 75,
      averageScore: 35.5,
      totalWordsGuessed: 150,
      totalWordsSkipped: 30,
      bestStreak: 12,
    },
  };
  
  const mockGameNoSkippedWords = {
    ...mockGame,
    wordsSkipped: 0,
    skippedWords: [],
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
  
  test('displays skipped words button when skipped words exist', () => {
    render(<SessionSummary onStartNewGame={mockOnStartNewGame} />);
    
    // Should have the Show skipped words button
    const showButton = screen.getByText('Show skipped words');
    expect(showButton).toBeInTheDocument();
  });
  
  test('does not display skipped words button when no skipped words', () => {
    (useGameState as jest.Mock).mockReturnValue(mockGameNoSkippedWords);
    
    render(<SessionSummary onStartNewGame={mockOnStartNewGame} />);
    
    // Should not have the Show skipped words button
    expect(screen.queryByText('Show skipped words')).not.toBeInTheDocument();
  });
  
  test('toggles skipped words visibility when button is clicked', () => {
    render(<SessionSummary onStartNewGame={mockOnStartNewGame} />);
    
    // Skipped words should be hidden initially
    expect(screen.queryByText('Words you skipped:')).not.toBeInTheDocument();
    
    // Click to show skipped words
    fireEvent.click(screen.getByText('Show skipped words'));
    
    // Now skipped words should be visible
    expect(screen.getByText('Words you skipped:')).toBeInTheDocument();
    expect(screen.getByText('esoteric')).toBeInTheDocument();
    expect(screen.getByText('ubiquitous')).toBeInTheDocument();
    expect(screen.getByText('ephemeral')).toBeInTheDocument();
    
    // Button text should change
    expect(screen.getByText('Hide skipped words')).toBeInTheDocument();
    
    // Click to hide skipped words
    fireEvent.click(screen.getByText('Hide skipped words'));
    
    // Skipped words should be hidden again
    expect(screen.queryByText('Words you skipped:')).not.toBeInTheDocument();
  });
  
  test('displays word details for skipped words', () => {
    render(<SessionSummary onStartNewGame={mockOnStartNewGame} />);
    
    // Show skipped words
    fireEvent.click(screen.getByText('Show skipped words'));
    
    // Check if word details are displayed
    expect(screen.getByText('esoteric')).toBeInTheDocument();
    expect(screen.getByText('Intended for or likely to be understood by only a small number of people')).toBeInTheDocument();
    
    // Use getAllByText for difficulty labels since 'hard' appears multiple times
    const hardLabels = screen.getAllByText('hard');
    expect(hardLabels.length).toBe(2); // There should be two 'hard' difficulty labels
    
    // Check another word
    expect(screen.getByText('ubiquitous')).toBeInTheDocument();
    expect(screen.getByText('Present, appearing, or found everywhere')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
  });
}); 