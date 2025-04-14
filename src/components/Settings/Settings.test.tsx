import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Settings } from './Settings';
import { GameProvider } from '@/contexts/GameContext';

// Mock för useGameWithWordSelection hook
jest.mock('@/hooks', () => ({
  useGameWithWordSelection: () => ({
    difficulty: 'medium',
    maxSkipsPerGame: 5,
    setDifficulty: jest.fn(),
    setMaxSkips: jest.fn(),
  }),
}));

describe('Settings Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders settings dialog correctly', () => {
    render(
      <GameProvider>
        <Settings onClose={mockOnClose} />
      </GameProvider>
    );
    
    // Kontrollera titel
    expect(screen.getByText('Game Settings')).toBeInTheDocument();
    
    // Kontrollera att svårighetsinställningar finns
    expect(screen.getByLabelText('Select Difficulty:')).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
    expect(screen.getByText('All Levels')).toBeInTheDocument();
    
    // Kontrollera att skippinställningar finns
    expect(screen.getByLabelText('Maximum Skips:')).toBeInTheDocument();
    expect(screen.getByText('3 skips (Hard)')).toBeInTheDocument();
    expect(screen.getByText('5 skips (Normal)')).toBeInTheDocument();
    expect(screen.getByText('10 skips (Easy)')).toBeInTheDocument();
    expect(screen.getByText('Unlimited')).toBeInTheDocument();
    
    // Kontrollera att spara-knappen finns
    expect(screen.getByText('Save Settings')).toBeInTheDocument();
  });

  test('closes when close button is clicked', () => {
    render(
      <GameProvider>
        <Settings onClose={mockOnClose} />
      </GameProvider>
    );
    
    const closeButton = screen.getByLabelText('Close settings');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('saves settings and closes when save button is clicked', () => {
    const { getByLabelText } = render(
      <GameProvider>
        <Settings onClose={mockOnClose} />
      </GameProvider>
    );
    
    // Klicka på spara-knappen
    const saveButton = screen.getByText('Save Settings');
    fireEvent.click(saveButton);
    
    // Kontrollera att onClose anropas
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('changes difficulty setting', () => {
    render(
      <GameProvider>
        <Settings onClose={mockOnClose} />
      </GameProvider>
    );
    
    // Ändra svårighetsnivå
    const difficultySelect = screen.getByLabelText('Select Difficulty:');
    fireEvent.change(difficultySelect, { target: { value: 'hard' } });
    
    // Kontrollera att värdet uppdateras i select-elementet
    expect(difficultySelect).toHaveValue('hard');
  });

  test('changes maximum skips setting', () => {
    render(
      <GameProvider>
        <Settings onClose={mockOnClose} />
      </GameProvider>
    );
    
    // Ändra maximal skippinställning
    const maxSkipsSelect = screen.getByLabelText('Maximum Skips:');
    fireEvent.change(maxSkipsSelect, { target: { value: '10' } });
    
    // Kontrollera att värdet uppdateras i select-elementet
    expect(maxSkipsSelect).toHaveValue('10');
  });
}); 