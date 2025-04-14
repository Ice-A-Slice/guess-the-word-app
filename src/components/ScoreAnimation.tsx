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
  
  return (
    <div className="score-animation">
      <div className={`text-xl font-bold ${getColor()} animate-score-float`}>
        +{points} points!
        {hasStreak && (
          <span className="ml-1 text-orange-500">
            🔥 {streakCount} streak
          </span>
        )}
      </div>
    </div>
  );
};

export default ScoreAnimation; 