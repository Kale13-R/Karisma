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
