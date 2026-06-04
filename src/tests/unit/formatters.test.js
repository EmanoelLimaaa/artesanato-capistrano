import { describe, it, expect } from 'vitest'
import { formatPriceBRL } from '../../../src/lib/utils/formatters'

describe('formatters - formatPriceBRL', () => {
  it('formata números para BRL', () => {
    expect(formatPriceBRL(10)).toBe('R$ 10,00')
    expect(formatPriceBRL('10')).toBe('R$ 10,00')
  })

  it('retorna R$ 0,00 para valores inválidos', () => {
    expect(formatPriceBRL(null)).toBe('R$ 0,00')
    expect(formatPriceBRL(undefined)).toBe('R$ 0,00')
    expect(formatPriceBRL('')).toBe('R$ 0,00')
    expect(formatPriceBRL('abc')).toBe('R$ 0,00')
  })
})

