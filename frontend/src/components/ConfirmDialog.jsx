export function ConfirmDialog({ aberto, titulo, mensagem, onConfirmar, onCancelar }) {
  if (!aberto) return null
  return (
    <div className="modal-backdrop" onClick={onCancelar}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>{titulo}</h3>
        <p>{mensagem}</p>
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onCancelar}>Cancelar</button>
          <button className="btn-danger-solid" onClick={onConfirmar}>Excluir</button>
        </div>
      </div>
    </div>
  )
}
