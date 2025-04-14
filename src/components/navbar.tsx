"use client";

import React from 'react';
import { ThemeToggle } from './ui/theme-toggle';
import { useGame } from '@/hooks';

const Navbar = () => {
  const game = useGame();
  
  return (
    <header className="game-header w-full">
      <div className="flex items-center">
        <span className="text-xl font-bold">Guess the Word</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="bg-white text-primary px-3 py-1 rounded-full font-bold">
          Score: {game.score}
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Navbar; 