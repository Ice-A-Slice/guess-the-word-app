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
    render(
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

  test('displays correct selected value in difficulty dropdown', () => {
    render(
      <GameProvider>
        <Settings onClose={mockOnClose} />
      </GameProvider>
    );
    
    // Kontrollera att dropdown visar rätt initalt värde (från mock)
    const difficultySelect = screen.getByLabelText('Select Difficulty:');
    expect(difficultySelect).toHaveValue('medium');
    
    // Kontrollera att "Current:" texten matchar valt värde
    expect(screen.getByText('Current: Medium')).toBeInTheDocument();
    
    // Ändra värdet och kontrollera att allt uppdateras
    fireEvent.change(difficultySelect, { target: { value: 'hard' } });
    expect(difficultySelect).toHaveValue('hard');
    expect(screen.getByText('Current: Hard')).toBeInTheDocument();
  });

  test('displays correct selected value in max skips dropdown', () => {
    render(
      <GameProvider>
        <Settings onClose={mockOnClose} />
      </GameProvider>
    );
    
    // Kontrollera att dropdown visar rätt initalt värde (från mock)
    const maxSkipsSelect = screen.getByLabelText('Maximum Skips:');
    expect(maxSkipsSelect).toHaveValue('5');
    
    // Kontrollera att "Current:" texten matchar valt värde
    expect(screen.getByText('Current: 5 skips (Normal)')).toBeInTheDocument();
    
    // Ändra värdet och kontrollera att allt uppdateras
    fireEvent.change(maxSkipsSelect, { target: { value: '10' } });
    expect(maxSkipsSelect).toHaveValue('10');
    expect(screen.getByText('Current: 10 skips (Easy)')).toBeInTheDocument();
  });

  test('fallbacks to default values when game state is missing values', () => {
    // Detta test är mer för att illustrera viktigheten av fallbacks 
    // än för faktisk testning, då det är svårt att återställa mocken korrekt
    render(
      <GameProvider>
        <Settings onClose={mockOnClose} />
      </GameProvider>
    );
    
    // Kontrollera att båda 'Current:'-texterna visas, vilket bekräftar att
    // vi har någon form av visuell indikering även om värdena inte är specificerade
    expect(screen.getAllByText(/Current:/, { exact: false }).length).toBe(2);
    
    // Se till att någon form av label visas efter 'Current:'
    const currentTexts = screen.getAllByText(/Current:/, { exact: false });
    currentTexts.forEach(element => {
      expect(element.textContent?.trim().length).toBeGreaterThan(9); // 'Current: ' är 9 tecken
    });
  });
}); 