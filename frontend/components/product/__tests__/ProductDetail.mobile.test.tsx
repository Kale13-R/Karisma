import { render, screen } from '@testing-library/react'
import ProductDetail from '../ProductDetail'
import { CartProvider } from '@/context/CartContext'
import type { Product } from '@/types'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, sizes }: { src: string; alt: string; sizes?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} data-sizes={sizes} />
  ),
}))

const mockProduct: Product = {
  id: 'test-tee-001',
  name: 'Test Tee',
  price: 99.00,
  description: 'A test product.',
  imageUrl: '/images/test.png',
  sizes: ['S', 'M', 'L', 'XL'],
  inStock: true,
  dropId: 'test-drop',
}

const mockRelated: Product[] = [
  { id: 'related-1', name: 'Related One', price: 50, description: '', imageUrl: '/images/r1.png', sizes: ['M'], inStock: true, dropId: 'test-drop' },
  { id: 'related-2', name: 'Related Two', price: 60, description: '', imageUrl: '/images/r2.png', sizes: ['L'], inStock: true, dropId: 'test-drop' },
]

function renderPDP(props?: { relatedProducts?: Product[] }) {
  return render(
    <CartProvider>
      <ProductDetail product={mockProduct} {...props} />
    </CartProvider>
  )
}

describe('ProductDetail — mobile responsive CSS classes', () => {
  it('main element has pdp-layout class (CSS handles grid/flex switch)', () => {
    renderPDP()
    const main = screen.getByRole('main')
    expect(main.className).toContain('pdp-layout')
  })

  it('main element does NOT have inline display/gridTemplateColumns (CSS class controls layout)', () => {
    renderPDP()
    const main = screen.getByRole('main')
    const styleAttr = main.getAttribute('style') || ''
    expect(styleAttr).not.toContain('display')
    expect(styleAttr).not.toContain('grid-template-columns')
  })

  it('image panel has pdp-image class (CSS handles sticky/relative + height)', () => {
    const { container } = renderPDP()
    const imagePanel = container.querySelector('.pdp-image')
    expect(imagePanel).toBeTruthy()
  })

  it('image panel does NOT have inline position/top/height (CSS class controls)', () => {
    const { container } = renderPDP()
    const imagePanel = container.querySelector('.pdp-image')
    const styleAttr = imagePanel?.getAttribute('style') || ''
    expect(styleAttr).not.toContain('position')
    expect(styleAttr).not.toContain('top:')
    expect(styleAttr).not.toContain('height')
  })

  it('content panel has pdp-content class', () => {
    const { container } = renderPDP()
    const content = container.querySelector('.pdp-content')
    expect(content).toBeTruthy()
  })

  it('spacer has pdp-spacer class (hidden on mobile via CSS)', () => {
    const { container } = renderPDP()
    const spacer = container.querySelector('.pdp-spacer')
    expect(spacer).toBeTruthy()
  })

  it('spacer is always rendered (CSS hides it on mobile, not JS)', () => {
    const { container } = renderPDP()
    const spacer = container.querySelector('.pdp-spacer')
    // If JS controlled this, spacer might be null on mobile.
    // Being present proves CSS-only approach.
    expect(spacer).toBeInTheDocument()
  })

  it('size buttons container has pdp-sizes class (grid on mobile via CSS)', () => {
    const { container } = renderPDP()
    const sizes = container.querySelector('.pdp-sizes')
    expect(sizes).toBeTruthy()
  })

  it('size buttons do NOT have inline width/height (controlled by CSS class)', () => {
    renderPDP()
    const sizeBtn = screen.getByRole('button', { name: 'Small' })
    const styleAttr = sizeBtn.getAttribute('style') || ''
    expect(styleAttr).not.toContain('width')
    expect(styleAttr).not.toContain('height')
  })

  it('add-to-cart button has pdp-add-btn class', () => {
    renderPDP()
    const addBtn = screen.getByRole('button', { name: /ADD TO YOUR COLLECTION/i })
    expect(addBtn.className).toContain('pdp-add-btn')
  })

  it('add-to-cart button does NOT have inline width/height (controlled by CSS class)', () => {
    renderPDP()
    const addBtn = screen.getByRole('button', { name: /ADD TO YOUR COLLECTION/i })
    const styleAttr = addBtn.getAttribute('style') || ''
    expect(styleAttr).not.toContain('width')
    expect(styleAttr).not.toContain('height')
  })

  it('product image uses responsive sizes attribute', () => {
    renderPDP()
    const img = screen.getByAltText('Test Tee')
    expect(img.getAttribute('data-sizes')).toBe('(max-width: 767px) 100vw, 50vw')
  })

  it('related products grid has pdp-related-grid class', () => {
    const { container } = renderPDP({ relatedProducts: mockRelated })
    const relatedGrid = container.querySelector('.pdp-related-grid')
    expect(relatedGrid).toBeTruthy()
  })

  it('related products grid does NOT have inline grid-template-columns (CSS controls)', () => {
    const { container } = renderPDP({ relatedProducts: mockRelated })
    const relatedGrid = container.querySelector('.pdp-related-grid')
    const styleAttr = relatedGrid?.getAttribute('style') || ''
    expect(styleAttr).not.toContain('grid-template-columns')
  })

  it('related product images use responsive sizes', () => {
    renderPDP({ relatedProducts: mockRelated })
    const relImg = screen.getByAltText('Related One')
    expect(relImg.getAttribute('data-sizes')).toBe('(max-width: 767px) 50vw, 12vw')
  })
})
