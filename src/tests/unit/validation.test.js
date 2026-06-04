import { describe, it, expect } from 'vitest'
import { isValidEmail, normalizePhoneDigits, validatePassword } from '../../../src/lib/utils/validation'

describe('validation - email', () => {
  it('deve retornar true para email válido', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
    expect(isValidEmail('  user@example.com  ')).toBe(true)
  })

  it('deve retornar false para email vazio', () => {
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail('   ')).toBe(false)
  })

  it('deve retornar false para email inválido', () => {
    expect(isValidEmail('user')).toBe(false)
    expect(isValidEmail('user@com')).toBe(false)
    expect(isValidEmail('user@.com')).toBe(false)
    expect(isValidEmail('user@@example.com')).toBe(false)
  })

  it('deve retornar false para valores nulos e não-string', () => {
    expect(isValidEmail(null)).toBe(false)
    expect(isValidEmail(undefined)).toBe(false)
    expect(isValidEmail(123)).toBe(false)
  })
})

describe('validation - password', () => {
  it('deve aceitar senha com 6 ou mais caracteres', () => {
    const res = validatePassword('123456')
    expect(res.ok).toBe(true)
  })

  it('deve rejeitar senha menor que 6 caracteres', () => {
    const res = validatePassword('12345')
    expect(res.ok).toBe(false)
    expect(res.message).toMatch(/mínimo 6/i)
  })

  it('deve rejeitar senha vazia', () => {
    const res = validatePassword('')
    expect(res.ok).toBe(false)
  })

  it('deve rejeitar valores nulos e não-string', () => {
    expect(validatePassword(null).ok).toBe(false)
    expect(validatePassword(undefined).ok).toBe(false)
    expect(validatePassword(123).ok).toBe(false)
  })
})

describe('validation - phone normalize', () => {
  it('remove caracteres não numéricos', () => {
    expect(normalizePhoneDigits('(85) 99999-1111')).toBe('85999991111')
  })

  it('retorna string vazia para entrada inválida', () => {
    expect(normalizePhoneDigits(null)).toBe('')
    expect(normalizePhoneDigits(undefined)).toBe('')
    expect(normalizePhoneDigits(123)).toBe('')
  })

  it('mantém apenas dígitos quando já está limpo', () => {
    expect(normalizePhoneDigits('85999991111')).toBe('85999991111')
  })
})

