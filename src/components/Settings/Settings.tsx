import React, { useState, useEffect } from 'react';
import { useGameWithWordSelection } from '@/hooks';

type Difficulty = 'easy' | 'medium' | 'hard' | 'all';

interface SettingsProps {
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const game = useGameWithWordSelection();
  
  // Använd lokala tillstånd för inställningar som sedan sparas vid klick på Spara
  const [difficulty, setDifficulty] = useState<Difficulty>(game.difficulty);
  const [maxSkips, setMaxSkips] = useState<number>(game.maxSkipsPerGame);
  
  // Uppdatera lokalt tillstånd när spelet ändras
  useEffect(() => {
    setDifficulty(game.difficulty);
    setMaxSkips(game.maxSkipsPerGame);
  }, [game.difficulty, game.maxSkipsPerGame]);
  
  // Funktion för att spara inställningar
  const handleSave = () => {
    // Uppdatera speltillståndet med de nya värdena
    game.setDifficulty(difficulty);
    game.setMaxSkips(maxSkips);
    
    // Stäng dialog
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Game Settings</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200"
            aria-label="Close settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
              Select Difficulty:
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
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
              value={maxSkips}
              onChange={(e) => setMaxSkips(Number(e.target.value))}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="3">3 skips (Hard)</option>
              <option value="5">5 skips (Normal)</option>
              <option value="10">10 skips (Easy)</option>
              <option value="999">Unlimited</option>
            </select>
          </div>
          
          <div className="pt-4">
            <button
              onClick={handleSave}
              className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 