import { render, screen } from '@testing-library/react'
import Header from '../Header'
import { CartProvider } from '@/context/CartContext'

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}))

function renderHeader() {
  return render(
    <CartProvider>
      <Header />
    </CartProvider>
  )
}

describe('Header — mobile responsive structure', () => {
  it('renders KARISMA wordmark', () => {
    renderHeader()
    expect(screen.getByText('KARISMA')).toBeInTheDocument()
  })

  it('does not use hardcoded mobile padding (no JS-based responsive)', () => {
    renderHeader()
    const header = screen.getByRole('banner')
    // Should NOT contain hardcoded mobile values — CSS vars handle it
    const styleAttr = header.getAttribute('style') || ''
    expect(styleAttr).not.toContain('14px')
  })

  it('renders desktop ACCOUNT link with desktop-only class', () => {
    renderHeader()
    const accountLinks = screen.getAllByText('ACCOUNT')
    const desktopLink = accountLinks.find(el => el.className.includes('desktop-only'))
    expect(desktopLink).toBeTruthy()
  })

  it('renders mobile ACCOUNT link inside mobile-only container', () => {
    renderHeader()
    const accountLinks = screen.getAllByText('ACCOUNT')
    const mobileLink = accountLinks.find(el => el.closest('.mobile-only') !== null)
    expect(mobileLink).toBeTruthy()
  })

  it('renders both ACCOUNT links (CSS handles visibility)', () => {
    renderHeader()
    const accountLinks = screen.getAllByText('ACCOUNT')
    expect(accountLinks.length).toBe(2)
  })

  it('dropdown menu uses header-dropdown class with data-open attribute', () => {
    const { container } = renderHeader()
    const dropdown = container.querySelector('.header-dropdown')
    expect(dropdown).toBeTruthy()
    expect(dropdown?.getAttribute('data-open')).toBe('false')
  })

  it('dropdown inner uses header-dropdown-inner class for responsive layout', () => {
    const { container } = renderHeader()
    const inner = container.querySelector('.header-dropdown-inner')
    expect(inner).toBeTruthy()
  })

  it('does not import or use useIsMobile hook (no JS-based responsive)', () => {
    // If useIsMobile were imported, there would be conditional rendering
    // (isMobile && ...) which would mean only ONE ACCOUNT link renders.
    // Both being present proves CSS-only approach is used.
    renderHeader()
    const accountLinks = screen.getAllByText('ACCOUNT')
    expect(accountLinks.length).toBe(2)
  })
})
