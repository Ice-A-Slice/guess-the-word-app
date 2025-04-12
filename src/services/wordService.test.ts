import wordService from './wordService';
import { words } from '@/data';
import { Word } from '@/types';

// Mock the words data
jest.mock('@/data', () => ({
  words: [
    { 
      id: '1',
      word: 'apple', 
      definition: 'A fruit with red or green skin', 
      difficulty: 'easy' 
    },
    { 
      id: '2',
      word: 'algorithm', 
      definition: 'A process or set of rules to be followed in calculations', 
      difficulty: 'medium' 
    },
    { 
      id: '3',
      word: 'ephemeral', 
      definition: 'Lasting for a very short time', 
      difficulty: 'hard' 
    },
    { 
      id: '4',
      word: 'banana', 
      definition: 'A long curved fruit with yellow skin', 
      difficulty: 'easy',
      category: 'food' 
    },
  ]
}));

describe('wordService', () => {
  test('getAllWords returns all words', () => {
    const result = wordService.getAllWords();
    expect(result).toEqual(words);
    expect(result.length).toBe(4);
  });

  describe('getWordsByDifficulty', () => {
    test('returns all words when difficulty is "all"', () => {
      const result = wordService.getWordsByDifficulty('all');
      expect(result).toEqual(words);
      expect(result.length).toBe(4);
    });

    test('returns only easy words when difficulty is "easy"', () => {
      const result = wordService.getWordsByDifficulty('easy');
      expect(result.length).toBe(2);
      result.forEach(word => {
        expect(word.difficulty).toBe('easy');
      });
    });

    test('returns only medium words when difficulty is "medium"', () => {
      const result = wordService.getWordsByDifficulty('medium');
      expect(result.length).toBe(1);
      expect(result[0].difficulty).toBe('medium');
    });

    test('returns only hard words when difficulty is "hard"', () => {
      const result = wordService.getWordsByDifficulty('hard');
      expect(result.length).toBe(1);
      expect(result[0].difficulty).toBe('hard');
    });
  });

  test('getWordsByCategory returns words with matching category', () => {
    const result = wordService.getWordsByCategory('food');
    expect(result.length).toBe(1);
    expect(result[0].category).toBe('food');
  });

  describe('getRandomWord', () => {
    test('returns a word from the list', () => {
      const result = wordService.getRandomWord();
      expect(words).toContainEqual(result);
    });

    test('random behavior is used', () => {
      // Mock Math.random to always return 0
      const originalRandom = Math.random;
      Math.random = jest.fn().mockReturnValue(0);
      
      const firstResult = wordService.getRandomWord();
      expect(firstResult).toEqual(words[0]);
      
      // Mock Math.random to return 0.75 (3/4)
      Math.random = jest.fn().mockReturnValue(0.75);
      
      const secondResult = wordService.getRandomWord();
      expect(secondResult).toEqual(words[3]);
      
      // Restore original Math.random
      Math.random = originalRandom;
    });
  });

  describe('getRandomWordByDifficulty', () => {
    test('returns a word with matching difficulty', () => {
      // Mock Math.random to always return 0
      const originalRandom = Math.random;
      Math.random = jest.fn().mockReturnValue(0);
      
      const easyWord = wordService.getRandomWordByDifficulty('easy');
      expect(easyWord.difficulty).toBe('easy');
      
      const mediumWord = wordService.getRandomWordByDifficulty('medium');
      expect(mediumWord.difficulty).toBe('medium');
      
      const hardWord = wordService.getRandomWordByDifficulty('hard');
      expect(hardWord.difficulty).toBe('hard');
      
      // Restore original Math.random
      Math.random = originalRandom;
    });

    test('returns a random word when difficulty is "all"', () => {
      // Mock Math.random to always return 0.5
      const originalRandom = Math.random;
      Math.random = jest.fn().mockReturnValue(0.5);
      
      const result = wordService.getRandomWordByDifficulty('all');
      // With 0.5 * 4 = 2, it should return the word at index 2
      expect(result).toEqual(words[2]);
      
      // Restore original Math.random
      Math.random = originalRandom;
    });
  });

  describe('checkGuess', () => {
    const testWord: Word = {
      id: 'test-1',
      word: 'example',
      definition: 'A representative form or pattern',
      difficulty: 'medium'
    };

    test('returns true for exact match', () => {
      expect(wordService.checkGuess('example', testWord)).toBe(true);
    });

    test('returns true for case-insensitive match', () => {
      expect(wordService.checkGuess('Example', testWord)).toBe(true);
      expect(wordService.checkGuess('EXAMPLE', testWord)).toBe(true);
    });

    test('returns true for match with extra spaces', () => {
      expect(wordService.checkGuess(' example ', testWord)).toBe(true);
    });

    test('returns false for incorrect guess', () => {
      expect(wordService.checkGuess('sample', testWord)).toBe(false);
      expect(wordService.checkGuess('examples', testWord)).toBe(false);
    });
    
    test('handles null or undefined guess', () => {
      expect(wordService.checkGuess(null, testWord)).toBe(false);
      expect(wordService.checkGuess(undefined, testWord)).toBe(false);
    });
    
    test('handles null or undefined word', () => {
      expect(wordService.checkGuess('example', null)).toBe(false);
      expect(wordService.checkGuess('example', undefined)).toBe(false);
    });
    
    test('handles both inputs being null or undefined', () => {
      expect(wordService.checkGuess(null, null)).toBe(false);
      expect(wordService.checkGuess(undefined, undefined)).toBe(false);
      expect(wordService.checkGuess(null, undefined)).toBe(false);
      expect(wordService.checkGuess(undefined, null)).toBe(false);
    });
  });
}); 