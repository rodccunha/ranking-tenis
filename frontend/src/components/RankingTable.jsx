import { useState } from 'react'

const COLUNAS = [
  { key: 'posicao',        label: 'Pos.',       sortable: false },
  { key: 'nome',           label: 'Jogador',    sortable: true  },
  { key: 'vitorias',       label: 'Vitórias',   sortable: true  },
  { key: 'derrotas',       label: 'Derrotas',   sortable: true  },
  { key: 'partidas',       label: 'Partidas',   sortable: true  },
  { key: 'aproveitamento', label: 'Aproveit.',  sortable: true  },
]

function rateClass(pct) {
  if (pct >= 60) return 'rate rate-high'
  if (pct >= 40) return 'rate rate-mid'
  return 'rate rate-low'
}

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

  const medalFor = (nome) => {
    const i = ranking.findIndex((r) => r.nome === nome)
    return i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1
  }

  return (
    <div className="card fade-in-3">
      <h2>🏆 Ranking</h2>
      <p style={{ color: '#475569', fontSize: 12, margin: '4px 0 0' }}>
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
                  style={{ cursor: col.sortable ? 'pointer' : 'default' }}
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
            {sorted.map((item) => (
              <tr key={item.nome}>
                <td>{medalFor(item.nome)}</td>
                <td style={{ fontWeight: 500, textAlign: 'left' }}>{item.nome}</td>
                <td style={{ color: '#4ade80', fontWeight: 600 }}>{item.vitorias}</td>
                <td style={{ color: '#f87171' }}>{item.derrotas}</td>
                <td>{item.partidas}</td>
                <td>
                  <span className={rateClass(item.aproveitamento)}>
                    {item.aproveitamento}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
