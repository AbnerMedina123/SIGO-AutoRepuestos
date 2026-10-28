import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { isCurrentUserAdmin } from '../../lib/auth';
import { registerCustomer } from '../../lib/api';
import { useStore } from '../../store/useStore';
import { Loading, ErrorState } from '../../components/ui/DataState';

/**
 * Página de retorno del login con Google (OAuth).
 * Cuando Google redirige de vuelta, Supabase establece la sesión; aquí la
 * leemos, sincronizamos el estado de la app y enviamos al usuario a su panel.
 */
export function AuthCallback() {
  const navigate = useNavigate();
  const { login } = useStore();
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error: sessErr } = await supabase.auth.getSession();
        if (sessErr) throw sessErr;

        const session = data.session;
        if (!session?.user) {
          // Sin sesión: probablemente el usuario canceló el inicio en Google.
          if (active) navigate('/login', { replace: true });
          return;
        }

        const user = session.user;
        const email = user.email ?? '';
        const fullName =
          (user.user_metadata?.full_name as string) ||
          (user.user_metadata?.name as string) ||
          email.split('@')[0];

        const admin = await isCurrentUserAdmin();
        if (admin) {
          login(email, true);
          if (active) navigate('/admin', { replace: true });
          return;
        }

        // Cliente: registra/asegura su ficha en la tabla y entra al dashboard.
        await registerCustomer({ fullName, email, phone: '' }).catch(() => {});
        login(email);
        if (active) navigate('/dashboard', { replace: true });
      } catch (e) {
        console.error(e);
        if (active) setError('No se pudo completar el inicio de sesión con Google.');
      }
    })();
    return () => {
      active = false;
    };
  }, [login, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-sigo-black flex items-center justify-center">
        <ErrorState message={error} onRetry={() => navigate('/login', { replace: true })} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sigo-black flex items-center justify-center">
      <Loading label="Completando inicio de sesión..." />
    </div>
  );
}
