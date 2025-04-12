'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components';
import { wordService } from '@/services';
import { Word } from '@/types';
import { WordSelectionDemo } from '@/components/WordGame';

export default function Home() {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [score] = useState(0);

  // Load a new word based on current preferences
  const loadNewWord = useCallback(() => {
    const newWord = wordService.getRandomWordByDifficulty('all');
    setCurrentWord(newWord);
  }, []);

  // Load a random word when component mounts
  useEffect(() => {
    loadNewWord();
  }, [loadNewWord]);

  // Show loading state until we have a word
  if (!currentWord) {
    return (
      <main className="flex min-h-screen flex-col">
        <Header title="Guess the Word" score={score} />
        <div className="flex items-center justify-center flex-1">
          <p className="text-lg">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Header title="Guess the Word" score={score} />
      <div className="flex-1 flex justify-center px-4 py-8">
        <div className="w-full max-w-5xl">
          <WordSelectionDemo />
        </div>
      </div>
    </main>
  );
}
