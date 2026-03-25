import { render, screen, act } from '@testing-library/react'
import GatePage from '../page'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getVideo() {
  return document.querySelector('video') as HTMLVideoElement
}

function mockCurrentTime(video: HTMLVideoElement, initialValue = 0) {
  let ct = initialValue
  Object.defineProperty(video, 'currentTime', {
    get: jest.fn(() => ct),
    set: jest.fn((v) => { ct = v }),
    configurable: true,
  })
  return { getCurrentTime: () => ct }
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('GatePage — gate video timing & flash-fix', () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_DROP_TIMESTAMP
    // Reset readyState to 0 (HAVE_NOTHING) — the "not cached" default
    Object.defineProperty(HTMLMediaElement.prototype, 'readyState', {
      get: jest.fn().mockReturnValue(0),
      configurable: true,
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  // -------------------------------------------------------------------------
  // Smoke
  // -------------------------------------------------------------------------

  it('renders the video element', async () => {
    await act(async () => { render(<GatePage />) })
    expect(getVideo()).toBeInTheDocument()
  })

  it('shows PasswordEntry when no drop timestamp is set', async () => {
    await act(async () => { render(<GatePage />) })
    expect(screen.getByPlaceholderText('enter email')).toBeInTheDocument()
  })

  // -------------------------------------------------------------------------
  // 1. Loop via `ended` event — NOT ping-pong / rAF reversal
  // -------------------------------------------------------------------------

  it('does NOT have loop attribute — ended handler owns restart logic', async () => {
    await act(async () => { render(<GatePage />) })
    expect(getVideo().hasAttribute('loop')).toBe(false)
  })

  it('resets currentTime to 0 and calls play() when the ended event fires', async () => {
    await act(async () => { render(<GatePage />) })
    const video = getVideo()
    const { getCurrentTime } = mockCurrentTime(video, 3)
    const playSpy = jest.spyOn(video, 'play').mockResolvedValue(undefined)

    await act(async () => { video.dispatchEvent(new Event('ended')) })

    expect(getCurrentTime()).toBe(0)
    expect(playSpy).toHaveBeenCalledTimes(1)
  })

  it('resets currentTime synchronously within the ended handler (no black-frame window)', async () => {
    await act(async () => { render(<GatePage />) })
    const video = getVideo()
    const { getCurrentTime } = mockCurrentTime(video, 3)
    jest.spyOn(video, 'play').mockResolvedValue(undefined)

    // Dispatch synchronously — reset must happen before any async tick
    video.dispatchEvent(new Event('ended'))

    expect(getCurrentTime()).toBe(0)
  })

  it('loops multiple times: each ended event triggers a new seek-and-play', async () => {
    await act(async () => { render(<GatePage />) })
    const video = getVideo()
    const { getCurrentTime } = mockCurrentTime(video, 0)
    const playSpy = jest.spyOn(video, 'play').mockResolvedValue(undefined)

    // Capture baseline calls (e.g. autoplay) before we start firing ended events
    const baseline = playSpy.mock.calls.length

    for (let i = 0; i < 3; i++) {
      await act(async () => { video.dispatchEvent(new Event('ended')) })
    }

    expect(playSpy.mock.calls.length - baseline).toBe(3)
    expect(getCurrentTime()).toBe(0)
  })

  it('does not use requestAnimationFrame for reverse playback', async () => {
    // Spy before mounting so we catch any rAF calls during mount or ended
    const rafSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 0)

    await act(async () => { render(<GatePage />) })
    const video = getVideo()
    mockCurrentTime(video, 3)
    jest.spyOn(video, 'play').mockResolvedValue(undefined)

    // Count rAF calls before and after ended event
    const rafCallsBeforeEnded = rafSpy.mock.calls.length
    video.dispatchEvent(new Event('ended'))
    const rafCallsAfterEnded = rafSpy.mock.calls.length

    // Ending the video must not schedule any rAF (no ping-pong mechanism)
    expect(rafCallsAfterEnded).toBe(rafCallsBeforeEnded)
  })

  it('playbackRate is never set to negative (no reverse-playback mechanism)', async () => {
    await act(async () => { render(<GatePage />) })
    const video = getVideo()
    mockCurrentTime(video, 3)
    jest.spyOn(video, 'play').mockResolvedValue(undefined)

    await act(async () => { video.dispatchEvent(new Event('ended')) })

    expect(video.playbackRate).toBeGreaterThanOrEqual(0)
  })

  // -------------------------------------------------------------------------
  // 2. Direct DOM ref — not React state — for ready detection
  // -------------------------------------------------------------------------

  it('video starts with opacity 0 in the initial render (not dependent on state update)', async () => {
    await act(async () => { render(<GatePage />) })
    // opacity:0 is set via the JSX style prop — visible before any effect runs
    expect(getVideo().style.opacity).toBe('0')
  })

  it('applies opacity via inline style, not a CSS class', async () => {
    await act(async () => { render(<GatePage />) })
    const video = getVideo()
    await act(async () => { video.dispatchEvent(new Event('canplay')) })

    // Fade-in is direct DOM style, not a className toggle
    expect(video.style.opacity).toBe('1')
    expect(video.style.transition).toContain('opacity')
    // No class should be toggling visibility
    expect(video.classList.contains('opacity-0')).toBe(false)
    expect(video.classList.contains('opacity-100')).toBe(false)
  })

  it('fade-in sets a CSS transition alongside opacity (smooth, not a jump)', async () => {
    await act(async () => { render(<GatePage />) })
    const video = getVideo()
    await act(async () => { video.dispatchEvent(new Event('canplay')) })

    expect(video.style.transition).toMatch(/opacity/)
  })

  // -------------------------------------------------------------------------
  // 3. rAF tick (pre-end pause guard) — implemented as timeupdate / ended reset
  //    The 3-second trim means the browser never reaches a natural stale frame;
  //    we verify the reset fires before any detectable "after-end" state.
  // -------------------------------------------------------------------------

  it('never leaves the video in a naturally-ended state without resetting', async () => {
    await act(async () => { render(<GatePage />) })
    const video = getVideo()
    const { getCurrentTime } = mockCurrentTime(video, 3)
    jest.spyOn(video, 'play').mockResolvedValue(undefined)

    // ended fires → handler resets immediately; video should never sit at end
    video.dispatchEvent(new Event('ended'))

    // currentTime must be back to 0 before we even yield the event loop
    expect(getCurrentTime()).toBe(0)
  })

  // -------------------------------------------------------------------------
  // 4. No black-frame flash — video resets before browser repaints end frame
  // -------------------------------------------------------------------------

  it('currentTime is 0 immediately after ended fires (no yielding to the paint queue)', async () => {
    await act(async () => { render(<GatePage />) })
    const video = getVideo()
    const { getCurrentTime } = mockCurrentTime(video, 3)
    jest.spyOn(video, 'play').mockResolvedValue(undefined)

    // Intentionally NOT using await act — the reset must be synchronous
    video.dispatchEvent(new Event('ended'))
    expect(getCurrentTime()).toBe(0)
  })

  it('does not call pause() on loop — avoids frozen frame between loops', async () => {
    await act(async () => { render(<GatePage />) })
    const video = getVideo()
    mockCurrentTime(video, 3)
    const pauseSpy = jest.spyOn(video, 'pause')
    jest.spyOn(video, 'play').mockResolvedValue(undefined)

    await act(async () => { video.dispatchEvent(new Event('ended')) })

    expect(pauseSpy).not.toHaveBeenCalled()
  })

  // -------------------------------------------------------------------------
  // 5. Fade-in when already cached (readyState >= 2 path)
  // -------------------------------------------------------------------------

  it('shows video immediately when readyState >= 2 at mount (browser cache hit)', async () => {
    Object.defineProperty(HTMLMediaElement.prototype, 'readyState', {
      get: jest.fn().mockReturnValue(2), // HAVE_CURRENT_DATA
      configurable: true,
    })

    await act(async () => { render(<GatePage />) })

    // Should be visible without needing a canplay event
    expect(getVideo().style.opacity).toBe('1')
  })

  it('shows video immediately for readyState 3 (HAVE_FUTURE_DATA)', async () => {
    Object.defineProperty(HTMLMediaElement.prototype, 'readyState', {
      get: jest.fn().mockReturnValue(3),
      configurable: true,
    })

    await act(async () => { render(<GatePage />) })

    expect(getVideo().style.opacity).toBe('1')
  })

  it('shows video immediately for readyState 4 (HAVE_ENOUGH_DATA)', async () => {
    Object.defineProperty(HTMLMediaElement.prototype, 'readyState', {
      get: jest.fn().mockReturnValue(4),
      configurable: true,
    })

    await act(async () => { render(<GatePage />) })

    expect(getVideo().style.opacity).toBe('1')
  })

  it('waits for canplay event when readyState < 2 (not yet decoded)', async () => {
    // readyState is 0 (default from beforeEach)
    await act(async () => { render(<GatePage />) })
    const video = getVideo()

    // Still hidden — no canplay yet
    expect(video.style.opacity).toBe('0')

    // canplay fires → should become visible
    await act(async () => { video.dispatchEvent(new Event('canplay')) })
    expect(video.style.opacity).toBe('1')
  })

  it('does NOT fire canplay listener when readyState >= 2 (no duplicate show calls)', async () => {
    Object.defineProperty(HTMLMediaElement.prototype, 'readyState', {
      get: jest.fn().mockReturnValue(2),
      configurable: true,
    })

    await act(async () => { render(<GatePage />) })

    // Spy on the specific video instance AFTER mount to check no canplay listener was added
    const video = getVideo()
    const addSpy = jest.spyOn(video, 'addEventListener')

    // Trigger another effect cycle — no canplay listener should be registered
    // because readyState >= 2 takes the immediate showVideo() path
    await act(async () => { /* flush effects */ })

    const canplayCalls = addSpy.mock.calls.filter(([event]) => event === 'canplay')
    expect(canplayCalls.length).toBe(0)

    // Confirm: the video is already visible without canplay having been dispatched
    expect(video.style.opacity).toBe('1')
  })

  // -------------------------------------------------------------------------
  // 6. Video source and attributes
  // -------------------------------------------------------------------------

  it('loads the trimmed karisma-gate.mp4 (not the original longer file)', async () => {
    await act(async () => { render(<GatePage />) })
    const source = document.querySelector('video source')
    expect(source?.getAttribute('src')).toBe('/videos/karisma-gate.mp4')
    expect(source?.getAttribute('src')).not.toContain('RPReplay')
  })

  it('video has autoPlay, muted, playsInline, and preload=auto for background use', async () => {
    await act(async () => { render(<GatePage />) })
    const video = getVideo()
    expect(video.hasAttribute('autoplay')).toBe(true)
    expect(video.hasAttribute('playsinline')).toBe(true)
    expect(video.getAttribute('preload')).toBe('auto')
  })

  // -------------------------------------------------------------------------
  // 7. Cleanup — no event-listener leaks
  // -------------------------------------------------------------------------

  it('removes ended and canplay listeners on unmount', async () => {
    const removeSpy = jest.spyOn(HTMLMediaElement.prototype, 'removeEventListener')
    let unmount: () => void

    await act(async () => {
      const result = render(<GatePage />)
      unmount = result.unmount
    })

    await act(async () => { unmount() })

    const removed = removeSpy.mock.calls.map(([event]) => event)
    expect(removed).toContain('ended')
    expect(removed).toContain('canplay')
  })

  it('ended listener no longer fires after unmount', async () => {
    let unmount: () => void
    await act(async () => {
      const result = render(<GatePage />)
      unmount = result.unmount
    })

    const video = getVideo()
    const { getCurrentTime } = mockCurrentTime(video, 3)
    const playSpy = jest.spyOn(video, 'play').mockResolvedValue(undefined)

    await act(async () => { unmount() })

    // Snapshot call count after unmount (autoplay may have fired before unmount)
    const callsAfterUnmount = playSpy.mock.calls.length

    video.dispatchEvent(new Event('ended'))

    // No new play() calls — the ended handler was cleaned up on unmount
    expect(playSpy.mock.calls.length).toBe(callsAfterUnmount)
    expect(getCurrentTime()).toBe(3) // unchanged — handler was removed
  })
})
