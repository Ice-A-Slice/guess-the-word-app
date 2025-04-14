import React from 'react';
import { render, screen, act, RenderResult } from '@testing-library/react';
import ScoreAnimation from './ScoreAnimation';

// Mock setTimeout
jest.useFakeTimers();

describe('ScoreAnimation', () => {
  // Vi behöver ta hand om alla setTimeout i komponenten
  afterEach(() => {
    act(() => {
      jest.runAllTimers();
    });
  });

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
    
    expect(screen.getByText("+5 points!")).toBeInTheDocument();
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
    
    expect(screen.getByText("+8 points!")).toBeInTheDocument();
    
    // Fix: Use a function to find text that matches part of the content
    const streakElement = screen.getByText((content, element) => {
      return element.textContent === "3x";
    });
    expect(streakElement).toBeInTheDocument();
    
    // Fix: Use getAllByText and just check that at least one element has streak text
    const streakElements = screen.getAllByText((content, element) => {
      return element.textContent?.includes('streak') || false;
    });
    expect(streakElements.length).toBeGreaterThan(0);
  });
  
  test('uses different colors based on difficulty', () => {
    let rerender: RenderResult['rerender'];
    
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
    
    // Fix: Access the inner div that has the color class directly
    const colorDiv = screen.getByText("+3 points!").parentElement?.parentElement;
    expect(colorDiv).toHaveClass('text-green-500');
    
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
    
    const mediumColorDiv = screen.getByText("+3 points!").parentElement?.parentElement;
    expect(mediumColorDiv).toHaveClass('text-blue-600');
    
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
    
    const hardColorDiv = screen.getByText("+3 points!").parentElement?.parentElement;
    expect(hardColorDiv).toHaveClass('text-purple-600');
  });

  test('disappears after timeout', () => {
    act(() => {
      render(
        <ScoreAnimation 
          points={3} 
          difficulty="easy" 
          hasStreak={false}
          streakCount={0}
        />
      );
    });
    
    expect(screen.getByText("+3 points!")).toBeInTheDocument();
    
    // Fast forward time to trigger the timeout
    act(() => {
      jest.advanceTimersByTime(1600);
    });
    
    // Element should no longer be in the document
    expect(screen.queryByText("+3 points!")).not.toBeInTheDocument();
  });
}); 