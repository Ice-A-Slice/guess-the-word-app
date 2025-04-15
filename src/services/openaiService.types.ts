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

/**
 * Supported languages for word descriptions
 */
export type Language = 'en' | 'sv';

/**
 * Language names mapping
 */
export const LANGUAGE_NAMES: Record<Language, string> = {
  'en': 'English',
  'sv': 'Swedish'
};
