import { useState } from "react"
import { useData } from "../../store/DataProvider"
import { SearchIcon, EyeIcon } from "../../components/ui/Icons"
import { formatCurrency } from "../../lib/whatsapp"

export function AdminCustomers() {
  const { customers, updateCustomerStatus } = useData()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = customers.find((customer) => customer.id === selectedId)

  const filtered = customers.filter(
    (c) =>
      (!search ||
        `${c.firstName} ${c.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())) &&
      (!statusFilter || c.status === statusFilter),
  )

  return (
    <div>
      <h1 className="font-display font-black text-4xl text-white uppercase mb-6">
        Gestión de clientes
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-sigo-card border border-sigo-border rounded-xl p-4">
          <div className="price-tag text-sigo-orange text-3xl">
            {customers.length}
          </div>
          <div className="text-sigo-muted text-sm mt-1">
            Clientes registrados
          </div>
        </div>
        <div className="bg-sigo-card border border-sigo-border rounded-xl p-4">
          <div className="price-tag text-green-400 text-3xl">
            {customers.filter((c) => c.status === "active").length}
          </div>
          <div className="text-sigo-muted text-sm mt-1">Cuentas activas</div>
        </div>
        <div className="bg-sigo-card border border-sigo-border rounded-xl p-4">
          <div className="price-tag text-sigo-orange text-3xl">
            {formatCurrency(
              customers.reduce((s, c) => s + c.totalPurchases, 0),
            )}
          </div>
          <div className="text-sigo-muted text-sm mt-1">
            Compras confirmadas
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <SearchIcon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-sigo-muted"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar clientes..."
            className="w-full bg-sigo-surface border border-sigo-border text-white placeholder-sigo-muted pl-9 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-sigo-orange text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-sigo-surface border border-sigo-border text-white text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-sigo-orange"
        >
          <option value="">Todos los estados</option>
          <option value="active">Activa</option>
          <option value="inactive">Inactiva</option>
        </select>
      </div>

      <div className="bg-sigo-card border border-sigo-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-sigo-surface border-b border-sigo-border">
              <tr>
                {[
                  "Cliente",
                  "Correo electrónico",
                  "Teléfono",
                  "Pedidos",
                  "Total de compras",
                  "Registro",
                  "Estado",
                  "Acciones",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-sigo-muted font-semibold text-xs uppercase py-3 px-4"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="row-hover border-b border-sigo-border/50 last:border-0"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-sigo-orange/20 text-sigo-orange flex items-center justify-center font-display font-bold text-sm flex-shrink-0">
                        {c.firstName[0]}
                        {c.lastName[0]}
                      </div>
                      <span className="text-white font-medium">
                        {c.firstName} {c.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sigo-muted">{c.email}</td>
                  <td className="py-3 px-4 text-sigo-muted text-xs">
                    {c.phone}
                  </td>
                  <td className="py-3 px-4 text-white font-bold">{c.orders}</td>
                  <td className="py-3 px-4 price-tag text-sigo-orange">
                    {formatCurrency(c.totalPurchases)}
                  </td>
                  <td className="py-3 px-4 text-sigo-muted text-xs">
                    {c.registeredAt}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        c.status === "active"
                          ? "bg-green-500/15 text-green-400"
                          : "bg-red-500/15 text-red-400"
                      }`}
                    >
                      {c.status === "active" ? "ACTIVA" : "INACTIVA"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <button
                        onClick={() => setSelectedId(c.id)}
                        className="p-1.5 text-sigo-muted hover:text-blue-400 transition-colors"
                        title="Ver detalle"
                        aria-label={`Ver detalle de ${c.firstName} ${c.lastName}`}
                      >
                        <EyeIcon size={15} />
                      </button>
                      <button
                        onClick={() =>
                          updateCustomerStatus(
                            c.id,
                            c.status === "active" ? "inactive" : "active",
                          ).catch((e) => console.error(e))
                        }
                        className="p-1.5 text-sigo-muted hover:text-red-400 transition-colors text-xs font-bold"
                        title={
                          c.status === "active"
                            ? "Desactivar cuenta"
                            : "Activar cuenta"
                        }
                      >
                        {c.status === "active" ? "Desactivar" : "Activar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-sigo-card border border-sigo-border rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between gap-4 mb-5">
              <div>
                <h3 className="font-display font-bold text-2xl text-white">
                  {selected.firstName} {selected.lastName}
                </h3>
                <p className="text-sigo-muted text-xs font-mono">
                  {selected.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="text-sigo-muted hover:text-white"
                aria-label="Cerrar detalle"
              >
                Cerrar
              </button>
            </div>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-sigo-muted">Correo electrónico</dt>
                <dd className="text-white break-all">{selected.email}</dd>
              </div>
              <div>
                <dt className="text-sigo-muted">Teléfono</dt>
                <dd className="text-white">{selected.phone}</dd>
              </div>
              <div>
                <dt className="text-sigo-muted">Pedidos</dt>
                <dd className="text-white">{selected.orders}</dd>
              </div>
              <div>
                <dt className="text-sigo-muted">Compras confirmadas</dt>
                <dd className="text-sigo-orange font-bold">
                  {formatCurrency(selected.totalPurchases)}
                </dd>
              </div>
              <div>
                <dt className="text-sigo-muted">Fecha de registro</dt>
                <dd className="text-white">{selected.registeredAt}</dd>
              </div>
              <div>
                <dt className="text-sigo-muted">Estado</dt>
                <dd className="text-white">
                  {selected.status === "active"
                    ? "Cuenta activa"
                    : "Cuenta inactiva"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  )
}
