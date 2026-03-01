import { renderHook, act } from '@testing-library/react'
import { CartProvider, useCart } from '../CartContext'
import type { Product } from '@/types'
import type { CartItem } from '@/types'

const mockProduct: Product = {
  id: 'test-001',
  name: 'Test Product',
  price: 100,
  description: 'Test description',
  imageUrl: '/images/test.png',
  sizes: ['S', 'M', 'L'],
  inStock: true,
  dropId: 'ss26',
}

const mockItem: CartItem = {
  product: mockProduct,
  size: 'M',
  quantity: 1,
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

beforeEach(() => {
  sessionStorage.clear()
})

describe('CartContext', () => {
  it('addItem increases itemCount by 1', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    expect(result.current.itemCount).toBe(0)
    act(() => { result.current.addItem(mockItem) })
    expect(result.current.itemCount).toBe(1)
  })

  it('removeItem decreases itemCount', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => { result.current.addItem(mockItem) })
    expect(result.current.itemCount).toBe(1)
    act(() => { result.current.removeItem(0) })
    expect(result.current.itemCount).toBe(0)
  })

  it('openDrawer sets isDrawerOpen to true', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    expect(result.current.isDrawerOpen).toBe(false)
    act(() => { result.current.openDrawer() })
    expect(result.current.isDrawerOpen).toBe(true)
  })

  it('clearCart empties items array', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => { result.current.addItem(mockItem) })
    act(() => { result.current.addItem(mockItem) })
    expect(result.current.items.length).toBe(2)
    act(() => { result.current.clearCart() })
    expect(result.current.items.length).toBe(0)
  })
})
