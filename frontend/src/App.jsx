import { useEffect, useState } from 'react'
import { supabase } from './supabase'

function App() {

  const [jogadores, setJogadores] = useState([])
  const [partidas, setPartidas] = useState([])

  const [jogador1, setJogador1] = useState('')
  const [jogador2, setJogador2] = useState('')
  const [vencedor, setVencedor] = useState('')
  const [resultado, setResultado] = useState('')

  
  async function carregarJogadores() {

    const { data } = await supabase
      .from('jogadores')
      .select('*')
      .order('nome')

    if (data) {
      setJogadores(data)
    }
  }

  async function carregarPartidas() {

    const { data } = await supabase
      .from('partidas')
      .select('*')
      .order('id', { ascending: false })

    if (data) {
      setPartidas(data)
    }
  }

  async function cadastrarPartida() {

    if (
      jogador1 === '' ||
      jogador2 === '' ||
      vencedor === ''
    ) {
      alert('Preencha todos os campos')
      return
    }

    if (jogador1 === jogador2) {
      alert('Os jogadores devem ser diferentes')
      return
    }

    await supabase
      .from('partidas')
      .insert([
  {
    jogador1,
    jogador2,
    vencedor,
    resultado
  }
])

    setJogador1('')
    setJogador2('')
    setVencedor('')
    setResultado('')

    carregarPartidas()
  }
async function excluirPartida(id) {

  const confirmar = confirm(
    'Deseja realmente excluir esta partida?'
  )

  if (!confirmar) {
    return
  }

  await supabase
    .from('partidas')
    .delete()
    .eq('id', id)

  carregarPartidas()
}
  function calcularRanking() {

  const ranking = {}

  jogadores.forEach((jogador) => {

    ranking[jogador.nome] = {
      nome: jogador.nome,
      vitorias: 0,
      derrotas: 0,
      partidas: 0,
      aproveitamento: 0
    }

  })

  partidas.forEach((partida) => {

    const vencedor = partida.vencedor

    const perdedor =
      partida.jogador1 === vencedor
        ? partida.jogador2
        : partida.jogador1

    if (ranking[vencedor]) {

      ranking[vencedor].vitorias++
      ranking[vencedor].partidas++

    }

    if (ranking[perdedor]) {

      ranking[perdedor].derrotas++
      ranking[perdedor].partidas++

    }

  })

  Object.values(ranking).forEach((jogador) => {

    if (jogador.partidas > 0) {

      jogador.aproveitamento = Math.round(
        (jogador.vitorias / jogador.partidas) * 100
      )

    }

  })

  return Object.values(ranking)
    .sort((a, b) => b.vitorias - a.vitorias)
}

  useEffect(() => {

    carregarJogadores()
    carregarPartidas()

  }, [])

  const ranking = calcularRanking()

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f172a',
        padding: 30,
        fontFamily: 'Arial',
        color: 'white'
      }}
    >

      <div
        style={{
          maxWidth: 900,
          margin: '0 auto'
        }}
      >

        <h1
  style={{
    textAlign: 'center',
    fontSize: 38,
    marginBottom: 10,
    lineHeight: 1.3,
    color: 'white'
  }}
>
  🏆 LIGA LUCAS GUIMARÃES
  <br />
  TENNIS ACADEMY
</h1>

        <p
          style={{
            textAlign: 'center',
            color: '#94a3b8',
            marginBottom: 40
          }}
        >
          Sistema de partidas e classificação
        </p>

        <div
          style={{
            background: '#1e293b',
            padding: 25,
            borderRadius: 16,
            marginBottom: 30
          }}
        >

          <h2>➕ Nova Partida</h2>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 15,
              marginTop: 20
            }}
          >

            <select
              value={jogador1}
              onChange={(e) => setJogador1(e.target.value)}
              style={inputStyle}
            >
              <option value="">Jogador 1</option>

              {jogadores.map((jogador) => (
                <option
                  key={jogador.id}
                  value={jogador.nome}
                >
                  {jogador.nome}
                </option>
              ))}
            </select>

            <select
              value={jogador2}
              onChange={(e) => setJogador2(e.target.value)}
              style={inputStyle}
            >
              <option value="">Jogador 2</option>

              {jogadores.map((jogador) => (
                <option
                  key={jogador.id}
                  value={jogador.nome}
                >
                  {jogador.nome}
                </option>
              ))}
            </select>

            <select
              value={vencedor}
              onChange={(e) => setVencedor(e.target.value)}
              style={inputStyle}
            >
              <option value="">Vencedor</option>

              {[jogador1, jogador2]
                .filter((j) => j !== '')
                .map((nome) => (
                  <option
                    key={nome}
                    value={nome}
                  >
                    {nome}
                  </option>
                ))}
            </select>
