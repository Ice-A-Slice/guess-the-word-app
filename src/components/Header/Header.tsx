import React, { useState } from 'react';
import { Settings } from '@/components/Settings';

interface HeaderProps {
  title: string;
  score?: number;
}

export const Header: React.FC<HeaderProps> = ({ title, score }) => {
  const [showSettings, setShowSettings] = useState(false);
  
  return (
    <header 
      className="w-full p-4 bg-blue-600 text-white shadow-md" 
      role="banner"
      aria-label="Game header"
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold" id="game-title">{title}</h1>
        <div className="flex items-center space-x-4">
          {score !== undefined && (
            <div 
              className="bg-white text-blue-600 px-4 py-2 rounded-full font-bold"
              aria-live="polite"
              aria-atomic="true"
              aria-label="Current score"
            >
              Score: <span aria-live="polite">{score}</span>
            </div>
          )}
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            aria-label="Game settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </header>
  );
}; 