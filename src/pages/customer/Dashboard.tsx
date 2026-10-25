import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useStore } from "../../store/useStore"
import type { Order } from "../../data/mockData"
import { OrderStatusBadge } from "../../components/ui/Badge"
import { imgFallback } from "../../lib/images"
import {
  UserIcon,
  PackageIcon,
  LogOutIcon,
  SettingsIcon,
  ChevronRightIcon,
} from "../../components/ui/Icons"
import { formatCurrency } from "../../lib/whatsapp"

type Section = "orders" | "profile" | "addresses" | "favorites"

const stepOrder: string[] = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Shipped",
  "Delivered",
]

function OrderProgress({ status }: { status: string }) {
  const idx = stepOrder.indexOf(status)
  return (
    <div className="flex items-center gap-1 mt-3">
      {stepOrder.map((s, i) => (
        <div key={s} className="flex items-center flex-1">
          <div
            className={`w-3 h-3 rounded-full flex-shrink-0 border-2 ${
              i < idx
                ? "bg-sigo-orange border-sigo-orange"
                : i === idx
                  ? "bg-sigo-orange border-sigo-orange ring-4 ring-sigo-orange/20"
                  : "bg-sigo-surface border-sigo-border"
            }`}
          />
          {i < stepOrder.length - 1 && (
            <div
              className={`flex-1 h-0.5 ${
                i < idx ? "bg-sigo-orange" : "bg-sigo-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export function Dashboard() {
  const { user, logout, isLoggedIn } = useStore()
  const navigate = useNavigate()
  const [section, setSection] = useState<Section>("orders")
  const [notice, setNotice] = useState("")
  const [showAddressForm, setShowAddressForm] = useState(false)

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <UserIcon size={48} className="text-sigo-border mx-auto mb-4" />
        <h2 className="font-display font-black text-3xl text-white mb-3">
          No has iniciado sesión
        </h2>
        <Link
          to="/login"
          className="bg-sigo-orange text-white font-bold px-8 py-3 rounded-xl inline-block"
        >
          Iniciar sesión
        </Link>
      </div>
    )
  }

  // Los pedidos del cliente se coordinan por WhatsApp y los gestiona el
  // administrador. Aquí mostramos un estado vacío hasta integrar pedidos por
  // cuenta de cliente.
  const myOrders: Order[] = []

  const sideItems = [
    { id: "orders", icon: <PackageIcon size={18} />, label: "Mis pedidos" },
    { id: "profile", icon: <UserIcon size={18} />, label: "Mi perfil" },
    { id: "addresses", icon: <SettingsIcon size={18} />, label: "Direcciones" },
    {
      id: "favorites",
      icon: <ChevronRightIcon size={18} />,
      label: "Favoritos",
    },
  ] as const

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-display font-black text-4xl text-white uppercase mb-8">
        Mi cuenta
      </h1>
      {notice && (
        <div
          role="status"
          className="mb-5 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg px-4 py-3 text-sm"
        >
          {notice}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="md:w-56 flex-shrink-0">
          <div className="bg-sigo-card border border-sigo-border rounded-xl overflow-hidden">
            <div className="p-5 border-b border-sigo-border">
              <div className="w-12 h-12 bg-sigo-orange/20 text-sigo-orange rounded-full flex items-center justify-center mb-2">
                <UserIcon size={24} />
              </div>
              <p className="font-display font-bold text-white">{user?.name}</p>
              <p className="text-sigo-muted text-xs">{user?.email}</p>
            </div>
            <nav className="p-2">
              {sideItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className={`sidebar-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    section === item.id
                      ? "active text-sigo-orange"
                      : "text-sigo-muted hover:text-white"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
              <hr className="border-sigo-border my-2" />
              <button
                onClick={() => {
                  logout()
                  navigate("/")
                }}
                className="sidebar-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOutIcon size={18} />
                Cerrar sesión
              </button>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1">
          {section === "orders" && (
            <div>
              <h2 className="font-display font-bold text-2xl text-white uppercase mb-5">
                Mis pedidos
              </h2>
              <div className="space-y-4">
                {myOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-sigo-card border border-sigo-border rounded-xl p-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-white font-bold">
                            {order.id}
                          </span>
                          <OrderStatusBadge status={order.status} />
                        </div>
                        <p className="text-sigo-muted text-xs mt-1">
                          {order.date} · {order.deliveryMethod} ·{" "}
                          {order.paymentMethod}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="price-tag text-sigo-orange text-xl">
                          {formatCurrency(order.total)}
                        </div>
                        <div className="text-sigo-muted text-xs">
                          {order.items.length} producto
                          {order.items.length > 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>

                    {order.status !== "Cancelled" && (
                      <OrderProgress status={order.status} />
                    )}

                    <div className="mt-4 flex gap-2 flex-wrap">
                      {order.items.slice(0, 2).map((item) => (
                        <div
                          key={item.productId}
                          className="flex items-center gap-2 bg-sigo-surface rounded-lg px-2 py-1.5"
                        >
                          <img
                            src={item.image}
                            alt=""
                            onError={imgFallback}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <span className="text-xs text-sigo-light line-clamp-1 max-w-[120px]">
                            {item.productName}
                          </span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="bg-sigo-surface rounded-lg px-3 py-1.5 text-xs text-sigo-muted">
                          +{order.items.length - 2} más
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === "profile" && (
            <div>
              <h2 className="font-display font-bold text-2xl text-white uppercase mb-5">
                Mi perfil
              </h2>
              <div className="bg-sigo-card border border-sigo-border rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Nombre", value: "Carlos" },
                    { label: "Apellido", value: "Mendoza" },
                    { label: "Correo electrónico", value: user?.email ?? "" },
                    { label: "Teléfono", value: "+502 7890 1234" },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="block text-sigo-muted text-xs font-semibold uppercase mb-1">
                        {f.label}
                      </label>
                      <input defaultValue={f.value} className="input-sigo" />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setNotice("Perfil actualizado correctamente.")
                    setTimeout(() => setNotice(""), 2500)
                  }}
                  className="bg-sigo-orange hover:bg-sigo-orange-dark text-white font-bold px-6 py-2.5 rounded-lg transition-colors"
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          )}

          {section === "addresses" && (
            <div>
              <h2 className="font-display font-bold text-2xl text-white uppercase mb-5">
                Direcciones
              </h2>
              <div className="bg-sigo-card border border-sigo-border rounded-xl p-5 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-semibold">Carlos Mendoza</p>
                    <p className="text-sigo-muted text-sm mt-1">
                      Zona 4, 6a avenida 12-45
                    </p>
                    <p className="text-sigo-muted text-sm">Mixco, Guatemala</p>
                  </div>
                  <span className="bg-sigo-orange/20 text-sigo-orange text-xs px-2 py-0.5 rounded font-bold">
                    PRINCIPAL
                  </span>
                </div>
              </div>
              {showAddressForm && (
                <div className="bg-sigo-card border border-sigo-border rounded-xl p-5 mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-admin">Departamento *</label>
                    <input className="input-sigo" defaultValue="Guatemala" />
                  </div>
                  <div>
                    <label className="label-admin">Municipio *</label>
                    <input className="input-sigo" defaultValue="Mixco" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label-admin">Dirección *</label>
                    <input
                      className="input-sigo"
                      placeholder="Zona, calle, avenida y número"
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-3">
                    <button
                      onClick={() => {
                        setShowAddressForm(false)
                        setNotice("Dirección guardada correctamente.")
                      }}
                      className="bg-sigo-orange text-white font-bold px-5 py-2 rounded-lg"
                    >
                      Guardar dirección
                    </button>
                    <button
                      onClick={() => setShowAddressForm(false)}
                      className="text-sigo-muted px-5 py-2"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
              <button
                onClick={() => setShowAddressForm(true)}
                className="flex items-center gap-2 border border-dashed border-sigo-border hover:border-sigo-orange text-sigo-muted hover:text-sigo-orange w-full p-4 rounded-xl transition-colors"
              >
                <span className="text-xl">+</span>
                <span>Agregar nueva dirección</span>
              </button>
            </div>
          )}

          {section === "favorites" && (
            <div>
              <h2 className="font-display font-bold text-2xl text-white uppercase mb-5">
                Favoritos
              </h2>
              <div className="text-center py-16 text-sigo-muted">
                <p className="text-xl font-display font-bold text-white">
                  Aún no tienes favoritos
                </p>
                <Link
                  to="/catalog"
                  className="text-sigo-orange mt-3 inline-block hover:underline"
                >
                  Ver productos
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
