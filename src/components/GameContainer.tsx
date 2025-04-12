import React from 'react';
import { useGameWithWordSelection } from '@/hooks';
import { wordService } from '@/services';
import GameControls from './GameControls';
import GuessForm from './GuessForm';

const GameContainer: React.FC = () => {
  const game = useGameWithWordSelection();
  
  // Handler for correct guesses
  const handleCorrectGuess = (hintsUsed: number) => {
    // Calculate points based on hints used (less hints = more points)
    const points = Math.max(1, 3 - hintsUsed);
    game.handleCorrectGuess(points);
  };
  
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
      <GameControls />
      
      {/* Only render game content if we're not in idle state */}
      {game.status !== 'idle' && renderGameContent()}
    </div>
  );
};

export default GameContainer; 