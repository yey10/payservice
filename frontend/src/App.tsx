import { useState } from 'react'
import type { ComponentType } from 'react'
import Icon from './components/Icon'
import Sidebar from './components/Sidebar'
import ToastProvider from './components/toast/ToastProvider'
import { NAV_ITEMS } from './config/navigation'
import { useHashRoute } from './hooks/useHashRoute'
import type { Route } from './hooks/useHashRoute'
import ClientesPage from './pages/ClientesPage'
import Dashboard from './pages/Dashboard'
import FacturasPage from './pages/FacturasPage'
import PagosPage from './pages/PagosPage'
import ProveedoresPage from './pages/ProveedoresPage'
import ServiciosPage from './pages/ServiciosPage'

const PAGES: Record<Route, ComponentType> = {
  resumen: Dashboard,
  clientes: ClientesPage,
  proveedores: ProveedoresPage,
  servicios: ServiciosPage,
  facturas: FacturasPage,
  pagos: PagosPage,
}

export default function App() {
  const route = useHashRoute()
  const [menuOpen, setMenuOpen] = useState(false)
  const Page = PAGES[route]
  const title = NAV_ITEMS.find((item) => item.route === route)?.label ?? 'PayServices'

  return (
    <ToastProvider>
      <div className="app">
        <Sidebar current={route} open={menuOpen} onNavigate={() => setMenuOpen(false)} />
        {menuOpen && <div className="scrim" onClick={() => setMenuOpen(false)} aria-hidden="true" />}

        <div className="main">
          <header className="topbar">
            <button type="button" className="icon-btn" aria-label="Abrir menú" onClick={() => setMenuOpen(true)}>
              <Icon name="menu" size={22} />
            </button>
            <span className="topbar-title">{title}</span>
          </header>
          <main className="content">
            <Page key={route} />
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
