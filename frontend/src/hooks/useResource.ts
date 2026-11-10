import { useCallback, useEffect, useState } from 'react'
import { services } from '../services'
import { getErrorMessage } from '../services/errors'
import type { BaseRecord, ResourceKey } from '../types'

export function useResource(key: ResourceKey) {
  const service = services[key]
  const [items, setItems] = useState<BaseRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState(0)

  useEffect(() => {
    let active = true
    service
      .list()
      .then((data) => {
        if (active) setItems(data)
      })
      .catch((e: unknown) => {
        if (active) setError(getErrorMessage(e))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [service, token])

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    setToken((t) => t + 1)
  }, [])

  const refresh = useCallback(async () => {
    try {
      setItems(await service.list())
      setError(null)
    } catch (e) {
      setError(getErrorMessage(e))
    }
  }, [service])

  const create = useCallback(
    async (payload: Record<string, unknown>) => {
      await service.create(payload)
      await refresh()
    },
    [service, refresh],
  )

  const update = useCallback(
    async (id: number, payload: Record<string, unknown>) => {
      await service.update(id, payload)
      await refresh()
    },
    [service, refresh],
  )

  const remove = useCallback(
    async (id: number) => {
      await service.remove(id)
      await refresh()
    },
    [service, refresh],
  )

  return { items, loading, error, reload, create, update, remove }
}
