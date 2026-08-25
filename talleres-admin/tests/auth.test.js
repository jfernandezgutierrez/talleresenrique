import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(),
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
  maybeSingle: vi.fn(),
}))

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: mocks.getSession,
      onAuthStateChange: mocks.onAuthStateChange,
      signInWithPassword: mocks.signInWithPassword,
      signOut: mocks.signOut,
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({ maybeSingle: mocks.maybeSingle })),
      })),
    })),
  },
}))

import { useAuthStore } from '../src/stores/auth.js'

describe('autenticación administrativa', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mocks.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })
  })

  it('acepta una cuenta incluida en admin_users', async () => {
    mocks.signInWithPassword.mockResolvedValue({ data: { user: { id: 'admin-1' } }, error: null })
    mocks.maybeSingle.mockResolvedValue({ data: { user_id: 'admin-1' }, error: null })

    const result = await useAuthStore().login('admin@example.com', 'correcta')

    expect(result.ok).toBe(true)
    expect(useAuthStore().isAdmin).toBe(true)
  })

  it('cierra la sesión de una cuenta que no está autorizada', async () => {
    mocks.signInWithPassword.mockResolvedValue({ data: { user: { id: 'otro' } }, error: null })
    mocks.maybeSingle.mockResolvedValue({ data: null, error: null })

    const result = await useAuthStore().login('otro@example.com', 'correcta')

    expect(result.ok).toBe(false)
    expect(mocks.signOut).toHaveBeenCalledOnce()
  })
})
