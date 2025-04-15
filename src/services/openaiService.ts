import OpenAI from 'openai';

/**
 * Custom error class for OpenAI service errors
 */
export class OpenAIServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OpenAIServiceError';
  }
}

/**
 * Interface for AI response
 */
export interface AIResponse {
  content: string;
  tokenUsage?: {
    prompt: number;
    completion: number;
    total: number;
  };
}

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

/**
 * Service for OpenAI-related operations
 */
const openaiService = {
  /**
   * Generate a description for a word using OpenAI
   * @param word - The word to generate a description for
   * @returns Promise containing the generated description
   */
  generateWordDescription: async (word: string): Promise<string> => {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates concise, informative, and engaging descriptions for words in a word-guessing game. The descriptions should provide clues without making the answer too obvious.'
          },
          {
            role: 'user',
            content: `Generate a brief description (2-3 sentences) for the word "${word}" that could be used in a word-guessing game. The description should give hints about the word without explicitly stating it.`
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content?.trim() || 
             `A word that refers to ${word}.`;
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
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an assistant for a word-guessing game. You provide helpful hints without giving away the answer completely.'
          },
          {
            role: 'user',
            content: `The word is "${word}". The player has made these guesses: ${previousGuesses.join(', ')}. Give a subtle hint that helps them get closer to the answer without making it too obvious.`
          }
        ],
        max_tokens: 100,
        temperature: 0.6,
      });

      return response.choices[0]?.message?.content?.trim() || 
             `Think about words that start with "${word[0]}".`;
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
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an assistant for a word-guessing game. You provide feedback on a player\'s guess compared to the correct word.'
          },
          {
            role: 'user',
            content: `The correct word is "${correctWord}" and the player guessed "${playerGuess}". Provide brief feedback (1-2 sentences) on how close they are, without revealing the answer.`
          }
        ],
        max_tokens: 100,
        temperature: 0.5,
      });

      return response.choices[0]?.message?.content?.trim() || 
             `That's not quite right. Keep trying!`;
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
  checkDefinitionMatch: async (
    word: string,
    definition: string
  ): Promise<boolean> => {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a judge for a word guessing game. Your task is to determine if a definition accurately describes a word.'
          },
          {
            role: 'user',
            content: `Word: ${word}\nDefinition: ${definition}\n\nDoes this definition accurately describe the word? Answer only with 'yes' or 'no'.`
          }
        ],
        max_tokens: 10,
        temperature: 0.3,
      });
      
      const answer = response.choices[0]?.message?.content?.trim().toLowerCase() || '';
      return answer.includes('yes');
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
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant for a word learning game. Your task is to create natural, useful example sentences.'
          },
          {
            role: 'user',
            content: `Generate a sample sentence using the word "${word}". The sentence should be natural, demonstrate proper usage, and help understand the word's meaning.`
          }
        ],
        max_tokens: 100,
      });
      
      return {
        content: response.choices[0]?.message?.content?.trim() || 'No example generated',
        tokenUsage: {
          prompt: response.usage?.prompt_tokens || 0,
          completion: response.usage?.completion_tokens || 0,
          total: response.usage?.total_tokens || 0,
        }
      };
    } catch (error) {
      console.error('Error generating sample sentence:', error);
      throw new OpenAIServiceError(
        error instanceof Error 
          ? `Failed to generate sample: ${error.message}` 
          : 'Failed to generate sample'
      );
    }
  }
};

export default openaiService; 