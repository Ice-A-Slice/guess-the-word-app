import React from 'react';

interface DefinitionDisplayProps {
  definition: string;
  difficulty: 'easy' | 'medium' | 'hard';
  animate?: boolean;
  description?: string;  // OpenAI generated description
  isDescriptionLoading?: boolean;  // Loading state for description
  descriptionLanguage?: string;  // Current language
}

export const DefinitionDisplay: React.FC<DefinitionDisplayProps> = ({ 
  definition, 
  difficulty,
  animate = false,
  description,
  isDescriptionLoading = false,
  descriptionLanguage = 'English'
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

  // Language flag emoji
  const languageFlag = descriptionLanguage === 'English' ? '🇬🇧' : '🇸🇪';
  const languageLabel = descriptionLanguage === 'English' ? 'English' : 'Svenska';

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

        {/* AI-Generated Description Section */}
        {(description || isDescriptionLoading) && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800 flex items-center justify-center">
              <span className="mr-2">🤖</span>
              <span>AI Description</span>
              <span className="ml-2 text-sm flex items-center">
                <span className="mr-1">{languageFlag}</span>
                <span className="text-gray-600">({languageLabel})</span>
              </span>
            </h3>
            
            <div
              className="text-gray-700 text-lg mb-4 max-w-3xl mx-auto p-5 bg-blue-50 rounded-lg border border-blue-200 shadow-inner relative min-h-[80px]"
              role="region"
              aria-live="polite"
            >
              {isDescriptionLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : description ? (
                <p>&ldquo;{description}&rdquo;</p>
              ) : (
                <p className="text-gray-500 italic">No description available</p>
              )}
            </div>
          </div>
        )}

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