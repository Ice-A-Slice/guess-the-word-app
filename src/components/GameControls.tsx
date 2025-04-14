import React from 'react';
import { useGameWithWordSelection } from '@/hooks';

// Definierar tillåtna värden för difficulty
type Difficulty = 'easy' | 'medium' | 'hard' | 'all';

interface GameControlsProps {
  onSkipWord?: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ onSkipWord }) => {
  const game = useGameWithWordSelection();
  
  // Use custom skip handler if provided, otherwise use the default one
  const handleSkipWord = onSkipWord || game.handleSkipWord;
  
  // Render different controls based on game status
  if (game.status === 'idle') {
    return (
      <div className="flex flex-col items-center space-y-4 mt-8">
        <h2 className="text-xl font-semibold">Guess the Word Game</h2>
        <p className="text-gray-600 text-center max-w-md">
          Test your vocabulary by guessing words based on their definitions. 
          Choose a difficulty and start playing!
        </p>
        
        <div className="w-full max-w-xs space-y-4">
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
              Select Difficulty:
            </label>
            <select
              id="difficulty"
              value={game.difficulty}
              onChange={(e) => game.setDifficulty(e.target.value as Difficulty)}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="all">All Levels</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="max-skips" className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Skips:
            </label>
            <select
              id="max-skips"
              value={game.maxSkipsPerGame}
              onChange={(e) => game.setMaxSkips(Number(e.target.value))}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="3">3 skips (Hard)</option>
              <option value="5">5 skips (Normal)</option>
              <option value="10">10 skips (Easy)</option>
              <option value="999">Unlimited</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={game.startGame}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          data-testid="start-button"
        >
          Start Game
        </button>
      </div>
    );
  }
  
  if (game.status === 'active') {
    // Calculate remaining skips
    const remainingSkips = game.maxSkipsPerGame - game.wordsSkipped;
    const skipsExhausted = remainingSkips <= 0;
    
    // Check if we have an active streak
    const hasStreak = game.currentStreak > 1;
    
    return (
      <div className="flex flex-col items-center space-y-3 mt-4">
        {/* Score and Stats Display */}
        <div className="flex justify-between w-full max-w-md px-4 py-3 bg-gray-100 rounded-lg shadow-sm">
          <div className="text-center">
            <span className="text-sm text-gray-500">Score</span>
            <p className="text-xl font-bold text-blue-600" data-testid="score-display">{game.score}</p>
          </div>
          <div className="text-center">
            <span className="text-sm text-gray-500">Words</span>
            <p className="text-lg font-bold" data-testid="words-guessed-display">{game.wordsGuessed}</p>
          </div>
          <div className="text-center">
            <span className="text-sm text-gray-500">Skips</span>
            <p className="text-lg font-bold" data-testid="remaining-skips">{remainingSkips}</p>
          </div>
          <div className="text-center">
            <span className="text-sm text-gray-500">Streak</span>
            <p className={`text-lg font-bold ${hasStreak ? 'text-green-600' : ''}`} data-testid="current-streak">
              {game.currentStreak}
              {hasStreak && '🔥'}
            </p>
          </div>
        </div>
        
        {/* Streak Info - show when streak is active */}
        {hasStreak && (
          <div className="text-xs text-center text-gray-600 -mt-2">
            <span>Streak bonus: +{Math.min(3, Math.floor(game.currentStreak / 2))} points per word</span>
          </div>
        )}
        
        {/* Game Controls */}
        <div className="flex space-x-2 mt-2">
          <button
            onClick={handleSkipWord}
            disabled={skipsExhausted}
            className={`px-4 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors ${
              skipsExhausted 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            data-testid="skip-button"
            title={skipsExhausted ? 'No more skips available' : 'Skip this word'}
          >
            Skip Word {skipsExhausted && '(0)'}
          </button>
          
          <button
            onClick={game.pauseGame}
            className="px-4 py-1 bg-yellow-200 text-yellow-800 rounded-md hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors"
            data-testid="pause-button"
          >
            Pause
          </button>
          
          <button
            onClick={game.endGame}
            className="px-4 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
            data-testid="end-button"
          >
            End Game
          </button>
        </div>
      </div>
    );
  }
  
  if (game.status === 'paused') {
    return (
      <div className="flex flex-col items-center space-y-4 mt-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
        <h2 className="text-xl font-semibold text-yellow-800">Game Paused</h2>
        <p className="text-gray-600 text-center">Take a breather. Your progress is saved.</p>
        
        <div className="flex space-x-4 mt-2">
          <button
            onClick={game.resumeGame}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            data-testid="resume-button"
          >
            Resume Game
          </button>
          
          <button
            onClick={game.endGame}
            className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
            data-testid="end-game-button"
          >
            End Game
          </button>
        </div>
      </div>
    );
  }
  
  if (game.status === 'completed') {
    return (
      <div className="flex flex-col items-center space-y-4 mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h2 className="text-xl font-semibold text-blue-800">Game Complete!</h2>
        
        {/* Game Statistics */}
        <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded shadow-sm">
              <p className="text-sm text-gray-500">Final Score</p>
              <p className="text-2xl font-bold text-blue-600" data-testid="final-score">{game.score}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded shadow-sm">
              <p className="text-sm text-gray-500">Words Guessed</p>
              <p className="text-2xl font-bold text-green-600" data-testid="final-words-guessed">{game.wordsGuessed}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded shadow-sm">
              <p className="text-sm text-gray-500">Longest Streak</p>
              <p className="text-2xl font-bold text-orange-500" data-testid="longest-streak">{game.longestStreak}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded shadow-sm">
              <p className="text-sm text-gray-500">Best Score</p>
              <p className="text-2xl font-bold text-purple-600" data-testid="high-score">{game.sessionStats.highScore}</p>
            </div>
          </div>
        </div>
        
        {/* Score History */}
        {game.scoreHistory.length > 0 && (
          <div className="w-full max-w-md mt-2">
            <h3 className="text-md font-semibold text-gray-700 mb-2">Scoring Details:</h3>
            <div className="bg-white p-3 rounded-lg shadow-sm max-h-48 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-1">Word</th>
                    <th className="text-left p-1">Difficulty</th>
                    <th className="text-right p-1">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {game.scoreHistory.map((score, index) => (
                    <tr key={`score-${index}`} className="border-b border-gray-100">
                      <td className="p-1 font-medium">{score.word}</td>
                      <td className="p-1 capitalize">{score.difficulty}</td>
                      <td className="p-1 text-right font-bold">+{score.pointsEarned}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t">
                  <tr>
                    <td colSpan={2} className="p-1 text-right font-medium">Total Score:</td>
                    <td className="p-1 text-right font-bold text-blue-600">{game.score}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
        
        {/* Skipped Words Section */}
        {game.skippedWords.length > 0 && (
          <div className="w-full max-w-md mt-2">
            <h3 className="text-md font-semibold text-gray-700 mb-2">Skipped Words:</h3>
            <div className="bg-white p-3 rounded-lg shadow-sm max-h-48 overflow-y-auto">
              <ul className="divide-y divide-gray-100">
                {game.skippedWords.map((word, index) => (
                  <li key={`${word.id}-${index}`} className="py-2">
                    <p className="font-medium">{word.word}</p>
                    <p className="text-sm text-gray-500">{word.definition}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        <button
          onClick={game.resetGame}
          className="mt-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          data-testid="new-game-button"
        >
          New Game
        </button>
      </div>
    );
  }
  
  // Fallback for any unhandled states
  return null;
};

export default GameControls; 