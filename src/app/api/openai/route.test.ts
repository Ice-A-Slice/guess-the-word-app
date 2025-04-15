import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Mock Next.js modules
jest.mock('next/server', () => {
  const originalModule = jest.requireActual('next/server');
  return {
    ...originalModule,
    NextResponse: {
      json: jest.fn((data, options) => {
        return {
          status: options?.status || 200,
          json: async () => data
        };
      })
    }
  };
});

// Mock the OpenAI module
jest.mock('openai', () => {
  const mockCreateMethod = jest.fn();
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCreateMethod
      }
    }
  }));
});

// Import the route handler after mocking dependencies
const { POST } = jest.requireActual('./route');

// Get reference to the mocked OpenAI create method for assertions
type MockedOpenAI = {
  chat: {
    completions: {
      create: jest.Mock;
    }
  }
};
const mockCreateMethod = (new OpenAI() as unknown as MockedOpenAI).chat.completions.create;

// Set up test environment
beforeAll(() => {
  process.env.OPENAI_API_KEY = 'fake-api-key';
});

beforeEach(() => {
  jest.clearAllMocks();
  (NextResponse.json as jest.Mock).mockClear();
});

// Helper function to create a mock request
const createMockRequest = (body: Record<string, unknown>): NextRequest => {
  return {
    json: jest.fn().mockResolvedValue(body)
  } as unknown as NextRequest;
};

describe('OpenAI API Route', () => {
  describe('POST handler', () => {
    test('returns 400 for invalid action', async () => {
      const req = createMockRequest({ action: 'invalidAction' });
      await POST(req);
      
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Invalid action specified' },
        { status: 400 }
      );
    });

    test('handles request parsing errors', async () => {
      const req = {
        json: jest.fn().mockRejectedValue(new Error('Parse error'))
      } as unknown as NextRequest;
      
      await POST(req);
      
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Failed to process request' },
        { status: 500 }
      );
    });
  });

  describe('handleGenerateWordDescription', () => {
    test('successfully generates a word description', async () => {
      mockCreateMethod.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: 'A descriptive text for the test word.'
            }
          }
        ]
      });

      const req = createMockRequest({ 
        action: 'generateWordDescription', 
        word: 'test' 
      });
      
      await POST(req);
      
      expect(NextResponse.json).toHaveBeenCalledWith({
        content: 'A descriptive text for the test word.'
      });
      
      expect(mockCreateMethod).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-4',
          messages: expect.arrayContaining([
            expect.objectContaining({
              content: expect.stringContaining('test')
            })
          ])
        })
      );
    });

    test('handles OpenAI errors', async () => {
      mockCreateMethod.mockRejectedValueOnce(new Error('API Error'));
      
      const req = createMockRequest({ 
        action: 'generateWordDescription', 
        word: 'test' 
      });
      
      await POST(req);
      
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Failed to generate word description' },
        { status: 500 }
      );
    });
  });

  describe('handleGenerateHint', () => {
    test('generates a hint with previous guesses', async () => {
      mockCreateMethod.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: 'This is a hint for the word.'
            }
          }
        ]
      });

      const req = createMockRequest({ 
        action: 'generateHint', 
        word: 'test',
        previousGuesses: ['guess1', 'guess2']
      });
      
      await POST(req);
      
      expect(NextResponse.json).toHaveBeenCalledWith({
        content: 'This is a hint for the word.'
      });
    });
  });

  describe('handleMultilingualWordDescription', () => {
    test('generates a multilingual description', async () => {
      mockCreateMethod.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: 'Esta es una descripción en español.'
            }
          }
        ],
        usage: {
          prompt_tokens: 25,
          completion_tokens: 8,
          total_tokens: 33
        }
      });

      const req = createMockRequest({ 
        action: 'generateMultilingualWordDescription', 
        word: 'test',
        language: 'Spanish'
      });
      
      await POST(req);
      
      expect(NextResponse.json).toHaveBeenCalledWith({
        content: 'Esta es una descripción en español.',
        tokenUsage: {
          prompt: 25,
          completion: 8,
          total: 33
        }
      });
    });
  });
}); 