import { useState } from "react"
import { useData } from "../../store/DataProvider"
import type { Product } from "../../data/mockData"
import { EditIcon } from "../../components/ui/Icons"
import { imgFallback } from "../../lib/images"

export function AdminInventory() {
  const { products, categories, updateStock } = useData()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [stockValue, setStockValue] = useState("")
  const [notice, setNotice] = useState("")
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= p.minStock)
  const outOfStock = products.filter((p) => p.stock === 0)
  const inStock = products.filter((p) => p.stock > p.minStock)

  const getStatus = (p: Product) => {
    if (p.stock === 0) return { label: "Agotado", cls: "status-cancelled" }
    if (p.stock <= p.minStock)
      return {
        label: "Existencias bajas",
        cls: "bg-yellow-500/15 text-yellow-400 badge-pulse",
      }
    return { label: "Disponible", cls: "bg-green-500/15 text-green-400" }
  }

  const saveStock = async (id: string) => {
    const value = Math.max(0, Number(stockValue))
    setEditingId(null)
    try {
      await updateStock(id, value)
      setNotice("Existencias actualizadas correctamente.")
    } catch (e) {
      console.error(e)
      setNotice("No se pudieron actualizar las existencias.")
    }
    setTimeout(() => setNotice(""), 2500)
  }

  return (
    <div>
      <h1 className="font-display font-black text-4xl text-white uppercase mb-2">
        Inventario
      </h1>
      <p className="text-sigo-muted mb-6">
        Control de existencias en tiempo real.
      </p>
      {notice && (
        <div
          role="status"
          className="mb-5 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg px-4 py-3 text-sm"
        >
          {notice}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
          <div className="price-tag text-green-400 text-3xl">
            {inStock.length}
          </div>
          <div className="text-green-400 font-display font-bold text-sm uppercase mt-1">
            Disponibles
          </div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
          <div className="price-tag text-yellow-400 text-3xl">
            {lowStock.length}
          </div>
          <div className="text-yellow-400 font-display font-bold text-sm uppercase mt-1">
            Existencias bajas
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="price-tag text-red-400 text-3xl">
            {outOfStock.length}
          </div>
          <div className="text-red-400 font-display font-bold text-sm uppercase mt-1">
            Agotados
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(lowStock.length > 0 || outOfStock.length > 0) && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
          <h3 className="font-display font-bold text-yellow-400 text-lg uppercase mb-3">
            Alertas de inventario
          </h3>
          <div className="space-y-2">
            {[...outOfStock, ...lowStock].map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between bg-sigo-black/40 rounded-lg px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.image}
                    alt=""
                    onError={imgFallback}
                    className="w-8 h-8 rounded object-cover"
                  />
                  <div>
                    <p className="text-white text-sm font-medium">{p.name}</p>
                    <p className="text-sigo-muted text-xs font-mono">
                      {p.code}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-mono font-bold text-sm ${
                      p.stock === 0 ? "text-red-400" : "text-yellow-400"
                    }`}
                  >
                    {p.stock} unidades
                  </p>
                  <p className="text-sigo-muted text-xs">
                    Mínimo: {p.minStock}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full inventory table */}
      <div className="bg-sigo-card border border-sigo-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-sigo-border">
          <h3 className="font-display font-bold text-white text-lg uppercase">
            Inventario completo
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-sigo-surface border-b border-sigo-border">
              <tr>
                {[
                  "Producto",
                  "Código",
                  "Categoría",
                  "Existencias actuales",
                  "Nivel mínimo",
                  "Estado",
                  "Última actualización",
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
              {products.map((p) => {
                const st = getStatus(p)
                return (
                  <tr
                    key={p.id}
                    className="row-hover border-b border-sigo-border/50 last:border-0"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={p.image}
                          alt=""
                          onError={imgFallback}
                          className="w-8 h-8 rounded object-cover bg-sigo-surface"
                        />
                        <span className="text-white font-medium text-xs line-clamp-1">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-sigo-muted text-xs">
                      {p.code}
                    </td>
                    <td className="py-3 px-4 text-sigo-muted">
                      {categories.find((c) => c.id === p.category)?.name ??
                        p.category}
                    </td>
                    <td className="py-3 px-4">
                      {editingId === p.id ? (
                        <input
                          type="number"
                          min="0"
                          value={stockValue}
                          onChange={(event) =>
                            setStockValue(event.target.value)
                          }
                          className="input-sigo w-24"
                          aria-label={`Existencias de ${p.name}`}
                        />
                      ) : (
                        <span
                          className={`font-mono font-bold text-base ${
                            p.stock === 0
                              ? "text-red-400"
                              : p.stock <= p.minStock
                                ? "text-yellow-400"
                                : "text-green-400"
                          }`}
                        >
                          {p.stock}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-sigo-muted">
                      {p.minStock}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full font-display ${st.cls}`}
                      >
                        {st.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sigo-muted text-xs">
                      26/09/2024
                    </td>
                    <td className="py-3 px-4">
                      {editingId === p.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveStock(p.id)}
                            className="text-green-400 text-xs font-bold"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-sigo-muted text-xs"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingId(p.id)
                            setStockValue(String(p.stock))
                          }}
                          className="p-1.5 text-sigo-muted hover:text-sigo-orange"
                          title="Actualizar existencias"
                          aria-label={`Actualizar existencias de ${p.name}`}
                        >
                          <EditIcon size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
