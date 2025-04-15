// Import OpenAI Node.js shims for tests
import 'openai/shims/node';

// Import testing-library utilities
import '@testing-library/jest-dom';

// Add global Request implementation for Next.js API route tests
global.Request = class Request {
  constructor(input, init = {}) {
    this.url = input;
    this.method = init.method || 'GET';
    this.headers = new Headers(init.headers || {});
    this.body = init.body || null;
  }
};

// Add global Response and Headers if they don't exist
if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    constructor(body, init = {}) {
      this.body = body;
      this.status = init.status || 200;
      this.statusText = init.statusText || '';
      this.headers = new Headers(init.headers || {});
      this._bodyInit = body;
    }
    json() {
      return Promise.resolve(JSON.parse(this._bodyInit));
    }
    text() {
      return Promise.resolve(this._bodyInit);
    }
  };
}

if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers {
    constructor(init = {}) {
      this._headers = init;
    }
    get(name) {
      return this._headers[name.toLowerCase()];
    }
    set(name, value) {
      this._headers[name.toLowerCase()] = value;
    }
  };
}

// Add global fetch polyfill for Node.js environment
global.fetch = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    status: 200,
    statusText: 'OK',
    headers: new Headers(),
  });
});

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