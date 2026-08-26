import { useState } from 'react'
import { CrownIcon, UsersIcon, PencilIcon, TrashIcon, CheckIcon, XIcon } from './Icons'
import { initials, avatarColor, rateClass } from '../lib/playerVisuals'

export function PlayerGrid({ ranking, onRenomear, onExcluir }) {
  const [editandoId, setEditandoId] = useState(null)
  const [valorEdicao, setValorEdicao] = useState('')

  function iniciarEdicao(jogador) {
    setEditandoId(jogador.id)
    setValorEdicao(jogador.nome)
  }

  function salvarEdicao(jogador) {
    onRenomear(jogador.id, jogador.nome, valorEdicao)
    setEditandoId(null)
  }

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

              {editandoId === jogador.id ? (
                <input
                  className="input player-name-input"
                  autoFocus
                  value={valorEdicao}
                  onChange={(e) => setValorEdicao(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') salvarEdicao(jogador)
                    if (e.key === 'Escape') setEditandoId(null)
                  }}
                  aria-label="Renomear jogador"
                />
              ) : (
                <h3>{jogador.nome}</h3>
              )}

              {index === 0 && editandoId !== jogador.id && <CrownIcon className="crown" />}

              <div className="player-card-actions">
                {editandoId === jogador.id ? (
                  <>
                    <button className="btn-icon" onClick={() => salvarEdicao(jogador)} title="Salvar">
                      <CheckIcon size={14} />
                    </button>
                    <button className="btn-icon" onClick={() => setEditandoId(null)} title="Cancelar">
                      <XIcon size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn-icon" onClick={() => iniciarEdicao(jogador)} title="Renomear">
                      <PencilIcon size={14} />
                    </button>
                    <button className="btn-icon btn-icon-danger-sm" onClick={() => onExcluir(jogador.id, jogador.nome)} title="Excluir">
                      <TrashIcon size={14} />
                    </button>
                  </>
                )}
              </div>
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
