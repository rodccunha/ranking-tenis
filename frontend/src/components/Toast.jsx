export function Toast({ mensagem, tipo }) {
  if (!mensagem) return null
  return <div className={`toast toast-${tipo}`}>{mensagem}</div>
}
