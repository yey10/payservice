export type ResourceKey =
  | 'clientes'
  | 'proveedores'
  | 'servicios'
  | 'facturas'
  | 'pagos'

export type BaseRecord = { id: number } & Record<string, unknown>

export type FormValues = Record<string, string>
export type FieldErrors = Record<string, string>

export type Lists = Partial<Record<ResourceKey, BaseRecord[]>>
export type ListErrors = Partial<Record<ResourceKey, string>>
