import { useState } from 'react'
import type { FormEvent } from 'react'
import { RESOURCES, formFieldsOf } from '../config/resources'
import type { FieldDef } from '../config/resources'
import type { BaseRecord, FieldErrors, FormValues, Lists, ListErrors, ResourceKey } from '../types'
import { buildPayload, toFormValues } from '../utils/payload'

interface ResourceFormProps {
  resource: ResourceKey
  record: BaseRecord | null
  lists: Lists
  listErrors: ListErrors
  listsLoading: boolean
  submitting: boolean
  formError: string | null
  fieldErrors: FieldErrors
  onSubmit: (payload: Record<string, unknown>) => void
  onCancel: () => void
}

export default function ResourceForm({
  resource,
  record,
  lists,
  listErrors,
  listsLoading,
  submitting,
  formError,
  fieldErrors,
  onSubmit,
  onCancel,
}: ResourceFormProps) {
  const config = RESOURCES[resource]
  const fields = formFieldsOf(resource)
  const [initial] = useState<FormValues>(() => toFormValues(fields, record))
  const [values, setValues] = useState<FormValues>(initial)
  const editing = record !== null

  const setValue = (name: string, value: string) => setValues((current) => ({ ...current, [name]: value }))

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(buildPayload(fields, values, editing ? initial : null))
  }

  const renderControl = (field: FieldDef, id: string, invalid: boolean) => {
    const common = {
      id,
      name: field.name,
      value: values[field.name] ?? '',
      required: field.required,
      disabled: submitting,
      'aria-invalid': invalid || undefined,
      'aria-describedby': invalid ? `${id}-error` : undefined,
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          {...common}
          rows={3}
          placeholder={field.placeholder}
          onChange={(e) => setValue(field.name, e.target.value)}
        />
      )
    }

    if (field.type === 'boolean') {
      return (
        <label className="check" htmlFor={id}>
          <input
            id={id}
            name={field.name}
            type="checkbox"
            checked={values[field.name] === 'true'}
            disabled={submitting}
            onChange={(e) => setValue(field.name, e.target.checked ? 'true' : 'false')}
          />
          {field.checkLabel ?? field.label}
        </label>
      )
    }

    if (field.type === 'select') {
      return (
        <select {...common} onChange={(e) => setValue(field.name, e.target.value)}>
          <option value="">{field.required ? 'Selecciona una opción' : 'Sin especificar'}</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    }

    if (field.type === 'relation' && field.relation) {
      const related = field.relation
      const options = lists[related] ?? []
      const relatedConfig = RESOURCES[related]
      return (
        <select {...common} onChange={(e) => setValue(field.name, e.target.value)}>
          <option value="">{listsLoading ? 'Cargando opciones…' : 'Selecciona una opción'}</option>
          {options.map((option) => (
            <option key={option.id} value={String(option.id)}>
              {relatedConfig.recordLabel(option)}
            </option>
          ))}
        </select>
      )
    }

    const inputType = field.type === 'money' || field.type === 'number' ? 'number' : field.type
    return (
      <input
        {...common}
        type={inputType}
        placeholder={field.placeholder}
        step={field.type === 'money' ? '0.01' : field.type === 'number' ? '1' : undefined}
        min={field.type === 'money' || field.type === 'number' ? 0 : undefined}
        inputMode={field.type === 'money' ? 'decimal' : undefined}
        autoComplete="off"
        onChange={(e) => setValue(field.name, e.target.value)}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-body">
        {formError && (
          <div className="alert alert-error" role="alert">
            {formError}
          </div>
        )}

        <div className="form-grid">
          {fields.map((field) => {
            const id = `${resource}-${field.name}`
            const error = fieldErrors[field.name]
            const related = field.relation
            const relationFailed = related ? listErrors[related] : undefined
            const relationEmpty = related && !listsLoading && !relationFailed && (lists[related]?.length ?? 0) === 0

            return (
              <div key={field.name} className={`field${field.wide ? ' field-wide' : ''}`}>
                {field.type === 'boolean' ? (
                  <span className="field-label">{field.label}</span>
                ) : (
                  <label htmlFor={id}>
                    {field.label}
                    {field.required && (
                      <span className="req" aria-hidden="true">
                        {' '}
                        *
                      </span>
                    )}
                  </label>
                )}
                {renderControl(field, id, Boolean(error))}
                {error && (
                  <p className="field-error" id={`${id}-error`}>
                    {error}
                  </p>
                )}
                {relationFailed && <p className="field-error">No se pudieron cargar las opciones: {relationFailed}</p>}
                {relationEmpty && related && (
                  <p className="field-hint">
                    No hay {RESOURCES[related].title.toLowerCase()} registrados. Crea uno primero en la sección{' '}
                    <a href={`#/${related}`}>{RESOURCES[related].title}</a>.
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <footer className="modal-foot">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={submitting}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Guardando…' : editing ? 'Guardar cambios' : `Crear ${config.singular.toLowerCase()}`}
        </button>
      </footer>
    </form>
  )
}
