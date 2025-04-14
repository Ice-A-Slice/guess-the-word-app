import React, { useState, useEffect } from 'react';
import { useGameWithWordSelection } from '@/hooks';
import GameControls from './GameControls';
import GuessForm from './GuessForm';
import ScoreAnimation from './ScoreAnimation';

const GameContainer: React.FC = () => {
  const game = useGameWithWordSelection();
  const [showSkipMessage, setShowSkipMessage] = useState(false);
  const [skippedWord, setSkippedWord] = useState<string | null>(null);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [lastScorePoints, setLastScorePoints] = useState(0);
  const [lastScoreDifficulty, setLastScoreDifficulty] = useState('');
  
  // Handler for correct guesses
  const handleCorrectGuess = (hintsUsed: number) => {
    if (!game.currentWord) return;
    
    // Calculate base points based on hints used (less hints = more points)
    const basePoints = Math.max(1, 3 - hintsUsed);
    
    // Add bonus points based on difficulty
    const difficultyBonus = {
      easy: 0,
      medium: 1,
      hard: 2,
      all: 0
    };
    
    // Get bonus for the word's difficulty
    const bonus = difficultyBonus[game.currentWord.difficulty] || 0;
    
    // Add streak bonus for 3+ consecutive correct guesses
    const streakBonus = game.currentStreak >= 2 ? Math.min(3, Math.floor(game.currentStreak / 2)) : 0;
    
    // Calculate total points
    const totalPoints = basePoints + bonus + streakBonus;
    
    // Show score animation
    setLastScorePoints(totalPoints);
    setLastScoreDifficulty(game.currentWord.difficulty);
    setShowScoreAnimation(true);
    
    // Hide animation after a few seconds
    setTimeout(() => {
      setShowScoreAnimation(false);
    }, 1500);
    
    // Pass both points and word to the action
    game.handleCorrectGuess(totalPoints, game.currentWord);
  };

  // Enhanced skip handler with visual feedback
  const handleSkipWord = () => {
    if (game.currentWord) {
      setSkippedWord(game.currentWord.word);
      setShowSkipMessage(true);
      
      // Hide message after a delay
      setTimeout(() => {
        setShowSkipMessage(false);
      }, 2000);
      
      // Skip the word
      game.handleSkipWord();
    }
  };
  
  // Clear skip message when current word changes
  useEffect(() => {
    setShowSkipMessage(false);
  }, [game.currentWord]);
  
  // Render the main game content based on game status
  const renderGameContent = () => {
    if (!game.currentWord) {
      return (
        <div className="text-center p-8 bg-gray-100 rounded-lg">
          <p className="text-gray-500">Loading words...</p>
        </div>
      );
    }
    
    return (
      <div className="w-full max-w-3xl mx-auto">
        {/* Score Animation */}
        {showScoreAnimation && (
          <ScoreAnimation 
            points={lastScorePoints} 
            difficulty={lastScoreDifficulty}
            hasStreak={game.currentStreak > 1}
            streakCount={game.currentStreak}
          />
        )}
        
        {/* Skip Feedback Message */}
        {showSkipMessage && skippedWord && (
          <div className="skip-feedback">
            <p>
              Skipped word: <span className="word">{skippedWord}</span>
            </p>
          </div>
        )}
        
        {/* Definition Display */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Definition:</h3>
          <p className="text-xl" data-testid="word-definition">
            {game.currentWord.definition}
          </p>
          
          {game.status === 'active' && (
            <div className="mt-4 text-sm text-gray-500">
              <p>Difficulty: <span className="font-medium">{game.currentWord.difficulty}</span></p>
            </div>
          )}
        </div>
        
        {/* Guess Form - only shown in active state */}
        {game.status === 'active' && (
          <GuessForm
            targetWord={game.currentWord}
            onCorrectGuess={handleCorrectGuess}
            hintsUsed={0} // To be implemented with hints feature
            disableInput={game.status !== 'active'}
          />
        )}
      </div>
    );
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Game Controls */}
      <GameControls onSkipWord={handleSkipWord} />
      
      {/* Only render game content if we're not in idle state */}
      {game.status !== 'idle' && renderGameContent()}
    </div>
  );
};

export default GameContainer; 