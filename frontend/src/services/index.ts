import { RESOURCES, RESOURCE_KEYS } from '../config/resources'
import type { ResourceKey } from '../types'
import { createCrudService } from './crud'
import type { CrudService } from './crud'

export const services = Object.fromEntries(
  RESOURCE_KEYS.map((key) => [key, createCrudService(RESOURCES[key].endpoint)]),
) as Record<ResourceKey, CrudService>
