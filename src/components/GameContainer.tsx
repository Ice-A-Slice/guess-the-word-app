import React, { useState, useEffect } from 'react';
import { useGameWithWordSelection } from '@/hooks';
import GameControls from './GameControls';
import GuessForm from './GuessForm';
import ScoreAnimation from './ScoreAnimation';
import { FeedbackMessage } from './FeedbackMessage';
import { DefinitionDisplay } from './DefinitionDisplay/DefinitionDisplay';
import { SessionSummary } from './index';

const GameContainer: React.FC = () => {
  const game = useGameWithWordSelection();
  const [showSkipMessage, setShowSkipMessage] = useState(false);
  const [skippedWord, setSkippedWord] = useState<string | null>(null);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [lastScorePoints, setLastScorePoints] = useState(0);
  const [lastScoreDifficulty, setLastScoreDifficulty] = useState('');
  const [wordTransition, setWordTransition] = useState(false);
  
  // Handler for correct guesses
  const handleCorrectGuess = (hintsUsed: number) => {
    if (!game.currentWord) return;
    
    // Trigger word transition animation
    setWordTransition(true);
    
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
    
    // Reset word transition after a delay
    setTimeout(() => {
      setWordTransition(false);
    }, 300);
    
    // Pass both points and word to the action
    game.handleCorrectGuess(totalPoints, game.currentWord);
  };

  // Enhanced skip handler with visual feedback
  const handleSkipWord = () => {
    if (game.currentWord) {
      // Trigger word transition animation
      setWordTransition(true);
      
      setSkippedWord(game.currentWord.word);
      setShowSkipMessage(true);
      
      // Hide message after a delay
      setTimeout(() => {
        setShowSkipMessage(false);
      }, 2000);
      
      // Reset word transition after a delay
      setTimeout(() => {
        setWordTransition(false);
      }, 300);
      
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
    if (game.status === 'completed') {
      return (
        <SessionSummary 
          onStartNewGame={() => {
            game.resetGame();
            game.startGame();
          }}
        />
      );
    }
    
    if (!game.currentWord) {
      return (
        <div className="text-center p-8 bg-gray-100 rounded-lg animate-pulse-gentle">
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
          <div className="w-full mb-4 animate-slide-in-right">
            <FeedbackMessage
              type="info"
              message={`Skipped word: "${skippedWord}"`}
              id="skip-feedback"
            />
          </div>
        )}
        
        {/* Definition Display */}
        <div className={`transition-all duration-300 ${wordTransition ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <DefinitionDisplay 
            definition={game.currentWord.definition}
            difficulty={game.currentWord.difficulty}
            animate={!wordTransition}
          />
        </div>
        
        {/* Guess Form - only shown in active state */}
        {game.status === 'active' && (
          <div className={`transition-all duration-300 ${wordTransition ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <GuessForm
              targetWord={game.currentWord}
              onCorrectGuess={handleCorrectGuess}
              hintsUsed={0} // To be implemented with hints feature
              disableInput={game.status !== 'active'}
            />
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Game Controls - only show if game is active or paused */}
      {(game.status === 'active' || game.status === 'paused') && (
        <GameControls 
          onSkipWord={handleSkipWord} 
          onEndGame={() => game.endGame()}
        />
      )}
      
      {/* Only render game content if we're not in idle state */}
      {game.status !== 'idle' && renderGameContent()}
      
      {/* Show start game button in idle state */}
      {game.status === 'idle' && (
        <div className="text-center py-10">
          <button
            onClick={() => game.startGame()}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Start Game
          </button>
        </div>
      )}
    </div>
  );
};

export default GameContainer; 