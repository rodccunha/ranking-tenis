export function AdicionarJogadorForm({ novoJogador, setNovoJogador, onAdicionar, adicionando }) {
  return (
    <div className="card fade-in-2">
      <h2>🆕 Adicionar Jogador</h2>
      <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
        <input
          className="input"
          type="text"
          placeholder="Nome do jogador"
          value={novoJogador}
          onChange={(e) => setNovoJogador(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onAdicionar()}
        />
        <button className="btn-primary" onClick={onAdicionar} disabled={adicionando}>
          {adicionando ? '⏳' : 'Adicionar'}
        </button>
      </div>
    </div>
  )
}
