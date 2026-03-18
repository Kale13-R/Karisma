import { render, screen, waitFor } from '@testing-library/react'
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

// Mock framer-motion to render base HTML elements
jest.mock('framer-motion', () => {
  const React = require('react')
  return {
    motion: new Proxy({}, {
      get: (_: any, tag: string) =>
        React.forwardRef(({ children, animate, initial, variants, whileHover,
          whileInView, viewport, onHoverStart, onHoverEnd, transition, exit,
          style, ...rest }: any, ref: any) =>
          React.createElement(tag, { ...rest, ref, style }, children)
        ),
    }),
    AnimatePresence: ({ children }: any) => children,
  }
})

describe('NewReleasesGrid — hover-only labels', () => {
  it('product names appear only once each (in overlay only, not as static labels)', async () => {
    render(<NewReleasesGrid />)
    await waitFor(() => {
      expect(screen.queryByText('LOADING')).not.toBeInTheDocument()
    })

    // Fallback products: KARISMA — Red and KARISMA — Black
    // Each name should appear exactly once (inside the hover overlay only)
    // If static labels existed below the image, each name would appear twice
    const redLabels = screen.getAllByText(/KARISMA — Red/i)
    expect(redLabels).toHaveLength(1)

    const blackLabels = screen.getAllByText(/KARISMA — Black/i)
    expect(blackLabels).toHaveLength(1)
  })

  it('product prices appear only once each (in overlay only)', async () => {
    render(<NewReleasesGrid />)
    await waitFor(() => {
      expect(screen.queryByText('LOADING')).not.toBeInTheDocument()
    })

    // Both fallback products have price $148.00
    // Should appear exactly 2 times total (once per product, in overlay only)
    const priceLabels = screen.getAllByText('$148.00')
    expect(priceLabels).toHaveLength(2)
  })

  it('renders product images', async () => {
    render(<NewReleasesGrid />)
    await waitFor(() => {
      expect(screen.queryByText('LOADING')).not.toBeInTheDocument()
    })

    const images = screen.getAllByRole('img')
    expect(images.length).toBe(2)
  })
})
