export function installSupabaseMock(config = {}) {
  if (typeof window === 'undefined') return

  const defaultState = {
    profileById: {
      'user-mock': {
        id: 'user-mock',
        nome: 'Artesão Mock',
        especialidade: 'ARGILA E CERÂMICA',
        biografia: 'Bio mock',
        whatsapp: '85999991111',
        email: 'artesao@mock.com',
        foto_perfil: null,
      },
    },
    productsByArtesaoId: {
      'user-mock': [],
    },
  }

  const state = {
    ...defaultState,
    ...(config.initialState || {}),
  }

  const overrides = config

  const getProfile = async ({ id }) => {
    return {
      data: state.profileById[id] ?? null,
      error: null,
    }
  }

  const listProducts = async ({ artesao_id } = {}) => {
    const id = artesao_id ?? 'user-mock'
    return {
      data: state.productsByArtesaoId[id] ?? [],
      error: null,
    }
  }

  const insertProduct = async (rows) => {
    const row = Array.isArray(rows) ? rows[0] : rows
    const artesaoId = row.artesao_id ?? 'user-mock'
    const id = `p-${Math.random().toString(36).slice(2, 9)}`

    const inserted = {
      id,
      nome: row.nome,
      descricao: row.descricao,
      categoria: row.categoria,
      preco: row.preco,
      preco_sugerido: row.preco_sugerido ?? row.preco,
      imagem: row.imagem,
      artesao_id: artesaoId,
    }

    state.productsByArtesaoId[artesaoId] = [inserted, ...(state.productsByArtesaoId[artesaoId] ?? [])]

    return { data: inserted, error: null }
  }

  const deleteProduct = async ({ id } = {}) => {
    const all = Object.keys(state.productsByArtesaoId)
    for (const artesaoId of all) {
      state.productsByArtesaoId[artesaoId] = (state.productsByArtesaoId[artesaoId] ?? []).filter((p) => p.id !== id)
    }
    return { error: null }
  }

  const updateProfile = async ({ values, id } = {}) => {
    state.profileById[id] = {
      ...(state.profileById[id] ?? { id }),
      ...values,
    }
    return { error: null }
  }

  const mock = {
    signInWithPassword: async () => ({ data: {}, error: null }),
    signOut: async () => ({ error: null }),
    resetPasswordForEmail: async () => ({ error: null }),
    signUp: async () => ({ data: { user: { id: 'user-mock' } }, error: null }),
    getUser: async () => {
      const testUser = window.__SUPABASE_TEST_USER__
      const id = testUser?.id ?? 'user-mock'
      return { data: { user: { id } }, error: null }
    },
    getSession: async () => {
      const testUser = window.__SUPABASE_TEST_USER__
      const id = testUser?.id ?? 'user-mock'
      return { data: { session: { user: { id } } }, error: null }
    },
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    getProfile: async () => getProfile({ id: 'user-mock' }),
    listMyProducts: async () => listProducts({ artesao_id: 'user-mock' }),
    insertProduct: async (rows) => insertProduct(rows),
    deleteProduct: async (payload) => deleteProduct(payload),
    updateProfile: async (values) => updateProfile({ values, id: 'user-mock' }),
    _state: state,
  }

  window.__SUPABASE_MOCK__ = mock

  window.supabase = {
    auth: {
      signInWithPassword: (payload) => window.__SUPABASE_MOCK__.signInWithPassword(payload),
      signOut: () => window.__SUPABASE_MOCK__.signOut(),
      resetPasswordForEmail: (email, opts) => window.__SUPABASE_MOCK__.resetPasswordForEmail(email, opts),
      signUp: (payload) => window.__SUPABASE_MOCK__.signUp(payload),
      getUser: () => window.__SUPABASE_MOCK__.getUser(),
      onAuthStateChange: (cb) => {
        cb('SIGNED_IN', { id: 'user-mock' })
        return window.__SUPABASE_MOCK__.onAuthStateChange(cb)
      },
    },

    from: (table) => {
      const api = {
        _eq: null,
        _selected: null,


        select: (columns) => {
          api._selected = columns
          return api
        },
        order: () => api,
        eq: (col, val) => {
          api._eq = { col, val }
          return api
        },
        maybeSingle: async () => {
          if (table === 'artesaos') {
            const id = api._eq?.val ?? 'user-mock'
            return getProfile({ id })
          }
          return { data: null, error: null }
        },

        _resolve: async () => {
          if (table === 'produtos') return listProducts({ artesao_id: api._eq?.val })
          if (table === 'artesaos') return getProfile({ id: api._eq?.val ?? 'user-mock' })
          return { data: [], error: null }
        },


        insert: async (rows) => {
          if (table === 'produtos') {
            const { data, error } = await insertProduct(rows)
            return { data, error }
          }
          if (table === 'artesaos') {
            const row = Array.isArray(rows) ? rows[0] : rows
            state.profileById[row.id] = { ...(state.profileById[row.id] ?? {}), ...row }
            return { data: row, error: null }
          }
          return { data: null, error: null }
        },

        update: async (values) => {
          if (table === 'artesaos') {
            const id = api._eq?.val ?? 'user-mock'
            return updateProfile({ values, id })
          }
          return { error: null }
        },

        delete: async () => {
          const id = api._eq?.val
          return deleteProduct({ id })
        },

        single: async () => {
          if (table === 'produtos') {
            const { data, error } = await insertProduct(overrides?.__lastInsertRows ?? [])
            return { data, error }
          }
          return { data: null, error: null }
        },
      }

      api.single = async () => {
        if (table === 'produtos') {
          const { data, error } = await insertProduct(overrides?.__lastInsertRows ?? [])
          return { data, error }
        }
        return { data: null, error: null }
      }

      api.maybeSingleData = null

      api._run = async () => {
        if (table === 'produtos') {
          const artesaoId = api._eq?.val
          return listProducts({ artesao_id: artesaoId })
        }
        if (table === 'artesaos') {
          const id = api._eq?.val ?? 'user-mock'
          return getProfile({ id })
        }
        return { data: [], error: null }
      }

      api.then = undefined

      return api
    },

    storage: {
      from: (bucket) => {
        return {
          upload: async () => ({ error: null }),
          getPublicUrl: async (fileName) => ({
            data: { publicUrl: `https://example.com/${bucket}/${fileName}` },
          }),
        }
      },
    },
  }

  return mock
}


