import { AIResponse, OpenAIServiceError, Language, LANGUAGE_NAMES } from './openaiService.types';

// OpenAI client declaration is not needed here since we're using API routes

/**
 * Custom error class for OpenAI service errors
 */


/**
 * Service for OpenAI-related operations via API routes
 */
const openaiService = {
  /**
   * Make a request to the OpenAI API route
   */
  _makeAPIRequest: async (action: string, data: Record<string, unknown>) => {
    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          ...data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new OpenAIServiceError(
          errorData.error || `API request failed with status ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`Error in ${action}:`, error);
      throw error instanceof OpenAIServiceError
        ? error
        : new OpenAIServiceError(
            error instanceof Error
              ? error.message
              : 'An unknown error occurred'
          );
    }
  },

  /**
   * Generate a description for a word using OpenAI
   * @param word - The word to generate a description for
   * @returns Promise containing the generated description
   */
  generateWordDescription: async (word: string): Promise<string> => {
    try {
      const result = await openaiService._makeAPIRequest('generateWordDescription', { word });
      return result.content;
    } catch (error) {
      console.error('Error generating word description:', error);
      return `A common word in the English language.`;
    }
  },

  /**
   * Generate a hint for a word using OpenAI
   * @param word - The word the player is trying to guess
   * @param previousGuesses - Array of previous guesses made by the player
   * @returns Promise containing the generated hint
   */
  generateHint: async (word: string, previousGuesses: string[] = []): Promise<string> => {
    try {
      const result = await openaiService._makeAPIRequest('generateHint', { word, previousGuesses });
      return result.content;
    } catch (error) {
      console.error('Error generating hint:', error);
      return `This word has ${word.length} letters.`;
    }
  },

  /**
   * Analyze a player's guess and give feedback using OpenAI
   * @param correctWord - The word the player is trying to guess
   * @param playerGuess - The player's guess
   * @returns Promise containing detailed feedback
   */
  analyzeGuess: async (correctWord: string, playerGuess: string): Promise<string> => {
    try {
      const result = await openaiService._makeAPIRequest('analyzeGuess', { 
        word: correctWord, 
        playerGuess 
      });
      return result.content;
    } catch (error) {
      console.error('Error analyzing guess:', error);
      return `Not correct. Try a different word.`;
    }
  },

  /**
   * Check if a guessed definition matches a word
   * 
   * @param word - The target word
   * @param definition - The guessed definition
   * @returns A promise that resolves to a boolean
   */
  checkDefinitionMatch: async (word: string, definition: string): Promise<boolean> => {
    try {
      const result = await openaiService._makeAPIRequest('checkDefinitionMatch', { 
        word, 
        definition 
      });
      return result.match;
    } catch (error) {
      console.error('Error checking definition match:', error);
      throw new OpenAIServiceError(
        error instanceof Error 
          ? `Failed to check definition: ${error.message}` 
          : 'Failed to check definition'
      );
    }
  },

  /**
   * Generate a sample sentence using the word
   * 
   * @param word - The word to use in a sentence
   * @returns A promise that resolves to an AIResponse
   */
  generateSampleSentence: async (word: string): Promise<AIResponse> => {
    try {
      const result = await openaiService._makeAPIRequest('generateSampleSentence', { word });
      return {
        content: result.content,
        tokenUsage: result.tokenUsage
      };
    } catch (error) {
      console.error('Error generating sample sentence:', error);
      throw new OpenAIServiceError(
        error instanceof Error 
          ? `Failed to generate sample: ${error.message}` 
          : 'Failed to generate sample'
      );
    }
  },

  /**
   * Generate a multilingual description for a word
   * @param word The word to generate a description for
   * @param language The target language for the description
   * @returns A description of the word in the specified language
   */
  generateMultilingualWordDescription: async (word: string, language: Language): Promise<AIResponse> => {
    try {
      return await openaiService._makeAPIRequest('generateMultilingualWordDescription', {
        word,
        language,
      });
    } catch (error) {
      console.error('Error generating multilingual word description:', error);
      return { content: `Failed to generate a description in ${LANGUAGE_NAMES[language]}. Please try again.` };
    }
  }
};

export default openaiService; 