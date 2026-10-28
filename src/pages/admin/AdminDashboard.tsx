import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { useData } from "../../store/DataProvider"
import { OrderStatusBadge } from "../../components/ui/Badge"
import { formatCurrency } from "../../lib/whatsapp"
import {
  salesByMonth,
  ordersByStatus,
  topProducts as computeTopProducts,
  salesByCategory,
} from "../../lib/analytics"

import type { Product, Order, Customer } from "../../data/mockData"

function buildStatCards(products: Product[], orders: Order[], customers: Customer[]) {
  const pending = orders.filter((o) => o.status === "Pending").length
  const lowStock = products.filter((p) => p.stock <= p.minStock && p.stock > 0).length
  const outOfStock = products.filter((p) => p.stock === 0).length
  const monthSales = orders.reduce((s, o) => s + o.total, 0)
  return [
    {
      label: "Pedidos registrados",
      value: orders.length.toString(),
      sub: `${pending} pendientes`,
      color: "text-sigo-orange",
      bg: "bg-sigo-orange/10",
    },
    {
      label: "Ventas acumuladas",
      value: formatCurrency(monthSales),
      sub: "Según pedidos registrados",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Pedidos pendientes",
      value: pending.toString(),
      sub: "Requieren atención",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      label: "Productos registrados",
      value: products.length.toString(),
      sub: `${outOfStock} agotados`,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      label: "Existencias bajas",
      value: lowStock.toString(),
      sub: "Requieren reabastecimiento",
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
    {
      label: "Clientes registrados",
      value: customers.length.toString(),
      sub: "Base de clientes",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
  ]
}

const ORANGE = "#FF6200"
const COLORS = [
  "#FF6200",
  "#60A5FA",
  "#C084FC",
  "#2DD4BF",
  "#4ADE80",
  "#F87171",
]

export function AdminDashboard() {
  const { products, orders, customers, categories } = useData()
  const statCards = buildStatCards(products, orders, customers)

  // Datos reales para las gráficas (calculados desde los pedidos de Supabase).
  const salesData = salesByMonth(orders, 6)
  const statusData = ordersByStatus(orders)
  const topData = computeTopProducts(orders, 5)
  const categoryData = salesByCategory(orders, products, categories)
  const recentOrders = [...orders]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-black text-4xl text-white uppercase">
          Panel principal
        </h1>
        <p className="text-sigo-muted mt-1">
          Resumen general del negocio
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map((c) => (
          <div
            key={c.label}
            className={`${c.bg} border border-sigo-border rounded-xl p-4`}
          >
            <div className={`font-display font-black text-2xl ${c.color}`}>
              {c.value}
            </div>
            <div className="text-white text-xs font-semibold mt-0.5">
              {c.label}
            </div>
            <div className="text-sigo-muted text-xs mt-0.5">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Sales over time */}
        <div className="xl:col-span-2 bg-sigo-card border border-sigo-border rounded-xl p-5">
          <h3 className="font-display font-bold text-white text-lg uppercase mb-4">
            Tendencia de ventas confirmadas
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={salesData}>
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
                labelStyle={{ color: "#FFF", fontFamily: "Barlow Condensed" }}
                formatter={(v) => [
                  `Q${Number(v).toLocaleString("es-GT")}`,
                  "Ventas",
                ]}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke={ORANGE}
                strokeWidth={2.5}
                dot={{ fill: ORANGE, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order status donut */}
        <div className="bg-sigo-card border border-sigo-border rounded-xl p-5">
          <h3 className="font-display font-bold text-white text-lg uppercase mb-4">
            Pedidos por estado
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#222",
                  border: "1px solid #2E2E2E",
                  borderRadius: 8,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {statusData.slice(0, 4).map((e) => (
              <div key={e.name} className="flex justify-between text-xs">
                <span
                  className="flex items-center gap-1.5"
                  style={{ color: e.color }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: e.color }}
                  />
                  {e.name}
                </span>
                <span className="text-sigo-muted">{e.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Top products */}
        <div className="bg-sigo-card border border-sigo-border rounded-xl p-5">
          <h3 className="font-display font-bold text-white text-lg uppercase mb-4">
            Productos más vendidos
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topData} layout="vertical">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#2E2E2E"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fill: "#6B6B6B", fontSize: 11 }}
                tickFormatter={(v) => `${v}`}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: "#AAAAAA", fontSize: 11 }}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#222",
                  border: "1px solid #2E2E2E",
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="sales" fill={ORANGE} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown */}
        <div className="bg-sigo-card border border-sigo-border rounded-xl p-5">
          <h3 className="font-display font-bold text-white text-lg uppercase mb-4">
            Ventas por categoría
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="40%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend
                iconSize={10}
                formatter={(v) => (
                  <span style={{ color: "#AAAAAA", fontSize: 12 }}>{v}</span>
                )}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#222",
                  border: "1px solid #2E2E2E",
                  borderRadius: 8,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-sigo-card border border-sigo-border rounded-xl p-5">
        <h3 className="font-display font-bold text-white text-lg uppercase mb-4">
          Pedidos recientes
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sigo-border">
                {[
                  "Pedido",
                  "Cliente",
                  "Fecha",
                  "Total",
                  "Origen",
                  "Estado",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-sigo-muted font-semibold text-xs uppercase pb-2 pr-4"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr
                  key={o.id}
                  className="row-hover border-b border-sigo-border/50 last:border-0"
                >
                  <td className="py-3 pr-4 font-mono text-sigo-orange text-xs">
                    {o.id}
                  </td>
                  <td className="py-3 pr-4 text-white">{o.customerName}</td>
                  <td className="py-3 pr-4 text-sigo-muted">{o.date}</td>
                  <td className="py-3 pr-4 price-tag text-white">
                    {formatCurrency(o.total)}
                  </td>
                  <td className="py-3 pr-4 text-sigo-muted">
                    {o.paymentMethod}
                  </td>
                  <td className="py-3">
                    <OrderStatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
