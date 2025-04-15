'use client';

import React, { createContext, useReducer, ReactNode, useEffect } from 'react';
import { Word } from '@/types';
import {
  saveGameState,
  saveSessionStats,
  loadGameState,
  loadSessionStats,
  clearGameState,
  hasSavedSession,
  loadLanguagePreference,
  saveLanguagePreference
} from '@/utils/localStorage';

// Language options
export type DescriptionLanguage = 'English' | 'Swedish';

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
  descriptionLanguage: DescriptionLanguage; // Language for word descriptions
  
  // Session management
  hasSavedSession: boolean;
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
  | { type: 'SET_DESCRIPTION_LANGUAGE'; payload: DescriptionLanguage }
  | { type: 'RESET_GAME' }
  | { type: 'LOAD_SAVED_STATE'; payload: Partial<GameState> }
  | { type: 'CONTINUE_SESSION' }
  | { type: 'LOAD_SESSION_STATS'; payload: GameState['sessionStats'] };

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
  descriptionLanguage: 'English', // Default language
  hasSavedSession: false,
};

// Reducer function
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':

      // Clear any existing game state before starting a new game
      clearGameState();
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
        hasSavedSession: false,
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
      
      const updatedSessionStats = {
        totalGames,
        highScore,
        averageScore,
        totalWordsGuessed,
        totalWordsSkipped,
        bestStreak
      };
      
      // Save session stats to localStorage
      saveSessionStats(updatedSessionStats);
      
      // Clear the current game state
      clearGameState();
      
      return {
        ...state,
        status: 'completed',
        sessionStats: updatedSessionStats,
        hasSavedSession: false,
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
      
      const newState = {
        ...state,
        score: state.score + action.payload.points,
        wordsGuessed: state.wordsGuessed + 1,
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        scoreHistory: [...state.scoreHistory, scoreEntry]
      };
      
      // Save state to localStorage whenever it changes
      saveGameState(newState);
      
      return newState;
    }
      
    case 'SKIP_WORD': {
      const newState = {
        ...state,
        wordsSkipped: state.wordsSkipped + 1,
        currentStreak: 0, // Reset streak on skip
        skippedWords: state.currentWord 
          ? [...state.skippedWords, state.currentWord]
          : state.skippedWords,
      };
      
      // Save state to localStorage whenever it changes
      saveGameState(newState);
      
      return newState;
    }
      
    case 'SET_DIFFICULTY':
      return {
        ...state,
        difficulty: action.payload,
      };
      
    case 'SET_DESCRIPTION_LANGUAGE': {
      const newLanguage = action.payload;
      
      // Explicitly call saveLanguagePreference
      saveLanguagePreference(newLanguage);
      
      const newState = {
        ...state,
        descriptionLanguage: newLanguage,
      };
      
      // Save state to localStorage when language changes
      saveGameState(newState);
      
      return newState;
    }
      
    case 'SET_MAX_SKIPS':
      return {
        ...state,
        maxSkipsPerGame: action.payload,
      };
      
    case 'RESET_GAME':
      // Clear local storage when resetting the game
      clearGameState();
      return {
        ...initialState,
        sessionStats: state.sessionStats, // Preserve session stats
        hasSavedSession: false,
      };
    
    case 'LOAD_SAVED_STATE':
      return {
        ...state,
        ...action.payload,
        hasSavedSession: false, // Reset after loading
      };
      
    case 'CONTINUE_SESSION':
      return {
        ...state,
        status: 'active',
        hasSavedSession: false,
      };
      
    case 'LOAD_SESSION_STATS':
      return {
        ...state,
        sessionStats: action.payload,
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
  const getInitialState = (): GameState => {
    // Check for saved session first
    const savedSession = hasSavedSession();
    
    // Load saved stats either way
    const savedStats = loadSessionStats() || initialState.sessionStats;
    
    if (savedSession) {
      // Resume previous session
      const savedState = loadGameState() || {};
      
      return {
        ...initialState,
        ...savedState,
        sessionStats: savedStats,
        hasSavedSession: true,
      };
    } else {
      // Start fresh with saved stats and preferences
      const languagePreference = loadLanguagePreference(); // Load language preference
      
      return {
        ...initialState,
        sessionStats: savedStats,
        descriptionLanguage: languagePreference, // Use the saved language preference
        hasSavedSession: false,
      };
    }
  };
  
  const [state, dispatch] = useReducer(gameReducer, getInitialState());
  
  // Save state changes to localStorage
  useEffect(() => {
    // Don't save state during initial render
    if (state !== initialState) {
      saveGameState(state);
      saveSessionStats(state.sessionStats);
    }
  }, [state]);
  
  // Check for saved session on mount
  useEffect(() => {
    // First, try to load session stats if available
    const savedStats = loadSessionStats();
    if (savedStats) {
      dispatch({ type: 'LOAD_SESSION_STATS', payload: savedStats });
    }
    
    // Then check if we have a saved game state
    const savedSession = hasSavedSession();
    if (savedSession) {
      const savedState = loadGameState();
      if (savedState) {
        dispatch({ 
          type: 'LOAD_SAVED_STATE', 
          payload: { 
            ...savedState, 
            status: 'paused', // Always load in paused state
            hasSavedSession: true // Mark that we have a saved session
          } 
        });
      }
    }
  }, []);
  
  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
}

// Custom hook for using the game context
export function useGameContext() {
  const state = React.useContext(GameStateContext);
  const dispatch = React.useContext(GameDispatchContext);
  
  if (state === undefined || dispatch === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  
  // Create action functions
  const startGame = () => dispatch({ type: 'START_GAME' });
  const pauseGame = () => dispatch({ type: 'PAUSE_GAME' });
  const resumeGame = () => dispatch({ type: 'RESUME_GAME' });
  const endGame = () => dispatch({ type: 'END_GAME' });
  const setWord = (word: Word) => dispatch({ type: 'SET_WORD', payload: word });
  const correctGuess = (points: number, word: Word) => dispatch({ type: 'CORRECT_GUESS', payload: { points, word } });
  const skipWord = () => dispatch({ type: 'SKIP_WORD' });
  const setDifficulty = (difficulty: 'easy' | 'medium' | 'hard' | 'all') => dispatch({ type: 'SET_DIFFICULTY', payload: difficulty });
  const setMaxSkips = (maxSkips: number) => dispatch({ type: 'SET_MAX_SKIPS', payload: maxSkips });
  const setDescriptionLanguage = (language: DescriptionLanguage) => dispatch({ type: 'SET_DESCRIPTION_LANGUAGE', payload: language });
  const resetGame = () => dispatch({ type: 'RESET_GAME' });
  const continueSession = () => dispatch({ type: 'CONTINUE_SESSION' });
  
  return {
    ...state,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    setWord,
    correctGuess,
    skipWord,
    setDifficulty,
    setMaxSkips,
    setDescriptionLanguage,
    resetGame,
    continueSession,
  };
} 