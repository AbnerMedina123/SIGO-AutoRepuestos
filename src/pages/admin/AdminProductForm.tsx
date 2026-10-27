import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useData } from "../../store/DataProvider"
import { UploadIcon, XIcon } from "../../components/ui/Icons"
import { imgFallback } from "../../lib/images"
import { uploadImage } from "../../lib/api"

export function AdminProductForm({ mode }: { mode: "new" | "edit" }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products: allProducts, categories, createProduct, updateProduct } = useData()
  const existing = mode === "edit" ? allProducts.find((p) => p.id === id) : null

  const [form, setForm] = useState({
    name: existing?.name ?? "",
    category: existing?.category ?? "",
    brand: existing?.brand ?? "",
    code: existing?.code ?? "",
    partNumber: existing?.partNumber ?? "",
    description: existing?.description ?? "",
    price: existing?.price?.toString() ?? "",
    salePrice: existing?.salePrice?.toString() ?? "",
    stock: existing?.stock?.toString() ?? "",
    minStock: existing?.minStock?.toString() ?? "",
    compatibility: existing?.compatibility?.join("\n") ?? "",
    warranty: existing?.warranty ?? "",
    status: existing?.status ?? "ACTIVE",
  })

  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  // Galería de imágenes del producto (URLs ya subidas a Supabase Storage).
  const [images, setImages] = useState<string[]>(existing?.images ?? [])
  const [uploading, setUploading] = useState(false)
  const [imgError, setImgError] = useState("")

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setImgError("")
    setUploading(true)
    try {
      const urls: string[] = []
      for (const file of Array.from(files)) {
        const url = await uploadImage(file, "products")
        urls.push(url)
      }
      setImages((prev) => [...prev, ...urls])
    } catch (e) {
      console.error(e)
      setImgError(
        e instanceof Error
          ? e.message
          : "No se pudo subir la imagen. Verifica tu sesión de administrador.",
      )
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (url: string) => setImages((prev) => prev.filter((u) => u !== url))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.category || Number(form.price) <= 0) {
      setError("Completa al menos el nombre, la categoría y un precio válido.")
      return
    }
    if (
      Number(form.salePrice) > 0 &&
      Number(form.salePrice) >= Number(form.price)
    ) {
      setError("El precio de oferta debe ser menor que el precio de venta.")
      return
    }
    setError("")
    setSaving(true)

    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      category: form.category,
      code: form.code.trim(),
      partNumber: form.partNumber.trim(),
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : null,
      stock: Number(form.stock) || 0,
      minStock: Number(form.minStock) || 0,
      compatibility: form.compatibility
        .split("\n")
        .map((c) => c.trim())
        .filter(Boolean),
      description: form.description.trim(),
      warranty: form.warranty.trim(),
      status: form.status,
      // La primera imagen de la galería es la principal del producto.
      image: images[0] ?? "",
      images: images,
    }

    try {
      if (mode === "edit" && id) {
        await updateProduct(id, payload)
      } else {
        await createProduct(payload)
      }
      setSaved(true)
      setTimeout(() => navigate("/admin/products"), 900)
    } catch (err) {
      console.error(err)
      setError(
        "No se pudo guardar el producto. Verifica que iniciaste sesión como administrador.",
      )
    } finally {
      setSaving(false)
    }
  }

  const field = (k: keyof typeof form) => ({
    value: form[k],
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => setForm({ ...form, [k]: e.target.value }),
  })

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/admin/products")}
          className="text-sigo-muted hover:text-white transition-colors"
        >
          ← Volver
        </button>
        <h1 className="font-display font-black text-4xl text-white uppercase">
          {mode === "new" ? "Agregar producto" : "Editar producto"}
        </h1>
      </div>

      <form onSubmit={handleSave}>
        {error && (
          <div
            role="alert"
            className="mb-5 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg"
          >
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main info */}
          <div className="xl:col-span-2 space-y-5">
            <div className="bg-sigo-card border border-sigo-border rounded-xl p-5">
              <h3 className="font-display font-bold text-white text-lg uppercase mb-4">
                Información del producto
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="label-admin">Nombre del producto *</label>
                  <input
                    {...field("name")}
                    required
                    className="input-sigo"
                    placeholder="Pastillas de freno cerámicas"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-admin">Categoría *</label>
                    <select
                      {...field("category")}
                      required
                      className="input-sigo"
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label-admin">Marca *</label>
                    <input
                      {...field("brand")}
                      required
                      className="input-sigo"
                      placeholder="Bosch"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-admin">Código del producto *</label>
                    <input
                      {...field("code")}
                      required
                      className="input-sigo font-mono"
                      placeholder="SG-BP-0001"
                    />
                  </div>
                  <div>
                    <label className="label-admin">Número de parte</label>
                    <input
                      {...field("partNumber")}
                      className="input-sigo font-mono"
                      placeholder="NÚMERO-DE-PARTE-OEM"
                    />
                  </div>
                </div>
                <div>
                  <label className="label-admin">Descripción</label>
                  <textarea
                    {...field("description")}
                    rows={4}
                    className="input-sigo"
                    placeholder="Descripción detallada del producto..."
                  />
                </div>
                <div>
                  <label className="label-admin">
                    Compatibilidad con vehículos (uno por línea)
                  </label>
                  <textarea
                    {...field("compatibility")}
                    rows={3}
                    className="input-sigo font-mono text-sm"
                    placeholder="Toyota Hilux 2015-2023&#10;Ford Ranger 2018-2022"
                  />
                </div>
                <div>
                  <label className="label-admin">Información de garantía</label>
                  <input
                    {...field("warranty")}
                    className="input-sigo"
                    placeholder="12 meses / 30,000 km"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-sigo-card border border-sigo-border rounded-xl p-5">
              <h3 className="font-display font-bold text-white text-lg uppercase mb-4">
                Imágenes del producto
              </h3>
              <label
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  handleFiles(e.dataTransfer.files)
                }}
                className="block border-2 border-dashed border-sigo-border hover:border-sigo-orange rounded-xl p-10 text-center transition-colors cursor-pointer group"
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-3 text-sigo-muted">
                    <div className="w-8 h-8 border-4 border-sigo-border border-t-sigo-orange rounded-full animate-spin" />
                    <span className="text-sm">Subiendo imágenes...</span>
                  </div>
                ) : (
                  <>
                    <UploadIcon
                      size={32}
                      className="mx-auto text-sigo-muted group-hover:text-sigo-orange mb-3 transition-colors"
                    />
                    <p className="text-sigo-muted text-sm">
                      Arrastra imágenes aquí o{" "}
                      <span className="text-sigo-orange">selecciona archivos</span>
                    </p>
                    <p className="text-sigo-muted text-xs mt-1">
                      PNG o JPG, máximo 5 MB. La primera imagen será la principal.
                    </p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  className="sr-only"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </label>

              {imgError && <p className="text-red-400 text-xs mt-2">{imgError}</p>}

              {images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {images.map((img, i) => (
                    <div
                      key={img}
                      className="relative rounded-lg overflow-hidden border border-sigo-border"
                      style={{ width: 72, height: 72 }}
                    >
                      <img
                        src={img}
                        alt=""
                        onError={imgFallback}
                        className="w-full h-full object-cover"
                      />
                      {i === 0 && (
                        <span className="absolute bottom-0 inset-x-0 bg-sigo-orange text-white text-[9px] font-bold text-center py-0.5">
                          PRINCIPAL
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(img)}
                        title="Quitar imagen"
                        className="absolute top-0.5 right-0.5 bg-black/70 hover:bg-red-500 text-white rounded-full p-0.5"
                      >
                        <XIcon size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Side panels */}
          <div className="space-y-5">
            <div className="bg-sigo-card border border-sigo-border rounded-xl p-5">
              <h3 className="font-display font-bold text-white text-lg uppercase mb-4">
                Precios
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="label-admin">Precio de venta (Q) *</label>
                  <input
                    type="number"
                    step="0.01"
                    {...field("price")}
                    required
                    className="input-sigo"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="label-admin">Precio de oferta (Q)</label>
                  <input
                    type="number"
                    step="0.01"
                    {...field("salePrice")}
                    className="input-sigo"
                    placeholder="0.00 (opcional)"
                  />
                </div>
              </div>
            </div>

            <div className="bg-sigo-card border border-sigo-border rounded-xl p-5">
              <h3 className="font-display font-bold text-white text-lg uppercase mb-4">
                Inventario
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="label-admin">Existencias actuales *</label>
                  <input
                    type="number"
                    {...field("stock")}
                    required
                    className="input-sigo"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="label-admin">
                    Nivel mínimo de existencias
                  </label>
                  <input
                    type="number"
                    {...field("minStock")}
                    className="input-sigo"
                    placeholder="5"
                  />
                </div>
              </div>
            </div>

            <div className="bg-sigo-card border border-sigo-border rounded-xl p-5">
              <h3 className="font-display font-bold text-white text-lg uppercase mb-4">
                Estado
              </h3>
              <select {...field("status")} className="input-sigo">
                <option value="ACTIVE">Activo</option>
                <option value="NEW">Nuevo</option>
                <option value="POPULAR">Popular</option>
                <option value="SALE">En oferta</option>
                <option value="OUT_OF_STOCK">Agotado</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving || saved}
                className={`flex-1 font-display font-bold py-3 rounded-xl transition-colors disabled:opacity-70 ${
                  saved
                    ? "bg-green-600 text-white"
                    : "bg-sigo-orange hover:bg-sigo-orange-dark text-white"
                }`}
              >
                {saved ? "¡Guardado!" : saving ? "Guardando..." : "Guardar producto"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="flex-1 border border-sigo-border text-sigo-muted hover:text-white py-3 rounded-xl transition-colors font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
