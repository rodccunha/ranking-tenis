import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { Toast } from './components/Toast'
import { NovaPartidaForm } from './components/NovaPartidaForm'
import { AdicionarJogadorForm } from './components/AdicionarJogadorForm'
import { RankingTable } from './components/RankingTable'
import { PlayerGrid } from './components/PlayerGrid'
import { HistoricoPartidas } from './components/HistoricoPartidas'

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

  function calcularRanking() {
    const K = 32
    const stats = {}
    jogadores.forEach((j) => {
      stats[j.nome] = { nome: j.nome, vitorias: 0, derrotas: 0, partidas: 0, aproveitamento: 0, elo: 1000, streak: 0 }
    })
    // Processar em ordem cronológica para ELO ser acumulado corretamente
    const cronologico = [...partidas].reverse()
    cronologico.forEach((p) => {
      const v = p.vencedor
      const d = p.jogador1 === v ? p.jogador2 : p.jogador1
      if (!stats[v] || !stats[d]) return
      stats[v].vitorias++; stats[v].partidas++
      stats[d].derrotas++; stats[d].partidas++
      const eloV = stats[v].elo, eloD = stats[d].elo
      const expV = 1 / (1 + Math.pow(10, (eloD - eloV) / 400))
      stats[v].elo = Math.round(eloV + K * (1 - expV))
      stats[d].elo = Math.round(eloD + K * (0 - (1 - expV)))
      stats[v].streak = stats[v].streak > 0 ? stats[v].streak + 1 : 1
      stats[d].streak = stats[d].streak < 0 ? stats[d].streak - 1 : -1
    })
    Object.values(stats).forEach((j) => {
      if (j.partidas > 0) j.aproveitamento = Math.round((j.vitorias / j.partidas) * 100)
    })
    return Object.values(stats).sort((a, b) => b.elo - a.elo)
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
        <div className="fade-in" style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 'clamp(26px, 5vw, 40px)', lineHeight: 1.2, margin: '0 0 10px', color: 'white', fontWeight: 700 }}>
            🏆 LIGA LUCAS GUIMARÃES<br />TENNIS ACADEMY
          </h1>
          <p style={{ color: '#475569', fontSize: 14, margin: 0 }}>Sistema de partidas e classificação</p>
        </div>

        {carregando ? (
          <div className="spinner-wrap fade-in">
            <div className="spinner" />
            <p style={{ color: '#475569', marginTop: 16, fontSize: 14 }}>Carregando dados...</p>
          </div>
        ) : (
          <>
            <NovaPartidaForm
              jogadores={jogadores}
              jogador1={jogador1} setJogador1={setJogador1}
              jogador2={jogador2} setJogador2={setJogador2}
              vencedor={vencedor} setVencedor={setVencedor}
              resultado={resultado} setResultado={setResultado}
              onSalvar={cadastrarPartida}
              salvando={salvando}
            />
            <AdicionarJogadorForm
              novoJogador={novoJogador}
              setNovoJogador={setNovoJogador}
              onAdicionar={cadastrarJogador}
              adicionando={adicionandoJogador}
            />
            <RankingTable ranking={ranking} />
            <PlayerGrid ranking={ranking} />
            <HistoricoPartidas partidas={partidas} onExcluir={excluirPartida} />
          </>
        )}
      </div>
    </div>
  )
}

export default App
