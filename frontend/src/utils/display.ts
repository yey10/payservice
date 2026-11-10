import { RESOURCES } from '../config/resources'
import type { FieldDef } from '../config/resources'
import type { BaseRecord, Lists } from '../types'
import { formatDate, formatDateTime, formatMoney, text } from './format'

export function relationId(value: unknown): string {
  if (value && typeof value === 'object' && 'id' in value) {
    return String((value as { id: unknown }).id)
  }
  return text(value)
}

export function findRelated(field: FieldDef, record: BaseRecord, lists: Lists): BaseRecord | undefined {
  if (!field.relation) return undefined
  const id = relationId(record[field.name])
  return lists[field.relation]?.find((item) => String(item.id) === id)
}

export function displayText(field: FieldDef, record: BaseRecord, lists: Lists): string {
  const value = record[field.name]
  switch (field.type) {
    case 'relation': {
      const id = relationId(value)
      if (id === '') return ''
      const related = findRelated(field, record, lists)
      if (related && field.relation) return RESOURCES[field.relation].recordLabel(related)
      return `#${id}`
    }
    case 'money':
      return text(value) === '' ? '' : formatMoney(value)
    case 'date':
      return text(value) === '' ? '' : formatDate(value)
    case 'datetime':
      return text(value) === '' ? '' : formatDateTime(value)
    case 'boolean':
      return value === true ? (field.trueLabel ?? 'Sí') : (field.falseLabel ?? 'No')
    case 'select': {
      const option = field.options?.find((o) => o.value === text(value))
      return option ? option.label : text(value)
    }
    default:
      return text(value)
  }
}

export type BadgeTone = 'ok' | 'warn' | 'danger' | 'neutral'

export function stateTone(value: unknown): BadgeTone {
  const v = text(value).toLowerCase()
  if (['pagada', 'pagado', 'completado', 'completada', 'aprobado', 'activo'].includes(v)) return 'ok'
  if (['pendiente', 'parcial', 'en proceso'].includes(v)) return 'warn'
  if (['vencida', 'vencido', 'rechazado', 'cancelada', 'cancelado', 'anulada'].includes(v)) return 'danger'
  return 'neutral'
}
