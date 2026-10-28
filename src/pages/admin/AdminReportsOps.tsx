import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { useData } from "../../store/DataProvider"
import { formatCurrency } from "../../lib/whatsapp"
import { ordersByStatus } from "../../lib/analytics"

/**
 * Reporte operativo e de inventario (ruta /admin/reports).
 * Enfocado en la OPERACIÓN: salud del inventario, productos por reabastecer,
 * flujo de pedidos y resumen del catálogo. Complementa la vista de Ventas
 * (/admin/sales), que se centra en los ingresos.
 */
export function AdminReportsOps() {
  const { products, orders, categories, customers } = useData()

  const available = products.filter((p) => p.stock > p.minStock)
  const low = products.filter((p) => p.stock > 0 && p.stock <= p.minStock)
  const out = products.filter((p) => p.stock === 0)
  const inventoryValue = products.reduce((s, p) => s + (p.salePrice ?? p.price) * p.stock, 0)

  const statusData = ordersByStatus(orders)

  // Productos por categoría (conteo real del catálogo).
  const byCategory = categories
    .map((c) => ({
      name: c.name,
      value: products.filter((p) => p.category === c.id).length,
    }))
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value)

  // Productos que requieren reabastecimiento (bajos + agotados).
  const restock = [...out, ...low].slice(0, 12)

  const summary = [
    { label: "Productos en catálogo", value: products.length.toString() },
    { label: "Valor del inventario", value: formatCurrency(inventoryValue) },
    { label: "Categorías activas", value: categories.filter((c) => c.active !== false).length.toString() },
    { label: "Clientes registrados", value: customers.length.toString() },
  ]

  const inventoryBars = [
    { label: "Disponibles", value: available.length, cls: "bg-green-400" },
    { label: "Existencias bajas", value: low.length, cls: "bg-yellow-400" },
    { label: "Agotados", value: out.length, cls: "bg-red-400" },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-black text-4xl text-white uppercase">Reportes</h1>
        <p className="text-sigo-muted text-sm mt-1">
          Estado operativo del catálogo, el inventario y el flujo de pedidos.
        </p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {summary.map((s) => (
          <div key={s.label} className="bg-sigo-card border border-sigo-border rounded-xl p-4">
            <div className="price-tag text-white text-2xl">{s.value}</div>
            <div className="text-sigo-muted text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Salud del inventario */}
        <div className="bg-sigo-card border border-sigo-border rounded-xl p-5">
          <h3 className="font-display font-bold text-white text-lg uppercase mb-4">
            Salud del inventario
          </h3>
          {products.length === 0 ? (
            <p className="text-sigo-muted text-sm py-6 text-center">
              Aún no hay productos en el catálogo.
            </p>
          ) : (
            inventoryBars.map((item) => (
              <div key={item.label} className="mb-4 last:mb-0">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-sigo-light">{item.label}</span>
                  <span className="text-white font-bold">{item.value}</span>
                </div>
                <div className="h-2 bg-sigo-surface rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.cls}`}
                    style={{ width: `${products.length ? (item.value / products.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pedidos por estado (dona) */}
        <div className="bg-sigo-card border border-sigo-border rounded-xl p-5">
          <h3 className="font-display font-bold text-white text-lg uppercase mb-4">
            Flujo de pedidos
          </h3>
          {statusData.length === 0 ? (
            <p className="text-sigo-muted text-sm py-6 text-center">
              Aún no hay pedidos registrados.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {statusData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#222", border: "1px solid #2E2E2E", borderRadius: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Productos por categoría */}
        <div className="bg-sigo-card border border-sigo-border rounded-xl p-5">
          <h3 className="font-display font-bold text-white text-lg uppercase mb-4">
            Productos por categoría
          </h3>
          {byCategory.length === 0 ? (
            <p className="text-sigo-muted text-sm py-6 text-center">
              Aún no hay productos registrados.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={byCategory} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2E2E2E" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#6B6B6B", fontSize: 11 }} allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: "#AAAAAA", fontSize: 11 }} width={110} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#222", border: "1px solid #2E2E2E", borderRadius: 8 }}
                />
                <Bar dataKey="value" fill="#FF6200" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Reabastecimiento */}
        <div className="bg-sigo-card border border-sigo-border rounded-xl p-5">
          <h3 className="font-display font-bold text-white text-lg uppercase mb-4">
            Productos por reabastecer
          </h3>
          {restock.length === 0 ? (
            <p className="text-sigo-muted text-sm py-6 text-center">
              Todo el inventario está en niveles saludables. ✔
            </p>
          ) : (
            <div className="space-y-2">
              {restock.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between bg-sigo-surface rounded-lg px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-white text-sm line-clamp-1">{p.name}</p>
                    <p className="text-sigo-muted text-xs font-mono">{p.code}</p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                      p.stock === 0
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {p.stock === 0 ? "Agotado" : `${p.stock} unid.`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
