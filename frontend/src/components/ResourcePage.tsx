import { useMemo, useState } from 'react'
import { RESOURCES, formFieldsOf } from '../config/resources'
import { useLists } from '../hooks/useLists'
import { useResource } from '../hooks/useResource'
import { getErrorMessage, parseApiError } from '../services/errors'
import type { BaseRecord, FieldErrors, ResourceKey } from '../types'
import { displayText } from '../utils/display'
import ConfirmDialog from './ConfirmDialog'
import DataTable from './DataTable'
import ErrorState from './ErrorState'
import Icon from './Icon'
import Modal from './Modal'
import ResourceForm from './ResourceForm'
import { useToast } from './toast/ToastContext'

type ModalState = { mode: 'create' } | { mode: 'edit'; record: BaseRecord } | null

export default function ResourcePage({ resource }: { resource: ResourceKey }) {
  const config = RESOURCES[resource]
  const toast = useToast()
  const { items, loading, error, reload, create, update, remove } = useResource(resource)

  const relationKeys = useMemo(
    () => Array.from(new Set(config.fields.flatMap((f) => (f.relation ? [f.relation] : [])))),
    [config],
  )
  const { data: lists, errors: listErrors, loading: listsLoading } = useLists(relationKeys)

  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<ModalState>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [toDelete, setToDelete] = useState<BaseRecord | null>(null)
  const [deleting, setDeleting] = useState(false)

  const done = config.feminine ? 'a' : 'o'
  const lowerSingular = config.singular.toLowerCase()

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (query === '') return items
    return items.filter((record) => {
      const haystack = [String(record.id), ...config.fields.map((f) => displayText(f, record, lists))]
      return haystack.join(' ').toLowerCase().includes(query)
    })
  }, [items, search, config, lists])

  const openModal = (state: ModalState) => {
    setFormError(null)
    setFieldErrors({})
    setModal(state)
  }
  const closeModal = () => setModal(null)

  const handleSubmit = async (payload: Record<string, unknown>) => {
    const current = modal
    if (!current) return

    if (current.mode === 'edit' && Object.keys(payload).length === 0) {
      closeModal()
      toast.info('No había cambios para guardar.')
      return
    }

    setSubmitting(true)
    setFormError(null)
    setFieldErrors({})
    try {
      if (current.mode === 'create') {
        await create(payload)
        toast.success(`${config.singular} cread${done} correctamente.`)
      } else {
        await update(current.record.id, payload)
        toast.success(`${config.singular} actualizad${done} correctamente.`)
      }
      closeModal()
    } catch (e) {
      const parsed = parseApiError(e, formFieldsOf(resource).map((f) => f.name))
      setFieldErrors(parsed.fields)
      setFormError(parsed.general)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      await remove(toDelete.id)
      toast.success(`${config.singular} eliminad${done} correctamente.`)
      setToDelete(null)
    } catch (e) {
      toast.error(`No se pudo eliminar: ${getErrorMessage(e)} Si ${done === 'a' ? 'la' : 'el'} ${lowerSingular} tiene registros asociados, elimínalos primero.`)
      setToDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>{config.title}</h1>
          <p className="page-desc">{config.description}</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => openModal({ mode: 'create' })}>
          <Icon name="plus" size={18} /> Nuev{done} {lowerSingular}
        </button>
      </div>

      <section className="panel">
        <div className="toolbar">
          <label className="search">
            <Icon name="search" size={17} />
            <span className="sr-only">Buscar en {config.title.toLowerCase()}</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Buscar en ${config.title.toLowerCase()}`}
            />
          </label>
          <span className="count" aria-live="polite">
            {loading ? 'Cargando…' : `${visible.length} de ${items.length}`}
          </span>
          <button type="button" className="btn btn-secondary" onClick={reload} disabled={loading}>
            <Icon name="refresh" size={16} /> Actualizar
          </button>
        </div>

        {loading ? (
          <div className="skeleton-list" aria-busy="true" aria-label="Cargando datos">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="skeleton skeleton-row" />
            ))}
          </div>
        ) : error && items.length === 0 ? (
          <ErrorState message={error} onRetry={reload} />
        ) : items.length === 0 ? (
          <div className="state">
            <span className="state-icon">
              <Icon name={config.icon} size={22} />
            </span>
            <h3>{config.emptyTitle}</h3>
            <p>{config.emptyHint}</p>
            <button type="button" className="btn btn-primary" onClick={() => openModal({ mode: 'create' })}>
              <Icon name="plus" size={18} /> Nuev{done} {lowerSingular}
            </button>
          </div>
        ) : visible.length === 0 ? (
          <div className="state">
            <h3>Sin resultados</h3>
            <p>Ningún registro coincide con «{search}».</p>
            <button type="button" className="btn btn-secondary" onClick={() => setSearch('')}>
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          <>
            {error && <div className="alert alert-error table-alert">{error}</div>}
            <DataTable
              resource={resource}
              items={visible}
              lists={lists}
              onEdit={(record) => openModal({ mode: 'edit', record })}
              onDelete={setToDelete}
            />
          </>
        )}
      </section>

      {modal && (
        <Modal
          title={modal.mode === 'create' ? `Nuev${done} ${lowerSingular}` : `Editar ${lowerSingular}`}
          busy={submitting}
          onClose={closeModal}
        >
          <ResourceForm
            resource={resource}
            record={modal.mode === 'edit' ? modal.record : null}
            lists={lists}
            listErrors={listErrors}
            listsLoading={listsLoading}
            submitting={submitting}
            formError={formError}
            fieldErrors={fieldErrors}
            onSubmit={handleSubmit}
            onCancel={closeModal}
          />
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog
          title={`Eliminar ${lowerSingular}`}
          message={`¿Seguro que quieres eliminar «${config.recordLabel(toDelete)}»? Esta acción no se puede deshacer.`}
          confirmLabel={`Eliminar ${lowerSingular}`}
          busy={deleting}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  )
}
