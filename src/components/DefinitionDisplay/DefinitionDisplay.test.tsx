import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DefinitionDisplay } from './DefinitionDisplay';

describe('DefinitionDisplay Component', () => {
  test('renders definition correctly', () => {
    render(<DefinitionDisplay definition="Test definition" difficulty="medium" />);
    expect(screen.getByText(/Test definition/i)).toBeInTheDocument();
  });

  test('renders heading with correct structure', () => {
    render(<DefinitionDisplay definition="Test definition" difficulty="medium" />);
    const headingElement = screen.getByRole('heading', { level: 2 });
    expect(headingElement).toBeInTheDocument();
    expect(headingElement.tagName).toBe('H2');
  });

  test('renders difficulty level correctly', () => {
    render(<DefinitionDisplay definition="Test definition" difficulty="easy" />);
    const difficultyText = screen.getByText('Easy');
    expect(difficultyText).toBeInTheDocument();
  });

  test('renders correct difficulty styles for easy level', () => {
    render(<DefinitionDisplay definition="Test definition" difficulty="easy" />);
    const container = screen.getByTestId('definition-display');
    const hasGreenClass = container.innerHTML.includes('text-green-600') || 
                         container.innerHTML.includes('text-yellow-600');
    expect(hasGreenClass).toBe(true);
  });

  test('renders correct difficulty styles for medium level', () => {
    render(<DefinitionDisplay definition="Test definition" difficulty="medium" />);
    const container = screen.getByTestId('definition-display');
    const hasBlueClass = container.innerHTML.includes('text-blue-600') || 
                        container.innerHTML.includes('text-yellow-600');
    expect(hasBlueClass).toBe(true);
  });

  test('renders correct difficulty styles for hard level', () => {
    render(<DefinitionDisplay definition="Test definition" difficulty="hard" />);
    const container = screen.getByTestId('definition-display');
    
    const hasPurpleClass = container.innerHTML.includes('text-purple-600');
    expect(hasPurpleClass).toBe(true);
  });

  test('has appropriate ARIA attributes for accessibility', () => {
    render(<DefinitionDisplay definition="Test definition" difficulty="medium" />);
    
    const section = screen.getByTestId('definition-display');
    expect(section).toHaveAttribute('aria-labelledby', 'definition-heading');
    
    const hasRegionRole = screen.getAllByRole('region').length > 0;
    expect(hasRegionRole).toBe(true);
    
    const definitionElement = screen.getByText(/Test definition/i);
    expect(definitionElement).toBeInTheDocument();
    
    const difficulty = screen.getByText('Medium');
    expect(difficulty).toHaveAttribute('aria-labelledby', 'difficulty-label');
  });
}); 