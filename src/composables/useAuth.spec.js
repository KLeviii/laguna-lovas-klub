import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock supabase auth
const mockGetSession = vi.fn()
const mockSignInWithPassword = vi.fn()
const mockSignOut = vi.fn()
const mockOnAuthStateChange = vi.fn()

vi.mock('@/services/supabase', () => ({
  supabase: {
    auth: {
      getSession: mockGetSession,
      signInWithPassword: mockSignInWithPassword,
      signOut: mockSignOut,
      onAuthStateChange: mockOnAuthStateChange,
    },
  },
}))

describe('useAuth', () => {
  let useAuth

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules()

    // Default mocks
    mockGetSession.mockResolvedValue({ data: { session: null } })
    mockOnAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })

    const mod = await import('./useAuth.js')
    useAuth = mod.useAuth
  })

  // ── signIn ───────────────────────────────────────────────────
  describe('signIn', () => {
    it('calls supabase signInWithPassword and sets user on success', async () => {
      const mockUser = { id: 'u1', email: 'test@test.com' }
      mockSignInWithPassword.mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      })

      const { signIn, user } = useAuth()
      const result = await signIn('test@test.com', 'password123')

      expect(result.success).toBe(true)
      expect(user.value).toEqual(mockUser)
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
      })
    })

    it('returns error on sign-in failure', async () => {
      mockSignInWithPassword.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Invalid credentials' },
      })

      const { signIn, error } = useAuth()
      const result = await signIn('bad@test.com', 'wrong')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid credentials')
      expect(error.value).toBe('Invalid credentials')
    })
  })

  // ── signOut ──────────────────────────────────────────────────
  describe('signOut', () => {
    it('clears user on successful sign out', async () => {
      // First sign in
      const mockUser = { id: 'u1', email: 'test@test.com' }
      mockSignInWithPassword.mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      })
      mockSignOut.mockResolvedValueOnce({ error: null })

      const { signIn, signOut, user } = useAuth()
      await signIn('test@test.com', 'pass')
      expect(user.value).toEqual(mockUser)

      const result = await signOut()

      expect(result.success).toBe(true)
      expect(user.value).toBeNull()
      expect(mockSignOut).toHaveBeenCalled()
    })

    it('returns error on sign-out failure', async () => {
      mockSignOut.mockResolvedValueOnce({ error: { message: 'Sign out failed' } })

      const { signOut, error } = useAuth()
      const result = await signOut()

      expect(result.success).toBe(false)
      expect(result.error).toBe('Sign out failed')
      expect(error.value).toBe('Sign out failed')
    })
  })

  // ── initAuth ─────────────────────────────────────────────────
  describe('initAuth', () => {
    it('sets user from existing session', async () => {
      const mockUser = { id: 'u1', email: 'existing@test.com' }
      mockGetSession.mockResolvedValueOnce({
        data: { session: { user: mockUser } },
      })

      const { initAuth, user, authReady } = useAuth()
      await initAuth()

      expect(user.value).toEqual(mockUser)
      expect(authReady.value).toBe(true)
    })

    it('sets authReady even when no session exists', async () => {
      mockGetSession.mockResolvedValueOnce({
        data: { session: null },
      })

      const { initAuth, user, authReady } = useAuth()
      await initAuth()

      expect(user.value).toBeNull()
      expect(authReady.value).toBe(true)
    })
  })
})
