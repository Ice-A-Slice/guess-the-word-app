'use client';

import { useContext, useEffect } from 'react';
import { GameStateContext, GameDispatchContext, GameState, GameAction } from '@/contexts/GameContext';
import { useWordSelection } from './useWordSelection';
import { Word } from '@/types';

// Hook for accessing the game state
export function useGameState(): GameState {
  const context = useContext(GameStateContext);
  
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  
  return context;
}

// Hook for accessing the dispatch function
export function useGameDispatch(): React.Dispatch<GameAction> {
  const context = useContext(GameDispatchContext);
  
  if (context === undefined) {
    throw new Error('useGameDispatch must be used within a GameProvider');
  }
  
  return context;
}

// Combined hook for convenience
export function useGame() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  
  return {
    ...state,
    
    // Action creators
    startGame: () => dispatch({ type: 'START_GAME' }),
    pauseGame: () => dispatch({ type: 'PAUSE_GAME' }),
    resumeGame: () => dispatch({ type: 'RESUME_GAME' }),
    endGame: () => dispatch({ type: 'END_GAME' }),
    correctGuess: (points = 1, word: Word) => {
      if (!word) {
        throw new Error('Word is required for scoring');
      }
      dispatch({ type: 'CORRECT_GUESS', payload: { points, word } });
    },
    skipWord: () => dispatch({ type: 'SKIP_WORD' }),
    setDifficulty: (difficulty: 'easy' | 'medium' | 'hard' | 'all') => 
      dispatch({ type: 'SET_DIFFICULTY', payload: difficulty }),
    setMaxSkips: (maxSkips: number) => 
      dispatch({ type: 'SET_MAX_SKIPS', payload: maxSkips }),
    resetGame: () => dispatch({ type: 'RESET_GAME' }),
  };
}

// Integration with word selection
export interface GameWithWordSelectionOptions {
  difficulty?: 'easy' | 'medium' | 'hard' | 'all';
  excludeWords?: string[];
}

// Hook that combines game state and word selection
export function useGameWithWordSelection(options: GameWithWordSelectionOptions = {}) {
  const gameState = useGameState();
  const dispatch = useGameDispatch();
  
  // Use the game's difficulty if not specified in options
  const wordSelectionOptions = {
    ...options,
    difficulty: options.difficulty || gameState.difficulty,
  };
  
  const { currentWord, getNextWord, ...wordSelection } = useWordSelection(wordSelectionOptions);
  
  // Update game state when word changes
  useEffect(() => {
    if (currentWord) {
      dispatch({ type: 'SET_WORD', payload: currentWord });
    }
  }, [currentWord, dispatch]);
  
  // Functions that update both systems
  const handleCorrectGuess = (points = 1, word = currentWord) => {
    if (!word) {
      throw new Error('No word available for scoring');
    }
    dispatch({ type: 'CORRECT_GUESS', payload: { points, word } });
    getNextWord();
  };
  
  const handleSkipWord = () => {
    dispatch({ type: 'SKIP_WORD' });
    getNextWord();
  };
  
  return {
    ...gameState,
    ...wordSelection,
    getNextWord,
    handleCorrectGuess,
    handleSkipWord,
    setMaxSkips: (maxSkips: number) => {
      dispatch({ type: 'SET_MAX_SKIPS', payload: maxSkips });
    },
    startGame: () => {
      dispatch({ type: 'START_GAME' });
      // Get the first word if we don't have one already
      if (!currentWord) {
        getNextWord();
      }
    },
    pauseGame: () => dispatch({ type: 'PAUSE_GAME' }),
    resumeGame: () => dispatch({ type: 'RESUME_GAME' }),
    endGame: () => dispatch({ type: 'END_GAME' }),
    setDifficulty: (difficulty: 'easy' | 'medium' | 'hard' | 'all') => {
      dispatch({ type: 'SET_DIFFICULTY', payload: difficulty });
    },
    resetGame: () => {
      dispatch({ type: 'RESET_GAME' });
      getNextWord();
    },
  };
} 