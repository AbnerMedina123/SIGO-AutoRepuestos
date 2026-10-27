import { useState } from "react"
import { useData } from "../../store/DataProvider"
import type { Category } from "../../data/mockData"
import { imgFallback } from "../../lib/images"
import { ImageUploader } from "../../components/ui/ImageUploader"
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  SearchIcon,
} from "../../components/ui/Icons"

const emptyForm = { name: "", description: "", image: "" }

export function AdminCategories() {
  const { categories, saveCategory: persistCategory, removeCategory: deleteCat } = useData()
  const [search, setSearch] = useState("")
  const [editing, setEditing] = useState<Category | "new" | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [notice, setNotice] = useState("")

  const openForm = (category?: Category) => {
    setEditing(category ?? "new")
    setForm(
      category
        ? {
            name: category.name,
            description: category.description,
            image: category.image,
          }
        : emptyForm,
    )
  }

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || `cat-${Date.now()}`

  const saveCategory = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!form.name.trim()) {
      setNotice("El nombre de la categoría es obligatorio.")
      return
    }
    try {
      if (editing === "new") {
        await persistCategory({
          id: slugify(form.name),
          name: form.name.trim(),
          description: form.description.trim(),
          image: "",
          icon: "",
          count: 0,
          active: true,
        })
      } else if (editing) {
        await persistCategory({
          ...editing,
          name: form.name.trim(),
          description: form.description.trim(),
        })
      }
      setEditing(null)
      setNotice("Categoría guardada correctamente.")
    } catch (e) {
      console.error(e)
      setNotice("No se pudo guardar la categoría.")
    }
  }

  const removeCategory = async (category: Category) => {
    if (category.count > 0) {
      setNotice(
        `No se puede eliminar “${category.name}” porque tiene ${category.count} productos asociados.`,
      )
      return
    }
    try {
      await deleteCat(category.id)
      setNotice("Categoría eliminada.")
    } catch (e) {
      console.error(e)
      setNotice("No se pudo eliminar la categoría.")
    }
  }

  const filtered = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-black text-4xl text-white uppercase">
            Categorías
          </h1>
          <p className="text-sigo-muted mt-1">
            Organiza el catálogo y controla qué categorías están visibles.
          </p>
        </div>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 bg-sigo-orange hover:bg-sigo-orange-dark text-white font-display font-bold px-5 py-2.5 rounded-lg"
        >
          <PlusIcon size={16} /> Agregar categoría
        </button>
      </div>

      {notice && (
        <div
          role="status"
          className="mb-5 bg-sigo-surface border border-sigo-border text-sigo-light rounded-lg px-4 py-3 text-sm"
        >
          {notice}
        </div>
      )}

      <div className="relative max-w-lg mb-5">
        <SearchIcon
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-sigo-muted"
        />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar categorías..."
          className="input-sigo pl-9"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((category) => (
          <div
            key={category.id}
            className="bg-sigo-card border border-sigo-border rounded-xl overflow-hidden group"
          >
            <div className="relative h-28">
              <img
                src={category.image}
                alt={category.name}
                onError={imgFallback}
                className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sigo-black" />
              <div className="absolute bottom-3 left-3">
                <span className="font-display font-black text-white text-xl">
                  {category.name}
                </span>
              </div>
              <span
                className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full ${
                  category.active
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {category.active ? "Activa" : "Inactiva"}
              </span>
            </div>
            <div className="p-4">
              <p className="text-sigo-muted text-sm min-h-10">
                {category.description}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sigo-orange font-bold text-sm">
                  {category.count} productos
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      persistCategory({ ...category, active: !category.active }).catch(
                        (e) => {
                          console.error(e)
                          setNotice("No se pudo actualizar la categoría.")
                        },
                      )
                    }
                    className="text-xs text-sigo-muted hover:text-white mr-2"
                  >
                    {category.active ? "Desactivar" : "Activar"}
                  </button>
                  <button
                    onClick={() => openForm(category)}
                    className="p-1.5 text-sigo-muted hover:text-sigo-orange"
                    title="Editar categoría"
                  >
                    <EditIcon size={15} />
                  </button>
                  <button
                    onClick={() => removeCategory(category)}
                    className="p-1.5 text-sigo-muted hover:text-red-400"
                    title="Eliminar categoría"
                  >
                    <TrashIcon size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={saveCategory}
            className="bg-sigo-card border border-sigo-border rounded-2xl p-6 max-w-lg w-full"
          >
            <h2 className="font-display font-bold text-2xl text-white mb-5">
              {editing === "new" ? "Agregar categoría" : "Editar categoría"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="label-admin">Nombre *</label>
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  className="input-sigo"
                />
              </div>
              <div>
                <label className="label-admin">Descripción *</label>
                <textarea
                  required
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  className="input-sigo"
                />
              </div>
              <ImageUploader
                label="Imagen de la categoría"
                value={form.image}
                folder="categories"
                onChange={(url) => setForm({ ...form, image: url })}
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="flex-1 border border-sigo-border text-sigo-light py-2.5 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-sigo-orange hover:bg-sigo-orange-dark text-white font-bold py-2.5 rounded-lg"
              >
                Guardar categoría
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
