import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  salesData,
  topProducts,
  categoryData,
  orderStatusData,
} from "../../data/mockData"
import { useData } from "../../store/DataProvider"
import { useState } from "react"
import { formatCurrency } from "../../lib/whatsapp"
import { useLocation } from "react-router-dom"

const dailyData = [
  { day: "Lun", sales: 1240, orders: 9 },
  { day: "Mar", sales: 1890, orders: 14 },
  { day: "Mié", sales: 1420, orders: 11 },
  { day: "Jue", sales: 2100, orders: 16 },
  { day: "Vie", sales: 2680, orders: 21 },
  { day: "Sáb", sales: 1850, orders: 14 },
  { day: "Dom", sales: 980, orders: 7 },
]

export function AdminReports() {
  const location = useLocation()
  const { products } = useData()
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("weekly")

  // Normaliza ambos orígenes de datos a una forma uniforme ({ label, sales,
  // orders }) para que las gráficas de Recharts reciban un único tipo.
  const chartData =
    period === "monthly"
      ? salesData.map((d) => ({ label: d.month, sales: d.sales, orders: d.orders }))
      : dailyData.map((d) => ({ label: d.day, sales: d.sales, orders: d.orders }))
  const periodLabels = {
    daily: "Diario",
    weekly: "Semanal",
    monthly: "Mensual",
  }
  const exportReport = () => {
    const csv =
      "Periodo,Ventas confirmadas,Pedidos confirmados\nActual,31200,241"
    const link = document.createElement("a")
    link.href = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    )
    link.download = "reporte-sigo.csv"
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-black text-4xl text-white uppercase">
            {location.pathname.endsWith("/sales") ? "Ventas" : "Reportes"}
          </h1>
          <p className="text-sigo-muted text-sm mt-1">
            Solo se incluyen ventas confirmadas; las solicitudes de WhatsApp
            pendientes no cuentan como ingresos.
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <button
            onClick={exportReport}
            className="border border-sigo-border text-sigo-light hover:text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            Exportar CSV
          </button>
          <div className="flex border border-sigo-border rounded-lg overflow-hidden">
            {(["daily", "weekly", "monthly"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  period === p
                    ? "bg-sigo-orange text-white"
                    : "bg-sigo-surface text-sigo-muted hover:text-white"
                }`}
              >
                {periodLabels[p]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Ventas confirmadas", value: "Q31,200", trend: "+8.4%" },
          { label: "Pedidos confirmados", value: "241", trend: "+12.1%" },
          {
            label: "Valor promedio por pedido",
            value: "Q129.46",
            trend: "+3.2%",
          },
          { label: "Clientes nuevos", value: "38", trend: "+15.8%" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-sigo-card border border-sigo-border rounded-xl p-4"
          >
            <div className="price-tag text-white text-2xl">{s.value}</div>
            <div className="text-sigo-muted text-xs mt-0.5">{s.label}</div>
            <div className="text-green-400 text-xs mt-1">
              {s.trend} en este período
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Sales trend */}
        <div className="bg-sigo-card border border-sigo-border rounded-xl p-5">
          <h3 className="font-display font-bold text-white text-lg uppercase mb-4">
            Tendencia de ventas
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2E2E2E" />
              <XAxis dataKey="label" tick={{ fill: "#6B6B6B", fontSize: 12 }} />
              <YAxis
                tick={{ fill: "#6B6B6B", fontSize: 12 }}
                tickFormatter={(v) => `Q${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#222",
                  border: "1px solid #2E2E2E",
                  borderRadius: 8,
                }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#FF6200"
                strokeWidth={2.5}
                dot={{ fill: "#FF6200", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders trend */}
        <div className="bg-sigo-card border border-sigo-border rounded-xl p-5">
          <h3 className="font-display font-bold text-white text-lg uppercase mb-4">
            Volumen de pedidos
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2E2E2E" />
              <XAxis dataKey="label" tick={{ fill: "#6B6B6B", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6B6B6B", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#222",
                  border: "1px solid #2E2E2E",
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="orders" fill="#FF6200" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-sigo-card border border-sigo-border rounded-xl p-5">
          <h3 className="font-display font-bold text-white text-lg uppercase mb-4">
            Pedidos por estado
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {orderStatusData.map((item) => (
              <div
                key={item.name}
                className="bg-sigo-surface rounded-lg p-3 flex justify-between gap-3"
              >
                <span className="text-sigo-light text-sm">{item.name}</span>
                <span className="text-white font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-sigo-card border border-sigo-border rounded-xl p-5">
          <h3 className="font-display font-bold text-white text-lg uppercase mb-4">
            Comportamiento del inventario
          </h3>
          {[
            {
              label: "Disponibles",
              value: products.filter(
                (product) => product.stock > product.minStock,
              ).length,
              cls: "bg-green-400",
            },
            {
              label: "Existencias bajas",
              value: products.filter(
                (product) =>
                  product.stock > 0 && product.stock <= product.minStock,
              ).length,
              cls: "bg-yellow-400",
            },
            {
              label: "Agotados",
              value: products.filter((product) => product.stock === 0).length,
              cls: "bg-red-400",
            },
          ].map((item) => (
            <div key={item.label} className="mb-4 last:mb-0">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-sigo-light">{item.label}</span>
                <span className="text-white font-bold">{item.value}</span>
              </div>
              <div className="h-2 bg-sigo-surface rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.cls}`}
                  style={{
                    width: `${Math.max(8, (item.value / products.length) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
          <p className="text-sigo-muted text-xs mt-4">
            Datos de demostración basados en el catálogo actual.
          </p>
        </div>
      </div>

      {/* Best selling */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="bg-sigo-card border border-sigo-border rounded-xl p-5">
          <h3 className="font-display font-bold text-white text-lg uppercase mb-4">
            Productos más vendidos
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sigo-border">
                <th className="text-left text-sigo-muted text-xs uppercase pb-2 font-semibold">
                  Producto
                </th>
                <th className="text-right text-sigo-muted text-xs uppercase pb-2 font-semibold">
                  Unidades
                </th>
                <th className="text-right text-sigo-muted text-xs uppercase pb-2 font-semibold">
                  Ventas
                </th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, i) => (
                <tr
                  key={p.name}
                  className="border-b border-sigo-border/50 last:border-0"
                >
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sigo-muted text-xs font-mono w-4">
                        {i + 1}
                      </span>
                      <span className="text-white text-xs">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-right text-sigo-light">
                    {p.sales}
                  </td>
                  <td className="py-2.5 text-right price-tag text-sigo-orange">
                    {formatCurrency(p.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-sigo-card border border-sigo-border rounded-xl p-5">
          <h3 className="font-display font-bold text-white text-lg uppercase mb-4">
            Categorías más vendidas
          </h3>
          <div className="space-y-3">
            {categoryData.map((c) => (
              <div key={c.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white">{c.name}</span>
                  <span className="text-sigo-orange font-bold">{c.value}%</span>
                </div>
                <div className="w-full bg-sigo-surface rounded-full h-2">
                  <div
                    className="bg-sigo-orange rounded-full h-2 transition-all"
                    style={{ width: `${c.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
