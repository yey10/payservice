import type { FieldDef } from '../config/resources'
import type { BaseRecord, Lists } from '../types'
import { displayText, stateTone } from '../utils/display'

interface CellValueProps {
  field: FieldDef
  record: BaseRecord
  lists: Lists
}

export default function CellValue({ field, record, lists }: CellValueProps) {
  const value = displayText(field, record, lists)
  if (value === '') return <span className="muted">—</span>

  if (field.type === 'select') {
    return <span className={`badge badge-${stateTone(record[field.name])}`}>{value}</span>
  }
  if (field.type === 'boolean') {
    return <span className={`badge badge-${record[field.name] === true ? 'ok' : 'neutral'}`}>{value}</span>
  }
  if (field.type === 'money') return <span className="amount">{value}</span>
  if (field.type === 'textarea') return <span className="clamp">{value}</span>
  return <>{value}</>
}
