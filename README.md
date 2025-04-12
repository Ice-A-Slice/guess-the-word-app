# Guess the Word

A vocabulary building game where players guess words based on their definitions.

## Project Overview

This project is a web-based vocabulary game where users are presented with word definitions and must guess the corresponding word. Unlike traditional dictionaries where users look up a word to find its meaning, this app reverses the process - showing the meaning first and challenging users to recall or deduce the word.

## Features

- **Definition-based Word Guessing** - See definitions and guess the matching word
- **Scoring System** - Earn points for correct guesses
- **Skip Option** - Skip difficult words without penalty
- **Multiple Attempts** - Try multiple guesses for each definition
- **Responsive Design** - Play seamlessly on any device

## Technologies Used

- **Next.js** - React framework with built-in server-side rendering
- **TypeScript** - For type safety
- **Tailwind CSS** - For responsive styling
- **Jest** - For unit testing

## Project Structure

```
src/
├── app/            # Next.js app router
├── components/     # Reusable UI components
├── contexts/       # React contexts for state management
├── hooks/          # Custom React hooks
├── services/       # API and external service integration
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
└── data/           # Static data (word definitions)
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/guess-the-word.git
   cd guess-the-word
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linting
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run tm:dev` - Run Task Master development server
- `npm run tm:list` - List tasks in Task Master
- `npm run tm:generate` - Generate task files
- `npm run tm:parse-prd` - Parse PRD document to generate tasks

## Accessibility

This project follows WCAG accessibility guidelines to ensure it's usable by everyone. Features include:

- Semantic HTML
- ARIA attributes
- Keyboard navigation
- Screen reader support
- Proper color contrast
- Focus management

## Development Workflow

1. Select a feature to work on
2. Create a branch with a descriptive name
3. Implement the feature with tests
4. Submit a pull request
5. After code review, merge into the main branch

## License

MIT
