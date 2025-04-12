import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import GuessForm from './GuessForm';
import { wordService } from '@/services';

// Mock the wordService
jest.mock('@/services', () => ({
  wordService: {
    validateGuess: jest.fn()
  }
}));

describe('GuessForm', () => {
  const targetWord = {
    id: 'test-1',
    word: 'example',
    definition: 'A representative form or pattern',
    difficulty: 'medium'
  };
  
  const onCorrectGuessMock = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the validateGuess mock to return a default value
    (wordService.validateGuess as jest.Mock).mockReturnValue({
      isCorrect: false,
      message: 'Not correct',
      hintLevel: 'none'
    });
  });
  
  test('renders correctly with all required elements', () => {
    render(
      <GuessForm
        targetWord={targetWord}
        onCorrectGuess={onCorrectGuessMock}
        hintsUsed={0}
      />
    );
    
    expect(screen.getByTestId('guess-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-guess')).toBeInTheDocument();
    expect(screen.getByTestId('submit-guess')).toBeDisabled(); // Initially disabled with empty input
  });
  
  test('input field accepts and displays user input', () => {
    render(
      <GuessForm
        targetWord={targetWord}
        onCorrectGuess={onCorrectGuessMock}
        hintsUsed={0}
      />
    );
    
    const input = screen.getByTestId('guess-input');
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(input).toHaveValue('test');
    expect(screen.getByTestId('submit-guess')).not.toBeDisabled(); // Enabled after input
  });
  
  test('calls wordService.validateGuess when form is submitted', () => {
    render(
      <GuessForm
        targetWord={targetWord}
        onCorrectGuess={onCorrectGuessMock}
        hintsUsed={0}
      />
    );
    
    const input = screen.getByTestId('guess-input');
    fireEvent.change(input, { target: { value: 'myguess' } });
    
    const button = screen.getByTestId('submit-guess');
    fireEvent.click(button);
    
    expect(wordService.validateGuess).toHaveBeenCalledWith('myguess', targetWord);
  });
  
  test('displays feedback message when validation is complete', () => {
    (wordService.validateGuess as jest.Mock).mockReturnValue({
      isCorrect: false,
      message: 'Not quite right',
      hintLevel: 'mild'
    });
    
    render(
      <GuessForm
        targetWord={targetWord}
        onCorrectGuess={onCorrectGuessMock}
        hintsUsed={0}
      />
    );
    
    const input = screen.getByTestId('guess-input');
    fireEvent.change(input, { target: { value: 'wrong' } });
    
    const button = screen.getByTestId('submit-guess');
    fireEvent.click(button);
    
    expect(screen.getByTestId('guess-feedback')).toBeInTheDocument();
    expect(screen.getByTestId('guess-feedback')).toHaveTextContent('Not quite right');
  });
  
  test('calls onCorrectGuess when answer is correct', () => {
    (wordService.validateGuess as jest.Mock).mockReturnValue({
      isCorrect: true,
      message: 'Correct!',
      hintLevel: 'none'
    });
    
    render(
      <GuessForm
        targetWord={targetWord}
        onCorrectGuess={onCorrectGuessMock}
        hintsUsed={2}
      />
    );
    
    const input = screen.getByTestId('guess-input');
    fireEvent.change(input, { target: { value: 'example' } });
    
    const button = screen.getByTestId('submit-guess');
    fireEvent.click(button);
    
    expect(onCorrectGuessMock).toHaveBeenCalledWith(2);
    expect(input).toHaveValue(''); // Input cleared after correct guess
  });
  
  test('shows special UI for fuzzy matches', () => {
    (wordService.validateGuess as jest.Mock).mockReturnValue({
      isCorrect: true,
      message: 'Almost! The correct spelling is "example", but we\'ll count that as correct!',
      hintLevel: 'none'
    });
    
    render(
      <GuessForm
        targetWord={targetWord}
        onCorrectGuess={onCorrectGuessMock}
        hintsUsed={1}
      />
    );
    
    const input = screen.getByTestId('guess-input');
    fireEvent.change(input, { target: { value: 'exampl' } });
    
    const button = screen.getByTestId('submit-guess');
    fireEvent.click(button);
    
    const feedback = screen.getByTestId('guess-feedback');
    expect(feedback).toBeInTheDocument();
    expect(feedback).toHaveTextContent('Almost!');
    expect(feedback).toHaveTextContent('example');
  });
  
  test('handles long inputs correctly', () => {
    render(
      <GuessForm
        targetWord={targetWord}
        onCorrectGuess={onCorrectGuessMock}
        hintsUsed={0}
      />
    );
    
    const input = screen.getByTestId('guess-input');
    const longInput = 'a'.repeat(100);
    fireEvent.change(input, { target: { value: longInput } });
    
    const button = screen.getByTestId('submit-guess');
    fireEvent.click(button);
    
    expect(wordService.validateGuess).toHaveBeenCalledWith(longInput, targetWord);
  });
  
  // Cross-device test simulations
  describe('responsive behavior', () => {
    test('has full-width input on small screens', () => {
      // Mock a mobile viewport
      global.innerWidth = 400;
      
      render(
        <GuessForm
          targetWord={targetWord}
          onCorrectGuess={onCorrectGuessMock}
          hintsUsed={0}
        />
      );
      
      const input = screen.getByTestId('guess-input');
      expect(input).toHaveClass('w-full');
    });
    
    test('maintains functionality for disabled state', () => {
      render(
        <GuessForm
          targetWord={targetWord}
          onCorrectGuess={onCorrectGuessMock}
          hintsUsed={0}
          disableInput={true}
        />
      );
      
      expect(screen.getByTestId('guess-input')).toBeDisabled();
      expect(screen.getByTestId('submit-guess')).toBeDisabled();
      
      // Should still be disabled even after trying to add input
      const input = screen.getByTestId('guess-input');
      fireEvent.change(input, { target: { value: 'test' } });
      
      expect(screen.getByTestId('submit-guess')).toBeDisabled();
    });
    
    // Simulating pasted input
    test('handles pasted input correctly', () => {
      render(
        <GuessForm
          targetWord={targetWord}
          onCorrectGuess={onCorrectGuessMock}
          hintsUsed={0}
        />
      );
      
      const input = screen.getByTestId('guess-input');
      
      // Simulate paste event
      fireEvent.paste(input, {
        clipboardData: {
          getData: () => 'pasted text'
        }
      });
      
      // Need to also trigger a change event
      fireEvent.change(input, { target: { value: 'pasted text' } });
      
      expect(input).toHaveValue('pasted text');
      expect(screen.getByTestId('submit-guess')).not.toBeDisabled();
    });
  });
}); 