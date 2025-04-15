# Prompt Engineering Documentation

## Multilingual Word Description Prompts

### Design Goals
- Generate high-quality word descriptions in multiple languages (currently English and Swedish)
- Prevent explicit mentions of the target word in descriptions
- Ensure appropriate difficulty level for a word-guessing game
- Create consistent format and quality regardless of language
- Handle diverse word types (concrete, abstract, etc.) appropriately

### System Prompt Design
The system prompt establishes the AI's role and core guidelines:

```
You are an expert linguist and game designer specializing in word games. 
Your task is to create engaging, concise descriptions of words for a guessing game that works across multiple languages.
You must ALWAYS follow these rules:
1. NEVER mention the word itself in your description
2. NEVER use words that share the same root or are derivatives of the target word
3. ALWAYS respond in ${language} only
4. Avoid obvious clues that would make guessing too easy
5. Focus on the word's meaning, usage context, and notable characteristics
6. Adjust difficulty based on word complexity - common words should have more nuanced descriptions
7. For abstract concepts, use relatable examples
8. For proper nouns or specialized terms, provide broader category information
```

**Key Design Decisions:**
1. **Expert Role**: Positioning the AI as an expert linguist and game designer establishes authority and sets expectations for high-quality output.
2. **Numbered Rules**: Clear, prioritized instructions help the model follow critical constraints.
3. **Word Avoidance Rules**: Explicit instructions to avoid the target word and its derivatives (rules 1-2) prevent obvious clues.
4. **Language Specification**: The rule to respond only in the target language (rule 3) ensures proper localization.
5. **Difficulty Calibration**: Instructions to adjust difficulty based on word complexity (rule 6) creates a better game experience.
6. **Word Type Handling**: Special instructions for abstract concepts and specialized terms (rules 7-8) ensure consistent quality across different word types.

### User Prompt Design
The user prompt provides specific instructions for the current request:

```
Create a challenging but fair description (2-3 sentences) for the word "${word}" to be used in a word-guessing game.

The description should:
- Give thoughtful hints about the word's meaning, usage, or characteristics
- Be understood by general audiences
- Balance difficulty (not too obvious, not impossible)
- Absolutely avoid using the word "${word}" or any direct derivatives
- Be written entirely in ${language}

Example of a good description for "book" in English might be: "This object contains many pages filled with text or images. People use it to gain knowledge or for entertainment, and it has existed for centuries in various forms."
```

**Key Design Decisions:**
1. **Structured Format**: Bulleted list makes requirements clear and scannable.
2. **Concrete Example**: Example description demonstrates the expected output format and quality.
3. **Audience Consideration**: Specifying "general audiences" ensures accessible descriptions.
4. **Difficulty Balance**: Explicit instruction about balancing difficulty guides the model to create fair challenges.
5. **Repetition of Critical Rules**: Reiterating the rule about avoiding the target word reinforces this critical constraint.

### Safeguards
To ensure the system performs reliably, we added post-processing checks:

```javascript
// Quick validation to make sure the word isn't explicitly mentioned
const contentLowerCase = generatedContent.toLowerCase();
const wordLowerCase = word.toLowerCase();

// If the word appears in the description, generate a generic fallback
const finalContent = contentLowerCase.includes(wordLowerCase) 
  ? `This is something people encounter in everyday life. It has specific uses and characteristics that make it recognizable.`
  : generatedContent;
```

**Key Design Decisions:**
1. **Double-Check Validation**: Even with clear instructions, we verify compliance with the most critical rule.
2. **Generic Fallback**: If the target word appears despite instructions, we use a generic description as fallback.
3. **Case Insensitivity**: Converting to lowercase ensures we catch mentions regardless of capitalization.

### Performance Considerations
- Using GPT-4o for optimal quality across languages
- Limiting response to 150 tokens to keep descriptions concise
- Temperature of 0.7 balances creativity with consistency

## Future Improvements
- Add support for more languages
- Create difficulty levels (easy, medium, hard) through prompt adjustments
- Develop more specific prompts for different word categories
- Add semantic checking to detect synonyms or closely related terms to the target word 