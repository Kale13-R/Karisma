import { render, screen, act } from '@testing-library/react'
import GatePage from '../page'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

describe('GatePage', () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_DROP_TIMESTAMP
  })

  it('renders the video element', async () => {
    await act(async () => {
      render(<GatePage />)
    })
    expect(document.querySelector('video')).toBeInTheDocument()
  })

  it('shows PasswordEntry when no drop timestamp is set', async () => {
    await act(async () => {
      render(<GatePage />)
    })
    expect(screen.getByPlaceholderText('enter password')).toBeInTheDocument()
  })
})
