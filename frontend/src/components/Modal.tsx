import { useEffect, useId } from 'react'
import type { ReactNode } from 'react'
import Icon from './Icon'

interface ModalProps {
  title: string
  onClose: () => void
  busy?: boolean
  size?: 'md' | 'sm'
  children: ReactNode
}

export default function Modal({ title, onClose, busy = false, size = 'md', children }: ModalProps) {
  const titleId = useId()

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) onClose()
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [busy, onClose])

  return (
    <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && !busy && onClose()}>
      <div className={`modal modal-${size}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="modal-head">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="icon-btn" aria-label="Cerrar" onClick={onClose} disabled={busy}>
            <Icon name="close" size={18} />
          </button>
        </header>
        {children}
      </div>
    </div>
  )
}
