import { useSyncExternalStore } from 'react'
import { isResourceKey } from '../config/resources'
import type { ResourceKey } from '../types'

export type Route = 'resumen' | ResourceKey

function subscribe(callback: () => void) {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}

function getSnapshot() {
  return window.location.hash
}

export function useHashRoute(): Route {
  const hash = useSyncExternalStore(subscribe, getSnapshot)
  const name = hash.replace(/^#\/?/, '')
  return isResourceKey(name) ? name : 'resumen'
}
