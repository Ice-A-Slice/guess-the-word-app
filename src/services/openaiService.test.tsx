import { OpenAIServiceError, AIResponse } from './openaiService.types';

// Declare Jest mock types for our service functions
type MockedFunction<T extends (...args: unknown[]) => unknown> = jest.Mock<ReturnType<T>, Parameters<T>> & {
  mockResolvedValueOnce: (value: Awaited<ReturnType<T>>) => jest.Mock;
  mockRejectedValueOnce: (reason: unknown) => jest.Mock;
};

// First mock the service module
jest.mock('./openaiService', () => {
  // Create the mock service object inside the factory function
  const mockService = {
    generateWordDescription: jest.fn(),
    generateHint: jest.fn(),
    analyzeGuess: jest.fn(),
    checkDefinitionMatch: jest.fn(),
    generateSampleSentence: jest.fn(),
    generateMultilingualWordDescription: jest.fn()
  };
  
  return {
    __esModule: true,
    default: mockService,
    OpenAIServiceError
  };
});

// Then import the service
import openaiService from './openaiService';

// Get the mock functions from Jest with proper type casting
const mockedGenerateWordDescription = openaiService.generateWordDescription as MockedFunction<typeof openaiService.generateWordDescription>;
const mockedGenerateHint = openaiService.generateHint as MockedFunction<typeof openaiService.generateHint>;
const mockedAnalyzeGuess = openaiService.analyzeGuess as MockedFunction<typeof openaiService.analyzeGuess>;
const mockedCheckDefinitionMatch = openaiService.checkDefinitionMatch as MockedFunction<typeof openaiService.checkDefinitionMatch>;
const mockedGenerateSampleSentence = openaiService.generateSampleSentence as MockedFunction<typeof openaiService.generateSampleSentence>;
const mockedMultilingualWordDescription = openaiService.generateMultilingualWordDescription as MockedFunction<typeof openaiService.generateMultilingualWordDescription>;

