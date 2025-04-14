'use client';

import React, { createContext, useReducer, ReactNode } from 'react';
import { Word } from '@/types';

// Game State Interface
export interface GameState {
  // Game status
  status: 'idle' | 'active' | 'paused' | 'completed';
  
  // Current word from useWordSelection
  currentWord: Word | null;
  
  // Score tracking
  score: number;
  wordsGuessed: number;
  wordsSkipped: number;
  currentStreak: number;
  longestStreak: number;
  
  // Track skipped words in current session
  skippedWords: Word[];
  
  // Track scoring history
  scoreHistory: {
    word: string;
    pointsEarned: number;
    difficulty: string;
    timestamp: number;
  }[];
  
  // Session statistics
  sessionStats: {
    totalGames: number;
    highScore: number;
    averageScore: number;
    totalWordsGuessed: number;
    totalWordsSkipped: number;
    bestStreak: number;
  };
  
  // Game settings
  maxSkipsPerGame: number;
  
  // User preferences
  difficulty: 'easy' | 'medium' | 'hard' | 'all';
}

// Game Actions
export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'END_GAME' }
  | { type: 'SET_WORD'; payload: Word }
  | { type: 'CORRECT_GUESS'; payload: { points: number; word: Word } }
  | { type: 'SKIP_WORD' }
  | { type: 'SET_DIFFICULTY'; payload: 'easy' | 'medium' | 'hard' | 'all' }
  | { type: 'SET_MAX_SKIPS'; payload: number }
  | { type: 'RESET_GAME' };

// Initial state
const initialState: GameState = {
  status: 'idle',
  currentWord: null,
  score: 0,
  wordsGuessed: 0,
  wordsSkipped: 0,
  currentStreak: 0,
  longestStreak: 0,
  skippedWords: [],
  scoreHistory: [],
  sessionStats: {
    totalGames: 0,
    highScore: 0,
    averageScore: 0,
    totalWordsGuessed: 0,
    totalWordsSkipped: 0,
    bestStreak: 0
  },
  maxSkipsPerGame: 5, // Default value
  difficulty: 'all',
};

// Reducer function
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        status: 'active',
        score: 0,
        wordsGuessed: 0,
        wordsSkipped: 0,
        currentStreak: 0,
        longestStreak: 0,
        skippedWords: [],
        scoreHistory: [],
      };
      
    case 'PAUSE_GAME':
      return {
        ...state,
        status: 'paused',
      };
      
    case 'RESUME_GAME':
      return {
        ...state,
        status: 'active',
      };
      
    case 'END_GAME': {
      const totalGames = state.sessionStats.totalGames + 1;
      const totalWordsGuessed = state.sessionStats.totalWordsGuessed + state.wordsGuessed;
      const totalWordsSkipped = state.sessionStats.totalWordsSkipped + state.wordsSkipped;
      const highScore = Math.max(state.sessionStats.highScore, state.score);
      const averageScore = (state.sessionStats.averageScore * (totalGames - 1) + state.score) / totalGames;
      const bestStreak = Math.max(state.sessionStats.bestStreak, state.longestStreak);
      
      return {
        ...state,
        status: 'completed',
        sessionStats: {
          totalGames,
          highScore,
          averageScore,
          totalWordsGuessed,
          totalWordsSkipped,
          bestStreak
        },
      };
    }
      
    case 'SET_WORD':
      return {
        ...state,
        currentWord: action.payload,
      };
      
    case 'CORRECT_GUESS': {
      // Update streak
      const newStreak = state.currentStreak + 1;
      const newLongestStreak = Math.max(state.longestStreak, newStreak);
      
      // Add to score history
      const scoreEntry = {
        word: action.payload.word.word,
        pointsEarned: action.payload.points,
        difficulty: action.payload.word.difficulty,
        timestamp: Date.now()
      };
      
      return {
        ...state,
        score: state.score + action.payload.points,
        wordsGuessed: state.wordsGuessed + 1,
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        scoreHistory: [...state.scoreHistory, scoreEntry]
      };
    }
      
    case 'SKIP_WORD':
      return {
        ...state,
        wordsSkipped: state.wordsSkipped + 1,
        currentStreak: 0, // Reset streak on skip
        skippedWords: state.currentWord 
          ? [...state.skippedWords, state.currentWord]
          : state.skippedWords,
      };
      
    case 'SET_DIFFICULTY':
      return {
        ...state,
        difficulty: action.payload,
      };
      
    case 'SET_MAX_SKIPS':
      return {
        ...state,
        maxSkipsPerGame: action.payload,
      };
      
    case 'RESET_GAME':
      return {
        ...initialState,
        sessionStats: state.sessionStats, // Preserve session stats
      };
      
    default:
      return state;
  }
}

// Create contexts
export const GameStateContext = createContext<GameState | undefined>(undefined);
export const GameDispatchContext = createContext<React.Dispatch<GameAction> | undefined>(undefined);

// Provider component
interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
} 