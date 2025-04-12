'use client';

import { useState, FormEvent, useEffect, useCallback } from 'react';
import { Header } from '@/components';
import { wordService } from '@/services';
import { Word, UserPreferences } from '@/types';

export default function Home() {
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | 'info' | null }>({ 
    message: '', 
    type: null 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [score, setScore] = useState(0);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    difficulty: 'all'
  });

  // Load a new word based on current preferences
  const loadNewWord = useCallback(() => {
    const newWord = wordService.getRandomWordByDifficulty(userPreferences.difficulty);
    setCurrentWord(newWord);
    setGuess('');
    setFeedback({ message: '', type: null });
  }, [userPreferences.difficulty]);

  // Load a random word when component mounts or when a new word is needed
  useEffect(() => {
    loadNewWord();
  }, [loadNewWord]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!guess.trim() || !currentWord) {
      setFeedback({
        message: 'Please enter a word',
        type: 'error'
      });
      setIsSubmitting(false);
      return;
    }

    // Short timeout to give feedback some time to be noticed
    setTimeout(() => {
      if (wordService.checkGuess(guess, currentWord)) {
        setScore(prevScore => prevScore + 1);
        setFeedback({
          message: 'Correct! Great job!',
          type: 'success'
        });
        // Load a new word after a short delay
        setTimeout(() => {
          loadNewWord();
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
    if (currentWord) {
      setFeedback({
        message: `The correct word was "${currentWord.word}". Loading a new word...`,
        type: 'info'
      });
      // Load a new word after a short delay
      setTimeout(() => {
        loadNewWord();
      }, 1500);
    }
  };

  const handleDifficultyChange = (difficulty: 'easy' | 'medium' | 'hard' | 'all') => {
    setUserPreferences(prev => ({
      ...prev,
      difficulty
    }));
  };

  // Show loading state until we have a word
  if (!currentWord) {
    return (
      <main className="flex min-h-screen flex-col items-center">
        <Header title="Guess the Word" score={score} />
        <div className="flex items-center justify-center flex-1">
          <p className="text-lg">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <Header title="Guess the Word" score={score} />
      
      <div className="container mx-auto flex flex-col items-center justify-center flex-1 px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <div className="mb-4 flex justify-center space-x-2">
            <button 
              className={`px-3 py-1 rounded-full text-sm font-medium ${userPreferences.difficulty === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => handleDifficultyChange('all')}
            >
              All
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm font-medium ${userPreferences.difficulty === 'easy' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => handleDifficultyChange('easy')}
            >
              Easy
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm font-medium ${userPreferences.difficulty === 'medium' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => handleDifficultyChange('medium')}
            >
              Medium
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm font-medium ${userPreferences.difficulty === 'hard' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => handleDifficultyChange('hard')}
            >
              Hard
            </button>
          </div>

          <div className="mb-8 text-center">
            <h2 className="text-xl font-semibold mb-2" id="definition-label">Definition:</h2>
            <p 
              className="text-gray-700 text-lg" 
              aria-labelledby="definition-label"
            >
              {currentWord.definition}
            </p>
            <div className="mt-2 text-sm text-gray-500">
              Difficulty: 
              <span className={`ml-1 font-medium ${
                currentWord.difficulty === 'easy' ? 'text-green-600' : 
                currentWord.difficulty === 'medium' ? 'text-yellow-600' : 
                'text-red-600'
              }`}>
                {currentWord.difficulty.charAt(0).toUpperCase() + currentWord.difficulty.slice(1)}
              </span>
            </div>
          </div>
          
          {feedback.message && (
            <div 
              className={`mb-4 p-3 rounded ${
                feedback.type === 'success' ? 'bg-green-100 text-green-800' : 
                feedback.type === 'error' ? 'bg-red-100 text-red-800' : 
                'bg-blue-100 text-blue-800'
              }`}
              role="alert"
              aria-live="assertive"
            >
              {feedback.message}
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="guess" className="block text-sm font-medium text-gray-700 mb-1">
                Your Guess:
              </label>
              <input
                type="text"
                id="guess"
                name="guess"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Type your answer..."
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  feedback.type === 'error' ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                aria-describedby={feedback.type === 'error' ? 'error-message' : undefined}
                aria-invalid={feedback.type === 'error'}
                disabled={isSubmitting}
                required
                autoComplete="off"
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? 'Checking...' : 'Submit'}
              </button>
              <button
                type="button"
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
                onClick={handleSkip}
                disabled={isSubmitting}
              >
                Skip
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
