import { useState } from 'react'
import { PlusIcon, CheckIcon, TrophyIcon, UsersIcon } from './Icons'

export function QuickActions({
  jogadores,
  jogador1, setJogador1,
  jogador2, setJogador2,
  vencedor, setVencedor,
  resultado, setResultado,
  onSalvarPartida,
  salvando,
  novoJogador, setNovoJogador,
  onAdicionarJogador,
  adicionando,
}) {
  const [aba, setAba] = useState('partida')

  return (
    <div className="card fade-in-3">
      <div className="card-head">
        <PlusIcon />
        <h2>Ações rápidas</h2>
      </div>

      <div className="tabs">
        <button className={`tab-btn${aba === 'partida' ? ' active' : ''}`} onClick={() => setAba('partida')}>
          <TrophyIcon size={15} />
          Nova Partida
        </button>
        <button className={`tab-btn${aba === 'jogador' ? ' active' : ''}`} onClick={() => setAba('jogador')}>
          <UsersIcon size={15} />
          Novo Jogador
        </button>
      </div>

      {aba === 'partida' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
          <select
            className="input"
            value={jogador1}
            onChange={(e) => { setJogador1(e.target.value); setVencedor('') }}
          >
            <option value="">Jogador 1</option>
            {jogadores.map((j) => (
              <option key={j.id} value={j.nome}>{j.nome}</option>
            ))}
          </select>

          <select
            className="input"
            value={jogador2}
            onChange={(e) => { setJogador2(e.target.value); setVencedor('') }}
          >
            <option value="">Jogador 2</option>
            {jogadores.filter((j) => j.nome !== jogador1).map((j) => (
              <option key={j.id} value={j.nome}>{j.nome}</option>
            ))}
          </select>

          <select
            className="input"
            value={vencedor}
            onChange={(e) => setVencedor(e.target.value)}
            disabled={!jogador1 || !jogador2}
          >
            <option value="">Vencedor</option>
            {[jogador1, jogador2].filter(Boolean).map((nome) => (
              <option key={nome} value={nome}>{nome}</option>
            ))}
          </select>

          <input
            className="input"
            type="text"
            placeholder="Resultado (Ex: 6/4 6/3)"
            value={resultado}
            onChange={(e) => setResultado(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSalvarPartida()}
          />

          <button className="btn-primary" onClick={onSalvarPartida} disabled={salvando}>
            <CheckIcon />
            {salvando ? 'Salvando...' : 'Salvar Partida'}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <input
            className="input"
            type="text"
            placeholder="Nome do jogador"
            value={novoJogador}
            onChange={(e) => setNovoJogador(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onAdicionarJogador()}
          />
          <button className="btn-primary" onClick={onAdicionarJogador} disabled={adicionando}>
            <PlusIcon size={16} />
            {adicionando ? '...' : 'Adicionar'}
          </button>
        </div>
      )}
    </div>
  )
}
