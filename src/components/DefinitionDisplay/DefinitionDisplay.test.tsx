import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DefinitionDisplay } from './DefinitionDisplay';

describe('DefinitionDisplay Component', () => {
  test('renders definition correctly', () => {
    render(<DefinitionDisplay definition="Test definition" difficulty="medium" />);
    expect(screen.getByText("Test definition", { exact: false })).toBeInTheDocument();
  });

  test('renders heading with correct structure', () => {
    render(<DefinitionDisplay definition="Test definition" difficulty="medium" />);
    const headingElement = screen.getByText('Definition');
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
    const difficultyContainer = screen.getByText('Difficulty:').closest('div');
    expect(difficultyContainer).toHaveClass('text-green-600');
  });

  test('renders correct difficulty styles for medium level', () => {
    render(<DefinitionDisplay definition="Test definition" difficulty="medium" />);
    const difficultyContainer = screen.getByText('Difficulty:').closest('div');
    expect(difficultyContainer).toHaveClass('text-blue-600');
  });

  test('renders correct difficulty styles for hard level', () => {
    render(<DefinitionDisplay definition="Test definition" difficulty="hard" />);
    const difficultyContainer = screen.getByText('Difficulty:').closest('div');
    expect(difficultyContainer).toHaveClass('text-purple-600');
  });

  test('has appropriate ARIA attributes for accessibility', () => {
    render(<DefinitionDisplay definition="Test definition" difficulty="medium" />);
    
    // Check section has proper labelledby
    const section = screen.getByTestId('definition-display');
    expect(section).toHaveAttribute('aria-labelledby', 'definition-heading');
    
    // Check definition container has proper role
    const definitionContainer = screen.getByText("Test definition", { exact: false }).closest('div');
    expect(definitionContainer).toHaveAttribute('role', 'region');
    
    // Check difficulty has proper labeling
    const difficulty = screen.getByText('Medium');
    expect(difficulty).toHaveAttribute('aria-labelledby', 'difficulty-label');
  });
}); 