import React, { ChangeEvent, KeyboardEvent } from 'react';

interface WordInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  hasError: boolean;
  errorMessage?: string;
  disabled?: boolean;
}

export const WordInput: React.FC<WordInputProps> = ({
  value,
  onChange,
  onSubmit,
  isSubmitting,
  hasError,
  errorMessage = 'Please check your answer and try again',
  disabled = false
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!isSubmitting && !disabled) {
        onSubmit();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const inputId = "word-guess-input";
  const errorId = "error-message";

  return (
    <form 
      className="space-y-4" 
      onSubmit={handleSubmit} 
      noValidate
      data-testid="word-input-form"
      aria-live="polite"
    >
      <div>
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Your Guess:
        </label>
        <input
          type="text"
          id={inputId}
          name="guess"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your answer..."
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            hasError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          }`}
          aria-describedby={hasError ? errorId : undefined}
          aria-invalid={hasError}
          disabled={isSubmitting || disabled}
          required
          autoComplete="off"
        />
        
        {hasError && (
          <p 
            id={errorId} 
            className="mt-1 text-sm text-red-600" 
            role="alert"
          >
            {errorMessage}
          </p>
        )}
      </div>
      
      <div className="flex space-x-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={isSubmitting || disabled}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Checking...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}; 