function rateClass(pct) {
  if (pct >= 60) return 'rate rate-high'
  if (pct >= 40) return 'rate rate-mid'
  return 'rate rate-low'
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
              <span>🏆 Vitórias</span>
              <strong style={{ color: '#4ade80' }}>{jogador.vitorias}</strong>
            </div>
            <div className="player-stat">
              <span>❌ Derrotas</span>
              <strong style={{ color: '#f87171' }}>{jogador.derrotas}</strong>
            </div>
            <div className="player-stat">
              <span>🎮 Partidas</span>
              <strong>{jogador.partidas}</strong>
            </div>
            <div className="player-stat">
              <span>📊 Aproveit.</span>
              <strong className={rateClass(jogador.aproveitamento)}>{jogador.aproveitamento}%</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
