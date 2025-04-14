import React, { useState } from 'react';
import { useGameState } from '@/hooks/useGame';

interface SessionSummaryProps {
  onStartNewGame: () => void;
}

const SessionSummary: React.FC<SessionSummaryProps> = ({ onStartNewGame }) => {
  const game = useGameState();
  const { sessionStats } = game;
  const [showSkippedWords, setShowSkippedWords] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-6">Session Summary</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-100 rounded-lg p-4 text-center">
          <p className="text-gray-600 text-sm">Score</p>
          <p className="text-3xl font-bold text-indigo-600">{game.score}</p>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-4 text-center">
          <p className="text-gray-600 text-sm">Best Streak</p>
          <p className="text-3xl font-bold text-indigo-600">{game.longestStreak}</p>
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600">Words Guessed</span>
          <span className="font-semibold">{game.wordsGuessed}</span>
        </div>
        
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600">Words Skipped</span>
          <span className="font-semibold">{game.wordsSkipped}</span>
        </div>
        
        {/* Skipped Words Section */}
        {game.skippedWords.length > 0 && (
          <div className="mt-2 pt-2">
            <button 
              onClick={() => setShowSkippedWords(!showSkippedWords)}
              className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center w-full justify-between font-medium"
              aria-expanded={showSkippedWords}
            >
              <span>
                {showSkippedWords ? 'Hide' : 'Show'} skipped words
              </span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 transition-transform ${showSkippedWords ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showSkippedWords && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm animate-slide-down">
                <h4 className="font-medium mb-2 text-gray-700">Words you skipped:</h4>
                <ul className="space-y-2">
                  {game.skippedWords.map((word, index) => (
                    <li key={`${word.id}-${index}`} className="pb-2 border-b border-gray-200 last:border-0">
                      <span className="font-medium text-indigo-700">{word.word}</span>
                      <p className="text-gray-600 text-xs mt-1">{word.definition}</p>
                      <span className="inline-block mt-1 px-2 py-1 bg-gray-200 rounded-full text-xs text-gray-700">
                        {word.difficulty}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="bg-indigo-50 rounded-lg p-4 mb-6">
        <h3 className="font-bold text-center mb-2">All-time Stats</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Games Played</span>
            <span className="font-semibold">{sessionStats.totalGames}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">High Score</span>
            <span className="font-semibold">{sessionStats.highScore}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Average Score</span>
            <span className="font-semibold">{Math.round(sessionStats.averageScore)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Best Streak</span>
            <span className="font-semibold">{sessionStats.bestStreak}</span>
          </div>
        </div>
      </div>
      
      <button
        onClick={onStartNewGame}
        className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300"
      >
        Start New Game
      </button>
    </div>
  );
};

export default SessionSummary; 