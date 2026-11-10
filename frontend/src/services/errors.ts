import axios from 'axios'
import { API_BASE_URL } from '../config/api'
import type { FieldErrors } from '../types'

function flatten(value: unknown): string {
  if (Array.isArray(value)) return value.map(flatten).join(' ')
  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).map(flatten).join(' ')
  }
  return String(value ?? '')
}

function describeBody(data: unknown): string | null {
  if (typeof data === 'string' && data.length > 0 && data.length < 300 && !data.includes('<')) {
    return data
  }
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const entries = Object.entries(data as Record<string, unknown>)
    if (entries.length === 0) return null
    return entries
      .map(([key, value]) =>
        key === 'detail' || key === 'non_field_errors'
          ? flatten(value)
          : `${key}: ${flatten(value)}`,
      )
      .join(' ')
  }
  return null
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const response = error.response
    if (!response) {
      if (error.code === 'ECONNABORTED') {
        return 'El servidor tardó demasiado en responder. Inténtalo de nuevo.'
      }
      return `No se pudo conectar con el backend en ${API_BASE_URL}. Verifica que Django esté en ejecución y que CORS permita el origen de este frontend.`
    }
    if (response.status === 404) return 'El registro no existe o ya fue eliminado.'
    if (response.status >= 500) {
      return `El servidor respondió con un error interno (${response.status}). Revisa la consola de Django para ver el detalle.`
    }
    const body = describeBody(response.data)
    if (body) return body
    return `La solicitud falló (código ${response.status}).`
  }
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.'
}

export interface ParsedApiError {
  fields: FieldErrors
  general: string
}

export function parseApiError(error: unknown, knownFields: string[]): ParsedApiError {
  const message = getErrorMessage(error)
  if (!axios.isAxiosError(error)) return { fields: {}, general: message }

  const response = error.response
  if (!response || response.status !== 400) return { fields: {}, general: message }

  const data: unknown = response.data
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { fields: {}, general: message }
  }

  const fields: FieldErrors = {}
  const general: string[] = []
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    const detail = flatten(value)
    if (knownFields.includes(key)) fields[key] = detail
    else general.push(key === 'detail' || key === 'non_field_errors' ? detail : `${key}: ${detail}`)
  }

  if (general.length > 0) return { fields, general: general.join(' ') }
  if (Object.keys(fields).length > 0) return { fields, general: 'Revisa los campos marcados.' }
  return { fields, general: message }
}
