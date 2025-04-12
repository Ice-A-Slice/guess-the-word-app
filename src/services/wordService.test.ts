import wordService, { GuessResult } from './wordService';
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

  describe('validateGuess', () => {
    const testWord: Word = {
      id: 'test-1',
      word: 'example',
      definition: 'A representative form or pattern',
      difficulty: 'medium'
    };

    test('returns correct status for exact match', () => {
      const result = wordService.validateGuess('example', testWord);
      expect(result.isCorrect).toBe(true);
      expect(result.message).toContain('Correct');
      expect(result.hintLevel).toBe('none');
    });

    test('handles case-insensitive matches', () => {
      const result = wordService.validateGuess('ExAmPlE', testWord);
      expect(result.isCorrect).toBe(true);
    });

    test('handles null/undefined inputs', () => {
      const result1 = wordService.validateGuess(null, testWord);
      expect(result1.isCorrect).toBe(false);
      expect(result1.message).toContain('valid guess');

      const result2 = wordService.validateGuess('example', null);
      expect(result2.isCorrect).toBe(false);
      expect(result2.message).toContain('valid guess');
    });

    test('handles empty guesses', () => {
      const result = wordService.validateGuess('', testWord);
      expect(result.isCorrect).toBe(false);
      expect(result.message).toContain('Please enter a word');
      expect(result.hintLevel).toBe('none');
    });

    test('provides length hints for short guesses', () => {
      const result = wordService.validateGuess('exam', testWord);
      expect(result.isCorrect).toBe(false);
      expect(result.message).toContain('too short');
      expect(result.message).toContain('7-letter');
      expect(result.hintLevel).toBe('mild');
    });

    test('provides length hints for long guesses', () => {
      const result = wordService.validateGuess('examples123', testWord);
      expect(result.isCorrect).toBe(false);
      expect(result.message).toContain('too long');
      expect(result.message).toContain('7-letter');
      expect(result.hintLevel).toBe('mild');
    });

    test('provides first/last letter hints for wrong guesses of correct length', () => {
      const result = wordService.validateGuess('exempla', testWord);
      expect(result.isCorrect).toBe(false);
      expect(result.message).toContain('starts with "e"');
      expect(result.message).toContain('ends with "e"');
      expect(result.hintLevel).toBe('strong');
    });
  });
}); 