import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useStore } from "../../store/useStore"
import {
  signInWithPassword,
  signUpWithPassword,
  signInWithGoogle,
  isCurrentUserAdmin,
  signOut,
  authErrorMessage,
} from "../../lib/auth"
import { registerCustomer } from "../../lib/api"
import { Turnstile, turnstileEnabled } from "../../components/ui/Turnstile"
import sigoLogo from "../../assets/sigo-logo.png"

export function Login() {
  const { login } = useStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [captcha, setCaptcha] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Completa todos los campos.")
      return
    }
    if (turnstileEnabled && !captcha) {
      setError("Completa la verificación de seguridad.")
      return
    }
    setError("")
    setLoading(true)
    try {
      // Autentica contra Supabase: verifica de verdad la contraseña.
      await signInWithPassword(email.trim(), password, captcha || undefined)
      const admin = await isCurrentUserAdmin()
      if (admin) {
        login(email.trim(), true)
        navigate("/admin")
      } else {
        login(email.trim())
        navigate("/dashboard")
      }
    } catch (err) {
      // Credenciales incorrectas o cuenta inexistente: NO se concede acceso.
      await signOut().catch(() => {})
      setError(authErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1400&h=900&fit=crop&auto=format')`,
        }}
      />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src={sigoLogo}
            alt="SIGO Autorepuestos"
            className="h-20 w-auto mx-auto mb-4"
          />
          <h1 className="font-display font-black text-4xl text-white uppercase">
            Bienvenido de nuevo
          </h1>
          <p className="text-sigo-muted mt-1">
            Inicia sesión en tu cuenta SIGO
          </p>
        </div>

        <div className="bg-sigo-card border border-sigo-border rounded-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2.5 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sigo-muted text-xs font-semibold uppercase mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-sigo"
                placeholder="tu@correo.com"
              />
            </div>
            <div>
              <label className="block text-sigo-muted text-xs font-semibold uppercase mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-sigo pr-20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-sigo-orange"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sigo-orange text-sm hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Turnstile onToken={setCaptcha} onExpire={() => setCaptcha("")} />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sigo-orange hover:bg-sigo-orange-dark text-white font-display font-bold text-lg py-3.5 rounded-xl transition-colors uppercase disabled:opacity-60"
            >
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>

            <div className="relative flex items-center gap-3">
              <div className="flex-1 border-t border-sigo-border" />
              <span className="text-sigo-muted text-xs">O</span>
              <div className="flex-1 border-t border-sigo-border" />
            </div>

            <button
              type="button"
              onClick={() => {
                signInWithGoogle().catch((err) => {
                  console.error(err)
                  setError(authErrorMessage(err))
                })
              }}
              className="w-full flex items-center justify-center gap-3 border border-sigo-border hover:border-sigo-muted text-sigo-light hover:text-white py-3 rounded-xl transition-colors font-medium"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continuar con Google
            </button>
          </form>

          <p className="text-center text-sigo-muted text-sm mt-6">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/register"
              className="text-sigo-orange font-semibold hover:underline"
            >
              Crear una cuenta
            </Link>
          </p>

          <div className="mt-4 text-center">
            <p className="text-sigo-muted text-xs">
              ¿Eres administrador? Inicia sesión con tu cuenta y te llevaremos al
              panel automáticamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Register() {
  const { login } = useStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    terms: false,
  })
  const [error, setError] = useState("")
  const [showPasswords, setShowPasswords] = useState(false)
  const [legalInfo, setLegalInfo] = useState("")

  const [registering, setRegistering] = useState(false)
  const [captcha, setCaptcha] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const email = form.email.trim()

    // Validaciones previas al registro.
    if (!form.firstName.trim() || !email) {
      setError("Completa todos los campos obligatorios.")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Ingresa un correo electrónico válido.")
      return
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.")
      return
    }
    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden.")
      return
    }
    if (!form.terms) {
      setError("Acepta los términos y condiciones.")
      return
    }
    if (turnstileEnabled && !captcha) {
      setError("Completa la verificación de seguridad.")
      return
    }

    setError("")
    setRegistering(true)
    try {
      // Crea la cuenta real en Supabase Auth (valida el correo y cifra la
      // contraseña). Guarda nombre y teléfono como metadatos del usuario.
      await signUpWithPassword(
        email,
        form.password,
        {
          full_name: `${form.firstName} ${form.lastName}`.trim(),
          phone: form.phone.trim(),
        },
        captcha || undefined,
      )

      // Registra también al cliente en la tabla para que aparezca en el panel.
      await registerCustomer({
        fullName: `${form.firstName} ${form.lastName}`.trim(),
        email,
        phone: form.phone,
      }).catch(() => {})

      login(email)
      navigate("/dashboard")
    } catch (err) {
      console.error(err)
      setError(authErrorMessage(err))
    } finally {
      setRegistering(false)
    }
  }

  const field = (k: keyof typeof form) => ({
    value: form[k] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [k]: e.target.value }),
  })

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1400&h=900&fit=crop&auto=format')`,
        }}
      />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src={sigoLogo}
            alt="SIGO Autorepuestos"
            className="h-20 w-auto mx-auto mb-4"
          />
          <h1 className="font-display font-black text-4xl text-white uppercase">
            Crear cuenta
          </h1>
          <p className="text-sigo-muted mt-1">Únete hoy a SIGO Autorepuestos</p>
        </div>

        <div className="bg-sigo-card border border-sigo-border rounded-2xl p-8">
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2.5 rounded-lg">
                {error}
              </div>
            )}
            {legalInfo && (
              <div
                role="status"
                className="bg-sigo-surface border border-sigo-border text-sigo-light text-sm px-4 py-2.5 rounded-lg"
              >
                {legalInfo}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sigo-muted text-xs font-semibold uppercase mb-1">
                  Nombre *
                </label>
                <input
                  {...field("firstName")}
                  className="input-sigo"
                  placeholder="Carlos"
                />
              </div>
              <div>
                <label className="block text-sigo-muted text-xs font-semibold uppercase mb-1">
                  Apellido *
                </label>
                <input
                  {...field("lastName")}
                  className="input-sigo"
                  placeholder="Mendoza"
                />
              </div>
            </div>
            <div>
              <label className="block text-sigo-muted text-xs font-semibold uppercase mb-1">
                Correo electrónico *
              </label>
              <input
                type="email"
                {...field("email")}
                className="input-sigo"
                placeholder="tu@correo.com"
              />
            </div>
            <div>
              <label className="block text-sigo-muted text-xs font-semibold uppercase mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                {...field("phone")}
                className="input-sigo"
                placeholder="+502 4575 2892"
              />
            </div>
            <div>
              <label className="block text-sigo-muted text-xs font-semibold uppercase mb-1">
                Contraseña *
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                {...field("password")}
                className="input-sigo"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sigo-muted text-xs font-semibold uppercase mb-1">
                Confirmar contraseña *
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                {...field("confirm")}
                className="input-sigo"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPasswords((value) => !value)}
                className="text-sigo-orange text-xs mt-2"
              >
                {showPasswords ? "Ocultar contraseñas" : "Mostrar contraseñas"}
              </button>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.terms}
                onChange={(e) => setForm({ ...form, terms: e.target.checked })}
                className="mt-0.5 accent-sigo-orange"
              />
              <span className="text-sigo-muted text-sm">
                Acepto los{" "}
                <button
                  type="button"
                  onClick={() =>
                    setLegalInfo(
                      "Términos de demostración: el registro no crea una cuenta real ni almacena datos.",
                    )
                  }
                  className="text-sigo-orange hover:underline"
                >
                  términos y condiciones
                </button>{" "}
                y la{" "}
                <button
                  type="button"
                  onClick={() =>
                    setLegalInfo(
                      "Privacidad: este prototipo no envía ni conserva información personal.",
                    )
                  }
                  className="text-sigo-orange hover:underline"
                >
                  política de privacidad
                </button>
              </span>
            </label>

            <Turnstile onToken={setCaptcha} onExpire={() => setCaptcha("")} />

            <button
              type="submit"
              disabled={registering}
              className="w-full bg-sigo-orange hover:bg-sigo-orange-dark text-white font-display font-bold text-lg py-3.5 rounded-xl transition-colors uppercase disabled:opacity-60"
            >
              {registering ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <p className="text-center text-sigo-muted text-sm mt-6">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="text-sigo-orange font-semibold hover:underline"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
