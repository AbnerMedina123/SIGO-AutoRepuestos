import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendPasswordReset, updatePassword, authErrorMessage } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import { Turnstile, turnstileEnabled } from '../../components/ui/Turnstile';
import sigoLogo from '../../assets/sigo-logo.png';

const wrapper =
  'min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden';
const card = 'relative z-10 w-full max-w-md bg-sigo-card border border-sigo-border rounded-2xl p-8';

/** Paso 1: el usuario pide el correo de recuperación. */
export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }
    if (turnstileEnabled && !captcha) {
      setError('Completa la verificación de seguridad.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await sendPasswordReset(email, captcha || undefined);
      setSent(true);
    } catch (err) {
      console.error(err);
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={wrapper}>
      <div className="absolute inset-0 stripe-accent opacity-20" />
      <div className={card}>
        <div className="text-center mb-6">
          <img src={sigoLogo} alt="SIGO Autorepuestos" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="font-display font-black text-3xl text-white uppercase">Recuperar contraseña</h1>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="text-5xl mb-3">📧</div>
            <p className="text-sigo-light">
              Si existe una cuenta con <span className="text-sigo-orange">{email}</span>, te enviamos
              un correo con el enlace para restablecer tu contraseña.
            </p>
            <p className="text-sigo-muted text-sm mt-3">Revisa tu bandeja de entrada y el spam.</p>
            <Link to="/login" className="inline-block mt-6 text-sigo-orange font-semibold hover:underline">
              ← Volver a iniciar sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <p className="text-sigo-muted text-sm">
              Escribe tu correo y te enviaremos un enlace para crear una nueva contraseña.
            </p>
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
                autoComplete="email"
              />
            </div>
            <Turnstile onToken={setCaptcha} onExpire={() => setCaptcha('')} />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sigo-orange hover:bg-sigo-orange-dark text-white font-display font-bold text-lg py-3.5 rounded-xl transition-colors uppercase disabled:opacity-60"
            >
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
            <p className="text-center text-sm">
              <Link to="/login" className="text-sigo-muted hover:text-white">← Volver a iniciar sesión</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

/** Paso 2: el usuario llega desde el correo y define su nueva contraseña. */
export function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  // Supabase coloca una sesión de recuperación al abrir el enlace del correo.
  // Esperamos a que exista antes de permitir cambiar la contraseña.
  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (active) setReady(Boolean(data.session));
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active && session) setReady(true);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await updatePassword(password);
      setDone(true);
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err) {
      console.error(err);
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={wrapper}>
      <div className="absolute inset-0 stripe-accent opacity-20" />
      <div className={card}>
        <div className="text-center mb-6">
          <img src={sigoLogo} alt="SIGO Autorepuestos" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="font-display font-black text-3xl text-white uppercase">Nueva contraseña</h1>
        </div>

        {done ? (
          <div className="text-center">
            <div className="text-5xl mb-3">✅</div>
            <p className="text-sigo-light">Tu contraseña se actualizó correctamente.</p>
            <p className="text-sigo-muted text-sm mt-2">Te estamos redirigiendo para iniciar sesión...</p>
          </div>
        ) : !ready ? (
          <div className="text-center text-sigo-muted">
            <p>Validando el enlace de recuperación...</p>
            <p className="text-sm mt-3">
              Si llegaste aquí sin usar el enlace del correo,{' '}
              <Link to="/login" className="text-sigo-orange hover:underline">vuelve a iniciar sesión</Link>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2.5 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sigo-muted text-xs font-semibold uppercase mb-1.5">
                Nueva contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-sigo"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="block text-sigo-muted text-xs font-semibold uppercase mb-1.5">
                Confirmar contraseña
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="input-sigo"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sigo-orange hover:bg-sigo-orange-dark text-white font-display font-bold text-lg py-3.5 rounded-xl transition-colors uppercase disabled:opacity-60"
            >
              {loading ? 'Guardando...' : 'Guardar contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
