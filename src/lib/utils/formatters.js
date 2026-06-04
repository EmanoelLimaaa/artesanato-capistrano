export function formatPriceBRL(value) {
  const num = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(num)) return 'R$ 0,00'

  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num)

  // Algumas plataformas retornam NBSP (\u00A0) após "R$".
  return formatted.replace(/R\$\u00A0/, 'R$ ')
}



