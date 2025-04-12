import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from './page';
import { wordService } from '@/services';

// Mock the wordService to control its behavior in tests
jest.mock('@/services', () => ({
  wordService: {
    getRandomWordByDifficulty: jest.fn(),
    checkGuess: jest.fn(),
  },
}));

describe('Home Component', () => {
  const mockWord = {
    id: 'test-1',
    word: 'example',
    definition: 'A representative form or pattern',
    difficulty: 'medium',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Set up mock implementation for getRandomWordByDifficulty
    (wordService.getRandomWordByDifficulty as jest.Mock).mockReturnValue(mockWord);
  });

  test('renders loading state initially before word loads', () => {
    // Override mock to return null first time (simulating loading)
    (wordService.getRandomWordByDifficulty as jest.Mock).mockReturnValueOnce(null);
    
    render(<Home />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders the word definition when word is loaded', () => {
    render(<Home />);
    expect(screen.getByText('Definition:')).toBeInTheDocument();
    expect(screen.getByText(mockWord.definition)).toBeInTheDocument();
  });

  test('displays correct difficulty label', () => {
    render(<Home />);
    // Look specifically for the difficulty indicator, not the button
    const difficultyLabel = screen.getByText('Medium', { selector: 'span.ml-1.font-medium' });
    expect(difficultyLabel).toBeInTheDocument();
  });

  test('allows changing difficulty level', async () => {
    render(<Home />);
    const easyButton = screen.getByRole('button', { name: 'Easy' });
    
    // Change difficulty to Easy
    fireEvent.click(easyButton);
    
    // Should call getRandomWordByDifficulty with 'easy'
    expect(wordService.getRandomWordByDifficulty).toHaveBeenCalledWith('easy');
  });

  test('shows error when submitting empty guess', async () => {
    render(<Home />);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    
    // Submit empty form
    fireEvent.click(submitButton);
    
    // Wait for the error message
    expect(await screen.findByText('Please enter a word')).toBeInTheDocument();
  });

  test('shows success message for correct guess', async () => {
    // Set up mock for checkGuess to return true (correct guess)
    (wordService.checkGuess as jest.Mock).mockReturnValue(true);
    
    render(<Home />);
    
    // Type a guess
    const guessInput = screen.getByLabelText('Your Guess:');
    fireEvent.change(guessInput, { target: { value: 'example' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);
    
    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText('Correct! Great job!')).toBeInTheDocument();
    });
    
    // Should increment score
    expect(wordService.checkGuess).toHaveBeenCalledWith('example', mockWord);
  });

  test('shows error message for incorrect guess', async () => {
    // Set up mock for checkGuess to return false (incorrect guess)
    (wordService.checkGuess as jest.Mock).mockReturnValue(false);
    
    render(<Home />);
    
    // Type a guess
    const guessInput = screen.getByLabelText('Your Guess:');
    fireEvent.change(guessInput, { target: { value: 'wrong' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Sorry, that\'s not correct. Try again!')).toBeInTheDocument();
    });
  });

  test('handles skipping a word', async () => {
    render(<Home />);
    
    // Click skip button
    const skipButton = screen.getByRole('button', { name: 'Skip' });
    fireEvent.click(skipButton);
    
    // Check for correct message
    await waitFor(() => {
      expect(screen.getByText(/The correct word was "example"/)).toBeInTheDocument();
    });
    
    // Should load a new word after delay
    expect(wordService.getRandomWordByDifficulty).toHaveBeenCalledTimes(1);
  });
}); 