export interface DropState {
  status: 'loading' | 'countdown' | 'open'
  timeRemaining: number | null
}

export interface UserSession {
  sessionId: string
  grantedAt: number
  expiresAt: number
  isAuthenticated: boolean
}

export interface GatePasswordPayload {
  password: string
}

export interface GateAuthResponse {
  success: boolean
  session?: UserSession
  error?: string
}

export interface User {
  id: number
  email: string
  created_at: string
}

export interface AccountAuthResponse {
  success: boolean
  user?: User
  error?: string
  detail?: string
}

export interface Product {
  id: string
  name: string
  price: number
  description: string
  imageUrl: string
  sizes: string[]
  inStock: boolean
  dropId: string
}

export interface CartItem {
  product: Product
  size: string
  quantity: number
}
