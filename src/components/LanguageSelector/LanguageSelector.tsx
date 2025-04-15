import React from 'react';
import { useGameContext, DescriptionLanguage } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';

export interface LanguageSelectorProps {
  className?: string;
  vertical?: boolean;
}

// Define available languages with corresponding labels
export const LANGUAGE_OPTIONS: { code: DescriptionLanguage; label: string }[] = [
  { code: 'English', label: 'English' },
  { code: 'Swedish', label: 'Svenska' }
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  className,
  vertical = false 
}) => {
  const { descriptionLanguage, setDescriptionLanguage } = useGameContext();

  return (
    <div className={`flex ${vertical ? 'flex-col space-y-2' : 'items-center space-x-2'} ${className || ''}`}>
      <span className="text-sm font-medium mr-2">Language:</span>
      <div className={`flex ${vertical ? 'flex-col space-y-1 w-full' : 'space-x-1'}`}>
        {LANGUAGE_OPTIONS.map((lang) => (
          <Button
            key={lang.code}
            variant={descriptionLanguage === lang.code ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDescriptionLanguage(lang.code)}
            aria-pressed={descriptionLanguage === lang.code}
            aria-label={`Select ${lang.label} language`}
            className={`${vertical ? 'w-full' : 'min-w-20'} ${descriptionLanguage === lang.code ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border-gray-300'}`}
          >
            {lang.label}
          </Button>
        ))}
      </div>
    </div>
  );
}; 