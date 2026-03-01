import '@testing-library/jest-dom'

// HTMLMediaElement mocks (jsdom does not implement media APIs)
window.HTMLMediaElement.prototype.play = jest.fn()
window.HTMLMediaElement.prototype.pause = jest.fn()
window.HTMLMediaElement.prototype.load = jest.fn()
Object.defineProperty(window.HTMLMediaElement.prototype, 'muted', {
  set: jest.fn(),
})
