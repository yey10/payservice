import type { BaseRecord, ResourceKey } from '../types'
import { formatMoney, text } from '../utils/format'

export type FieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'textarea'
  | 'number'
  | 'money'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'select'
  | 'relation'

export interface FieldOption {
  value: string
  label: string
}

export interface FieldDef {
  name: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  relation?: ResourceKey
  options?: FieldOption[]
  hideInTable?: boolean
  wide?: boolean
  readOnly?: boolean
  defaultValue?: string
  checkLabel?: string
  trueLabel?: string
  falseLabel?: string
}

export interface ResourceConfig {
  key: ResourceKey
  endpoint: string
  title: string
  singular: string
  feminine: boolean
  description: string
  emptyTitle: string
  emptyHint: string
  icon: 'users' | 'building' | 'box' | 'receipt' | 'card'
  fields: FieldDef[]
  recordLabel: (record: BaseRecord) => string
}


export const RESOURCES: Record<ResourceKey, ResourceConfig> = {
  clientes: {
    key: 'clientes',
    endpoint: 'clientes/',
    title: 'Clientes',
    singular: 'Cliente',
    feminine: false,
    description: 'Personas y empresas que reciben facturas y realizan pagos.',
    emptyTitle: 'Aún no hay clientes',
    emptyHint: 'Registra el primer cliente para poder emitirle facturas.',
    icon: 'users',
    fields: [
      { name: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: 'Nombre completo o razón social' },
      { name: 'documento', label: 'Documento', type: 'text', required: true, placeholder: 'Cédula o NIT' },
      { name: 'correo', label: 'Correo electrónico', type: 'email', required: true, placeholder: 'cliente@correo.com' },
      { name: 'telefono', label: 'Teléfono', type: 'tel', required: true, placeholder: '300 000 0000' },
    ],
    recordLabel: (r) => text(r.nombre) || `Cliente #${r.id}`,
  },

  proveedores: {
    key: 'proveedores',
    endpoint: 'proveedores/',
    title: 'Proveedores',
    singular: 'Proveedor',
    feminine: false,
    description: 'Empresas que ofrecen los servicios disponibles en la plataforma.',
    emptyTitle: 'Aún no hay proveedores',
    emptyHint: 'Registra un proveedor antes de crear los servicios que ofrece.',
    icon: 'building',
    fields: [
      { name: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: 'Nombre del proveedor' },
      { name: 'nit', label: 'NIT', type: 'text', required: true, placeholder: '900123456-7' },
      { name: 'correo', label: 'Correo electrónico', type: 'email', required: true, placeholder: 'contacto@proveedor.com' },
      { name: 'telefono', label: 'Teléfono', type: 'tel', required: true, placeholder: '300 000 0000' },
    ],
    recordLabel: (r) => text(r.nombre) || `Proveedor #${r.id}`,
  },

  servicios: {
    key: 'servicios',
    endpoint: 'servicios/',
    title: 'Servicios',
    singular: 'Servicio',
    feminine: false,
    description: 'Catálogo de servicios que pueden facturarse, cada uno asociado a un proveedor.',
    emptyTitle: 'Aún no hay servicios',
    emptyHint: 'Crea un servicio y asígnalo a un proveedor.',
    icon: 'box',
    fields: [
      { name: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: 'Ej. Internet hogar' },
      { name: 'categoria', label: 'Categoría', type: 'text', required: true, placeholder: 'Ej. Telecomunicaciones' },
      { name: 'proveedor', label: 'Proveedor', type: 'relation', relation: 'proveedores', required: true },
      {
        name: 'activo',
        label: 'Estado',
        type: 'boolean',
        defaultValue: 'true',
        checkLabel: 'Servicio activo',
        trueLabel: 'Activo',
        falseLabel: 'Inactivo',
      },
      { name: 'descripcion', label: 'Descripción', type: 'textarea', required: true, wide: true, hideInTable: true, placeholder: 'Detalle del servicio' },
    ],
    recordLabel: (r) => text(r.nombre) || `Servicio #${r.id}`,
  },

  facturas: {
    key: 'facturas',
    endpoint: 'facturas/',
    title: 'Facturas',
    singular: 'Factura',
    feminine: true,
    description: 'Cobros emitidos a los clientes por los servicios contratados.',
    emptyTitle: 'Aún no hay facturas',
    emptyHint: 'Emite una factura seleccionando un cliente y un servicio.',
    icon: 'receipt',
    fields: [
      { name: 'numero_factura', label: 'Número de factura', type: 'text', required: true, placeholder: 'FAC-0001' },
      { name: 'cliente', label: 'Cliente', type: 'relation', relation: 'clientes', required: true },
      { name: 'servicio', label: 'Servicio', type: 'relation', relation: 'servicios', required: true },
      { name: 'valor', label: 'Valor', type: 'money', required: true, placeholder: '0.00' },
      { name: 'fecha_emision', label: 'Fecha de emisión', type: 'date', required: true },
      { name: 'fecha_vencimiento', label: 'Fecha de vencimiento', type: 'date', required: true },
      {
        name: 'estado',
        label: 'Estado',
        type: 'select',
        defaultValue: 'pendiente',
        options: [
          { value: 'pendiente', label: 'Pendiente' },
          { value: 'parcial', label: 'Pago parcial' },
          { value: 'pagada', label: 'Pagada' },
        ],
      },
    ],
    recordLabel: (r) => `${text(r.numero_factura) || `Factura #${r.id}`} · ${formatMoney(r.valor)}`,
  },

  pagos: {
    key: 'pagos',
    endpoint: 'pagos/',
    title: 'Pagos',
    singular: 'Pago',
    feminine: false,
    description: 'Registro de pagos simulados con fines académicos. No se procesa dinero real.',
    emptyTitle: 'Aún no hay pagos',
    emptyHint: 'Registra un pago simulado asociado a una factura.',
    icon: 'card',
    fields: [
      { name: 'referencia', label: 'Referencia', type: 'text', required: true, placeholder: 'PAGO-0001' },
      { name: 'factura', label: 'Factura', type: 'relation', relation: 'facturas', required: true },
      { name: 'valor', label: 'Valor', type: 'money', required: true, placeholder: '0.00' },
      { name: 'metodo_pago', label: 'Método de pago', type: 'text', required: true, placeholder: 'Ej. Tarjeta, Transferencia' },
      {
        name: 'estado',
        label: 'Estado',
        type: 'select',
        defaultValue: 'aprobado',
        options: [
          { value: 'aprobado', label: 'Aprobado' },
          { value: 'rechazado', label: 'Rechazado' },
        ],
      },
      { name: 'fecha_pago', label: 'Fecha de pago', type: 'datetime', readOnly: true },
    ],
    recordLabel: (r) => `${text(r.referencia) || `Pago #${r.id}`} · ${formatMoney(r.valor)}`,
  },
}

export const RESOURCE_KEYS = Object.keys(RESOURCES) as ResourceKey[]

export function isResourceKey(value: string): value is ResourceKey {
  return (RESOURCE_KEYS as string[]).includes(value)
}

export function formFieldsOf(key: ResourceKey): FieldDef[] {
  return RESOURCES[key].fields.filter((field) => !field.readOnly)
}
