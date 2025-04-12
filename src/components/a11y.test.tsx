import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { DefinitionDisplay, WordInput, FeedbackMessage } from './index';

// Add jest-axe matchers
expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  describe('DefinitionDisplay', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(
        <DefinitionDisplay 
          definition="The round fruit of an apple tree, which typically has thin red, green, or yellow skin and crisp flesh."
          difficulty="medium"
        />
      );
      
      // Check that the component is semantic and labeled properly
      expect(screen.getAllByRole('region').length).toBeGreaterThan(0);
      expect(screen.getByRole('heading', { name: /definition/i })).toBeInTheDocument();
      
      // Run axe accessibility tests
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('WordInput', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(
        <WordInput 
          value=""
          onChange={() => {}}
          onSubmit={() => {}}
          isSubmitting={false}
          hasError={false}
        />
      );
      
      // Check for proper labeling and form controls
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
      
      // Run axe accessibility tests
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should show error message properly when there is an error', async () => {
      const { container } = render(
        <WordInput 
          value="test"
          onChange={() => {}}
          onSubmit={() => {}}
          isSubmitting={false}
          hasError={true}
          errorMessage="This is a test error message"
        />
      );
      
      // Check for error message and proper ARIA attributes
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('This is a test error message')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
      
      // Run axe accessibility tests
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('FeedbackMessage', () => {
    it('should not have any accessibility violations for success message', async () => {
      const { container } = render(
        <FeedbackMessage 
          message="Correct answer!"
          type="success"
        />
      );
      
      // Check for correct role attribute
      expect(screen.getByRole('status')).toBeInTheDocument();
      
      // Run axe accessibility tests
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have any accessibility violations for error message', async () => {
      const { container } = render(
        <FeedbackMessage 
          message="Incorrect answer!"
          type="error"
        />
      );
      
      // Check for correct role attribute
      expect(screen.getByRole('alert')).toBeInTheDocument();
      
      // Run axe accessibility tests
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
}); 