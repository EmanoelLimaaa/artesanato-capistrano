(() => {
  const defaultState = {
    profileById: {
      'user-mock': {
        id: 'user-mock',
        nome: 'Artesao Mock',
        especialidade: 'ARGILA E CERAMICA',
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

  const initialState = window.__SUPABASE_MOCK_INITIAL_STATE__ || {}
  const state = {
    ...defaultState,
    ...initialState,
    profileById: {
      ...defaultState.profileById,
      ...(initialState.profileById || {}),
    },
    productsByArtesaoId: {
      ...defaultState.productsByArtesaoId,
      ...(initialState.productsByArtesaoId || {}),
    },
  }

  window.__SUPABASE_TEST_USER__ = window.__SUPABASE_TEST_USER__ || { id: 'user-mock' }

  const getUserId = () => window.__SUPABASE_TEST_USER__?.id || 'user-mock'

  const getProfile = async (id = getUserId()) => ({
    data: state.profileById[id] || null,
    error: null,
  })

  const listProducts = async (artesaoId = getUserId()) => ({
    data: state.productsByArtesaoId[artesaoId] || [],
    error: null,
  })

  const insertProduct = async (rows) => {
    const row = Array.isArray(rows) ? rows[0] : rows
    const artesaoId = row.artesao_id || getUserId()
    const inserted = {
      id: `p-${Math.random().toString(36).slice(2, 9)}`,
      nome: row.nome,
      descricao: row.descricao,
      categoria: row.categoria,
      preco: row.preco,
      preco_sugerido: row.preco_sugerido ?? row.preco,
      imagem: row.imagem,
      artesao_id: artesaoId,
    }

    state.productsByArtesaoId[artesaoId] = [
      inserted,
      ...(state.productsByArtesaoId[artesaoId] || []),
    ]

    return { data: inserted, error: null }
  }

  const deleteProduct = async (id) => {
    Object.keys(state.productsByArtesaoId).forEach((artesaoId) => {
      state.productsByArtesaoId[artesaoId] = (state.productsByArtesaoId[artesaoId] || []).filter(
        (product) => product.id !== id,
      )
    })

    return { error: null }
  }

  const updateProfile = async (id, values) => {
    state.profileById[id] = {
      ...(state.profileById[id] || { id }),
      ...values,
    }

    return { error: null }
  }

  const createQuery = (table) => {
    const query = {
      _eq: null,
      _insertRows: null,
      select() {
        return query
      },
      order() {
        return query
      },
      eq(col, val) {
        query._eq = { col, val }
        return query
      },
      insert(rows) {
        query._insertRows = rows
        return query
      },
      update(values) {
        query._updateValues = values
        return query
      },
      delete() {
        query._delete = true
        return query
      },
      async maybeSingle() {
        if (table === 'artesaos') return getProfile(query._eq?.val)
        return { data: null, error: null }
      },
      async single() {
        if (table === 'produtos' && query._insertRows) return insertProduct(query._insertRows)
        return { data: null, error: null }
      },
      async then(resolve, reject) {
        try {
          if (table === 'produtos') {
            if (query._delete) return resolve(await deleteProduct(query._eq?.val))
            return resolve(await listProducts(query._eq?.val))
          }

          if (table === 'artesaos') {
            if (query._updateValues) {
              return resolve(await updateProfile(query._eq?.val || getUserId(), query._updateValues))
            }
            return resolve(await getProfile(query._eq?.val))
          }

          return resolve({ data: [], error: null })
        } catch (error) {
          return reject(error)
        }
      },
    }

    return query
  }

  window.__SUPABASE_MOCK__ = {
    auth: {
      signInWithPassword: async () => ({ data: {}, error: null }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ error: null }),
      signUp: async () => ({ data: { user: { id: getUserId() } }, error: null }),
      getUser: async () => ({ data: { user: { id: getUserId() } }, error: null }),
      getSession: async () => ({ data: { session: { user: { id: getUserId() } } }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    },
    from: createQuery,
    storage: {
      from: (bucket) => ({
        upload: async () => ({ error: null }),
        getPublicUrl: (fileName) => ({
          data: { publicUrl: `https://example.com/${bucket}/${fileName}` },
        }),
      }),
    },
    _state: state,
  }
})()
