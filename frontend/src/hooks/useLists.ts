import { useCallback, useEffect, useState } from 'react'
import { services } from '../services'
import { getErrorMessage } from '../services/errors'
import type { ListErrors, Lists, ResourceKey } from '../types'

interface State {
  data: Lists
  errors: ListErrors
  loading: boolean
}

export function useLists(keys: ResourceKey[]) {
  const signature = keys.join(',')
  const [state, setState] = useState<State>({
    data: {},
    errors: {},
    loading: keys.length > 0,
  })
  const [token, setToken] = useState(0)

  useEffect(() => {
    if (signature === '') return
    const list = signature.split(',') as ResourceKey[]
    let active = true

    Promise.allSettled(list.map((key) => services[key].list())).then((results) => {
      if (!active) return
      const data: Lists = {}
      const errors: ListErrors = {}
      results.forEach((result, index) => {
        const key = list[index]
        if (result.status === 'fulfilled') data[key] = result.value
        else errors[key] = getErrorMessage(result.reason)
      })
      setState({ data, errors, loading: false })
    })

    return () => {
      active = false
    }
  }, [signature, token])

  const reload = useCallback(() => {
    setState((current) => ({ ...current, loading: true }))
    setToken((t) => t + 1)
  }, [])

  return { ...state, reload }
}
