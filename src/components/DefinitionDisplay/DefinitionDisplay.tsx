import React from 'react';

interface DefinitionDisplayProps {
  definition: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const DefinitionDisplay: React.FC<DefinitionDisplayProps> = ({ 
  definition, 
  difficulty 
}) => {
  const difficultyColor = 
    difficulty === 'easy' ? 'text-green-600' : 
    difficulty === 'medium' ? 'text-yellow-600' : 
    'text-red-600';

  const difficultyText = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  return (
    <section 
      className="w-full mb-10 text-center" 
      data-testid="definition-display"
      aria-labelledby="definition-heading"
    >
      <h2 
        className="text-2xl font-semibold mb-4" 
        id="definition-heading"
      >
        Definition:
      </h2>
      <div
        className="text-gray-700 text-xl mb-4 max-w-3xl mx-auto"
        role="region"
        aria-live="polite"
      >
        {definition}
      </div>
      <div 
        className="mt-2 text-md text-gray-500"
        aria-live="polite"
      >
        <span id="difficulty-label">Difficulty:</span>
        <span 
          className={`ml-2 font-medium ${difficultyColor}`}
          aria-labelledby="difficulty-label"
        >
          {difficultyText}
        </span>
      </div>
    </section>
  );
}; 