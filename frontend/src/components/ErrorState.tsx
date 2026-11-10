import Icon from './Icon'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
}

export default function ErrorState({ title = 'No se pudieron cargar los datos', message, onRetry }: ErrorStateProps) {
  return (
    <div className="state state-error" role="alert">
      <span className="state-icon">
        <Icon name="alert" size={22} />
      </span>
      <h3>{title}</h3>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-secondary" onClick={onRetry}>
          <Icon name="refresh" size={16} /> Reintentar
        </button>
      )}
    </div>
  )
}
