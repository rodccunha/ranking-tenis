import { useEffect, useRef, useState } from 'react'
import { supabase } from './supabase'
import { Toast } from './components/Toast'
import { QuickActions } from './components/QuickActions'
import { RankingTable } from './components/RankingTable'
import { PlayerGrid } from './components/PlayerGrid'
import { HistoricoPartidas } from './components/HistoricoPartidas'
import { ConfirmDialog } from './components/ConfirmDialog'
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
  const [confirmacao, setConfirmacao] = useState(null) // { tipo: 'partida' | 'jogador', id, nome }

  const [toast, setToast] = useState({ mensagem: '', tipo: 'sucesso' })
  const toastId = useRef(0)

  function mostrarToast(mensagem, tipo = 'sucesso') {
    const id = ++toastId.current
    setToast({ mensagem, tipo })
    setTimeout(() => {
      setToast((atual) => (id === toastId.current ? { mensagem: '', tipo: 'sucesso' } : atual))
    }, 3000)
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

  function resultadoValido(valor) {
    const texto = valor.trim()
    if (!texto) return true
    return texto.split(/\s+/).every((set) => /^\d+\/\d+$/.test(set))
  }

  async function cadastrarPartida() {
    if (!jogador1 || !jogador2 || !vencedor) {
      mostrarToast('Preencha todos os campos', 'erro')
      return
    }
    if (jogador1 === jogador2) {
      mostrarToast('Escolha dois jogadores diferentes', 'erro')
      return
    }
    if (!resultadoValido(resultado)) {
      mostrarToast('Resultado inválido. Use o formato 6/4 6/3', 'erro')
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
    const nome = novoJogador.trim()
    if (!nome) {
      mostrarToast('Digite o nome do jogador', 'erro')
      return
    }
    if (jogadores.some((j) => j.nome.toLowerCase() === nome.toLowerCase())) {
      mostrarToast('Já existe um jogador com esse nome', 'erro')
      return
    }
    setAdicionandoJogador(true)
    const { error } = await supabase.from('jogadores').insert([{ nome }])
    if (error) {
      mostrarToast('Erro ao adicionar jogador', 'erro')
    } else {
      mostrarToast('Jogador adicionado!')
      setNovoJogador('')
      await carregarJogadores()
    }
    setAdicionandoJogador(false)
  }

  async function renomearJogador(id, nomeAtual, novoNomeBruto) {
    const novoNome = novoNomeBruto.trim()
    if (!novoNome || novoNome === nomeAtual) return
    if (jogadores.some((j) => j.id !== id && j.nome.toLowerCase() === novoNome.toLowerCase())) {
      mostrarToast('Já existe um jogador com esse nome', 'erro')
      return
    }

    const { error } = await supabase.from('jogadores').update({ nome: novoNome }).eq('id', id)
    if (error) {
      mostrarToast('Erro ao renomear jogador', 'erro')
      return
    }
    // As partidas guardam o nome do jogador em texto, não o id — atualiza o
    // histórico junto para não repetir o problema de nomes desatualizados.
    await Promise.all([
      supabase.from('partidas').update({ jogador1: novoNome }).eq('jogador1', nomeAtual),
      supabase.from('partidas').update({ jogador2: novoNome }).eq('jogador2', nomeAtual),
      supabase.from('partidas').update({ vencedor: novoNome }).eq('vencedor', nomeAtual),
    ])
    mostrarToast('Jogador renomeado!')
    await Promise.all([carregarJogadores(), carregarPartidas()])
  }

  async function excluirPartida(id) {
    const { error } = await supabase.from('partidas').delete().eq('id', id)
    if (error) {
      mostrarToast('Erro ao excluir partida', 'erro')
    } else {
      mostrarToast('Partida excluída')
      await carregarPartidas()
    }
  }

  async function excluirJogador(id) {
    const { error } = await supabase.from('jogadores').delete().eq('id', id)
    if (error) {
      mostrarToast('Erro ao excluir jogador', 'erro')
    } else {
      mostrarToast('Jogador excluído')
      await carregarJogadores()
    }
  }

  async function confirmarExclusao() {
    if (!confirmacao) return
    if (confirmacao.tipo === 'partida') await excluirPartida(confirmacao.id)
    else await excluirJogador(confirmacao.id)
    setConfirmacao(null)
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
      stats[j.nome] = { id: j.id, nome: j.nome, vitorias: 0, derrotas: 0, partidas: 0, aproveitamento: 0, saldoVitorias: 0, saldoGames: 0 }
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
            <PlayerGrid
              ranking={ranking}
              onRenomear={renomearJogador}
              onExcluir={(id, nome) => setConfirmacao({ tipo: 'jogador', id, nome })}
            />
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
            <HistoricoPartidas
              partidas={partidas}
              onExcluir={(id) => setConfirmacao({ tipo: 'partida', id })}
            />
          </>
        )}
      </div>

      <ConfirmDialog
        aberto={!!confirmacao}
        titulo={confirmacao?.tipo === 'partida' ? 'Excluir partida?' : 'Excluir jogador?'}
        mensagem={
          confirmacao?.tipo === 'partida'
            ? 'Essa ação não pode ser desfeita.'
            : `As partidas de ${confirmacao?.nome} continuarão no histórico, mas o jogador sairá do ranking.`
        }
        onConfirmar={confirmarExclusao}
        onCancelar={() => setConfirmacao(null)}
      />
    </div>
  )
}

export default App
