import { RESOURCES } from '../config/resources'
import type { BaseRecord, Lists, ResourceKey } from '../types'
import CellValue from './CellValue'
import Icon from './Icon'

interface DataTableProps {
  resource: ResourceKey
  items: BaseRecord[]
  lists: Lists
  onEdit: (record: BaseRecord) => void
  onDelete: (record: BaseRecord) => void
}

export default function DataTable({ resource, items, lists, onEdit, onDelete }: DataTableProps) {
  const config = RESOURCES[resource]
  const columns = config.fields.filter((field) => !field.hideInTable)

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th className="col-id">ID</th>
            {columns.map((field) => (
              <th key={field.name} className={field.type === 'money' ? 'num' : undefined}>
                {field.label}
              </th>
            ))}
            <th className="col-actions">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((record) => (
            <tr key={record.id}>
              <td className="col-id muted">{record.id}</td>
              {columns.map((field) => (
                <td key={field.name} className={field.type === 'money' ? 'num' : undefined}>
                  <CellValue field={field} record={record} lists={lists} />
                </td>
              ))}
              <td className="col-actions">
                <div className="row-actions">
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label={`Editar ${config.recordLabel(record)}`}
                    onClick={() => onEdit(record)}
                  >
                    <Icon name="edit" size={17} />
                  </button>
                  <button
                    type="button"
                    className="icon-btn icon-btn-danger"
                    aria-label={`Eliminar ${config.recordLabel(record)}`}
                    onClick={() => onDelete(record)}
                  >
                    <Icon name="trash" size={17} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
