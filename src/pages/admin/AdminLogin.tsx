import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useStore } from "../../store/useStore"
import sigoLogo from "../../assets/sigo-logo.png"
import { ShieldIcon } from "../../components/ui/Icons"
import { signInWithPassword, isCurrentUserAdmin, signOut } from "../../lib/auth"
import { useData } from "../../store/DataProvider"

export function AdminLogin() {
  const { login } = useStore()
  const { reloadAdminData } = useData()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await signInWithPassword(email.trim(), password)
      const admin = await isCurrentUserAdmin()
      if (!admin) {
        await signOut()
        setError("Esta cuenta no tiene permisos de administrador.")
        return
      }
      login(email.trim(), true)
      await reloadAdminData()
      navigate("/admin")
    } catch (err) {
      console.error(err)
      setError("Las credenciales de administrador no son válidas.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-sigo-black flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 stripe-accent opacity-30" />
      <div className="absolute top-0 left-0 w-1 h-full bg-sigo-orange" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <img src={sigoLogo} alt="SIGO" className="h-20 w-auto mx-auto mb-4" />
          <div className="inline-flex items-center gap-2 bg-sigo-orange/10 border border-sigo-orange/30 rounded-lg px-4 py-1.5 mb-3">
            <ShieldIcon size={14} className="text-sigo-orange" />
            <span className="text-sigo-orange font-display font-bold text-sm tracking-wider">
              ACCESO ADMINISTRATIVO
            </span>
          </div>
          <h1 className="font-display font-black text-4xl text-white uppercase">
            Panel administrativo
          </h1>
          <p className="text-sigo-muted mt-1 text-sm">
            Acceso restringido únicamente a personal autorizado
          </p>
        </div>

        <div className="bg-sigo-card border border-sigo-border rounded-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2.5 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sigo-muted text-xs font-semibold uppercase mb-1.5">
                Correo del administrador
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-sigo"
                placeholder="admin@sigoautorepuestos.com"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-sigo-muted text-xs font-semibold uppercase mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-sigo"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sigo-orange hover:bg-sigo-orange-dark text-white font-display font-bold text-lg py-3.5 rounded-xl transition-colors uppercase disabled:opacity-60"
            >
              {loading ? "Ingresando..." : "Ingresar al panel"}
            </button>
          </form>

          <p className="text-center text-sigo-muted text-xs mt-6">
            Acceso exclusivo para administradores autorizados.
          </p>
        </div>
      </div>
    </div>
  )
}
