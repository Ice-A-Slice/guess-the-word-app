import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DefinitionDisplay } from './DefinitionDisplay';

describe('DefinitionDisplay Component', () => {
  test('renders definition correctly', () => {
    render(<DefinitionDisplay definition="Test definition" difficulty="medium" />);
    const definitionElement = screen.getByText('Test definition');
    expect(definitionElement).toBeInTheDocument();
  });

  test('renders heading with correct structure', () => {
    render(<DefinitionDisplay definition="Test definition" difficulty="medium" />);
    const headingElement = screen.getByText('Definition:');
    expect(headingElement).toBeInTheDocument();
    expect(headingElement.tagName).toBe('H2');
  });

  test('renders difficulty level correctly', () => {
    render(<DefinitionDisplay definition="Test definition" difficulty="easy" />);
    const difficultyText = screen.getByText('Easy');
    expect(difficultyText).toBeInTheDocument();
  });

  test('renders correct difficulty color for easy level', () => {
    render(<DefinitionDisplay definition="Test definition" difficulty="easy" />);
    const difficultyText = screen.getByText('Easy');
    expect(difficultyText).toHaveClass('text-green-600');
  });

  test('renders correct difficulty color for medium level', () => {
    render(<DefinitionDisplay definition="Test definition" difficulty="medium" />);
    const difficultyText = screen.getByText('Medium');
    expect(difficultyText).toHaveClass('text-yellow-600');
  });

  test('renders correct difficulty color for hard level', () => {
    render(<DefinitionDisplay definition="Test definition" difficulty="hard" />);
    const difficultyText = screen.getByText('Hard');
    expect(difficultyText).toHaveClass('text-red-600');
  });

  test('has appropriate ARIA attributes for accessibility', () => {
    render(<DefinitionDisplay definition="Test definition" difficulty="medium" />);
    
    // Check section has proper labelledby
    const section = screen.getByTestId('definition-display');
    expect(section).toHaveAttribute('aria-labelledby', 'definition-heading');
    
    // Check definition container has proper role
    const definitionContainer = screen.getByText('Test definition').closest('div');
    expect(definitionContainer).toHaveAttribute('role', 'region');
    
    // Check difficulty has proper labeling
    const difficulty = screen.getByText('Medium');
    expect(difficulty).toHaveAttribute('aria-labelledby', 'difficulty-label');
  });
}); 