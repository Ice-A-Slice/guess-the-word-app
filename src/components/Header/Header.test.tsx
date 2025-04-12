import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from './Header';

describe('Header Component', () => {
  test('renders title correctly', () => {
    render(<Header title="Test Title" />);
    const titleElement = screen.getByText('Test Title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.tagName).toBe('H1');
  });

  test('displays score when provided', () => {
    render(<Header title="Test Title" score={42} />);
    const scoreElement = screen.getByText('Score:', { exact: false });
    expect(scoreElement).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  test('does not display score when not provided', () => {
    render(<Header title="Test Title" />);
    expect(screen.queryByText('Score:', { exact: false })).not.toBeInTheDocument();
  });

  test('has appropriate ARIA attributes for accessibility', () => {
    render(<Header title="Test Title" score={10} />);
    
    // Check header has appropriate role
    const header = screen.getByRole('banner');
    expect(header).toHaveAttribute('aria-label', 'Game header');
    
    // Check score has appropriate ARIA attributes
    const scoreContainer = screen.getByLabelText('Current score');
    expect(scoreContainer).toHaveAttribute('aria-live', 'polite');
    expect(scoreContainer).toHaveAttribute('aria-atomic', 'true');
  });
}); 