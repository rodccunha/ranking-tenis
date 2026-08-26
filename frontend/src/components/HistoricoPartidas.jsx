import { useState, useEffect } from 'react'
import { CalendarIcon, TrophyIcon, TrashIcon } from './Icons'

const POR_PAGINA = 5

export function HistoricoPartidas({ partidas, onExcluir }) {
  const [pagina, setPagina] = useState(1)

  const total = Math.ceil(partidas.length / POR_PAGINA)
  const paginaValida = Math.min(pagina, Math.max(1, total))
  const itens = partidas.slice((paginaValida - 1) * POR_PAGINA, paginaValida * POR_PAGINA)

  useEffect(() => {
    setPagina(1)
  }, [partidas.length])

  return (
    <div className="card fade-in-4">
      <div className="card-head">
        <CalendarIcon />
        <h2>Histórico de Partidas</h2>
      </div>

      {partidas.length === 0 ? (
        <p style={{ color: '#475569', marginTop: 16, fontSize: 14 }}>
          Nenhuma partida registrada ainda.
        </p>
      ) : (
        <>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {itens.map((partida) => (
              <div key={partida.id} className="match-card">
                <div className="match-vs-block">
                  <div className="match-title">
                    {partida.jogador1}
                    <span className="match-vs">vs</span>
                    {partida.jogador2}
                  </div>
                  <div className="match-meta">
                    <span className="match-winner">
                      <TrophyIcon size={13} />
                      {partida.vencedor}
                    </span>
                    {partida.resultado && <span>{partida.resultado}</span>}
                  </div>
                </div>
                <button className="btn-icon-danger" onClick={() => onExcluir(partida.id)} title="Excluir">
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>

          {total > 1 && (
            <div className="pagination">
              <button
                className="btn-ghost"
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                disabled={paginaValida === 1}
              >
                ← Anterior
              </button>
              <span style={{ color: '#475569', fontSize: 13 }}>
                {paginaValida} / {total}
              </span>
              <button
                className="btn-ghost"
                onClick={() => setPagina((p) => Math.min(total, p + 1))}
                disabled={paginaValida === total}
              >
                Próxima →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
