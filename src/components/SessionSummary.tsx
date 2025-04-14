import React from 'react';
import { useGameState } from '@/hooks/useGame';

interface SessionSummaryProps {
  onStartNewGame: () => void;
}

const SessionSummary: React.FC<SessionSummaryProps> = ({ onStartNewGame }) => {
  const game = useGameState();
  const { sessionStats } = game;
  
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