# Cross-Device Testing Guide for Developers

This guide provides practical instructions for testing the Word Guess application across different devices and input methods.

## Setup for Testing

### Required Hardware
- Desktop/laptop computer
- At least one iOS device (iPhone/iPad)
- At least one Android device
- Physical keyboard
- External mouse/trackpad

### Required Software
- Browser DevTools (Chrome, Firefox, Safari)
- Browser device emulators
- BrowserStack account (optional)
- Mobile screen mirroring software (iOS: QuickTime, Android: scrcpy)

## Testing Process

### 1. Desktop Testing

**Setup:**
```bash
# Start the development server
npm run dev
```

**Physical Keyboard Test Cases:**
1. Type normal words in guess input
2. Use keyboard combinations (Ctrl+A, Ctrl+C, Ctrl+V)
3. Submit using Enter key
4. Test with international keyboard layouts
5. Test with symbols and numbers

**Mouse/Trackpad Test Cases:**
1. Click on input field
2. Click submit button 
3. Copy-paste using right-click menu
4. Test with different pointer settings (speed, precision)

### 2. Mobile Testing

**Setup iOS:**
1. Connect device via USB
2. Open Safari Developer settings
3. Enable Web Inspector
4. Access localhost through Safari

**Setup Android:**
1. Enable USB debugging
2. Connect device via USB
3. Use Chrome remote debugging
4. Access localhost through port forwarding

**Virtual Keyboard Test Cases:**
1. Test predictive text/autocorrect behavior
2. Test switching between keyboard layouts 
3. Test with Emoji keyboards
4. Test with different language keyboards
5. Test with auto-capitalization on/off

**Touch Interaction Test Cases:**
1. Test touch precision on input field
2. Test button touch targets
3. Test scrolling while input is focused

### 3. Voice Input Testing

**Setup:**
1. Enable device voice input
2. Focus on input field

**Voice Test Cases:**
1. Dictate common words
2. Dictate words with homophones
3. Dictate words with uncommon pronunciation
4. Test with different accents
5. Test with background noise

### 4. Accessibility Testing

**Setup:**
1. Enable screen readers (VoiceOver, TalkBack, NVDA)
2. Enable high contrast mode
3. Set font sizes to largest setting

**Accessibility Test Cases:**
1. Navigate using keyboard only
2. Test with screen reader reading input feedback
3. Verify all feedback is announced correctly
4. Test color contrast of error/success states
5. Test with zoom at 200%

## Browser Compatibility Matrix

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Basic input | Test | Test | Test | Test |
| Fuzzy match | Test | Test | Test | Test |
| Special chars | Test | Test | Test | Test |
| Responsive UI | Test | Test | Test | Test |

## Device Compatibility Matrix

| Feature | iOS Phone | iOS Tablet | Android Phone | Android Tablet |
|---------|-----------|------------|---------------|---------------|
| Virtual keyboard | Test | Test | Test | Test |
| Copy-paste | Test | Test | Test | Test |
| Voice input | Test | Test | Test | Test |

## Troubleshooting Common Issues

### Input Validation Inconsistencies
- Check for browser-specific input sanitization
- Verify event handling for paste events
- Check for input encoding differences

### Virtual Keyboard Issues
- Adjust layout for keyboard overlap
- Test with keyboard animations
- Handle keyboard show/hide events

### Voice Input Problems
- Improve error handling for ambiguous words
- Consider common mispronunciations
- Implement feedback for unrecognized words

## Reporting Issues

When reporting cross-device issues, include:
1. Device make and model
2. Operating system version
3. Browser and version
4. Input method used
5. Step-by-step reproduction instructions
6. Expected vs actual behavior
7. Screenshots or screen recordings

## Automating Cross-Device Tests

Example Cypress test to check input on different viewports:

```javascript
describe('Word input on different viewports', () => {
  const viewports = [
    { width: 375, height: 667, device: 'mobile' },
    { width: 768, height: 1024, device: 'tablet' },
    { width: 1280, height: 800, device: 'desktop' }
  ];
  
  viewports.forEach(viewport => {
    it(`handles input correctly on ${viewport.device}`, () => {
      cy.viewport(viewport.width, viewport.height);
      cy.visit('/');
      cy.get('[data-testid="guess-input"]').type('example');
      cy.get('[data-testid="submit-guess"]').click();
      cy.get('[data-testid="guess-feedback"]').should('be.visible');
    });
  });
});
``` 