import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from './Header';
import { GameProvider } from '@/contexts/GameContext';

// Mock för Settings-komponenten
jest.mock('@/components/Settings', () => ({
  Settings: ({ onClose }) => (
    <div data-testid="settings-modal">
      <button onClick={onClose}>Close Settings</button>
    </div>
  ),
}));

describe('Header Component', () => {
  test('renders title correctly', () => {
    render(
      <GameProvider>
        <Header title="Test Title" />
      </GameProvider>
    );
    const titleElement = screen.getByText('Test Title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.tagName).toBe('H1');
  });

  test('displays score when provided', () => {
    render(
      <GameProvider>
        <Header title="Test Title" score={42} />
      </GameProvider>
    );
    const scoreElement = screen.getByText('Score:', { exact: false });
    expect(scoreElement).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  test('does not display score when not provided', () => {
    render(
      <GameProvider>
        <Header title="Test Title" />
      </GameProvider>
    );
    expect(screen.queryByText('Score:', { exact: false })).not.toBeInTheDocument();
  });

  test('has appropriate ARIA attributes for accessibility', () => {
    render(
      <GameProvider>
        <Header title="Test Title" score={10} />
      </GameProvider>
    );
    
    // Check header has appropriate role
    const header = screen.getByRole('banner');
    expect(header).toHaveAttribute('aria-label', 'Game header');
    
    // Check score has appropriate ARIA attributes
    const scoreContainer = screen.getByLabelText('Current score');
    expect(scoreContainer).toHaveAttribute('aria-live', 'polite');
    expect(scoreContainer).toHaveAttribute('aria-atomic', 'true');
  });

  test('renders settings button', () => {
    render(
      <GameProvider>
        <Header title="Test Title" />
      </GameProvider>
    );
    const settingsButton = screen.getByLabelText('Game settings');
    expect(settingsButton).toBeInTheDocument();
  });

  test('opens settings modal when settings button is clicked', () => {
    render(
      <GameProvider>
        <Header title="Test Title" />
      </GameProvider>
    );
    
    // Först bör inställningsmodalen inte visas
    expect(screen.queryByTestId('settings-modal')).not.toBeInTheDocument();
    
    // Klicka på inställningsknappen
    const settingsButton = screen.getByLabelText('Game settings');
    fireEvent.click(settingsButton);
    
    // Nu bör inställningsmodalen visas
    expect(screen.getByTestId('settings-modal')).toBeInTheDocument();
  });
  
  test('closes settings modal when close button is clicked', () => {
    render(
      <GameProvider>
        <Header title="Test Title" />
      </GameProvider>
    );
    
    // Öppna inställningsmodalen
    const settingsButton = screen.getByLabelText('Game settings');
    fireEvent.click(settingsButton);
    
    // Kontrollera att modalen visas
    expect(screen.getByTestId('settings-modal')).toBeInTheDocument();
    
    // Klicka på stäng-knappen
    const closeButton = screen.getByText('Close Settings');
    fireEvent.click(closeButton);
    
    // Modalen bör nu vara stängd
    expect(screen.queryByTestId('settings-modal')).not.toBeInTheDocument();
  });
}); 