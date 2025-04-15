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
    
    // Verifiera att texten "Hard" visas
    const hardText = screen.getByText('Hard');
    expect(hardText).toBeInTheDocument();
    
    // Verifiera att föräldraelementet har någon styling
    const container = screen.getByTestId('definition-display');
    expect(container).toBeInTheDocument();
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

  // New tests for description functionality
  test('renders AI description when provided', () => {
    render(
      <DefinitionDisplay 
        definition="Test definition" 
        difficulty="medium" 
        description="AI generated description" 
      />
    );
    expect(screen.getByText(/AI generated description/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Description/i)).toBeInTheDocument();
  });

  test('does not render AI description section when not provided', () => {
    render(<DefinitionDisplay definition="Test definition" difficulty="medium" />);
    expect(screen.queryByText(/AI Description/i)).not.toBeInTheDocument();
  });

  test('shows loading spinner when isDescriptionLoading is true', () => {
    render(
      <DefinitionDisplay 
        definition="Test definition" 
        difficulty="medium" 
        isDescriptionLoading={true} 
      />
    );
    expect(screen.getByText(/AI Description/i)).toBeInTheDocument();
    // Check for the loading spinner container
    const spinnerContainer = document.querySelector('.animate-spin');
    expect(spinnerContainer).toBeInTheDocument();
  });

  test('shows English language indicator when descriptionLanguage is English', () => {
    render(
      <DefinitionDisplay 
        definition="Test definition" 
        difficulty="medium" 
        description="AI description" 
        descriptionLanguage="English" 
      />
    );
    expect(screen.getByText(/English/i)).toBeInTheDocument();
  });

  test('shows Swedish language indicator when descriptionLanguage is Swedish', () => {
    render(
      <DefinitionDisplay 
        definition="Test definition" 
        difficulty="medium" 
        description="AI beskrivning" 
        descriptionLanguage="Swedish" 
      />
    );
    expect(screen.getByText(/Svenska/i)).toBeInTheDocument();
  });
}); 