import Modal from './Modal'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel: string
  busy: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ title, message, confirmLabel, busy, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Modal title={title} size="sm" busy={busy} onClose={onCancel}>
      <div className="modal-body">
        <p className="confirm-text">{message}</p>
      </div>
      <footer className="modal-foot">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={busy}>
          Cancelar
        </button>
        <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={busy} autoFocus>
          {busy ? 'Eliminando…' : confirmLabel}
        </button>
      </footer>
    </Modal>
  )
}
