import React from 'react'
import { render, act } from '@testing-library/react'
import AnimateWrapper from '../AnimateWrapper'

// Track mount/unmount counts to prove children are NOT remounted
let mountCount = 0
let unmountCount = 0

function TrackedChild() {
  React.useEffect(() => {
    mountCount++
    return () => { unmountCount++ }
  }, [])
  return <div data-testid="child">child content</div>
}

let mockPathname = '/gate'
jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}))

describe('AnimateWrapper', () => {
  beforeEach(() => {
    mountCount = 0
    unmountCount = 0
    mockPathname = '/gate'
  })

  it('renders children inside a plain div (no Framer Motion wrapper)', () => {
    const { getByTestId, container } = render(
      <AnimateWrapper><TrackedChild /></AnimateWrapper>
    )
    expect(getByTestId('child')).toBeInTheDocument()
    // Should be a plain div, not a framer motion component
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('mounts children exactly once on initial render', () => {
    render(<AnimateWrapper><TrackedChild /></AnimateWrapper>)
    expect(mountCount).toBe(1)
    expect(unmountCount).toBe(0)
  })

  it('does NOT use AnimatePresence or key={pathname} in JSX (which caused the remount bug)', () => {
    const source = require('fs').readFileSync(
      require('path').resolve(__dirname, '../AnimateWrapper.tsx'),
      'utf8'
    )
    // Strip comments to check only executable code
    const codeOnly = source
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*/g, '')
    expect(codeOnly).not.toContain('<AnimatePresence')
    expect(codeOnly).not.toContain('key={pathname}')
  })

  it('uses useLayoutEffect for pre-paint opacity control (not useEffect)', () => {
    const source = require('fs').readFileSync(
      require('path').resolve(__dirname, '../AnimateWrapper.tsx'),
      'utf8'
    )
    expect(source).toContain('useLayoutEffect')
    // The import line should not include useEffect (only useLayoutEffect)
    const importLine = source.split('\n').find((l: string) => l.includes('from \'react\''))
    expect(importLine).not.toContain('useEffect')
    expect(importLine).toContain('useLayoutEffect')
  })

  it('keeps children stable across pathname changes (no unmount/remount)', () => {
    const { rerender, getByTestId } = render(
      <AnimateWrapper><TrackedChild /></AnimateWrapper>
    )
    expect(mountCount).toBe(1)
    expect(unmountCount).toBe(0)

    // Simulate route change
    mockPathname = '/new-releases'
    rerender(<AnimateWrapper><TrackedChild /></AnimateWrapper>)

    expect(getByTestId('child')).toBeInTheDocument()
    expect(unmountCount).toBe(0) // No unmount!
    expect(mountCount).toBe(1)   // Still only mounted once!
  })

  it('does not animate on first mount (no initial fade-in flash)', () => {
    const { container } = render(
      <AnimateWrapper><TrackedChild /></AnimateWrapper>
    )
    const wrapper = container.firstChild as HTMLElement
    // On first mount, opacity should be 1 (fully visible, no initial animation)
    expect(wrapper.style.opacity).toBe('1')
  })
})
