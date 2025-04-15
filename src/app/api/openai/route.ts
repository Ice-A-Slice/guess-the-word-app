import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client on the server side
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Enable for testing in browser-like environments
});

/**
 * Handler for generating word descriptions
 */
export async function POST(request: NextRequest) {
  try {
    const { action, word, previousGuesses, playerGuess, definition, language } = await request.json();
    
    // Different handlers based on the requested action
    switch (action) {
      case 'generateWordDescription':
        return handleGenerateWordDescription(word);
      case 'generateMultilingualWordDescription':
        return handleMultilingualWordDescription(word, language);
      case 'generateHint':
        return handleGenerateHint(word, previousGuesses);
      case 'analyzeGuess':
        return handleAnalyzeGuess(word, playerGuess);
      case 'checkDefinitionMatch':
        return handleCheckDefinitionMatch(word, definition);
      case 'generateSampleSentence':
        return handleGenerateSampleSentence(word);
      case 'generateMultilingualWordDescription':
        return handleMultilingualWordDescription(word, language);
      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

/**
 * Generate a description for a word
 */
async function handleGenerateWordDescription(word: string) {
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

    return NextResponse.json({
      content: response.choices[0]?.message?.content?.trim() || 
               `A word that refers to ${word}.`
    });
  } catch (error) {
    console.error('Error generating word description:', error);
    return NextResponse.json(
      { error: 'Failed to generate word description' },
      { status: 500 }
    );
  }
}

/**
 * Generate a multilingual description for a word
 */
async function handleMultilingualWordDescription(word: string, language: string = 'English') {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert linguist and game designer specializing in word games. 
Your task is to create engaging, concise descriptions of words for a guessing game that works across multiple languages.
You must ALWAYS follow these rules:
1. NEVER mention the word itself in your description
2. NEVER use words that share the same root or are derivatives of the target word
3. ALWAYS respond in ${language} only
4. Avoid obvious clues that would make guessing too easy
5. Focus on the word's meaning, usage context, and notable characteristics
6. Adjust difficulty based on word complexity - common words should have more nuanced descriptions
7. For abstract concepts, use relatable examples
8. For proper nouns or specialized terms, provide broader category information`
        },
        {
          role: 'user',
          content: `Create a challenging but fair description (2-3 sentences) for the word "${word}" to be used in a word-guessing game.

The description should:
- Give thoughtful hints about the word's meaning, usage, or characteristics
- Be understood by general audiences
- Balance difficulty (not too obvious, not impossible)
- Absolutely avoid using the word "${word}" or any direct derivatives
- Be written entirely in ${language}

Example of a good description for "book" in English might be: "This object contains many pages filled with text or images. People use it to gain knowledge or for entertainment, and it has existed for centuries in various forms."`
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    // Extract and return the generated content
    const generatedContent = response.choices[0]?.message?.content?.trim() || 
                            `A common term used in many contexts.`;
    
    // Quick validation to make sure the word isn't explicitly mentioned
    const contentLowerCase = generatedContent.toLowerCase();
    const wordLowerCase = word.toLowerCase();
    
    // If the word appears in the description, generate a generic fallback
    const finalContent = contentLowerCase.includes(wordLowerCase) 
      ? `This is something people encounter in everyday life. It has specific uses and characteristics that make it recognizable.`
      : generatedContent;
    
    return NextResponse.json({
      content: finalContent,
      language: language
    });
  } catch (error) {
    console.error('Error generating multilingual word description:', error);
    return NextResponse.json(
      { error: 'Failed to generate multilingual word description' },
      { status: 500 }
    );
  }
}

/**
 * Generate a hint for a word
 */
async function handleGenerateHint(word: string, previousGuesses: string[] = []) {
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

    return NextResponse.json({
      content: response.choices[0]?.message?.content?.trim() || 
               `Think about words that start with "${word[0]}".`
    });
  } catch (error) {
    console.error('Error generating hint:', error);
    return NextResponse.json(
      { error: 'Failed to generate hint' },
      { status: 500 }
    );
  }
}

/**
 * Analyze a player's guess
 */
async function handleAnalyzeGuess(correctWord: string, playerGuess: string) {
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

    return NextResponse.json({
      content: response.choices[0]?.message?.content?.trim() || 
               `That's not quite right. Keep trying!`
    });
  } catch (error) {
    console.error('Error analyzing guess:', error);
    return NextResponse.json(
      { error: 'Failed to analyze guess' },
      { status: 500 }
    );
  }
}

/**
 * Check if a definition matches a word
 */
async function handleCheckDefinitionMatch(word: string, definition: string) {
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
    return NextResponse.json({
      match: answer.includes('yes')
    });
  } catch (error) {
    console.error('Error checking definition match:', error);
    return NextResponse.json(
      { error: 'Failed to check definition match' },
      { status: 500 }
    );
  }
}

/**
 * Generate a sample sentence using the word
 */
async function handleGenerateSampleSentence(word: string) {
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
    
    return NextResponse.json({
      content: response.choices[0]?.message?.content?.trim() || 'No example generated',
      tokenUsage: {
        prompt: response.usage?.prompt_tokens || 0,
        completion: response.usage?.completion_tokens || 0,
        total: response.usage?.total_tokens || 0,
      }
    });
  } catch (error) {
    console.error('Error generating sample sentence:', error);
    return NextResponse.json(
      { error: 'Failed to generate sample sentence' },
      { status: 500 }
    );
  }
}

/**
 * Generate a word description in the specified language
 */
async function handleMultilingualWordDescription(word: string, language: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that generates concise, informative descriptions for words in ${language}. The descriptions should be natural and idiomatic in the target language.`
        },
        {
          role: 'user',
          content: `Generate a brief description (2-3 sentences) in ${language} for the word "${word}". The description should give hints about the word without explicitly stating it.`
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    return NextResponse.json({
      content: response.choices[0]?.message?.content?.trim() || 
               `A word that means ${word} in ${language}.`,
      tokenUsage: {
        prompt: response.usage?.prompt_tokens || 0,
        completion: response.usage?.completion_tokens || 0,
        total: response.usage?.total_tokens || 0,
      }
    });
  } catch (error) {
    console.error(`Error generating ${language} word description:`, error);
    return NextResponse.json(
      { error: `Failed to generate ${language} word description` },
      { status: 500 }
    );
  }
}
