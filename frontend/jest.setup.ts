import '@testing-library/jest-dom'

// HTMLMediaElement mocks (jsdom does not implement media APIs)
window.HTMLMediaElement.prototype.play = jest.fn()
window.HTMLMediaElement.prototype.pause = jest.fn()
window.HTMLMediaElement.prototype.load = jest.fn()
Object.defineProperty(window.HTMLMediaElement.prototype, 'muted', {
  set: jest.fn(),
})

// matchMedia mock (jsdom does not implement matchMedia)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    onchange: null,
    dispatchEvent: jest.fn(),
  })),
})
