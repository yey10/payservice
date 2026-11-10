import { http } from './http'
import type { BaseRecord } from '../types'

interface Paginated {
  results: BaseRecord[]
  next: string | null
}

async function fetchPage(url: string): Promise<BaseRecord[] | Paginated> {
  const response = await http.get<BaseRecord[] | Paginated>(url)
  return response.data
}

export interface CrudService {
  list: () => Promise<BaseRecord[]>
  create: (data: Record<string, unknown>) => Promise<BaseRecord>
  update: (id: number, data: Record<string, unknown>) => Promise<BaseRecord>
  remove: (id: number) => Promise<void>
}


export function createCrudService(endpoint: string): CrudService {
  return {
    async list() {
      const all: BaseRecord[] = []
      let url: string | null = endpoint
      while (url) {
        const data = await fetchPage(url)
        if (Array.isArray(data)) return data
        if (!data || !Array.isArray(data.results)) {
          throw new Error('La API devolvió un formato de lista inesperado.')
        }
        all.push(...data.results)
        url = data.next
      }
      return all
    },

    async create(payload) {
      const { data } = await http.post<BaseRecord>(endpoint, payload)
      return data
    },

    async update(id, payload) {
      const { data } = await http.patch<BaseRecord>(`${endpoint}${id}/`, payload)
      return data
    },

    async remove(id) {
      await http.delete(`${endpoint}${id}/`)
    },
  }
}
