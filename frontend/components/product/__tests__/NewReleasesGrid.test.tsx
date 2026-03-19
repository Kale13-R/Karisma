import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import NewReleasesGrid from '../NewReleasesGrid'

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { fill, sizes, priority, unoptimized, style: _style, ...rest } = props
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...rest} />
  },
}))

jest.mock('@/lib/api', () => ({
  get: jest.fn().mockRejectedValue(new Error('unavailable')),
}))

// Mock framer-motion: render base HTML elements, apply animate values as styles
jest.mock('framer-motion', () => {
  const React = require('react')
  return {
    motion: new Proxy({}, {
      get: (_: any, tag: string) =>
        React.forwardRef(({ children, animate, initial, variants, whileHover,
          whileInView, viewport, onHoverStart, onHoverEnd, transition, exit,
          style, ...rest }: any, ref: any) => {
          const animStyle = typeof animate === 'object' ? animate : {}
          return React.createElement(tag, {
            ...rest, ref, style: { ...style, ...animStyle },
          }, children)
        }),
    }),
    AnimatePresence: ({ children }: any) => children,
  }
})

describe('NewReleasesGrid — image flash prevention', () => {
  it('renders fallback products after loading', async () => {
    render(<NewReleasesGrid />)
    await waitFor(() => {
      expect(screen.queryByText('LOADING')).not.toBeInTheDocument()
    })

    expect(screen.getAllByText(/KARISMA — Red/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/KARISMA — Black/i).length).toBeGreaterThan(0)
  })

  it('product images have onLoad handlers that fire without error', async () => {
    render(<NewReleasesGrid />)
    await waitFor(() => {
      expect(screen.queryByText('LOADING')).not.toBeInTheDocument()
    })

    const images = screen.getAllByRole('img')
    expect(images.length).toBe(2)

    // Fire load event on each image — should not crash
    images.forEach(img => {
      fireEvent.load(img)
    })

    // Images still present after load events
    expect(screen.getAllByRole('img')).toHaveLength(2)
  })

  it('card containers start with opacity 0 before image loads', async () => {
    const { container } = render(<NewReleasesGrid />)
    await waitFor(() => {
      expect(screen.queryByText('LOADING')).not.toBeInTheDocument()
    })

    // Find divs with opacity: 0 (cards before image load)
    const hiddenCards = container.querySelectorAll('div[style*="opacity: 0"]')
    expect(hiddenCards.length).toBeGreaterThan(0)
  })
})
