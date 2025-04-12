import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WordInput } from './WordInput';

describe('WordInput Component', () => {
  const mockOnChange = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders input field and submit button', () => {
    render(
      <WordInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        hasError={false}
      />
    );
    
    expect(screen.getByLabelText('Your Guess:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  test('shows "Checking..." text when submitting', () => {
    render(
      <WordInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isSubmitting={true}
        hasError={false}
      />
    );
    
    expect(screen.getByRole('button', { name: 'Checking...' })).toBeInTheDocument();
  });

  test('disables input and button when submitting', () => {
    render(
      <WordInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isSubmitting={true}
        hasError={false}
      />
    );
    
    const input = screen.getByLabelText('Your Guess:');
    const button = screen.getByRole('button', { name: 'Checking...' });
    
    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  test('applies error styling when hasError is true', () => {
    render(
      <WordInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        hasError={true}
      />
    );
    
    const input = screen.getByLabelText('Your Guess:');
    expect(input).toHaveClass('border-red-300');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'error-message');
  });

  test('calls onChange handler when input value changes', () => {
    render(
      <WordInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        hasError={false}
      />
    );
    
    const input = screen.getByLabelText('Your Guess:');
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('test');
  });

  test('calls onSubmit handler when form is submitted', () => {
    render(
      <WordInput
        value="test"
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        hasError={false}
      />
    );
    
    const form = screen.getByTestId('word-input-form');
    fireEvent.submit(form);
    
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  test('has appropriate ARIA attributes for accessibility', () => {
    render(
      <WordInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isSubmitting={true}
        hasError={false}
      />
    );
    
    const button = screen.getByRole('button', { name: 'Checking...' });
    expect(button).toHaveAttribute('aria-busy', 'true');
  });
}); 