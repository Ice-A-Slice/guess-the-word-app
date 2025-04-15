import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSelector } from './LanguageSelector';

// Global mock for the setDescriptionLanguage function
const mockSetLanguage = jest.fn();

// Mock the GameContext to avoid dependencies
jest.mock('@/contexts/GameContext', () => {
  return {
    GameProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    useGameContext: () => ({
      // Game status properties
      status: 'idle',
      currentWord: null,
      score: 0,
      wordsGuessed: 0,
      wordsSkipped: 0,
      currentStreak: 0,
      longestStreak: 0,
      skippedWords: [],
      scoreHistory: [],
      sessionStats: {
        totalGames: 0,
        highScore: 0,
        averageScore: 0,
        totalWordsGuessed: 0,
        totalWordsSkipped: 0,
        bestStreak: 0
      },
      maxSkipsPerGame: 5,
      difficulty: 'all',
      hasSavedSession: false,
      
      // The properties we're actually testing
      descriptionLanguage: 'English',
      setDescriptionLanguage: mockSetLanguage,
      
      // Action functions
      startGame: jest.fn(),
      pauseGame: jest.fn(),
      resumeGame: jest.fn(),
      endGame: jest.fn(),
      setWord: jest.fn(),
      correctGuess: jest.fn(),
      skipWord: jest.fn(),
      setDifficulty: jest.fn(),
      setMaxSkips: jest.fn(),
      resetGame: jest.fn(),
      continueSession: jest.fn(),
    }),
  };
});

describe('LanguageSelector', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });
  
  it('renders language options correctly', () => {
    render(<LanguageSelector />);
    
    expect(screen.getByText('Language:')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Svenska')).toBeInTheDocument();
  });
  
  it('highlights the currently selected language', () => {
    render(<LanguageSelector />);
    
    const englishButton = screen.getByText('English').closest('button');
    const swedishButton = screen.getByText('Svenska').closest('button');
    
    expect(englishButton).toHaveAttribute('aria-pressed', 'true');
    expect(swedishButton).toHaveAttribute('aria-pressed', 'false');
  });
  
  it('calls setDescriptionLanguage when a language is selected', () => {
    render(<LanguageSelector />);
    
    const swedishButton = screen.getByText('Svenska');
    fireEvent.click(swedishButton);
    
    expect(mockSetLanguage).toHaveBeenCalledWith('Swedish');
  });
  
  it('applies custom className when provided', () => {
    render(<LanguageSelector className="custom-class" />);
    
    const container = screen.getByText('Language:').parentElement;
    expect(container).toHaveClass('custom-class');
  });
  
  it('renders in vertical layout when vertical prop is true', () => {
    render(<LanguageSelector vertical />);
    
    const container = screen.getByText('Language:').parentElement;
    const buttonContainer = screen.getByText('English').parentElement?.parentElement;
    
    expect(container).toHaveClass('flex-col');
    expect(buttonContainer).toHaveClass('flex-col');
  });
}); 