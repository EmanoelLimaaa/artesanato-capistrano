function normalizeString(input) {
  if (typeof input !== 'string') return ''
  return input.trim().toLowerCase()
}

function matchesQuery(product, query) {
  const q = normalizeString(query)
  if (!q) return true

  const haystack = `${product.material} ${product.artisan} ${product.title} ${product.description} ${
    Array.isArray(product.tags) ? product.tags.join(' ') : ''
  }`.toLowerCase()

  return haystack.includes(q)
}

function matchesFilter(product, activeFilter) {
  if (!activeFilter || activeFilter === 'Todos') return true

  const filterLower = String(activeFilter).toLowerCase()
  if (activeFilter === 'Outros') {
    const excluded = ['argila', 'tecido', 'madeira', 'palha']
    const materialLower = String(product.material).toLowerCase()
    const tagsLower = Array.isArray(product.tags) ? product.tags.map((t) => String(t).toLowerCase()) : []

    // Mantém a regra do componente: "Outros" exclui materiais/tags que contenham as categorias base.
    return !excluded.some((m) =>
      materialLower.includes(m) || tagsLower.some((t) => t.includes(m))
    )
  }

  return (

    String(product.material).toLowerCase().includes(filterLower) ||
    (Array.isArray(product.tags) && product.tags.some((t) => normalizeString(t).includes(filterLower)))
  )
}

export function filterProducts(products, query, activeFilter) {
  if (!Array.isArray(products)) return []

  return products.filter((p) => {
    if (!p) return false
    if (!matchesFilter(p, activeFilter)) return false
    if (!matchesQuery(p, query)) return false
    return true
  })
}

export function orderProducts(products, { orderBy = 'id', direction = 'desc' } = {}) {
  if (!Array.isArray(products)) return []
  const dir = direction === 'asc' ? 1 : -1

  return [...products].sort((a, b) => {
    const av = a?.[orderBy]
    const bv = b?.[orderBy]

    const aNil = av === null || av === undefined
    const bNil = bv === null || bv === undefined
    if (aNil && bNil) return 0
    if (aNil) return 1
    if (bNil) return -1

    if (typeof av === 'number' && typeof bv === 'number') return dir * (av - bv)

    return dir * String(av).localeCompare(String(bv), 'pt-BR')
  })
}

