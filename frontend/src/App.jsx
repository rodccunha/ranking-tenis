import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { Toast } from './components/Toast'
import { QuickActions } from './components/QuickActions'
import { RankingTable } from './components/RankingTable'
import { PlayerGrid } from './components/PlayerGrid'
import { HistoricoPartidas } from './components/HistoricoPartidas'
import { TrophyIcon } from './components/Icons'

function App() {
  const [jogadores, setJogadores] = useState([])
  const [partidas, setPartidas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [adicionandoJogador, setAdicionandoJogador] = useState(false)

  const [jogador1, setJogador1] = useState('')
  const [jogador2, setJogador2] = useState('')
  const [vencedor, setVencedor] = useState('')
  const [resultado, setResultado] = useState('')
  const [novoJogador, setNovoJogador] = useState('')

  const [toast, setToast] = useState({ mensagem: '', tipo: 'sucesso' })

  function mostrarToast(mensagem, tipo = 'sucesso') {
    setToast({ mensagem, tipo })
    setTimeout(() => setToast({ mensagem: '', tipo: 'sucesso' }), 3000)
  }

  async function carregarJogadores() {
    const { data, error } = await supabase.from('jogadores').select('*').order('nome')
    if (error) { mostrarToast('Erro ao carregar jogadores', 'erro'); return }
    if (data) setJogadores(data)
  }

  async function carregarPartidas() {
    const { data, error } = await supabase.from('partidas').select('*').order('id', { ascending: false })
    if (error) { mostrarToast('Erro ao carregar partidas', 'erro'); return }
    if (data) setPartidas(data)
  }

  async function cadastrarPartida() {
    if (!jogador1 || !jogador2 || !vencedor) {
      mostrarToast('Preencha todos os campos', 'erro')
      return
    }

    setSalvando(true)
    const { error } = await supabase.from('partidas').insert([{ jogador1, jogador2, vencedor, resultado }])
    if (error) {
      mostrarToast('Erro ao salvar partida', 'erro')
    } else {
      mostrarToast('Partida salva com sucesso!')
      setJogador1(''); setJogador2(''); setVencedor(''); setResultado('')
      await carregarPartidas()
    }
    setSalvando(false)
  }

  async function cadastrarJogador() {
    if (!novoJogador.trim()) {
      mostrarToast('Digite o nome do jogador', 'erro')
      return
    }
    setAdicionandoJogador(true)
    const { error } = await supabase.from('jogadores').insert([{ nome: novoJogador.trim() }])
    if (error) {
      mostrarToast('Erro ao adicionar jogador', 'erro')
    } else {
      mostrarToast('Jogador adicionado!')
      setNovoJogador('')
      await carregarJogadores()
    }
    setAdicionandoJogador(false)
  }

  async function excluirPartida(id) {
    if (!confirm('Deseja excluir esta partida?')) return
    const { error } = await supabase.from('partidas').delete().eq('id', id)
    if (error) {
      mostrarToast('Erro ao excluir partida', 'erro')
    } else {
      mostrarToast('Partida excluída')
      await carregarPartidas()
    }
  }

  function gamesDaPartida(resultado) {
    let g1 = 0, g2 = 0, valido = false
    for (const set of (resultado || '').trim().split(/\s+/)) {
      const m = set.match(/^(\d+)\/(\d+)$/)
      if (!m) continue
      g1 += Number(m[1]); g2 += Number(m[2]); valido = true
    }
    return valido ? { g1, g2 } : null
  }

  function calcularRanking() {
    const stats = {}
    jogadores.forEach((j) => {
      stats[j.nome] = { nome: j.nome, vitorias: 0, derrotas: 0, partidas: 0, aproveitamento: 0, saldoVitorias: 0, saldoGames: 0 }
    })
    partidas.forEach((p) => {
      const v = p.vencedor
      const d = p.jogador1 === v ? p.jogador2 : p.jogador1
      if (!stats[v] || !stats[d]) return
      stats[v].vitorias++; stats[v].partidas++
      stats[d].derrotas++; stats[d].partidas++

      const games = gamesDaPartida(p.resultado)
      if (games) {
        const gv = p.jogador1 === v ? games.g1 : games.g2
        const gd = p.jogador1 === v ? games.g2 : games.g1
        stats[v].saldoGames += gv - gd
        stats[d].saldoGames += gd - gv
      }
    })
    Object.values(stats).forEach((j) => {
      if (j.partidas > 0) j.aproveitamento = Math.round((j.vitorias / j.partidas) * 100)
      j.saldoVitorias = j.vitorias - j.derrotas
    })
    return Object.values(stats).sort((a, b) =>
      b.saldoVitorias - a.saldoVitorias || b.saldoGames - a.saldoGames
    )
  }

  useEffect(() => {
    async function init() {
      setCarregando(true)
      await Promise.all([carregarJogadores(), carregarPartidas()])
      setCarregando(false)
    }
    init()
  }, [])

  useEffect(() => {
    if (vencedor && vencedor !== jogador1 && vencedor !== jogador2) setVencedor('')
  }, [jogador1, jogador2])

  const ranking = calcularRanking()

  return (
    <div style={{ minHeight: '100vh', padding: '30px 20px' }}>
      <Toast mensagem={toast.mensagem} tipo={toast.tipo} />

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="fade-in hero">
          <div className="hero-badge">
            <TrophyIcon size={26} />
          </div>
          <h1>Liga <span className="accent">Lucas Guimarães</span><br />Tennis Academy</h1>
          <p>Sistema de partidas e classificação</p>
        </div>

        {carregando ? (
          <div className="spinner-wrap fade-in">
            <div className="spinner" />
            <p style={{ color: '#475569', marginTop: 16, fontSize: 14 }}>Carregando dados...</p>
          </div>
        ) : (
          <>
            <RankingTable ranking={ranking} />
            <PlayerGrid ranking={ranking} />
            <QuickActions
              jogadores={jogadores}
              jogador1={jogador1} setJogador1={setJogador1}
              jogador2={jogador2} setJogador2={setJogador2}
              vencedor={vencedor} setVencedor={setVencedor}
              resultado={resultado} setResultado={setResultado}
              onSalvarPartida={cadastrarPartida}
              salvando={salvando}
              novoJogador={novoJogador} setNovoJogador={setNovoJogador}
              onAdicionarJogador={cadastrarJogador}
              adicionando={adicionandoJogador}
            />
            <HistoricoPartidas partidas={partidas} onExcluir={excluirPartida} />
          </>
        )}
      </div>
    </div>
  )
}

export default App
