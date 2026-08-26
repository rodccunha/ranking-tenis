import { useState, useEffect, useMemo } from 'react'
import { CalendarIcon, TrophyIcon, TrashIcon, SearchIcon } from './Icons'

const POR_PAGINA = 5

function formatarData(data) {
  if (!data) return ''
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

export function HistoricoPartidas({ partidas, onExcluir }) {
  const [pagina, setPagina] = useState(1)
  const [busca, setBusca] = useState('')

  const partidasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo) return partidas
    return partidas.filter((p) =>
      p.jogador1.toLowerCase().includes(termo) || p.jogador2.toLowerCase().includes(termo)
    )
  }, [partidas, busca])

  const total = Math.ceil(partidasFiltradas.length / POR_PAGINA)
  const paginaValida = Math.min(pagina, Math.max(1, total))
  const itens = partidasFiltradas.slice((paginaValida - 1) * POR_PAGINA, paginaValida * POR_PAGINA)

  useEffect(() => {
    setPagina(1)
  }, [partidas.length, busca])

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
          <div className="search-field" style={{ marginTop: 16 }}>
            <SearchIcon size={16} />
            <input
              className="input"
              type="text"
              placeholder="Buscar por jogador..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              aria-label="Buscar partidas por jogador"
            />
          </div>

          {partidasFiltradas.length === 0 ? (
            <p style={{ color: '#475569', marginTop: 16, fontSize: 14 }}>
              Nenhuma partida encontrada para "{busca}".
            </p>
          ) : (
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
                    {partida.data && <span>{formatarData(partida.data)}</span>}
                  </div>
                </div>
                <button className="btn-icon-danger" onClick={() => onExcluir(partida.id)} title="Excluir">
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
          )}

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
