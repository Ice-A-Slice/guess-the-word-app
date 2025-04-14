import React from 'react';

interface DefinitionDisplayProps {
  definition: string;
  difficulty: 'easy' | 'medium' | 'hard';
  animate?: boolean;
}

export const DefinitionDisplay: React.FC<DefinitionDisplayProps> = ({ 
  definition, 
  difficulty,
  animate = false
}) => {
  // Colors based on difficulty
  const difficultyColor = 
    difficulty === 'easy' ? 'text-green-600 border-green-200 bg-green-50' : 
    difficulty === 'medium' ? 'text-blue-600 border-blue-200 bg-blue-50' : 
    'text-purple-600 border-purple-200 bg-purple-50';
    
  // Icons based on difficulty
  const difficultyIcon = 
    difficulty === 'easy' ? '🌱' : 
    difficulty === 'medium' ? '🔥' : 
    '⭐';

  const difficultyText = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  
  // Animation class based on prop
  const animationClass = animate ? 'animate-scale-in' : '';

  return (
    <section 
      className={`w-full mb-10 ${animationClass}`} 
      data-testid="definition-display"
      aria-labelledby="definition-heading"
    >
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h2 
          className="text-2xl font-semibold mb-4 text-gray-800 flex items-center justify-center" 
          id="definition-heading"
        >
          <span className="mr-2">📝</span>
          Definition
        </h2>
        <div
          className="text-gray-700 text-xl mb-6 max-w-3xl mx-auto p-5 bg-gray-50 rounded-lg border border-gray-200 shadow-inner"
          role="region"
          aria-live="polite"
        >
          &ldquo;{definition}&rdquo;
        </div>
        <div 
          className={`mt-2 px-3 py-1 rounded-md inline-flex items-center ${difficultyColor}`}
          aria-live="polite"
        >
          <span id="difficulty-label" className="text-gray-700 mr-2">Difficulty:</span>
          <span 
            className="font-medium flex items-center"
            aria-labelledby="difficulty-label"
          >
            <span className="mr-1">{difficultyIcon}</span>
            {difficultyText}
          </span>
        </div>
      </div>
    </section>
  );
};