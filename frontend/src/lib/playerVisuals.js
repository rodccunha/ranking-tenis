const AVATAR_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ec4899', '#14b8a6']

export function initials(nome) {
  const partes = nome.trim().split(/\s+/)
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : ''
  return (partes[0][0] + ultima).toUpperCase()
}

export function avatarColor(nome) {
  const soma = [...nome].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return AVATAR_COLORS[soma % AVATAR_COLORS.length]
}

export function rateClass(pct) {
  if (pct >= 60) return 'rate rate-high'
  if (pct >= 40) return 'rate rate-mid'
  return 'rate rate-low'
}

export function rankBadge(posicao) {
  if (posicao === 1) return { className: 'rank-badge rank-1', label: '1' }
  if (posicao === 2) return { className: 'rank-badge rank-2', label: '2' }
  if (posicao === 3) return { className: 'rank-badge rank-3', label: '3' }
  return { className: 'rank-badge rank-n', label: String(posicao) }
}