<input
  type="text"
  placeholder="Resultado (Ex: 6/4 6/3)"
  value={resultado}
  onChange={(e) => setResultado(e.target.value)}
  style={inputStyle}
/>
            <button
              onClick={cadastrarPartida}
              style={buttonStyle}
            >
              Salvar Partida
            </button>

          </div>

        </div>

        <div
          style={{
            background: '#1e293b',
            padding: 25,
            borderRadius: 16,
            marginBottom: 30
          }}
        >

          <h2>🏆 Ranking</h2>

          <table
            style={{
              width: '100%',
              marginTop: 20,
              borderCollapse: 'collapse'
            }}
          >

            <thead>

  <tr
    style={{
      background: '#334155'
    }}
  >
    <th style={tableHeader}>Posição</th>
    <th style={tableHeader}>Jogador</th>
    <th style={tableHeader}>Vitórias</th>
    <th style={tableHeader}>Derrotas</th>
    <th style={tableHeader}>Partidas</th>
    <th style={tableHeader}>Aproveitamento</th>
  </tr>

</thead>

            <tbody>

  {ranking.map((item, index) => (

    <tr
      key={item.nome}
      style={{
        textAlign: 'center',
        borderBottom: '1px solid #334155'
      }}
    >

      <td style={tableCell}>
        {index === 0 ? '🥇' :
         index === 1 ? '🥈' :
         index === 2 ? '🥉' :
         index + 1}
      </td>

      <td style={tableCell}>
        {item.nome}
      </td>

      <td style={tableCell}>
        {item.vitorias}
      </td>

      <td style={tableCell}>
        {item.derrotas}
      </td>

      <td style={tableCell}>
        {item.partidas}
      </td>

      <td style={tableCell}>
        {item.aproveitamento}%
      </td>

    </tr>

  ))}

</tbody>

          </table>

        </div>
<div
  style={{
    background: '#1e293b',
    padding: 25,
    borderRadius: 16,
    marginBottom: 30
  }}
>

  <h2>👤 Jogadores</h2>

  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 20,
      marginTop: 20
    }}
  >

    {ranking.map((jogador, index) => (

      <div
        key={jogador.nome}
        style={{
          background:
            index === 0
              ? '#365314'
              : '#334155',

          padding: 20,
          borderRadius: 14
        }}
      >

        <h3
          style={{
            marginTop: 0,
            marginBottom: 15
          }}
        >
          {index === 0 ? '👑 ' : ''}
          {jogador.nome}
        </h3>

        <div style={{ marginBottom: 8 }}>
          🏆 Vitórias: {jogador.vitorias}
        </div>

        <div style={{ marginBottom: 8 }}>
          ❌ Derrotas: {jogador.derrotas}
        </div>

        <div style={{ marginBottom: 8 }}>
          🎮 Partidas: {jogador.partidas}
        </div>

        <div
          style={{
            fontWeight: 'bold',
            color: '#22c55e'
          }}
        >
          📊 Aproveitamento: {jogador.aproveitamento}%
        </div>

      </div>

    ))}

  </div>

</div>
        <div
          style={{
            background: '#1e293b',
            padding: 25,
            borderRadius: 16
          }}
        >

          <h2>📅 Últimas Partidas</h2>

          <div
            style={{
              marginTop: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 15
            }}
          >

            {partidas.map((partida) => (

              <div
                key={partida.id}
                style={{
                  background: '#334155',
                  padding: 15,
                  borderRadius: 12
                }}
              >

                <div
                  style={{
                    fontSize: 18,
                    marginBottom: 8
                  }}
                >
                  {partida.jogador1} vs {partida.jogador2}
                </div>

                <div
                  style={{
                    color: '#22c55e',
                    fontWeight: 'bold'
                  }}
                ><div
  style={{
    marginBottom: 8
  }}
>
  📊 Resultado: {partida.resultado}
</div>
                  🏆 Vencedor: {partida.vencedor}
                </div>
<button
  onClick={() => excluirPartida(partida.id)}
  style={{
    marginTop: 12,
    background: '#ef4444',
    border: 'none',
    padding: '10px 14px',
    borderRadius: 8,
    color: 'white',
    cursor: 'pointer'
  }}
>
  Excluir
</button>
              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  )
}

const inputStyle = {
  padding: 14,
  borderRadius: 10,
  border: 'none',
  fontSize: 16
}

const buttonStyle = {
  padding: 14,
  borderRadius: 10,
  border: 'none',
  background: '#22c55e',
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
  cursor: 'pointer'
}

const tableHeader = {
  padding: 15
}

const tableCell = {
  padding: 15
}

export default App