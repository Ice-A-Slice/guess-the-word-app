import { render, screen } from '@testing-library/react';
import Home from './page';
import { GameProvider } from '@/contexts';

// Mock the useGame hook to control its behavior in tests
jest.mock('@/hooks', () => ({
  useGame: jest.fn(() => ({
    score: 0,
    status: 'active'
  }))
}));

// Mock the GameContainer component
jest.mock('@/components/GameContainer', () => 
  jest.fn(() => <div data-testid="game-container">Game Container</div>)
);

describe('Home Component', () => {
  test('renders the home page with GameContainer', () => {
    render(
      <GameProvider>
        <Home />
      </GameProvider>
    );
    
    // Check that the header and game container are rendered
    expect(screen.getByText('Guess the Word')).toBeInTheDocument();
    expect(screen.getByTestId('game-container')).toBeInTheDocument();
  });
});