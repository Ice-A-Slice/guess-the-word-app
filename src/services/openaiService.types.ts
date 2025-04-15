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
 * Supported languages for API requests
 * These are the internal API codes, not the display names
 */
export type Language = 'en' | 'sv';

/**
 * Human-readable language names
 */
export const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  sv: 'Swedish'
};
