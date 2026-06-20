export function NovaPartidaForm({
  jogadores,
  jogador1, setJogador1,
  jogador2, setJogador2,
  vencedor, setVencedor,
  resultado, setResultado,
  onSalvar,
  salvando,
}) {
  return (
    <div className="card fade-in-1">
      <h2>➕ Nova Partida</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 18 }}>
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
          onKeyDown={(e) => e.key === 'Enter' && onSalvar()}
        />

        <button className="btn-primary" onClick={onSalvar} disabled={salvando}>
          {salvando ? '⏳ Salvando...' : 'Salvar Partida'}
        </button>
      </div>
    </div>
  )
}
