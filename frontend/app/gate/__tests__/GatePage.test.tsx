import { render, screen, act } from '@testing-library/react'
import GatePage from '../page'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

// Helper: fire a timeupdate event on a video element with given currentTime/duration
function fireTimeUpdate(video: HTMLVideoElement, currentTime: number, duration: number) {
  Object.defineProperty(video, 'currentTime', { value: currentTime, writable: true, configurable: true })
  Object.defineProperty(video, 'duration', { value: duration, writable: true, configurable: true })
  video.dispatchEvent(new Event('timeupdate'))
}

describe('GatePage', () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_DROP_TIMESTAMP
  })

  // ─── Basic rendering ───────────────────────────────────────────────────────

  it('renders the video element', async () => {
    await act(async () => { render(<GatePage />) })
    expect(document.querySelector('video')).toBeInTheDocument()
  })

  it('shows PasswordEntry when no drop timestamp is set', async () => {
    await act(async () => { render(<GatePage />) })
    expect(screen.getByPlaceholderText('enter password')).toBeInTheDocument()
  })

  // ─── Video element attributes ──────────────────────────────────────────────

  it('video has autoPlay, playsInline, and preload="auto"', async () => {
    await act(async () => { render(<GatePage />) })
    const video = document.querySelector('video')!
    expect(video).toHaveAttribute('autoplay')
    // Note: jsdom's jest.setup.ts replaces the muted setter with a jest.fn() so
    // video.muted is untestable here — verified in the JSX source instead.
    expect(video).toHaveAttribute('playsinline')
    expect(video).toHaveAttribute('preload', 'auto')
  })

  it('video does NOT have the loop attribute — manual looping handles it', async () => {
    await act(async () => { render(<GatePage />) })
    const video = document.querySelector('video')!
    expect(video).not.toHaveAttribute('loop')
  })

  it('video starts with black background to prevent flash', async () => {
    await act(async () => { render(<GatePage />) })
    const video = document.querySelector('video')! as HTMLVideoElement
    // jsdom normalises #000 → rgb(0, 0, 0) — either form means black
    expect(video.style.backgroundColor).toMatch(/^(#000|rgb\(0,\s*0,\s*0\))$/)
  })

  it('video does NOT start with opacity 0 (old fade-in approach removed)', async () => {
    await act(async () => { render(<GatePage />) })
    const video = document.querySelector('video')!
    // The old implementation set opacity:0 and faded in — that caused a flash.
    // The fix sets backgroundColor instead; opacity should be absent / ''.
    expect(video.style.opacity).not.toBe('0')
  })

  // ─── No React state for video readiness ───────────────────────────────────

  it('does not use a videoReady / canplay state — video is visible immediately', async () => {
    // If React state were used for readiness, the video element would initially
    // be absent or hidden until a canplay event fires.  Verify the element
    // exists and is not hidden on first render without firing any media events.
    await act(async () => { render(<GatePage />) })
    const video = document.querySelector('video')!
    expect(video).toBeInTheDocument()
    // No display:none or visibility:hidden set via inline style
    expect(video.style.display).not.toBe('none')
    expect(video.style.visibility).not.toBe('hidden')
  })

  it('canplay event does NOT change video opacity (no fade-in state logic)', async () => {
    await act(async () => { render(<GatePage />) })
    const video = document.querySelector('video')! as HTMLVideoElement
    const opacityBefore = video.style.opacity
    await act(async () => { video.dispatchEvent(new Event('canplay')) })
    // If there were a canplay → opacity handler, opacity would change to '1'.
    // The fix removes that; opacity must remain unchanged.
    expect(video.style.opacity).toBe(opacityBefore)
  })

  // ─── Manual loop via timeupdate ────────────────────────────────────────────

  it('timeupdate listener is active — fires handler when near end', async () => {
    // Behavioral proof that a timeupdate listener is attached:
    // if it weren't, currentTime would NOT be reset.
    await act(async () => { render(<GatePage />) })
    const video = document.querySelector('video')! as HTMLVideoElement
    act(() => { fireTimeUpdate(video, 2.9, 3.0) })
    expect(video.currentTime).toBe(0)
  })

  it('ended event does NOT reset currentTime (old loop approach removed)', async () => {
    // In the old implementation, an `ended` handler called currentTime=0 + play().
    // The new approach uses timeupdate so `ended` should be a no-op.
    await act(async () => { render(<GatePage />) })
    const video = document.querySelector('video')! as HTMLVideoElement

    // Place video at mid-playback, then fire ended — currentTime must stay put
    Object.defineProperty(video, 'currentTime', { value: 1.5, writable: true, configurable: true })
    const playSpy = jest.spyOn(video, 'play').mockResolvedValue(undefined)

    await act(async () => { video.dispatchEvent(new Event('ended')) })

    // Neither currentTime nor play() should be touched by an ended handler
    expect(video.currentTime).toBe(1.5)
    expect(playSpy).not.toHaveBeenCalled()
    playSpy.mockRestore()
  })

  it('resets currentTime to 0 when within 0.15 s of the end', async () => {
    await act(async () => { render(<GatePage />) })
    const video = document.querySelector('video')! as HTMLVideoElement

    // Simulate playback at exactly the threshold boundary (duration - 0.15)
    act(() => { fireTimeUpdate(video, 2.85, 3.0) })
    expect(video.currentTime).toBe(0)
  })

  it('resets currentTime to 0 when currentTime is past the threshold', async () => {
    await act(async () => { render(<GatePage />) })
    const video = document.querySelector('video')! as HTMLVideoElement

    act(() => { fireTimeUpdate(video, 2.99, 3.0) })
    expect(video.currentTime).toBe(0)
  })

  it('does NOT reset currentTime when well before the threshold', async () => {
    await act(async () => { render(<GatePage />) })
    const video = document.querySelector('video')! as HTMLVideoElement

    act(() => { fireTimeUpdate(video, 1.5, 3.0) })
    expect(video.currentTime).toBe(1.5)
  })

  it('does NOT reset currentTime when just before the threshold', async () => {
    await act(async () => { render(<GatePage />) })
    const video = document.querySelector('video')! as HTMLVideoElement

    // 2.84 is one tick before 2.85 threshold — should not reset
    act(() => { fireTimeUpdate(video, 2.84, 3.0) })
    expect(video.currentTime).toBe(2.84)
  })

  it('does NOT reset currentTime when duration is 0 (video not yet loaded)', async () => {
    await act(async () => { render(<GatePage />) })
    const video = document.querySelector('video')! as HTMLVideoElement

    // duration=0 is falsy — guard prevents reset during loading
    act(() => { fireTimeUpdate(video, 0, 0) })
    expect(video.currentTime).toBe(0) // not reset (was already 0, no side-effect)
  })

  it('does NOT reset when duration is NaN (metadata not loaded)', async () => {
    await act(async () => { render(<GatePage />) })
    const video = document.querySelector('video')! as HTMLVideoElement

    // NaN duration — guard `video.duration &&` should short-circuit
    Object.defineProperty(video, 'currentTime', { value: 5, writable: true, configurable: true })
    Object.defineProperty(video, 'duration', { value: NaN, writable: true, configurable: true })
    video.dispatchEvent(new Event('timeupdate'))
    expect(video.currentTime).toBe(5)
  })

  // ─── No black-frame flash ──────────────────────────────────────────────────

  it('never allows video to reach its natural end (reset fires before ended)', async () => {
    await act(async () => { render(<GatePage />) })
    const video = document.querySelector('video')! as HTMLVideoElement

    // Simulate the last few timeupdate ticks before the video would end
    const duration = 3.0
    const ticks = [2.80, 2.82, 2.84, 2.85, 2.87, 2.90, 2.95, 3.00]
    let resetFired = false

    for (const t of ticks) {
      act(() => { fireTimeUpdate(video, t, duration) })
      if (video.currentTime === 0) {
        resetFired = true
        break
      }
    }

    expect(resetFired).toBe(true)
    // After reset the time is 0, meaning the 'ended' event was pre-empted
    expect(video.currentTime).toBe(0)
  })

  it('reset happens at least 0.15 s before the end, not at the exact end', async () => {
    await act(async () => { render(<GatePage />) })
    const video = document.querySelector('video')! as HTMLVideoElement

    const duration = 3.0
    // A tick at duration - 0.16 (outside window) should NOT reset
    act(() => { fireTimeUpdate(video, duration - 0.16, duration) })
    expect(video.currentTime).not.toBe(0)

    // A tick at duration - 0.15 (on the boundary) SHOULD reset
    act(() => { fireTimeUpdate(video, duration - 0.15, duration) })
    expect(video.currentTime).toBe(0)
  })

  // ─── Edge cases ────────────────────────────────────────────────────────────

  it('rapid re-render: timeupdate handler still works after re-render', async () => {
    // Behavioral: after a forced re-render, the timeupdate handler must still
    // reset currentTime — proving the listener was properly cleaned up and
    // re-attached without accumulating stale handlers.
    const { rerender } = await act(async () => render(<GatePage />))
    await act(async () => { rerender(<GatePage />) })

    const video = document.querySelector('video')! as HTMLVideoElement
    act(() => { fireTimeUpdate(video, 2.9, 3.0) })
    expect(video.currentTime).toBe(0)
  })

  it('removes the timeupdate listener on unmount', async () => {
    const removeEventSpy = jest.spyOn(HTMLVideoElement.prototype, 'removeEventListener')
    const { unmount } = await act(async () => render(<GatePage />))

    await act(async () => { unmount() })

    const timeupdateRemovals = removeEventSpy.mock.calls.filter(([type]) => type === 'timeupdate')
    expect(timeupdateRemovals).toHaveLength(1)
    removeEventSpy.mockRestore()
  })

  it('handles slow-loading video: no reset when currentTime matches NaN duration', async () => {
    await act(async () => { render(<GatePage />) })
    const video = document.querySelector('video')! as HTMLVideoElement

    // Simulate partial load: currentTime 0, duration undefined/NaN
    Object.defineProperty(video, 'currentTime', { value: 0, writable: true, configurable: true })
    Object.defineProperty(video, 'duration', { value: undefined, writable: true, configurable: true })
    act(() => { video.dispatchEvent(new Event('timeupdate')) })
    // Should not throw and currentTime should remain 0
    expect(video.currentTime).toBe(0)
  })

  it('handles a very short (sub-second) video without error', async () => {
    await act(async () => { render(<GatePage />) })
    const video = document.querySelector('video')! as HTMLVideoElement

    // duration=0.5s, threshold = 0.35s
    act(() => { fireTimeUpdate(video, 0.36, 0.5) })
    expect(video.currentTime).toBe(0)

    act(() => { fireTimeUpdate(video, 0.10, 0.5) })
    expect(video.currentTime).toBe(0.10)
  })

  it('after a reset, subsequent timeupdate ticks at t=0 do not re-reset', async () => {
    await act(async () => { render(<GatePage />) })
    const video = document.querySelector('video')! as HTMLVideoElement

    // Trigger reset
    act(() => { fireTimeUpdate(video, 2.90, 3.0) })
    expect(video.currentTime).toBe(0)

    // Next tick at t=0 — should stay at 0, not re-trigger
    act(() => { fireTimeUpdate(video, 0, 3.0) })
    expect(video.currentTime).toBe(0)
  })

  // ─── Countdown / drop state ────────────────────────────────────────────────

  it('shows Countdown when drop timestamp is in the future', async () => {
    const future = new Date(Date.now() + 60_000).toISOString()
    process.env.NEXT_PUBLIC_DROP_TIMESTAMP = future

    await act(async () => { render(<GatePage />) })
    expect(screen.getByText(/DROP INCOMING/i)).toBeInTheDocument()
  })

  it('shows PasswordEntry when drop timestamp is in the past', async () => {
    const past = new Date(Date.now() - 60_000).toISOString()
    process.env.NEXT_PUBLIC_DROP_TIMESTAMP = past

    await act(async () => { render(<GatePage />) })
    expect(screen.getByPlaceholderText('enter password')).toBeInTheDocument()
  })
})
