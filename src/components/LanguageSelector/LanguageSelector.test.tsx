import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSelector, LANGUAGE_OPTIONS } from './LanguageSelector';
import { useGameContext } from '@/contexts/GameContext';

// Mock the GameContext hook
jest.mock('@/contexts/GameContext', () => ({
  useGameContext: jest.fn(),
  DescriptionLanguage: String
}));

describe('LanguageSelector', () => {
  const mockSetDescriptionLanguage = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useGameContext as jest.Mock).mockReturnValue({
      descriptionLanguage: 'English',
      setDescriptionLanguage: mockSetDescriptionLanguage
    });
  });

  it('renders the language options', () => {
    render(<LanguageSelector />);
    
    // Verify language label is shown
    expect(screen.getByText('Language:')).toBeInTheDocument();
    
    // Check all language options are rendered
    LANGUAGE_OPTIONS.forEach(lang => {
      expect(screen.getByText(lang.label)).toBeInTheDocument();
    });
  });

  it('highlights the currently selected language', () => {
    render(<LanguageSelector />);
    
    // English button should be highlighted (default mock value)
    const englishButton = screen.getByText('English');
    const swedishButton = screen.getByText('Svenska');
    
    expect(englishButton).toHaveAttribute('aria-pressed', 'true');
    expect(swedishButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls setDescriptionLanguage when a language button is clicked', () => {
    render(<LanguageSelector />);
    
    // Click the Swedish button
    fireEvent.click(screen.getByText('Svenska'));
    
    // Verify the context function was called with correct language code
    expect(mockSetDescriptionLanguage).toHaveBeenCalledWith('Swedish');
  });

  it('renders in vertical layout when vertical prop is true', () => {
    render(<LanguageSelector vertical={true} />);
    
    // Check the container has vertical flexbox classes
    const container = screen.getByText('Language:').parentElement;
    expect(container).toHaveClass('flex-col');
  });

  it('applies custom className when provided', () => {
    render(<LanguageSelector className="custom-class" />);
    
    // Check the container has the custom class
    const container = screen.getByText('Language:').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('displays Swedish as selected when Swedish is the active language', () => {
    // Update the mock to return Swedish as the current language
    (useGameContext as jest.Mock).mockReturnValue({
      descriptionLanguage: 'Swedish',
      setDescriptionLanguage: mockSetDescriptionLanguage
    });
    
    render(<LanguageSelector />);
    
    // Swedish button should be highlighted
    const englishButton = screen.getByText('English');
    const swedishButton = screen.getByText('Svenska');
    
    expect(englishButton).toHaveAttribute('aria-pressed', 'false');
    expect(swedishButton).toHaveAttribute('aria-pressed', 'true');
  });
}); 