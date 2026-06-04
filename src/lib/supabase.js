import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// O Playwright injeta este mock antes do bundle para testar rotas autenticadas.
const browserSupabaseMock = () => {
  if (typeof window === 'undefined') return null
  return window.__SUPABASE_MOCK__ ?? null
}

const browserE2EUser = () => {
  if (typeof window === 'undefined') return null
  const testUser = window.__SUPABASE_TEST_USER__
  if (!testUser?.id) return null
  return {
    id: String(testUser.id),
  }
}

const e2eAuthPatch = () => {
  if (typeof window === 'undefined') return null
  if (!window.__SUPABASE_E2E_AUTH_PATCHED__) {
    window.__SUPABASE_E2E_AUTH_PATCHED__ = true
    const user = browserE2EUser()
    if (user) {
      window.__SUPABASE_E2E_AUTH_USER__ = user
    }
  }
  return null
}

e2eAuthPatch()

export const supabase = browserSupabaseMock() ?? createClient(supabaseUrl, supabaseAnonKey)


