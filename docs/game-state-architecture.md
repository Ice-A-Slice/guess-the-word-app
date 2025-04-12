# Game State Management Architecture Plan

## Overview
This document outlines the architecture for implementing state management for the word guessing game. The solution uses React Context and custom hooks to manage game state, current word, score, and session statistics.

## Architecture Components

### 1. Context Structure
- Create two separate contexts:
  - `GameStateContext`: For read-only state access
  - `GameDispatchContext`: For state update functions

### 2. State Interface
```typescript
interface GameState {
  // Game status
  status: 'idle' | 'active' | 'paused' | 'completed';
  
  // Current word from useWordSelection
  currentWord: Word | null;
  
  // Score tracking
  score: number;
  wordsGuessed: number;
  wordsSkipped: number;
  
  // Session statistics
  sessionStats: {
    totalGames: number;
    highScore: number;
    averageScore: number;
    totalWordsGuessed: number;
    totalWordsSkipped: number;
  };
  
  // User preferences
  difficulty: 'easy' | 'medium' | 'hard' | 'all';
}
```

### 3. Action Types
```typescript
type GameAction =
  | { type: 'START_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'END_GAME' }
  | { type: 'SET_WORD'; payload: Word }
  | { type: 'CORRECT_GUESS'; payload: { points: number } }
  | { type: 'SKIP_WORD' }
  | { type: 'SET_DIFFICULTY'; payload: 'easy' | 'medium' | 'hard' | 'all' }
  | { type: 'RESET_GAME' };
```

### 4. Implementation Steps

1. **Create Context Files**
   - Create `src/contexts/GameContext.tsx` with both contexts and provider

2. **Implement Reducer**
   - Create a reducer function that handles all game state transitions
   - Include logic for updating score, tracking words guessed/skipped
   - Handle game status changes (start, pause, resume, end)

3. **Create Custom Hooks**
   - `useGameState`: For accessing the current state
   - `useGameDispatch`: For dispatching actions
   - `useGame`: Convenience hook that combines both

4. **Integrate with useWordSelection**
   - Create a specialized hook that combines game state with word selection
   - Sync the current word from useWordSelection with game state
   - Provide methods for correct guesses and skipping words

5. **Update Components**
   - Wrap the application with the GameProvider
   - Update components to use the game state hooks

## Data Flow

1. User interacts with a component (submits guess, skips word)
2. Component calls a function from useGame or dispatches an action
3. Reducer processes the action and updates the state
4. Components that consume the state re-render with new values

## Integration with Existing Code

### useWordSelection Integration
```typescript
function useGameWithWordSelection(options = {}) {
  const game = useGame();
  const dispatch = useGameDispatch();
  
  const { currentWord, getNextWord } = useWordSelection({
    difficulty: game.difficulty,
    ...options
  });
  
  // Update game state when word changes
  useEffect(() => {
    if (currentWord) {
      dispatch({ type: 'SET_WORD', payload: currentWord });
    }
  }, [currentWord, dispatch]);
  
  // Functions that update both systems
  const handleCorrectGuess = (points = 1) => {
    dispatch({ type: 'CORRECT_GUESS', payload: { points } });
    getNextWord();
  };
  
  const handleSkipWord = () => {
    dispatch({ type: 'SKIP_WORD' });
    getNextWord();
  };
  
  return {
    ...game,
    currentWord,
    getNextWord,
    handleCorrectGuess,
    handleSkipWord
  };
}
```

## File Structure

```
src/
├── contexts/
│   ├── index.ts
│   └── GameContext.tsx  (contexts, provider, reducer)
├── hooks/
│   ├── index.ts
│   ├── useWordSelection.ts (existing)
│   └── useGame.ts (new hooks for game state)
```

## Future Considerations

1. **Persistence**: The architecture is designed to be extended with localStorage in a future task
2. **Performance**: Context splitting optimizes rendering by preventing unnecessary re-renders
3. **Testing**: The reducer pattern makes it easy to test state transitions in isolation