import { renderHook, act, waitFor } from '@testing-library/react'
import { UserProvider, useUser } from '../UserContext'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <UserProvider>{children}</UserProvider>
)

const mockUser = { id: 1, email: 'test@example.com', created_at: '2026-03-17' }

beforeEach(() => {
  jest.resetAllMocks()
})

describe('UserContext', () => {
  it('starts loading then resolves to null when unauthenticated', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false }),
    } as Response)

    const { result } = renderHook(() => useUser(), { wrapper })
    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.user).toBeNull()
  })

  it('hydrates user from /api/accounts/me on mount', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, user: mockUser }),
    } as Response)

    const { result } = renderHook(() => useUser(), { wrapper })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.user).toEqual(mockUser)
  })

  it('register sets user on success', async () => {
    // Initial /me call → unauthenticated
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: false, json: async () => ({ success: false }) } as Response)
      // register call → success
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, user: mockUser }) } as Response)

    const { result } = renderHook(() => useUser(), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))

    let response
    await act(async () => {
      response = await result.current.register('test@example.com', 'password123')
    })

    expect(response).toEqual({ success: true, user: mockUser })
    expect(result.current.user).toEqual(mockUser)
  })

  it('login sets user on success', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: false, json: async () => ({ success: false }) } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, user: mockUser }) } as Response)

    const { result } = renderHook(() => useUser(), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.login('test@example.com', 'password123')
    })

    expect(result.current.user).toEqual(mockUser)
  })

  it('logout clears user', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, user: mockUser }) } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) } as Response)

    const { result } = renderHook(() => useUser(), { wrapper })
    await waitFor(() => expect(result.current.user).toEqual(mockUser))

    await act(async () => {
      await result.current.logout()
    })

    expect(result.current.user).toBeNull()
  })

  it('register handles empty JSON response gracefully', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: false, json: async () => ({ success: false }) } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => { throw new SyntaxError('Unexpected end of JSON input') },
      } as Response)

    const { result } = renderHook(() => useUser(), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))

    let response: any
    await act(async () => {
      response = await result.current.register('test@example.com', 'password123')
    })

    expect(response.success).toBe(false)
    expect(response.error).toBe('Unexpected server response')
    expect(result.current.user).toBeNull()
  })

  it('login handles server error with empty body', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: false, json: async () => ({ success: false }) } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => { throw new SyntaxError('Unexpected end of JSON input') },
      } as Response)

    const { result } = renderHook(() => useUser(), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))

    let response: any
    await act(async () => {
      response = await result.current.login('test@example.com', 'password123')
    })

    expect(response.success).toBe(false)
    expect(response.error).toBe('Server error (500)')
    expect(result.current.user).toBeNull()
  })
})
