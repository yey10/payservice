import type { FieldDef } from '../config/resources'
import type { BaseRecord, FormValues } from '../types'
import { relationId } from './display'
import { text } from './format'

export function toFormValues(fields: FieldDef[], record: BaseRecord | null): FormValues {
  const values: FormValues = {}
  for (const field of fields) {
    const raw = record ? record[field.name] : (field.defaultValue ?? '')
    if (field.type === 'relation') values[field.name] = relationId(raw)
    else if (field.type === 'date') values[field.name] = text(raw).slice(0, 10)
    else values[field.name] = text(raw)
  }
  return values
}


export function buildPayload(
  fields: FieldDef[],
  values: FormValues,
  initial: FormValues | null,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  for (const field of fields) {
    const value = (values[field.name] ?? '').trim()
    if (initial && value === (initial[field.name] ?? '').trim()) continue

    if (field.type === 'boolean') {
      payload[field.name] = value === 'true'
      continue
    }

    if (value === '') {
      if (initial) {
        const nullable = ['relation', 'date', 'number', 'money', 'select'].includes(field.type)
        payload[field.name] = nullable ? null : ''
      }
      continue
    }

    if (field.type === 'relation' || field.type === 'number') payload[field.name] = Number(value)
    else payload[field.name] = value
  }
  return payload
}
