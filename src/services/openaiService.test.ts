import openaiService from './openaiService';
import { OpenAIServiceError } from './openaiService.types';

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
    test('returns content from a successful API call', async () => {
      const mockContent = 'A description of the test word';
      setupMockFetchSuccess({ content: mockContent });

      const result = await openaiService.generateWordDescription('test');
      
      expect(result).toBe(mockContent);
      expect(global.fetch).toHaveBeenCalledWith('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generateWordDescription',
          word: 'test',
        }),
      });
    });

    test('returns fallback message when API call fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API error'));

      const result = await openaiService.generateWordDescription('test');
      
      expect(result).toBe('A common word in the English language.');
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

  describe('generateMultilingualWordDescription', () => {
    test('returns content and token usage from a successful API call', async () => {
      const mockResponse = {
        content: 'Esta es una descripción en español.',
        tokenUsage: {
          prompt: 15,
          completion: 10,
          total: 25
        }
      };
      setupMockFetchSuccess(mockResponse);

      const result = await openaiService.generateMultilingualWordDescription('word', 'Spanish');
      
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generateMultilingualWordDescription',
          word: 'word',
          language: 'Spanish',
        }),
      });
    });

    test('throws error when API call fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API error'));

      await expect(openaiService.generateMultilingualWordDescription('word', 'French'))
        .rejects
        .toThrow(OpenAIServiceError);
    });
  });
}); 