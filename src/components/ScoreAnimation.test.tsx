import React from 'react';
import { render, screen, act } from '@testing-library/react';
import ScoreAnimation from './ScoreAnimation';

describe('ScoreAnimation', () => {
  test('renders score animation with points', () => {
    act(() => {
      render(
        <ScoreAnimation 
          points={5} 
          difficulty="medium" 
          hasStreak={false}
          streakCount={0}
        />
      );
    });
    
    expect(screen.getByText('+5 points!')).toBeInTheDocument();
  });
  
  test('renders score animation with streak information', () => {
    act(() => {
      render(
        <ScoreAnimation 
          points={8} 
          difficulty="hard" 
          hasStreak={true}
          streakCount={3}
        />
      );
    });
    
    expect(screen.getByText('+8 points!')).toBeInTheDocument();
    expect(screen.getByText('🔥 3 streak')).toBeInTheDocument();
  });
  
  test('uses different colors based on difficulty', () => {
    let rerender;
    
    act(() => {
      const result = render(
        <ScoreAnimation 
          points={3} 
          difficulty="easy" 
          hasStreak={false}
          streakCount={0}
        />
      );
      rerender = result.rerender;
    });
    
    // Easy difficulty should have green text
    expect(screen.getByText('+3 points!').className).toContain('text-green-500');
    
    // Rerender with medium difficulty
    act(() => {
      rerender(
        <ScoreAnimation 
          points={3} 
          difficulty="medium" 
          hasStreak={false}
          streakCount={0}
        />
      );
    });
    
    // Medium difficulty should have blue text
    expect(screen.getByText('+3 points!').className).toContain('text-blue-600');
    
    // Rerender with hard difficulty
    act(() => {
      rerender(
        <ScoreAnimation 
          points={3} 
          difficulty="hard" 
          hasStreak={false}
          streakCount={0}
        />
      );
    });
    
    // Hard difficulty should have purple text
    expect(screen.getByText('+3 points!').className).toContain('text-purple-600');
  });
}); 