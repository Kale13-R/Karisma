import { render, screen, fireEvent } from '@testing-library/react'
import ProductDetail from '../ProductDetail'
import { CartProvider } from '@/context/CartContext'
import type { Product } from '@/types'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}))

const mockProduct: Product = {
  id: 'karisma-void-hoodie-001',
  name: 'Karisma Void Hoodie 001',
  price: 148.00,
  description: 'Cut from brushed fleece in a colour that refuses definition.',
  imageUrl: '/images/IMG_8709.png',
  sizes: ['S', 'M', 'L', 'XL'],
  inStock: true,
  dropId: 'ss26',
}

describe('ProductDetail', () => {
  it('renders the product name', () => {
    render(<CartProvider><ProductDetail product={mockProduct} /></CartProvider>)
    expect(screen.getByRole('heading', { name: /Karisma Void Hoodie 001/i })).toBeInTheDocument()
  })

  it('renders all 4 size buttons', () => {
    render(<CartProvider><ProductDetail product={mockProduct} /></CartProvider>)
    expect(screen.getByRole('button', { name: 'Small' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Medium' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Large' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Extra Large' })).toBeInTheDocument()
  })

  it('ADD TO YOUR COLLECTION button is disabled when no size selected', () => {
    render(<CartProvider><ProductDetail product={mockProduct} /></CartProvider>)
    const addBtn = screen.getByRole('button', { name: /ADD TO YOUR COLLECTION/i })
    expect(addBtn).toBeDisabled()
  })

  it('ADD TO YOUR COLLECTION button enables after size selection', () => {
    render(<CartProvider><ProductDetail product={mockProduct} /></CartProvider>)
    fireEvent.click(screen.getByRole('button', { name: 'Medium' }))
    const addBtn = screen.getByRole('button', { name: /ADD TO YOUR COLLECTION/i })
    expect(addBtn).not.toBeDisabled()
  })
})
