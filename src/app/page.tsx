'use client';

import { Header } from '@/components';
import GameContainer from '@/components/GameContainer';
import { useGame } from '@/hooks';

export default function Home() {
  // Access the game state directly from context
  const game = useGame();
  
  return (
    <main className="flex min-h-screen flex-col">
      <Header title="Guess the Word" score={game.score} />
      <div className="flex-1 flex justify-center px-4 py-8">
        <div className="w-full max-w-5xl">
          <GameContainer />
        </div>
      </div>
    </main>
  );
}
