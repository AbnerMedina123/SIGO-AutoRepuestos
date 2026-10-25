import { useState } from "react"
import sigoLogo from "../../assets/sigo-logo.png"

export function AdminSettings() {
  const [saved, setSaved] = useState(false)
  const [shippingCoordination, setShippingCoordination] = useState(true)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <h1 className="font-display font-black text-4xl text-white uppercase mb-6">
        Configuración
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Store info */}
        <div className="bg-sigo-card border border-sigo-border rounded-xl p-6">
          <h3 className="font-display font-bold text-white text-lg uppercase mb-4">
            Información del negocio
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="label-admin">Nombre del negocio</label>
              <input defaultValue="SIGO Autorepuestos" className="input-sigo" />
            </div>
            <div>
              <label className="label-admin">Eslogan</label>
              <input defaultValue="Liviano y Pesado" className="input-sigo" />
            </div>
            <div>
              <label className="label-admin">Número de WhatsApp</label>
              <input
                defaultValue="+502 4575 2892"
                className="input-sigo font-mono"
                placeholder="+502 4575 2892"
              />
              <p className="text-sigo-muted text-xs mt-1">
                Número oficial utilizado en todos los accesos de WhatsApp.
              </p>
            </div>
            <div>
              <label className="label-admin">Correo de contacto</label>
              <input
                type="email"
                defaultValue="info@sigoautorepuestos.com"
                className="input-sigo"
              />
            </div>
            <div>
              <label className="label-admin">Dirección</label>
              <textarea
                defaultValue="Guatemala, Guatemala"
                rows={2}
                className="input-sigo"
              />
            </div>
            <button
              type="submit"
              className={`font-display font-bold px-6 py-2.5 rounded-lg transition-colors ${
                saved
                  ? "bg-green-600 text-white"
                  : "bg-sigo-orange hover:bg-sigo-orange-dark text-white"
              }`}
            >
              {saved ? "Guardado" : "Guardar cambios"}
            </button>
          </form>
        </div>

        {/* Store hours */}
        <div className="bg-sigo-card border border-sigo-border rounded-xl p-6">
          <h3 className="font-display font-bold text-white text-lg uppercase mb-4">
            Horario de atención
          </h3>
          <div className="space-y-3">
            {[
              { day: "Lunes a viernes", hours: "8:00 a 18:00", open: true },
              { day: "Sábado", hours: "8:00 a 13:00", open: true },
              { day: "Domingo", hours: "Cerrado", open: false },
            ].map((h) => (
              <div
                key={h.day}
                className="flex items-center justify-between py-2 border-b border-sigo-border last:border-0"
              >
                <span className="text-sigo-light text-sm">{h.day}</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm ${
                      h.open ? "text-white" : "text-sigo-muted"
                    }`}
                  >
                    {h.hours}
                  </span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      h.open ? "bg-green-400" : "bg-red-400"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-sigo-card border border-sigo-border rounded-xl p-6">
          <h3 className="font-display font-bold text-white text-lg uppercase mb-4">
            Configuración de envíos
          </h3>
          <div className="space-y-4">
            <div>
              <label className="label-admin">
                Tarifa estándar de envío (Q)
              </label>
              <input type="number" defaultValue="15" className="input-sigo" />
            </div>
            <div>
              <label className="label-admin">Monto para envío gratis (Q)</label>
              <input type="number" defaultValue="200" className="input-sigo" />
            </div>
            <div className="flex items-center justify-between p-3 bg-sigo-surface rounded-lg">
              <div>
                <p className="text-white text-sm font-medium">
                  Coordinación por WhatsApp
                </p>
                <p className="text-sigo-muted text-xs">
                  Confirmar entrega y forma de pago por WhatsApp
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={shippingCoordination}
                aria-label="Activar coordinación por WhatsApp"
                onClick={() => setShippingCoordination((value) => !value)}
                className={`w-10 h-5 rounded-full relative ${
                  shippingCoordination ? "bg-sigo-orange" : "bg-sigo-border"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    shippingCoordination ? "left-5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="bg-sigo-card border border-sigo-border rounded-xl p-6">
          <h3 className="font-display font-bold text-white text-lg uppercase mb-4">
            Identidad visual
          </h3>
          <div className="flex items-center gap-4 mb-4">
            <img src={sigoLogo} alt="Logo actual" className="h-16 w-auto" />
            <div>
              <p className="text-white text-sm font-medium">Logo actual</p>
              <p className="text-sigo-muted text-xs">sigo-logo.png</p>
            </div>
          </div>
          <label className="block border-2 border-dashed border-sigo-border hover:border-sigo-orange rounded-xl p-6 text-center cursor-pointer transition-colors">
            <p className="text-sigo-muted text-sm">
              Haz clic para cargar un nuevo logo
            </p>
            <p className="text-sigo-muted text-xs mt-1">
              Se recomienda PNG o SVG · Máximo 2 MB
            </p>
            <input
              type="file"
              accept=".png,.svg,image/png,image/svg+xml"
              className="sr-only"
              onChange={() => {
                setSaved(true)
                setTimeout(() => setSaved(false), 2000)
              }}
            />
          </label>
          <div className="mt-4">
            <label className="label-admin">Color principal de la marca</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                defaultValue="#FF6200"
                className="h-10 w-16 rounded cursor-pointer bg-sigo-surface border border-sigo-border"
              />
              <input
                defaultValue="#FF6200"
                className="input-sigo flex-1 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="bg-sigo-card border border-sigo-border rounded-xl p-6">
          <h3 className="font-display font-bold text-white text-lg uppercase mb-4">
            Inventario e idioma
          </h3>
          <div className="space-y-4">
            <div>
              <label className="label-admin">
                Alerta predeterminada de existencias bajas
              </label>
              <input
                type="number"
                defaultValue="5"
                min="0"
                className="input-sigo"
              />
              <p className="text-sigo-muted text-xs mt-1">
                Este valor se puede personalizar por producto.
              </p>
            </div>
            <div>
              <label className="label-admin">Idioma de la interfaz</label>
              <select defaultValue="es-419" className="input-sigo">
                <option value="es-419">Español (Latinoamérica)</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => {
                setSaved(true)
                setTimeout(() => setSaved(false), 2000)
              }}
              className="bg-sigo-orange hover:bg-sigo-orange-dark text-white font-bold px-5 py-2.5 rounded-lg"
            >
              {saved ? "Preferencias guardadas" : "Guardar preferencias"}
            </button>
          </div>
        </div>

        <div className="bg-sigo-card border border-sigo-border rounded-xl p-6">
          <h3 className="font-display font-bold text-white text-lg uppercase mb-4">
            Perfil y seguridad
          </h3>
          <div className="space-y-4">
            <div>
              <label className="label-admin">Nombre del administrador</label>
              <input defaultValue="Administrador SIGO" className="input-sigo" />
            </div>
            <div>
              <label className="label-admin">Correo del administrador</label>
              <input
                type="email"
                defaultValue="admin@sigo.com"
                className="input-sigo"
              />
            </div>
            <div>
              <label className="label-admin">Nueva contraseña</label>
              <input
                type="password"
                className="input-sigo"
                placeholder="Dejar en blanco para no cambiar"
                autoComplete="new-password"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setSaved(true)
                setTimeout(() => setSaved(false), 2000)
              }}
              className="bg-sigo-orange hover:bg-sigo-orange-dark text-white font-bold px-5 py-2.5 rounded-lg"
            >
              {saved ? "Perfil guardado" : "Guardar perfil"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
