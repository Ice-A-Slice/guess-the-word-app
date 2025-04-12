'use client';

import { useState, FormEvent, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components';
import { wordService } from '@/services';
import { Word, UserPreferences } from '@/types';
import { WordSelectionDemo } from '@/components/WordGame';

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

  // Store timeouts in refs so we can clean them up
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const newWordTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
      if (newWordTimeoutRef.current) {
        clearTimeout(newWordTimeoutRef.current);
      }
    };
  }, []);

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

    // Clear any existing timeouts
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    // Short timeout to give feedback some time to be noticed
    feedbackTimeoutRef.current = setTimeout(() => {
      if (wordService.checkGuess(guess, currentWord)) {
        setScore(prevScore => prevScore + 1);
        setFeedback({
          message: 'Correct! Great job!',
          type: 'success'
        });
        
        // Clear any existing timeouts
        if (newWordTimeoutRef.current) {
          clearTimeout(newWordTimeoutRef.current);
        }
        
        // Load a new word after a short delay
        newWordTimeoutRef.current = setTimeout(() => {
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
      
      // Clear any existing timeouts
      if (newWordTimeoutRef.current) {
        clearTimeout(newWordTimeoutRef.current);
      }
      
      // Load a new word after a short delay
      newWordTimeoutRef.current = setTimeout(() => {
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
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="max-w-4xl w-full">
        <Header title="Guess the Word" score={score} />
        <WordSelectionDemo />
      </div>
    </main>
  );
}
