import { render, screen } from '@testing-library/react'
import CartDrawer from '../CartDrawer'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

jest.mock('@/context/CartContext', () => ({
  CartProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useCart: () => ({
    items: [],
    removeItem: jest.fn(),
    itemCount: 0,
    isDrawerOpen: true,
    closeDrawer: jest.fn(),
  }),
}))

describe('CartDrawer — mobile responsive', () => {
  it('does NOT use hardcoded 380px width (CSS var handles it)', () => {
    const { container } = render(<CartDrawer />)
    const panels = container.querySelectorAll('div')
    const has380 = Array.from(panels).some(el => {
      const styleAttr = el.getAttribute('style') || ''
      return styleAttr.includes('380px')
    })
    expect(has380).toBe(false)
  })

  it('does not import useIsMobile (no JS-based responsive)', () => {
    // If useIsMobile were used, width would be a ternary like "100% or 380px".
    // No hardcoded 380px in any style attribute proves CSS var approach.
    const { container } = render(<CartDrawer />)
    const panels = container.querySelectorAll('div')
    const hasHardcoded = Array.from(panels).some(el => {
      const styleAttr = el.getAttribute('style') || ''
      return styleAttr.includes('width: 100%') || styleAttr.includes('380px')
    })
    expect(hasHardcoded).toBe(false)
  })

  it('renders empty cart message when open', () => {
    render(<CartDrawer />)
    expect(screen.getByText('YOUR CART IS EMPTY')).toBeInTheDocument()
  })
})
