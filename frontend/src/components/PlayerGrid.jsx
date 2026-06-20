function rateClass(pct) {
  if (pct >= 60) return 'rate rate-high'
  if (pct >= 40) return 'rate rate-mid'
  return 'rate rate-low'
}

function eloClass(elo) {
  if (elo > 1000) return 'rate rate-high'
  if (elo < 1000) return 'rate rate-low'
  return ''
}

function streakLabel(streak) {
  if (streak === 0) return null
  if (streak > 0) return `🔥 ${streak}`
  return `❄️ ${Math.abs(streak)}`
}

export function PlayerGrid({ ranking }) {
  return (
    <div className="card fade-in-4">
      <h2>👤 Jogadores</h2>
      <div className="player-grid">
        {ranking.map((jogador, index) => (
          <div key={jogador.nome} className={`player-card${index === 0 ? ' leader' : ''}`}>
            <h3>{index === 0 ? '👑 ' : ''}{jogador.nome}</h3>
            <div className="player-stat">
              <span>⚡ ELO</span>
              <strong className={eloClass(jogador.elo)} style={{ fontSize: 16 }}>{jogador.elo}</strong>
            </div>
            <div className="player-stat">
              <span>🏆 Vitórias</span>
              <strong style={{ color: '#4ade80' }}>{jogador.vitorias}</strong>
            </div>
            <div className="player-stat">
              <span>❌ Derrotas</span>
              <strong style={{ color: '#f87171' }}>{jogador.derrotas}</strong>
            </div>
            <div className="player-stat">
              <span>📊 Aproveit.</span>
              <strong className={rateClass(jogador.aproveitamento)}>{jogador.aproveitamento}%</strong>
            </div>
            {streakLabel(jogador.streak) && (
              <div className="player-stat" style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #334155' }}>
                <span>Sequência</span>
                <strong style={{ fontSize: 14 }}>{streakLabel(jogador.streak)}</strong>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
