import { useState } from "react"
import { useData } from "../../store/DataProvider"
import type { Order, OrderStatus } from "../../data/mockData"
import { SearchIcon, EyeIcon } from "../../components/ui/Icons"
import { formatCurrency } from "../../lib/whatsapp"
import { imgFallback } from "../../lib/images"

const statusOptions: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Shipped",
  "Delivered",
  "Cancelled",
]
const statusLabels: Record<OrderStatus, string> = {
  Pending: "Pendiente",
  Confirmed: "Confirmado",
  Preparing: "En preparación",
  Shipped: "Enviado",
  Delivered: "Entregado",
  Cancelled: "Cancelado",
}

export function AdminOrders() {
  const { orders, customers, updateOrderStatus } = useData()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [notice, setNotice] = useState("")

  const filtered = orders.filter(
    (o) =>
      (!search ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase())) &&
      (!statusFilter || o.status === statusFilter),
  )

  const updateStatus = async (id: string, status: OrderStatus) => {
    if (selectedOrder?.id === id)
      setSelectedOrder((prev) => (prev ? { ...prev, status } : prev))
    try {
      await updateOrderStatus(id, status)
      setNotice(`Estado actualizado a “${statusLabels[status]}”.`)
    } catch (e) {
      console.error(e)
      setNotice("No se pudo actualizar el estado del pedido.")
    }
    setTimeout(() => setNotice(""), 2500)
  }

  return (
    <div>
      <h1 className="font-display font-black text-4xl text-white uppercase mb-2">
        Gestión de pedidos
      </h1>
      <p className="text-sigo-muted mb-6">
        Una solicitud enviada por WhatsApp permanece pendiente hasta que el
        negocio la confirme.
      </p>
      {notice && (
        <div
          role="status"
          className="mb-5 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg px-4 py-3 text-sm"
        >
          {notice}
        </div>
      )}

      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <SearchIcon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-sigo-muted"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por número de pedido o cliente..."
            className="w-full bg-sigo-surface border border-sigo-border text-white placeholder-sigo-muted pl-9 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-sigo-orange text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-sigo-surface border border-sigo-border text-white text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-sigo-orange"
        >
          <option value="">Todos los estados</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-sigo-card border border-sigo-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-sigo-surface border-b border-sigo-border">
              <tr>
                {[
                  "Pedido",
                  "Cliente",
                  "Fecha",
                  "Total",
                  "Origen",
                  "Entrega",
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
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  className="row-hover border-b border-sigo-border/50 last:border-0"
                >
                  <td className="py-3 px-4 font-mono text-sigo-orange text-xs">
                    {o.id}
                  </td>
                  <td className="py-3 px-4 text-white">{o.customerName}</td>
                  <td className="py-3 px-4 text-sigo-muted">{o.date}</td>
                  <td className="py-3 px-4 price-tag text-white">
                    {formatCurrency(o.total)}
                  </td>
                  <td className="py-3 px-4 text-sigo-muted text-xs">
                    {o.paymentMethod}
                  </td>
                  <td className="py-3 px-4 text-sigo-muted text-xs">
                    {o.deliveryMethod}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={o.status}
                      onChange={(e) =>
                        updateStatus(o.id, e.target.value as OrderStatus)
                      }
                      className={`text-xs font-semibold rounded-full px-2 py-1 border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-sigo-orange status-${o.status.toLowerCase()} bg-transparent`}
                    >
                      {statusOptions.map((s) => (
                        <option
                          key={s}
                          value={s}
                          className="bg-sigo-dark text-white"
                        >
                          {statusLabels[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="p-1.5 text-sigo-muted hover:text-blue-400 transition-colors"
                      title="Ver detalle"
                      aria-label={`Ver detalle de ${o.id}`}
                    >
                      <EyeIcon size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-sigo-card border border-sigo-border rounded-2xl p-6 max-w-lg w-full shadow-2xl menu-fade max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-xl text-white">
                  {selectedOrder.id}
                </h3>
                <p className="text-sigo-muted text-xs">
                  {selectedOrder.date} · {selectedOrder.customerName}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-sigo-muted hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {selectedOrder.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-3 bg-sigo-surface rounded-lg px-3 py-2"
                >
                  <img
                    src={item.image}
                    alt=""
                    onError={imgFallback}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm line-clamp-1">
                      {item.productName}
                    </p>
                    <p className="text-sigo-muted text-xs">
                      {item.quantity} × {formatCurrency(item.unitPrice)} c/u ·{" "}
                      {item.productCode}
                    </p>
                  </div>
                  <span className="text-sigo-orange font-bold text-sm">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-sigo-surface rounded-lg p-3 text-sm space-y-1 mb-4">
              <div className="flex justify-between">
                <span className="text-sigo-muted">Subtotal</span>
                <span className="text-white">
                  {formatCurrency(selectedOrder.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sigo-muted">Descuento</span>
                <span className="text-green-400">
                  −{formatCurrency(selectedOrder.discount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sigo-muted">Envío</span>
                <span className="text-white">
                  {selectedOrder.shipping
                    ? formatCurrency(selectedOrder.shipping)
                    : "Gratis"}
                </span>
              </div>
              <div className="flex justify-between font-bold border-t border-sigo-border pt-1">
                <span className="text-white">Total</span>
                <span className="price-tag text-sigo-orange text-lg">
                  {formatCurrency(selectedOrder.total)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-sigo-muted mb-4">
              <div>
                <span className="font-semibold text-white block">
                  Dirección de envío
                </span>
                {selectedOrder.address}
                <span className="font-semibold text-white block mt-2">
                  Teléfono
                </span>
                {customers.find(
                  (customer) => customer.id === selectedOrder.customerId,
                )?.phone ?? "No registrado"}
              </div>
              <div>
                <span className="font-semibold text-white block">
                  Origen de la solicitud
                </span>
                {selectedOrder.paymentMethod}
                <span className="font-semibold text-white block mt-2">
                  Entrega
                </span>
                {selectedOrder.deliveryMethod}
              </div>
            </div>

            <div>
              <label className="block text-sigo-muted text-xs font-semibold uppercase mb-1">
                Actualizar estado
              </label>
              <select
                value={selectedOrder.status}
                onChange={(e) =>
                  updateStatus(selectedOrder.id, e.target.value as OrderStatus)
                }
                className="w-full bg-sigo-surface border border-sigo-border text-white text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-sigo-orange"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {statusLabels[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
