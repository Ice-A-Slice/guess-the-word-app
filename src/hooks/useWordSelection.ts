import { useState, useEffect, useCallback } from 'react';
import wordService from '@/services/wordService';
import { Word } from '@/types';

interface UseWordSelectionOptions {
  difficulty?: 'easy' | 'medium' | 'hard' | 'all';
  maxHistorySize?: number; // Maximum number of words to keep in history
  preventRepetition?: boolean; // Whether to avoid showing the same word again soon
}

interface UseWordSelectionResult {
  currentWord: Word | null;
  getNextWord: () => void;
  history: Word[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * Custom hook for word selection logic
 * 
 * Features:
 * - Select random words from the dataset
 * - Filter by difficulty if needed
 * - Ensure words don't repeat too frequently in a session
 * - Track word history
 */
export const useWordSelection = (options: UseWordSelectionOptions = {}): UseWordSelectionResult => {
  const {
    difficulty = 'all',
    maxHistorySize = 10,
    preventRepetition = true
  } = options;

  // Initialize with default values instead of loading state
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [history, setHistory] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Start with false to avoid hanging in tests
  const [error, setError] = useState<Error | null>(null);

  // Get a random word that hasn't been shown recently
  const getRandomWordNotInHistory = useCallback(() => {
    try {
      // Get all available words for the selected difficulty
      const availableWords = wordService.getWordsByDifficulty(difficulty);
      
      if (availableWords.length === 0) {
        throw new Error(`No words available for difficulty: ${difficulty}`);
      }

      // If we don't need to prevent repetition or have no history, just get a random word
      if (!preventRepetition || history.length === 0) {
        return wordService.getRandomWordByDifficulty(difficulty);
      }

      // Get IDs of words in history to check against
      const historyIds = history.map(word => word.id);
      
      // Filter out words that are in history
      const wordsNotInHistory = availableWords.filter(word => !historyIds.includes(word.id));
      
      // If we've shown all words, get a truly random word
      if (wordsNotInHistory.length === 0) {
        return wordService.getRandomWordByDifficulty(difficulty);
      }
      
      // Pick a random word from those not in history
      const randomIndex = Math.floor(Math.random() * wordsNotInHistory.length);
      return wordsNotInHistory[randomIndex];
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('Failed to get a random word'));
      }
      // Return a fallback word or null
      return null;
    }
  }, [difficulty, history, preventRepetition]);

  // Get next word and update state - simplified to avoid potential issues
  const getNextWord = useCallback(() => {
    // Set loading state
    setIsLoading(true);
    
    try {
      // Get next word synchronously
      const nextWord = getRandomWordNotInHistory();
      
      if (!nextWord) {
        setIsLoading(false);
        return;
      }
      
      // Update state synchronously
      setCurrentWord(nextWord);
      
      // Update history, maintaining maxHistorySize
      setHistory(prevHistory => {
        const newHistory = [...prevHistory];
        
        // Add new word to history
        newHistory.unshift(nextWord);
        
        // Keep only the most recent 'maxHistorySize' words
        if (newHistory.length > maxHistorySize) {
          return newHistory.slice(0, maxHistorySize);
        }
        
        return newHistory;
      });
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('Failed to get next word'));
      }
    }
    
    // Always set loading to false immediately
    setIsLoading(false);
  }, [getRandomWordNotInHistory, maxHistorySize]);

  // Initialize with first word - use a simpler approach
  useEffect(() => {
    // Get initial word immediately
    try {
      const initialWord = wordService.getRandomWordByDifficulty(difficulty);
      if (initialWord) {
        setCurrentWord(initialWord);
        setHistory([initialWord]);
      } else {
        setError(new Error(`No words available for difficulty: ${difficulty}`));
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('Failed to get initial word'));
      }
    }
    // No loading state needed for initial load
  }, [difficulty]); // Remove getNextWord from dependencies to avoid potential loops

  return {
    currentWord,
    getNextWord,
    history,
    isLoading,
    error
  };
}; 