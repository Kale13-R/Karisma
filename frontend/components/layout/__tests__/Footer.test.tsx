import { render, screen } from '@testing-library/react'
import Footer from '../Footer'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

import { usePathname } from 'next/navigation'
const mockUsePathname = usePathname as jest.Mock

describe('Footer', () => {
  it('renders footer links on a standard page', () => {
    mockUsePathname.mockReturnValue('/')
    render(<Footer />)
    expect(screen.getByRole('link', { name: 'ABOUT' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'CONTACT' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'ARCHIVE' })).toBeInTheDocument()
  })

  it('renders copyright text', () => {
    mockUsePathname.mockReturnValue('/')
    render(<Footer />)
    expect(screen.getByText(/KARISMA/i)).toBeInTheDocument()
  })

  it('returns null on /gate', () => {
    mockUsePathname.mockReturnValue('/gate')
    const { container } = render(<Footer />)
    expect(container.firstChild).toBeNull()
  })

  it('renders on /about', () => {
    mockUsePathname.mockReturnValue('/about')
    render(<Footer />)
    expect(screen.getByRole('link', { name: 'ABOUT' })).toBeInTheDocument()
  })
})
