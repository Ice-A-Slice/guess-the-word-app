import React, { useState, useEffect } from 'react';

interface ScoreAnimationProps {
  points: number;
  difficulty: string;
  hasStreak: boolean;
  streakCount: number;
}

const ScoreAnimation: React.FC<ScoreAnimationProps> = ({ 
  points, 
  difficulty, 
  hasStreak,
  streakCount 
}) => {
  const [visible, setVisible] = useState(true);
  
  // Automatically hide the animation after 1.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!visible) return null;
  
  // Determine color based on difficulty
  const getColor = () => {
    switch(difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-blue-600';
      case 'hard': return 'text-purple-600';
      default: return 'text-gray-700';
    }
  };
  
  // Determine size based on points
  const getSize = () => {
    if (points >= 5) return 'text-3xl';
    if (points >= 3) return 'text-2xl';
    return 'text-xl';
  };

  // Icon based on difficulty
  const getIcon = () => {
    switch(difficulty) {
      case 'easy': return '🌱';
      case 'medium': return '🔥';
      case 'hard': return '⭐';
      default: return '✓';
    }
  };
  
  return (
    <div className="fixed top-1/4 inset-x-0 flex justify-center items-center z-50">
      <div className={`${getSize()} font-bold ${getColor()} animate-score-float`}>
        <span className="flex items-center justify-center whitespace-nowrap">
          <span className="mr-1">{getIcon()}</span>
          <span className="bg-white bg-opacity-95 px-3 py-1 rounded-full shadow-lg border border-gray-200">
            +{points} points!
            {hasStreak && (
              <span className="ml-2 text-orange-500 inline-flex items-center">
                🔥 <span className="ml-1 font-bold">{streakCount}x</span> streak
              </span>
            )}
          </span>
        </span>
      </div>
    </div>
  );
};

export default ScoreAnimation; 