import { useState } from "react"
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom"
import sigoLogo from "../../assets/sigo-logo.png"
import {
  HomeIcon,
  PackageIcon,
  GridIcon,
  BarChartIcon,
  UsersIcon,
  SettingsIcon,
  LogOutIcon,
  MenuIcon,
  ClipboardIcon,
  TagIcon,
  DollarIcon,
} from "../../components/ui/Icons"
import { useStore } from "../../store/useStore"
import { signOut } from "../../lib/auth"

const navItems = [
  {
    to: "/admin",
    icon: <HomeIcon size={18} />,
    label: "Panel principal",
    exact: true,
  },
  {
    to: "/admin/products",
    icon: <PackageIcon size={18} />,
    label: "Productos",
  },
  { to: "/admin/categories", icon: <TagIcon size={18} />, label: "Categorías" },
  { to: "/admin/inventory", icon: <GridIcon size={18} />, label: "Inventario" },
  { to: "/admin/orders", icon: <ClipboardIcon size={18} />, label: "Pedidos" },
  { to: "/admin/customers", icon: <UsersIcon size={18} />, label: "Clientes" },
  { to: "/admin/sales", icon: <DollarIcon size={18} />, label: "Ventas" },
  { to: "/admin/reports", icon: <BarChartIcon size={18} />, label: "Reportes" },
  {
    to: "/admin/settings",
    icon: <SettingsIcon size={18} />,
    label: "Configuración",
  },
]

export function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useStore()
  const [sideOpen, setSideOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    logout()
    navigate("/")
  }

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to)

  return (
    <div className="min-h-screen bg-sigo-black flex">
      {/* Mobile overlay */}
      {sideOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSideOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-sigo-dark border-r border-sigo-border z-40 flex flex-col transition-transform duration-200 ${
          sideOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-4 border-b border-sigo-border">
          <img src={sigoLogo} alt="SIGO" className="h-12 w-auto" />
          <div className="mt-2 bg-sigo-orange/10 border border-sigo-orange/30 rounded px-2 py-0.5 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-sigo-orange rounded-full" />
            <span className="text-sigo-orange text-xs font-bold">
              PANEL ADMINISTRATIVO
            </span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSideOpen(false)}
              className={`sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive(item.to, item.exact)
                  ? "active text-white bg-sigo-orange/10 border-sigo-orange"
                  : "text-sigo-muted hover:text-white"
              }`}
            >
              <span
                className={
                  isActive(item.to, item.exact) ? "text-sigo-orange" : ""
                }
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-sigo-border">
          <button
            onClick={handleLogout}
            className="sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 w-full transition-all"
          >
            <LogOutIcon size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Admin top bar */}
        <header className="sticky top-0 z-20 bg-sigo-dark/95 backdrop-blur border-b border-sigo-border px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => setSideOpen(!sideOpen)}
            className="lg:hidden text-sigo-muted hover:text-white p-1"
          >
            <MenuIcon size={22} />
          </button>
          <div className="hidden lg:block">
            <h2 className="font-display font-bold text-white text-lg">
              {navItems.find((n) => isActive(n.to, n.exact))?.label ??
                "Administración"}
            </h2>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="w-8 h-8 bg-sigo-orange text-white rounded-full flex items-center justify-center font-display font-bold text-sm">
              A
            </div>
            <span className="text-sm text-sigo-light hidden md:inline">
              Administrador
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
