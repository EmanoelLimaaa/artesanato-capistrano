import { describe, it, expect } from 'vitest'
import { filterProducts, orderProducts } from '../../../src/lib/utils/catalog'

describe('catalog - filterProducts', () => {
  const products = [
    {
      id: 1,
      title: 'Vaso de Barro',
      material: 'ARGILA E CERÂMICA',
      description: 'Produto de argila',
      artisan: 'Maria',
      tags: ['Argila e Cerâmica'],
    },
    {
      id: 2,
      title: 'Tapete de Tecido',
      material: 'TÊXTIL E BORDADO',
      description: 'Tecido bordado',
      artisan: 'João',
      tags: ['Tecido'],
    },
    {
      id: 3,
      title: 'Entalhe de Madeira',
      material: 'MADEIRA E ENTALHE',
      description: 'Madeira entalhada',
      artisan: 'Ana',
      tags: ['Madeira'],
    },
    {
      id: 4,
      title: 'Cesto de Palha',
      material: 'PALHA E TRANÇADO',
      description: 'Palha trançada',
      artisan: 'Pedro',
      tags: ['Palha'],
    },
    {
      id: 5,
      title: 'Peça Incomum',
      material: 'OUTROS',
      description: 'Variedade',
      artisan: 'Lia',
      tags: ['Outros'],
    },
  ]

  it('deve retornar lista inteira quando query vazia e filtro Todos', () => {
    const res = filterProducts(products, '   ', 'Todos')
    expect(res.map((p) => p.id)).toEqual([1, 2, 3, 4, 5])
  })

  it('deve filtrar por query (busca por texto)', () => {
    const res = filterProducts(products, 'madeira', 'Todos')
    expect(res.map((p) => p.id)).toEqual([3])
  })

  it('deve filtrar por filtro específico (ex: Argila)', () => {
    const res = filterProducts(products, '', 'Argila')
    expect(res.map((p) => p.id)).toEqual([1])
  })

  it('deve filtrar corretamente por filtro Outros (exclui argila/tecido/madeira/palha)', () => {
    const res = filterProducts(products, '', 'Outros')
    expect(res.map((p) => p.id)).toEqual([5])
  })

  it('deve lidar com inputs nulos/vazios', () => {
    expect(filterProducts(null, '', 'Todos')).toEqual([])
    expect(filterProducts([], '', 'Todos')).toEqual([])
  })

  it('deve ignorar itens nulos dentro do array', () => {
    const res = filterProducts([null, products[0]], '', 'Todos')
    expect(res.map((p) => p.id)).toEqual([1])
  })
})

describe('catalog - orderProducts', () => {
  it('ordena desc por default e trata valores nulos/undefined como maiores (indo ao fim para asc/desc com nossa regra)', () => {
    const res = orderProducts([
      { id: 2 },
      { id: 1 },
      { id: null },
      { id: undefined },
      { id: 3 },
    ])

    // Para desc: ids 3,2,1 depois null/undefined
    expect(res.map((x) => x.id)).toEqual([3, 2, 1, null, undefined])
  })

  it('ordena asc', () => {
    const res = orderProducts([{ id: 2 }, { id: 1 }, { id: 3 }], { orderBy: 'id', direction: 'asc' })
    expect(res.map((x) => x.id)).toEqual([1, 2, 3])
  })
})

