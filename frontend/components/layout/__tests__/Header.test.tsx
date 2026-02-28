import { render, screen } from '@testing-library/react'
import Header from '../Header'
import { CartProvider } from '@/context/CartContext'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: () => ({ push: jest.fn() }),
}))

import { usePathname } from 'next/navigation'
const mockUsePathname = usePathname as jest.Mock

describe('Header', () => {
  it('returns null when pathname is /gate', () => {
    mockUsePathname.mockReturnValue('/gate')
    const { container } = render(<CartProvider><Header /></CartProvider>)
    expect(container.firstChild).toBeNull()
  })

  it('renders KARISMA wordmark when pathname is /', () => {
    mockUsePathname.mockReturnValue('/')
    render(<CartProvider><Header /></CartProvider>)
    expect(screen.getByRole('link', { name: 'KARISMA' })).toBeInTheDocument()
  })
})
