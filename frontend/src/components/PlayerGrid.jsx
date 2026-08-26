import { CrownIcon, UsersIcon } from './Icons'
import { initials, avatarColor, rateClass } from '../lib/playerVisuals'

export function PlayerGrid({ ranking }) {
  return (
    <div className="card fade-in-2">
      <div className="card-head">
        <UsersIcon />
        <h2>Jogadores</h2>
      </div>
      <div className="player-grid">
        {ranking.map((jogador, index) => (
          <div key={jogador.nome} className={`player-card${index === 0 ? ' leader' : ''}`}>
            <div className="player-card-head">
              <span className="avatar" style={{ background: avatarColor(jogador.nome) }}>{initials(jogador.nome)}</span>
              <h3>{jogador.nome}</h3>
              {index === 0 && <CrownIcon className="crown" />}
            </div>
            <div className="player-stat">
              <span>Vitórias</span>
              <strong style={{ color: '#4ade80' }}>{jogador.vitorias}</strong>
            </div>
            <div className="player-stat">
              <span>Derrotas</span>
              <strong style={{ color: '#f87171' }}>{jogador.derrotas}</strong>
            </div>
            <div className="player-stat">
              <span>Partidas</span>
              <strong>{jogador.partidas}</strong>
            </div>
            <div className="player-stat">
              <span>Aproveit.</span>
              <strong className={rateClass(jogador.aproveitamento)}>{jogador.aproveitamento}%</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
