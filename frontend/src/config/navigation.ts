import type { IconName } from '../components/Icon'
import type { Route } from '../hooks/useHashRoute'
import { RESOURCES, RESOURCE_KEYS } from './resources'

export interface NavItem {
  route: Route
  label: string
  icon: IconName
}

export const NAV_ITEMS: NavItem[] = [
  { route: 'resumen', label: 'Resumen', icon: 'dashboard' },
  ...RESOURCE_KEYS.map((key) => ({
    route: key as Route,
    label: RESOURCES[key].title,
    icon: RESOURCES[key].icon as IconName,
  })),
]
