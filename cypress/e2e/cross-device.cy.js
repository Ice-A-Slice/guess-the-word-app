/**
 * Cross-device testing for Word Guessing Game
 * These tests verify functionality across different viewports and input methods
 */

describe('Word Guessing Game - Cross-Device Tests', () => {
  // Define viewports to test
  const viewports = [
    { width: 375, height: 667, device: 'mobile' },
    { width: 768, height: 1024, device: 'tablet' },
    { width: 1280, height: 800, device: 'desktop' }
  ];
  
  beforeEach(() => {
    // Mock the API or use test data to ensure consistent results
    cy.intercept('GET', '/api/words', { fixture: 'test-words.json' }).as('getWords');
    cy.visit('/');
    cy.wait('@getWords');
  });
  
  // Test input field and submit button on all viewports
  viewports.forEach(viewport => {
    it(`renders input and submit correctly on ${viewport.device}`, () => {
      cy.viewport(viewport.width, viewport.height);
      cy.get('[data-testid="guess-input"]').should('be.visible');
      cy.get('[data-testid="submit-guess"]').should('be.visible');
    });
    
    it(`handles basic input correctly on ${viewport.device}`, () => {
      cy.viewport(viewport.width, viewport.height);
      cy.get('[data-testid="guess-input"]').type('example');
      cy.get('[data-testid="submit-guess"]').click();
      cy.get('[data-testid="guess-feedback"]').should('be.visible');
    });
  });
  
  // Test edge cases on different viewports
  describe('Edge Case Handling', () => {
    viewports.forEach(viewport => {
      it(`handles empty input correctly on ${viewport.device}`, () => {
        cy.viewport(viewport.width, viewport.height);
        cy.get('[data-testid="submit-guess"]').should('be.disabled');
        cy.get('[data-testid="guess-input"]').type(' ');
        cy.get('[data-testid="submit-guess"]').should('be.disabled');
      });
      
      it(`handles special characters correctly on ${viewport.device}`, () => {
        cy.viewport(viewport.width, viewport.height);
        cy.get('[data-testid="guess-input"]').type('e@x#a$m%p^l&e');
        cy.get('[data-testid="submit-guess"]').click();
        cy.get('[data-testid="guess-feedback"]')
          .should('be.visible')
          .and('contain.text', 'special characters');
      });
      
      it(`handles long inputs correctly on ${viewport.device}`, () => {
        cy.viewport(viewport.width, viewport.height);
        const longInput = 'a'.repeat(60);
        cy.get('[data-testid="guess-input"]').type(longInput);
        cy.get('[data-testid="submit-guess"]').click();
        cy.get('[data-testid="guess-feedback"]')
          .should('be.visible')
          .and('contain.text', 'too long');
      });
    });
  });
  
  // Test input methods
  describe('Input Method Tests', () => {
    it('handles copy-paste input', () => {
      cy.viewport(1280, 800);
      // Programmatically set clipboard content
      cy.window().then(win => {
        win.navigator.clipboard.writeText('example');
      });
      
      cy.get('[data-testid="guess-input"]').focus().type('{ctrl+v}');
      cy.get('[data-testid="guess-input"]').should('have.value', 'example');
    });
    
    it('handles keyboard navigation', () => {
      cy.viewport(1280, 800);
      cy.get('[data-testid="guess-input"]').focus().type('example{enter}');
      cy.get('[data-testid="guess-feedback"]').should('be.visible');
    });
  });
  
  // Test responsive behavior
  describe('Responsive UI Tests', () => {
    viewports.forEach(viewport => {
      it(`displays feedback messages correctly on ${viewport.device}`, () => {
        cy.viewport(viewport.width, viewport.height);
        cy.get('[data-testid="guess-input"]').type('wrong');
        cy.get('[data-testid="submit-guess"]').click();
        
        // Check that feedback is visible and properly styled
        cy.get('[data-testid="guess-feedback"]')
          .should('be.visible')
          .and('have.css', 'max-width')
          .and(maxWidth => {
            // On mobile, width should be close to viewport width
            if (viewport.device === 'mobile') {
              expect(parseInt(maxWidth)).to.be.lessThan(viewport.width);
            }
          });
      });
    });
  });
  
  // Test fuzzy matching across devices
  describe('Fuzzy Matching Tests', () => {
    viewports.forEach(viewport => {
      it(`handles fuzzy matches correctly on ${viewport.device}`, () => {
        cy.viewport(viewport.width, viewport.height);
        
        // Mock the word to always be "example"
        cy.window().then(win => {
          win.currentWord = { id: '1', word: 'example', definition: 'test', difficulty: 'easy' };
        });
        
        cy.get('[data-testid="guess-input"]').type('exampl');
        cy.get('[data-testid="submit-guess"]').click();
        
        cy.get('[data-testid="guess-feedback"]')
          .should('be.visible')
          .and('contain.text', 'Almost')
          .and('contain.text', 'example');
      });
    });
  });
}); 