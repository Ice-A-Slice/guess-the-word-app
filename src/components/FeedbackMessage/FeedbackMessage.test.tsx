import React from 'react';
import { render, screen } from '@testing-library/react';
import { FeedbackMessage, MessageType } from './FeedbackMessage';

describe('FeedbackMessage', () => {
  const testMessage = 'Test message';
  
  const renderComponent = (type: MessageType = 'info') => {
    return render(<FeedbackMessage message={testMessage} type={type} />);
  };

  test('renders the message text', () => {
    renderComponent();
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });

  test('renders success message with correct styles and accessibility', () => {
    renderComponent('success');
    const messageElement = screen.getByRole('status');
    
    expect(messageElement).toHaveClass('bg-green-100');
    expect(messageElement).toHaveClass('border-green-400');
    expect(messageElement).toHaveClass('text-green-700');
    expect(messageElement).toHaveAttribute('aria-live', 'polite');
  });

  test('renders error message with correct styles and accessibility', () => {
    renderComponent('error');
    const messageElement = screen.getByRole('alert');
    
    expect(messageElement).toHaveClass('bg-red-100');
    expect(messageElement).toHaveClass('border-red-400');
    expect(messageElement).toHaveClass('text-red-700');
    expect(messageElement).toHaveAttribute('aria-live', 'assertive');
  });

  test('renders info message with correct styles and accessibility', () => {
    renderComponent('info');
    const messageElement = screen.getByRole('status');
    
    expect(messageElement).toHaveClass('bg-blue-100');
    expect(messageElement).toHaveClass('border-blue-400');
    expect(messageElement).toHaveClass('text-blue-700');
    expect(messageElement).toHaveAttribute('aria-live', 'polite');
  });

  test('displays the appropriate icon for each message type', () => {
    // Success icon
    const { unmount } = renderComponent('success');
    const successIcon = screen.getByText('✓');
    expect(successIcon).toBeInTheDocument();
    expect(successIcon).toHaveAttribute('aria-hidden', 'true');
    unmount();
    
    // Error icon
    renderComponent('error');
    const errorIcon = screen.getByText('✗');
    expect(errorIcon).toBeInTheDocument();
    expect(errorIcon).toHaveAttribute('aria-hidden', 'true');
    unmount();
    
    // Info icon
    renderComponent('info');
    const infoIcon = screen.getByText('ℹ');
    expect(infoIcon).toBeInTheDocument();
    expect(infoIcon).toHaveAttribute('aria-hidden', 'true');
  });
}); 