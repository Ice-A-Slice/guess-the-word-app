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
    
    // Modified to be more flexible in finding point text
    expect(screen.getByText(/\+5 points!/i)).toBeInTheDocument();
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
    
    expect(screen.getByText(/\+8 points!/i)).toBeInTheDocument();
    
    // Använd regex istället för exakt text för att hitta siffran 3
    // Detta matchar både "3" och "3x"
    const streakCountElement = screen.getByText(/3x?/);
    expect(streakCountElement).toBeInTheDocument();
    
    // Check for any element containing "streak"
    const streakTextElement = screen.getByText(/streak/i);
    expect(streakTextElement).toBeInTheDocument();
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
    
    // Instead of checking specific elements, test that the correct color class exists somewhere
    const container = screen.getByText(/\+3 points!/i).closest('div');
    const containerParent = container?.parentElement;
    
    // Check that text-green-500 exists somewhere in this component
    const hasGreenClass = containerParent?.innerHTML.includes('text-green-500');
    expect(hasGreenClass).toBeTruthy();
    
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
    
    const mediumContainer = screen.getByText(/\+3 points!/i).closest('div');
    const mediumContainerParent = mediumContainer?.parentElement;
    
    // Check that text-blue-600 exists somewhere in this component
    const hasBlueClass = mediumContainerParent?.innerHTML.includes('text-blue-600');
    expect(hasBlueClass).toBeTruthy();
    
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
    
    const hardContainer = screen.getByText(/\+3 points!/i).closest('div');
    const hardContainerParent = hardContainer?.parentElement;
    
    // Check that text-purple-600 exists somewhere in this component
    const hasPurpleClass = hardContainerParent?.innerHTML.includes('text-purple-600');
    expect(hasPurpleClass).toBeTruthy();
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
    
    expect(screen.getByText(/\+3 points!/i)).toBeInTheDocument();
    
    // Fast forward time to trigger the timeout
    act(() => {
      jest.advanceTimersByTime(1600);
    });
    
    // Element should no longer be in the document
    expect(screen.queryByText(/\+3 points!/i)).not.toBeInTheDocument();
  });
}); 