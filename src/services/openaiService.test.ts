import openaiService from './openaiService';
import { OpenAIServiceError } from './openaiService.types';
import descriptionCache from './cacheService';

// Mock cacheService
jest.mock('./cacheService', () => ({
  get: jest.fn(),
  add: jest.fn(),
  has: jest.fn(),
  clear: jest.fn()
}));

// Define types for mocked responses
interface MockResponse<T> {
  ok: boolean;
  status?: number;
  json: jest.Mock<Promise<T>>;
}

// Mock the global fetch function
global.fetch = jest.fn();

// Helper function to setup successful mock responses
const setupMockFetchSuccess = <T>(responseData: T): void => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: jest.fn().mockResolvedValueOnce(responseData)
  } as MockResponse<T>);
};

// Helper function to setup error mock responses
const setupMockFetchError = (status = 500, errorMessage = 'Server error'): void => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    status,
    json: jest.fn().mockResolvedValueOnce({ error: errorMessage })
  } as MockResponse<{ error: string }>);
};

// Access the private method type safely
type OpenAIServiceWithPrivateMethods = typeof openaiService & {
  _makeAPIRequest: (action: string, data: Record<string, unknown>) => Promise<unknown>;
};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

describe('openaiService', () => {
  describe('_makeAPIRequest', () => {
    test('makes a successful API request', async () => {
      const mockData = { content: 'Test content' };
      setupMockFetchSuccess(mockData);

      // Access the private method with type assertion
      const result = await (openaiService as OpenAIServiceWithPrivateMethods)._makeAPIRequest('testAction', { param: 'value' });
      
      expect(global.fetch).toHaveBeenCalledWith('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'testAction',
          param: 'value',
        }),
      });
      expect(result).toEqual(mockData);
    });

    test('handles API error responses', async () => {
      setupMockFetchError(400, 'Bad request');

      // Access the private method with type assertion
      await expect((openaiService as OpenAIServiceWithPrivateMethods)._makeAPIRequest('testAction', {}))
        .rejects
        .toThrow(OpenAIServiceError);
      
      expect(global.fetch).toHaveBeenCalled();
    });

    test('handles network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      // Access the private method with type assertion
      await expect((openaiService as OpenAIServiceWithPrivateMethods)._makeAPIRequest('testAction', {}))
        .rejects
        .toThrow(OpenAIServiceError);
    });
  });

  describe('generateWordDescription', () => {
    test('returns cached content when available', async () => {
      const cachedContent = 'Cached description';
      (descriptionCache.get as jest.Mock).mockReturnValueOnce(cachedContent);
      
      const result = await openaiService.generateWordDescription('test', 'English');
      
      expect(result).toBe(cachedContent);
      expect(descriptionCache.get).toHaveBeenCalledWith('test', 'English');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    test('forwards to generateMultilingualWordDescription when no cache', async () => {
      const mockContent = 'A description of the test word';
      (descriptionCache.get as jest.Mock).mockReturnValueOnce(null);
      setupMockFetchSuccess({ 
        content: mockContent,
        tokenUsage: { prompt: 10, completion: 5, total: 15 }
      });

      const result = await openaiService.generateWordDescription('test', 'English');
      
      expect(result).toBe(mockContent);
      expect(global.fetch).toHaveBeenCalledWith('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generateMultilingualWordDescription',
          word: 'test',
          language: 'en', // Should be mapped from 'English' to 'en'
        }),
      });
    });

    test('returns fallback message when API call fails', async () => {
      (descriptionCache.get as jest.Mock).mockReturnValueOnce(null);
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API error'));

      const result = await openaiService.generateWordDescription('test', 'English');
      
      expect(result).toBe('A common word in the English language.');
    });

    test('uses Swedish fallback message for Swedish language', async () => {
      (descriptionCache.get as jest.Mock).mockReturnValueOnce(null);
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API error'));

      const result = await openaiService.generateWordDescription('test', 'Swedish');
      
      expect(result).toBe('A common word in the Swedish language.');
    });
  });

  describe('generateMultilingualWordDescription', () => {
    test('returns cached content when available', async () => {
      const cachedContent = 'Cached multilingual description';
      (descriptionCache.get as jest.Mock).mockReturnValueOnce(cachedContent);
      
      const result = await openaiService.generateMultilingualWordDescription('test', 'English');
      
      expect(result.content).toBe(cachedContent);
      expect(descriptionCache.get).toHaveBeenCalledWith('test', 'English');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    test('makes API request with English language code when passed "English"', async () => {
      const mockContent = 'English description';
      (descriptionCache.get as jest.Mock).mockReturnValueOnce(null);
      setupMockFetchSuccess({ 
        content: mockContent,
        tokenUsage: { prompt: 10, completion: 5, total: 15 }
      });

      const result = await openaiService.generateMultilingualWordDescription('test', 'English');
      
      expect(result.content).toBe(mockContent);
      expect(global.fetch).toHaveBeenCalledWith('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generateMultilingualWordDescription',
          word: 'test',
          language: 'en', // Should map to API language code
        }),
      });
      expect(descriptionCache.add).toHaveBeenCalledWith('test', 'English', mockContent);
    });

    test('makes API request with Swedish language code when passed "Swedish"', async () => {
      const mockContent = 'Swedish description';
      (descriptionCache.get as jest.Mock).mockReturnValueOnce(null);
      setupMockFetchSuccess({ 
        content: mockContent,
        tokenUsage: { prompt: 10, completion: 5, total: 15 }
      });

      const result = await openaiService.generateMultilingualWordDescription('test', 'Swedish');
      
      expect(result.content).toBe(mockContent);
      expect(global.fetch).toHaveBeenCalledWith('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generateMultilingualWordDescription',
          word: 'test',
          language: 'sv', // Should map to API language code
        }),
      });
    });

    test('returns fallback message when API call fails', async () => {
      (descriptionCache.get as jest.Mock).mockReturnValueOnce(null);
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API error'));

      const result = await openaiService.generateMultilingualWordDescription('test', 'English');
      
      expect(result.content).toBe('Failed to generate a description in English. Please try again.');
    });
  });

  describe('generateHint', () => {
    test('returns hint from a successful API call with previous guesses', async () => {
      const mockContent = 'This is a hint';
      setupMockFetchSuccess({ content: mockContent });

      const result = await openaiService.generateHint('word', ['guess1', 'guess2']);
      
      expect(result).toBe(mockContent);
      expect(global.fetch).toHaveBeenCalledWith('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generateHint',
          word: 'word',
          previousGuesses: ['guess1', 'guess2'],
        }),
      });
    });

    test('handles empty previous guesses array', async () => {
      const mockContent = 'This is a hint';
      setupMockFetchSuccess({ content: mockContent });

      const result = await openaiService.generateHint('word');
      
      expect(result).toBe(mockContent);
      expect(global.fetch).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
        body: JSON.stringify({
          action: 'generateHint',
          word: 'word',
          previousGuesses: [],
        }),
      }));
    });

    test('returns fallback message when API call fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API error'));

      const result = await openaiService.generateHint('word');
      
      expect(result).toBe('This word has 4 letters.');
    });
  });

  describe('analyzeGuess', () => {
    test('returns analysis from a successful API call', async () => {
      const mockContent = 'Your guess is close!';
      setupMockFetchSuccess({ content: mockContent });

      const result = await openaiService.analyzeGuess('correct', 'guess');
      
      expect(result).toBe(mockContent);
      expect(global.fetch).toHaveBeenCalledWith('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'analyzeGuess',
          word: 'correct',
          playerGuess: 'guess',
        }),
      });
    });

    test('returns fallback message when API call fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API error'));

      const result = await openaiService.analyzeGuess('correct', 'guess');
      
      expect(result).toBe('Not correct. Try a different word.');
    });
  });

  describe('checkDefinitionMatch', () => {
    test('returns match result from a successful API call', async () => {
      setupMockFetchSuccess({ match: true });

      const result = await openaiService.checkDefinitionMatch('word', 'definition');
      
      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'checkDefinitionMatch',
          word: 'word',
          definition: 'definition',
        }),
      });
    });

    test('throws error when API call fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API error'));

      await expect(openaiService.checkDefinitionMatch('word', 'definition'))
        .rejects
        .toThrow(OpenAIServiceError);
    });
  });

  describe('generateSampleSentence', () => {
    test('returns content and token usage from a successful API call', async () => {
      const mockResponse = {
        content: 'This is a sample sentence.',
        tokenUsage: {
          prompt: 10,
          completion: 5,
          total: 15
        }
      };
      setupMockFetchSuccess(mockResponse);

      const result = await openaiService.generateSampleSentence('word');
      
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generateSampleSentence',
          word: 'word',
        }),
      });
    });

    test('throws error when API call fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API error'));

      await expect(openaiService.generateSampleSentence('word'))
        .rejects
        .toThrow(OpenAIServiceError);
    });
  });
}); 