import { useState } from 'react'
import { TrophyIcon } from './Icons'
import { initials, avatarColor, rateClass, rankBadge } from '../lib/playerVisuals'

const COLUNAS = [
  { key: 'nome',           label: 'Jogador',    sortable: true  },
  { key: 'vitorias',       label: 'Vitórias',   sortable: true  },
  { key: 'derrotas',       label: 'Derrotas',   sortable: true  },
  { key: 'partidas',       label: 'Partidas',   sortable: true  },
  { key: 'aproveitamento', label: 'Aproveit.',  sortable: true  },
]

export function RankingTable({ ranking }) {
  const [sortKey, setSortKey] = useState('aproveitamento')
  const [sortDir, setSortDir] = useState('desc')

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const sorted = [...ranking].sort((a, b) => {
    const va = a[sortKey] ?? ''
    const vb = b[sortKey] ?? ''
    const cmp = typeof va === 'string' ? va.localeCompare(vb) : va - vb
    return sortDir === 'desc' ? -cmp : cmp
  })

  const posicaoDe = (nome) => ranking.findIndex((r) => r.nome === nome) + 1

  return (
    <div className="card fade-in-1">
      <div className="card-head">
        <TrophyIcon />
        <h2>Ranking</h2>
      </div>
      <p className="card-sub">
        Ordenado por aproveitamento — em caso de empate, quem jogou mais partidas fica à frente
      </p>
      <div className="table-wrapper">
        <table className="ranking-table">
          <thead>
            <tr>
              {COLUNAS.map((col) => (
                <th
                  key={col.key}
                  className={sortKey === col.key ? 'sorted' : ''}
                  onClick={() => col.sortable && handleSort(col.key)}
                  style={{ cursor: col.sortable ? 'pointer' : 'default', textAlign: col.key === 'nome' ? 'left' : 'center' }}
                  title={col.sortable ? 'Clique para ordenar' : ''}
                >
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    <span style={{ marginLeft: 5, fontSize: 11 }}>
                      {sortDir === 'desc' ? '▼' : '▲'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((item) => {
              const badge = rankBadge(posicaoDe(item.nome))
              return (
                <tr key={item.nome}>
                  <td className="player-cell">
                    <span className={badge.className}>{badge.label}</span>
                    <span className="avatar" style={{ background: avatarColor(item.nome) }}>{initials(item.nome)}</span>
                    {item.nome}
                  </td>
                  <td style={{ color: '#4ade80', fontWeight: 600 }}>{item.vitorias}</td>
                  <td style={{ color: '#f87171' }}>{item.derrotas}</td>
                  <td>{item.partidas}</td>
                  <td>
                    <span className={rateClass(item.aproveitamento)}>
                      {item.aproveitamento}%
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
