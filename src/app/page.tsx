'use client';

import { Header } from '@/components';
import GameContainer from '@/components/GameContainer';
import { useGame } from '@/hooks';
import { useEffect } from 'react';

export default function Home() {
  // Access the game state directly from contextt
  const game = useGame();
  
  // Add effect to set viewport height for mobile browsers
  useEffect(() => {
    // Fix for mobile viewport height issues
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    // Set initial value
    setVH();
    
    // Update on resize
    window.addEventListener('resize', setVH);
    return () => window.removeEventListener('resize', setVH);
  }, []);
  
  return (
    <main className="flex min-h-screen flex-col" style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}>
      <Header title="Guess the Word" score={game.score} />
      <div className="flex-1 flex justify-center px-4 py-8 pt-16 mt-2">
        <div className="w-full max-w-5xl">
          <GameContainer />
        </div>
      </div>
    </main>
  );
}
