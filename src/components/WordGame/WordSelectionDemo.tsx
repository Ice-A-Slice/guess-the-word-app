import React, { useState, useEffect, useRef } from 'react';
import { useWordSelection } from '@/hooks';
import { DefinitionDisplay, WordInput, FeedbackMessage } from '@/components';
import type { MessageType } from '@/components';

/**
 * Demo component showing how useWordSelection works with UI components
 */
export const WordSelectionDemo: React.FC = () => {
  const [guess, setGuess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: MessageType } | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'all'>('all');
  
  // Initialize our word selection hook
  const { 
    currentWord, 
    getNextWord, 
    isLoading, 
    error 
  } = useWordSelection({
    difficulty,
    maxHistorySize: 10,
    preventRepetition: true
  });

  // Handle difficulty change
  const handleDifficultyChange = (newDifficulty: 'easy' | 'medium' | 'hard' | 'all') => {
    setDifficulty(newDifficulty);
  };

  const handleGuessChange = (value: string) => {
    setGuess(value);
    
    // Clear feedback when user starts typing again
    if (feedback) {
      setFeedback(null);
    }
  };

  // Store timeouts in refs so we can clean them up
  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const newWordTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
      if (newWordTimeoutRef.current) {
        clearTimeout(newWordTimeoutRef.current);
      }
    };
  }, []);

  const handleGuessSubmit = () => {
    if (!currentWord || !guess.trim()) return;
    
    setIsSubmitting(true);
    
    // Clear any existing timeouts
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
    }
    
    // Simple timeout to simulate checking
    checkTimeoutRef.current = setTimeout(() => {
      const isCorrect = guess.trim().toLowerCase() === currentWord.word.toLowerCase();
      
      if (isCorrect) {
        setFeedback({
          message: 'Correct! Well done!',
          type: 'success'
        });
        
        // Clear any existing timeouts
        if (newWordTimeoutRef.current) {
          clearTimeout(newWordTimeoutRef.current);
        }
        
        // Get a new word after correct answer
        newWordTimeoutRef.current = setTimeout(() => {
          getNextWord();
          setGuess('');
          setFeedback(null);
        }, 1500);
      } else {
        setFeedback({
          message: 'Sorry, that\'s not correct. Try again!',
          type: 'error'
        });
      }
      
      setIsSubmitting(false);
    }, 500);
  };

  const handleSkip = () => {
    getNextWord();
    setGuess('');
    setFeedback(null);
  };

  if (error) {
    return (
      <div className="p-4 text-red-600">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-4">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-center">Difficulty</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          <button 
            onClick={() => handleDifficultyChange('easy')}
            className={`py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              difficulty === 'easy' 
                ? 'bg-green-600 text-white' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Easy
          </button>
          <button 
            onClick={() => handleDifficultyChange('medium')}
            className={`py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              difficulty === 'medium' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Medium
          </button>
          <button 
            onClick={() => handleDifficultyChange('hard')}
            className={`py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              difficulty === 'hard' 
                ? 'bg-red-600 text-white' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Hard
          </button>
          <button 
            onClick={() => handleDifficultyChange('all')}
            className={`py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              difficulty === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            All
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-xl">Loading...</div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {currentWord && (
            <DefinitionDisplay 
              definition={currentWord.definition} 
              difficulty={currentWord.difficulty} 
            />
          )}
          
          <WordInput 
            value={guess}
            onChange={handleGuessChange}
            onSubmit={handleGuessSubmit}
            isSubmitting={isSubmitting}
            hasError={feedback?.type === 'error'}
          />
          
          <div className="mt-6">
            <button 
              onClick={handleSkip}
              className="w-full py-3 text-lg text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
              disabled={isSubmitting}
            >
              Skip This Word
            </button>
          </div>
          
          {feedback && (
            <div className="mt-6">
              <FeedbackMessage 
                message={feedback.message} 
                type={feedback.type} 
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 