import { render, screen } from '@testing-library/react';
import Home from './page';
import { wordService } from '@/services';

// Mock the wordService to control its behavior in tests
jest.mock('@/services', () => ({
  wordService: {
    getRandomWordByDifficulty: jest.fn(),
    checkGuess: jest.fn(),
  },
}));

// Mock the WordSelectionDemo component to avoid its complexity
jest.mock('@/components/WordGame/WordSelectionDemo', () => ({
  WordSelectionDemo: () => <div data-testid="word-selection-demo">Word Selection Demo</div>
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

  test('renders loading state initially when no word is available', () => {
    // Override mock to return null (simulating loading)
    (wordService.getRandomWordByDifficulty as jest.Mock).mockReturnValueOnce(null);
    
    render(<Home />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders the main content when word is loaded', () => {
    render(<Home />);
    
    // Check that the header and demo component are rendered
    expect(screen.getByText('Guess the Word')).toBeInTheDocument();
    expect(screen.getByTestId('word-selection-demo')).toBeInTheDocument();
  });

  test('calls getRandomWordByDifficulty on initial render', () => {
    render(<Home />);
    
    // Should call getRandomWordByDifficulty with 'all' (default)
    expect(wordService.getRandomWordByDifficulty).toHaveBeenCalledWith('all');
  });
});