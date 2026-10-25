import { useState } from "react"
import { Link } from "react-router-dom"
import { useData } from "../../store/DataProvider"
import { Badge } from "../../components/ui/Badge"
import { imgFallback } from "../../lib/images"
import {
  SearchIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
} from "../../components/ui/Icons"
import { formatCurrency } from "../../lib/whatsapp"

export function AdminProducts() {
  const { products, categories, deleteProduct, updateProduct } = useData()
  const [search, setSearch] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [category, setCategory] = useState("")
  const [busy, setBusy] = useState(false)

  const filtered = products.filter(
    (p) =>
      (!search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.code.toLowerCase().includes(search.toLowerCase())) &&
      (!category || p.category === category),
  )

  const handleDelete = async (id: string) => {
    setBusy(true)
    try {
      await deleteProduct(id)
    } catch (e) {
      console.error(e)
      alert("No se pudo eliminar el producto. ¿Iniciaste sesión como administrador?")
    } finally {
      setBusy(false)
      setDeleteId(null)
    }
  }

  const toggleActive = async (id: string) => {
    const p = products.find((x) => x.id === id)
    if (!p) return
    setBusy(true)
    try {
      await updateProduct(id, {
        name: p.name,
        brand: p.brand,
        category: p.category,
        code: p.code,
        partNumber: p.partNumber,
        price: p.price,
        salePrice: p.salePrice ?? null,
        stock: p.stock,
        minStock: p.minStock,
        compatibility: p.compatibility,
        description: p.description,
        specs: p.specs,
        warranty: p.warranty,
        status: p.status,
        image: p.image,
        images: p.images,
        active: !p.active,
      })
    } catch (e) {
      console.error(e)
      alert("No se pudo actualizar el producto.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-black text-4xl text-white uppercase">
            Productos
          </h1>
          <p className="text-sigo-muted mt-1">
            {products.length} productos registrados
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 bg-sigo-orange hover:bg-sigo-orange-dark text-white font-display font-bold px-5 py-2.5 rounded-lg transition-colors"
        >
          <PlusIcon size={16} />
          Agregar producto
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <SearchIcon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-sigo-muted"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o código..."
            className="w-full bg-sigo-surface border border-sigo-border text-white placeholder-sigo-muted pl-9 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-sigo-orange text-sm"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-sigo-surface border border-sigo-border text-white text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-sigo-orange"
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-sigo-card border border-sigo-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-sigo-surface border-b border-sigo-border">
              <tr>
                {[
                  "Producto",
                  "Categoría",
                  "Marca",
                  "Precio",
                  "Existencias",
                  "Estado",
                  "Activo",
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
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="row-hover border-b border-sigo-border/50 last:border-0"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt=""
                        onError={imgFallback}
                        className="w-10 h-10 rounded object-cover bg-sigo-surface flex-shrink-0"
                      />
                      <div>
                        <p className="text-white font-medium line-clamp-1">
                          {p.name}
                        </p>
                        <p className="text-sigo-muted text-xs font-mono">
                          {p.code}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sigo-muted">
                    {categories.find((c) => c.id === p.category)?.name ??
                      p.category}
                  </td>
                  <td className="py-3 px-4 text-sigo-light">{p.brand}</td>
                  <td className="py-3 px-4">
                    <div className="price-tag text-sigo-orange">
                      {formatCurrency(p.salePrice ?? p.price)}
                    </div>
                    {p.salePrice && (
                      <div className="text-sigo-muted text-xs line-through">
                        {formatCurrency(p.price)}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-mono text-sm font-bold ${
                        p.stock === 0
                          ? "text-red-400"
                          : p.stock <= p.minStock
                            ? "text-yellow-400"
                            : "text-green-400"
                      }`}
                    >
                      {p.stock}
                    </span>
                    <span className="text-sigo-muted text-xs">
                      {" "}
                      / mín. {p.minStock}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge status={p.status} />
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleActive(p.id)}
                      aria-label={
                        p.active ? `Desactivar ${p.name}` : `Activar ${p.name}`
                      }
                      title={
                        p.active ? "Desactivar producto" : "Activar producto"
                      }
                      className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${
                        p.active ? "bg-sigo-orange" : "bg-sigo-border"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          p.active ? "translate-x-4" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/product/${p.id}`}
                        className="p-1.5 text-sigo-muted hover:text-blue-400 transition-colors"
                        title="Ver producto"
                      >
                        <EyeIcon size={15} />
                      </Link>
                      <Link
                        to={`/admin/products/edit/${p.id}`}
                        className="p-1.5 text-sigo-muted hover:text-sigo-orange transition-colors"
                        title="Editar producto"
                      >
                        <EditIcon size={15} />
                      </Link>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="p-1.5 text-sigo-muted hover:text-red-400 transition-colors"
                        title="Eliminar producto"
                      >
                        <TrashIcon size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-sigo-card border border-sigo-border rounded-2xl p-6 max-w-sm w-full shadow-2xl menu-fade">
            <h3 className="font-display font-bold text-xl text-white mb-2">
              ¿Eliminar producto?
            </h3>
            <p className="text-sigo-muted text-sm mb-5">
              Esta acción eliminará el producto de la base de datos y no se puede
              deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={busy}
                className="flex-1 border border-sigo-border text-sigo-muted hover:text-white py-2.5 rounded-lg transition-colors text-sm font-semibold disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={busy}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg transition-colors text-sm font-bold disabled:opacity-50"
              >
                {busy ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
