import React, { useState, useRef, useEffect } from 'react';
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
  const [isAnimating, setIsAnimating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clear feedback when target word changes
  useEffect(() => {
    setFeedback(null);
    setGuess('');
    setIsAnimating(false);
    
    // Focus the input field after a word change
    if (inputRef.current && !disableInput) {
      inputRef.current.focus();
    }
  }, [targetWord, disableInput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!guess.trim()) return;
    
    const result = wordService.validateGuess(guess, targetWord);
    setFeedback(result);
    
    if (result.isCorrect) {
      setIsAnimating(true);
      
      // Pass score update with a slight delay to allow animation
      setTimeout(() => {
        onCorrectGuess(hintsUsed);
      }, 300);
      
      setGuess('');
    } else {
      // Shake the input for wrong answers
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
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
            className={`w-full p-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
              ${feedback && !feedback.isCorrect && isAnimating ? 'animate-shake border-red-500' : ''}
              ${feedback && feedback.isCorrect ? 'border-green-500' : ''}
              ${disableInput ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            `}
            data-testid="guess-input"
          />
        </div>
        <button
          type="submit"
          disabled={!guess.trim() || disableInput}
          className={`px-6 py-2 text-lg font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all
            ${!guess.trim() || disableInput ? 'bg-gray-400 opacity-50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 transform hover:-translate-y-1 hover:shadow-md'}
          `}
          data-testid="submit-guess"
        >
          Submit Guess
        </button>
      </form>
      
      {feedback && (
        <div
          className={`mt-4 p-4 rounded-lg text-center 
            ${feedback.isCorrect
              ? 'bg-green-100 border border-green-300 text-green-800 animate-scale-in'
              : 'bg-red-100 border border-red-300 text-red-800 animate-fade-in'
            }
          `}
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
              <>
                {feedback.isCorrect ? (
                  <span className="flex items-center justify-center">
                    <span className="inline-block mr-2 text-xl animate-bounce-gentle">🎉</span>
                    {feedback.message}
                    <span className="inline-block ml-2 text-xl animate-bounce-gentle">🎉</span>
                  </span>
                ) : (
                  feedback.message
                )}
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default GuessForm; 