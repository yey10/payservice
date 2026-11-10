import { RESOURCES, RESOURCE_KEYS } from '../config/resources'
import { useLists } from '../hooks/useLists'
import ErrorState from '../components/ErrorState'
import Icon from '../components/Icon'
import { relationId } from '../utils/display'
import { formatDate, formatMoney, text, toNumber } from '../utils/format'

const sum = (values: unknown[]) => values.reduce<number>((total, value) => total + toNumber(value), 0)

export default function Dashboard() {
  const { data, errors, loading, reload } = useLists(RESOURCE_KEYS)

  const facturas = data.facturas ?? []
  const pagos = data.pagos ?? []

  const facturado = sum(facturas.map((f) => f.valor))
  const pagosAprobados = pagos.filter((p) => text(p.estado) !== 'rechazado')
  const pagado = sum(pagosAprobados.map((p) => p.valor))
  const porCobrar = Math.max(facturado - pagado, 0)
  const recaudado = facturado > 0 ? Math.min(100, (pagado / facturado) * 100) : 0

  const porEstado = new Map<string, number>()
  for (const factura of facturas) {
    const estado = text(factura.estado) || 'Sin estado'
    porEstado.set(estado, (porEstado.get(estado) ?? 0) + 1)
  }
  const estadoLabel = (value: string) =>
    RESOURCES.facturas.fields.find((f) => f.name === 'estado')?.options?.find((o) => o.value === value)?.label ?? value

  const facturaNumero = (ref: unknown) => {
    const id = relationId(ref)
    if (id === '') return ''
    const factura = facturas.find((f) => String(f.id) === id)
    return text(factura?.numero_factura) || `Factura #${id}`
  }

  const ultimosPagos = [...pagos].sort((a, b) => b.id - a.id).slice(0, 5)
  const failed = RESOURCE_KEYS.filter((key) => errors[key])

  const value = (content: string) => (loading ? <span className="skeleton skeleton-num" aria-label="Cargando" /> : content)

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Resumen</h1>
          <p className="page-desc">Estado general de la cartera, calculado con los datos actuales del backend.</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={reload} disabled={loading}>
          <Icon name="refresh" size={16} /> Actualizar
        </button>
      </div>

      {failed.length > 0 && (
        <ErrorState
          title="Algunos datos no se pudieron cargar"
          message={failed.map((key) => `${RESOURCES[key].title}: ${errors[key]}`).join(' ')}
          onRetry={reload}
        />
      )}

      <section className="balance" aria-label="Balance de cartera">
        <div className="balance-main">
          <p className="balance-label">Por cobrar</p>
          <p className="balance-figure">{value(formatMoney(porCobrar))}</p>
          <p className="balance-sub">
            {loading ? 'Calculando…' : `de ${formatMoney(facturado)} facturados, ${recaudado.toFixed(0)} % recaudado con pagos aprobados`}
          </p>
        </div>

        <div className="balance-bar" role="img" aria-label={`${recaudado.toFixed(0)} por ciento de lo facturado ya fue pagado`}>
          <span className="balance-bar-paid" style={{ width: `${recaudado}%` }} />
        </div>

        <dl className="balance-stats">
          <div>
            <dt>Facturado</dt>
            <dd>{value(formatMoney(facturado))}</dd>
          </div>
          <div>
            <dt>Pagado</dt>
            <dd>{value(formatMoney(pagado))}</dd>
          </div>
          <div>
            <dt>Facturas emitidas</dt>
            <dd>{value(String(facturas.length))}</dd>
          </div>
        </dl>
      </section>

      <section className="stat-grid" aria-label="Indicadores generales">
        {RESOURCE_KEYS.map((key) => (
          <a key={key} href={`#/${key}`} className="stat-card">
            <span className="stat-icon">
              <Icon name={RESOURCES[key].icon} size={20} />
            </span>
            <span className="stat-value">{value(String(data[key]?.length ?? 0))}</span>
            <span className="stat-label">{RESOURCES[key].title}</span>
          </a>
        ))}
      </section>

      <div className="split">
        <section className="panel">
          <h2 className="panel-title">Facturas por estado</h2>
          {loading ? (
            <div className="skeleton skeleton-row" />
          ) : porEstado.size === 0 ? (
            <p className="panel-empty">Todavía no hay facturas registradas.</p>
          ) : (
            <ul className="bars">
              {[...porEstado.entries()].map(([estado, count]) => (
                <li key={estado}>
                  <div className="bars-head">
                    <span>{estadoLabel(estado)}</span>
                    <strong>{count}</strong>
                  </div>
                  <div className="bars-track">
                    <span className="bars-fill" style={{ width: `${(count / facturas.length) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <h2 className="panel-title">Últimos pagos</h2>
          {loading ? (
            <div className="skeleton skeleton-row" />
          ) : ultimosPagos.length === 0 ? (
            <p className="panel-empty">Todavía no hay pagos registrados.</p>
          ) : (
            <ul className="recent">
              {ultimosPagos.map((pago) => (
                <li key={pago.id}>
                  <div>
                    <strong>{text(pago.referencia) || `Pago #${pago.id}`}</strong>
                    <span className="muted">
                      {facturaNumero(pago.factura)}
                      {text(pago.fecha_pago) !== '' && ` · ${formatDate(pago.fecha_pago)}`}
                      {text(pago.estado) === 'rechazado' && ' · Rechazado'}
                    </span>
                  </div>
                  <span className="amount">{formatMoney(pago.valor)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}
