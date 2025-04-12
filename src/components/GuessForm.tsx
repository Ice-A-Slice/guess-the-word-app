import React, { useState, useRef } from 'react';
import { wordService } from '@/services';
import { Word } from '@/types';
import { GuessResult } from '@/services/wordService';

interface GuessFormProps {
  targetWord: Word;
  onCorrectGuess: (hintsUsed: number) => void;
  hintsUsed: number;
  disableInput?: boolean;
}

const GuessForm: React.FC<GuessFormProps> = ({ targetWord, onCorrectGuess, hintsUsed, disableInput = false }) => {
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState<GuessResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = wordService.validateGuess(guess, targetWord);
    setFeedback(result);
    
    if (result.isCorrect) {
      onCorrectGuess(hintsUsed);
      setGuess('');
      
      // Focus after short delay to allow animations to complete
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
        <div className="w-full max-w-md">
          <input
            ref={inputRef}
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter your guess"
            disabled={disableInput}
            className="w-full p-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            data-testid="guess-input"
          />
        </div>
        <button
          type="submit"
          disabled={!guess.trim() || disableInput}
          className={`px-6 py-2 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors ${
            !guess.trim() || disableInput ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          data-testid="submit-guess"
        >
          Submit Guess
        </button>
      </form>
      
      {feedback && (
        <div
          className={`mt-4 p-4 rounded-lg text-center ${
            feedback.isCorrect
              ? 'bg-green-100 border-green-300 text-green-800'
              : 'bg-red-100 border-red-300 text-red-800'
          }`}
          data-testid="guess-feedback"
        >
          <p className="text-lg font-semibold">
            {feedback.isCorrect && feedback.message.includes('Almost') ? (
              <>
                <span className="text-green-500">Almost! </span>
                <span>The correct word is </span>
                <span className="font-bold">{targetWord.word}</span>
              </>
            ) : (
              feedback.message
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default GuessForm; 