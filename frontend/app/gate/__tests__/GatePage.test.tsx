import { render, screen, act } from '@testing-library/react'
import GatePage from '../page'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

describe('GatePage', () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_DROP_TIMESTAMP
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders the video element', async () => {
    await act(async () => {
      render(<GatePage />)
    })
    expect(document.querySelector('video')).toBeInTheDocument()
  })

  it('does NOT have loop attribute on video (ended handler restarts playback)', async () => {
    await act(async () => {
      render(<GatePage />)
    })
    const video = document.querySelector('video')
    expect(video?.hasAttribute('loop')).toBe(false)
  })

  it('shows PasswordEntry when no drop timestamp is set', async () => {
    await act(async () => {
      render(<GatePage />)
    })
    expect(screen.getByPlaceholderText('enter password')).toBeInTheDocument()
  })

  it('video starts at opacity 0 and fades in on canplay', async () => {
    await act(async () => {
      render(<GatePage />)
    })
    const video = document.querySelector('video') as HTMLVideoElement
    // Initially hidden
    expect(video.style.opacity).toBe('0')
    // Fire canplay
    await act(async () => {
      video.dispatchEvent(new Event('canplay'))
    })
    expect(video.style.opacity).toBe('1')
  })

  it('resets to start and plays again when video ends', async () => {
    await act(async () => {
      render(<GatePage />)
    })

    const video = document.querySelector('video') as HTMLVideoElement
    let currentTime = 0
    Object.defineProperty(video, 'currentTime', {
      get: jest.fn(() => currentTime),
      set: jest.fn((v) => { currentTime = v }),
      configurable: true,
    })
    const playSpy = jest.spyOn(video, 'play').mockResolvedValue(undefined)

    // Simulate the video ending
    await act(async () => {
      video.dispatchEvent(new Event('ended'))
    })

    // Should reset to 0 and play again
    expect(currentTime).toBe(0)
    expect(playSpy).toHaveBeenCalled()
  })
})
