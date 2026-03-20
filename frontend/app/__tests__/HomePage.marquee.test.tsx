import { render, act } from '@testing-library/react'
import HomePage from '../page'

jest.mock('@/components/product/NewReleasesGrid', () => () => <div />)
jest.mock('next/image', () => ({ __esModule: true, default: (props: Record<string, unknown>) => <img {...props} /> }))

const MOCK_TOP = 1000
const THRESHOLD = MOCK_TOP - 56

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { value, configurable: true })
}

function fireScroll() {
  act(() => { window.dispatchEvent(new Event('scroll')) })
}

function getFixedTakeover() {
  return Array.from(document.body.querySelectorAll('div')).find(
    el => el.style.position === 'fixed' && el.style.top === '56px' && el.style.zIndex === '100'
  )
}

describe('HomePage marquee scroll takeover', () => {
  beforeEach(() => {
    setScrollY(0)
    jest.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      top: MOCK_TOP, bottom: MOCK_TOP + 38, left: 0, right: 1024,
      width: 1024, height: 38, x: 0, y: MOCK_TOP, toJSON: () => ({}),
    })
  })

  afterEach(() => {
    document.body.classList.remove('hide-fixed-marquee')
    jest.restoreAllMocks()
  })

  it('archive marquee class not hidden on load', () => {
    render(<HomePage />)
    expect(document.body.classList.contains('hide-fixed-marquee')).toBe(false)
  })

  it('sentinel is visible on load', () => {
    const { container } = render(<HomePage />)
    const sentinel = container.querySelector('[style*="visibility"]') as HTMLElement
    expect(sentinel?.style.visibility).toBe('visible')
  })

  it('takeover not rendered on load', () => {
    render(<HomePage />)
    expect(getFixedTakeover()).toBeUndefined()
  })

  it('archive marquee hidden after scrolling past threshold', () => {
    render(<HomePage />)
    setScrollY(THRESHOLD)
    fireScroll()
    expect(document.body.classList.contains('hide-fixed-marquee')).toBe(true)
  })

  it('sentinel hidden after scrolling past threshold', () => {
    const { container } = render(<HomePage />)
    setScrollY(THRESHOLD)
    fireScroll()
    const sentinel = container.querySelector('[style*="visibility"]') as HTMLElement
    expect(sentinel?.style.visibility).toBe('hidden')
  })

  it('takeover rendered with correct text after scrolling past threshold', () => {
    render(<HomePage />)
    setScrollY(THRESHOLD)
    fireScroll()
    const takeover = getFixedTakeover()
    expect(takeover).toBeDefined()
    expect(takeover?.textContent).toContain('KARISMA')
    expect(takeover?.textContent).toContain('SUMMER 2026')
    expect(takeover?.textContent).toContain('DROP NOW')
  })

  it('reverts when scrolling back above threshold', () => {
    render(<HomePage />)
    setScrollY(THRESHOLD)
    fireScroll()
    setScrollY(THRESHOLD - 1)
    fireScroll()
    expect(document.body.classList.contains('hide-fixed-marquee')).toBe(false)
    expect(getFixedTakeover()).toBeUndefined()
  })

  it('cleans up on unmount', () => {
    const { unmount } = render(<HomePage />)
    setScrollY(THRESHOLD)
    fireScroll()
    unmount()
    expect(document.body.classList.contains('hide-fixed-marquee')).toBe(false)
  })
})
