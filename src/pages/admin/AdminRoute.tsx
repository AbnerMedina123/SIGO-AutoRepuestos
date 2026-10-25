import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getSession, isCurrentUserAdmin } from '../../lib/auth';
import { Loading } from '../../components/ui/DataState';

/**
 * Protege las rutas /admin/*. Comprueba contra Supabase que haya una sesión
 * activa y que el usuario sea administrador. Si no, redirige a /admin/login.
 */
export function AdminRoute({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<'checking' | 'ok' | 'denied'>('checking');

  useEffect(() => {
    let active = true;
    (async () => {
      const session = await getSession();
      if (!session) {
        if (active) setState('denied');
        return;
      }
      const admin = await isCurrentUserAdmin();
      if (active) setState(admin ? 'ok' : 'denied');
    })();
    return () => {
      active = false;
    };
  }, []);

  if (state === 'checking') {
    return (
      <div className="min-h-screen bg-sigo-black flex items-center justify-center">
        <Loading label="Verificando acceso..." />
      </div>
    );
  }
  if (state === 'denied') return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