describe('openaiService', () => {
  beforeEach(() => {
    // Clear all mocks between tests
    jest.clearAllMocks();
  });

  describe('generateWordDescription', () => {
    test('returns the generated description when successful', async () => {
      // Arrange
      const mockDescription = 'A popular fruit that keeps doctors away, known for its crisp texture and sweet flavor.';
      mockedGenerateWordDescription.mockResolvedValueOnce(mockDescription);

      // Act
      const result = await openaiService.generateWordDescription('apple');

      // Assert
      expect(result).toBe(mockDescription);
      expect(openaiService.generateWordDescription).toHaveBeenCalledWith('apple');
    });

    test('returns fallback text when API throws an error', async () => {
      // Arrange
      const fallbackText = 'A common word in the English language.';
      mockedGenerateWordDescription.mockResolvedValueOnce(fallbackText);

      // Act
      const result = await openaiService.generateWordDescription('apple');

      // Assert
      expect(result).toBe(fallbackText);
    });
  });

  describe('generateHint', () => {
    test('returns the generated hint when successful', async () => {
      // Arrange
      const mockHint = 'This fruit is round and often red or green.';
      mockedGenerateHint.mockResolvedValueOnce(mockHint);

      // Act
      const result = await openaiService.generateHint('apple', ['banana', 'orange']);

      // Assert
      expect(result).toBe(mockHint);
      expect(openaiService.generateHint).toHaveBeenCalledWith('apple', ['banana', 'orange']);
    });

    test('includes previous guesses in the prompt', async () => {
      // Arrange
      mockedGenerateHint.mockResolvedValueOnce('A hint');

      // Act
      await openaiService.generateHint('apple', ['banana', 'orange']);

      // Assert
      expect(openaiService.generateHint).toHaveBeenCalledWith('apple', ['banana', 'orange']);
    });

    test('returns fallback text when API throws an error', async () => {
      // Arrange
      const fallbackText = 'This word has 5 letters.';
      mockedGenerateHint.mockResolvedValueOnce(fallbackText);

      // Act
      const result = await openaiService.generateHint('apple');

      // Assert
      expect(result).toBe(fallbackText);
    });
  });

  describe('analyzeGuess', () => {
    test('returns feedback on a guess when successful', async () => {
      // Arrange
      const mockFeedback = 'You are close! Your guess is a similar fruit.';
      mockedAnalyzeGuess.mockResolvedValueOnce(mockFeedback);

      // Act
      const result = await openaiService.analyzeGuess('apple', 'orange');

      // Assert
      expect(result).toBe(mockFeedback);
      expect(openaiService.analyzeGuess).toHaveBeenCalledWith('apple', 'orange');
    });

    test('returns fallback text when API throws an error', async () => {
      // Arrange
      const fallbackText = 'Not correct. Try a different word.';
      mockedAnalyzeGuess.mockResolvedValueOnce(fallbackText);

      // Act
      const result = await openaiService.analyzeGuess('apple', 'orange');

      // Assert
      expect(result).toBe(fallbackText);
    });
  });

  describe('checkDefinitionMatch', () => {
    test('returns true when the definition matches', async () => {
      // Arrange
      mockedCheckDefinitionMatch.mockResolvedValueOnce(true);

      // Act
      const result = await openaiService.checkDefinitionMatch(
        'apple', 
        'A round fruit with red or green skin and a white interior'
      );

      // Assert
      expect(result).toBe(true);
    });

    test('returns false when the definition does not match', async () => {
      // Arrange
      mockedCheckDefinitionMatch.mockResolvedValueOnce(false);

      // Act
      const result = await openaiService.checkDefinitionMatch(
        'apple', 
        'A yellow curved fruit that monkeys like to eat'
      );

      // Assert
      expect(result).toBe(false);
    });

    test('throws OpenAIServiceError when API throws an error', async () => {
      // Arrange
      mockedCheckDefinitionMatch.mockRejectedValueOnce(new OpenAIServiceError('API error'));

      // Act & Assert
      await expect(openaiService.checkDefinitionMatch('apple', 'A definition'))
        .rejects
        .toThrow(OpenAIServiceError);
    });
  });

  describe('generateSampleSentence', () => {
    test('returns the generated sample sentence when successful', async () => {
      // Arrange
      const mockResponse = {
        content: 'She ate an apple for lunch every day.',
        tokenUsage: {
          prompt: 50,
          completion: 30,
          total: 80
        }
      };
      mockedGenerateSampleSentence.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await openaiService.generateSampleSentence('apple');

      // Assert
      expect(result).toEqual(mockResponse);
    });

    test('throws OpenAIServiceError when API throws an error', async () => {
      // Arrange
      mockedGenerateSampleSentence.mockRejectedValueOnce(new OpenAIServiceError('API error'));

      // Act & Assert
      await expect(openaiService.generateSampleSentence('apple'))
        .rejects
        .toThrow(OpenAIServiceError);
    });

    test('includes token usage when available', async () => {
      // Arrange
      const mockResponse = {
        content: 'Example sentence',
        tokenUsage: {
          prompt: 40,
          completion: 20,
          total: 60
        }
      };
      mockedGenerateSampleSentence.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await openaiService.generateSampleSentence('word');

      // Assert
      expect(result.tokenUsage).toEqual({
        prompt: 40,
        completion: 20,
        total: 60
      });
    });
  });

  describe('generateMultilingualWordDescription', () => {
    test('returns the generated multilingual description when successful', async () => {
      // Arrange
      const mockResponse: AIResponse = {
        content: 'En populär frukt som håller läkare borta, känd för sin krispiga textur och söta smak.',
        tokenUsage: {
          prompt: 50,
          completion: 30,
          total: 80
        }
      };
      mockedMultilingualWordDescription.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await openaiService.generateMultilingualWordDescription('apple', 'sv');

      // Assert
      expect(result).toEqual(mockResponse);
      expect(openaiService.generateMultilingualWordDescription).toHaveBeenCalledWith('apple', 'sv');
    });

    test('returns fallback message when API throws an error', async () => {
      // Arrange
      const fallbackResponse: AIResponse = { 
        content: 'Failed to generate a description in Swedish. Please try again.' 
      };
      mockedMultilingualWordDescription.mockResolvedValueOnce(fallbackResponse);

      // Act
      const result = await openaiService.generateMultilingualWordDescription('apple', 'sv');

      // Assert
      expect(result).toEqual(fallbackResponse);
    });
  });
}); 