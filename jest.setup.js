// Import testing-library utilities
import '@testing-library/jest-dom';

// Set global timeout
jest.setTimeout(15000);

// Use fake timers for all tests
jest.useFakeTimers();

// This will be used to extend Jest's expect
// Examples: expect(element).toBeInTheDocument()

// Suppress error messages from act warnings
const originalConsoleError = console.error;
console.error = (...args) => {
  if (/Warning.*not wrapped in act/.test(args[0])) {
    return;
  }
  originalConsoleError(...args);
};

// Add a global afterEach to advance timers and clean up
afterEach(() => {
  // Run all pending timers and then clear them
  jest.runOnlyPendingTimers();
  jest.clearAllTimers();
});