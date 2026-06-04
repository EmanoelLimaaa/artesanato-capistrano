export function isValidEmail(email) {
  if (typeof email !== 'string') return false
  const value = email.trim()
  if (!value) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function validatePassword(password) {
  if (typeof password !== 'string') return { ok: false, message: 'Senha inválida' }
  const value = password
  if (!value) return { ok: false, message: 'A senha precisa ter no mínimo 6 caracteres' }
  if (value.length < 6) {
    return { ok: false, message: 'A senha precisa ter no mínimo 6 caracteres' }
  }
  return { ok: true, message: '' }
}

export function normalizePhoneDigits(input) {
  if (typeof input !== 'string') return ''
  return input.replace(/\D/g, '')
}

