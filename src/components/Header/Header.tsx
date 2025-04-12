import React from 'react';

interface HeaderProps {
  title: string;
  score?: number;
}

export const Header: React.FC<HeaderProps> = ({ title, score }) => {
  return (
    <header 
      className="w-full p-4 bg-blue-600 text-white shadow-md" 
      role="banner"
      aria-label="Game header"
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold" id="game-title">{title}</h1>
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
      </div>
    </header>
  );
}; 