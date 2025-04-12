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
    <div className="mb-8 text-center" data-testid="definition-display">
      <h2 
        className="text-xl font-semibold mb-2" 
        id="definition-label"
      >
        Definition:
      </h2>
      <p 
        className="text-gray-700 text-lg"
        aria-labelledby="definition-label"
      >
        {definition}
      </p>
      <div className="mt-2 text-sm text-gray-500">
        Difficulty: 
        <span 
          className={`ml-1 font-medium ${difficultyColor}`}
          aria-label={`Difficulty level: ${difficultyText}`}
        >
          {difficultyText}
        </span>
      </div>
    </div>
  );
}; 