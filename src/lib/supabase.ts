import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

/**
 * Indica si las variables de entorno de Supabase están configuradas.
 * La app lo usa para mostrar un mensaje claro en pantalla en lugar de
 * quedarse en blanco cuando faltan (p. ej. si no se configuraron en Netlify).
 */
export const supabaseConfigured = Boolean(supabaseUrl && supabaseKey);

if (!supabaseConfigured) {
  // No lanzamos una excepción al cargar el módulo (eso dejaría la página en
  // blanco). Avisamos en consola; la UI mostrará un aviso amigable.
  console.error(
    'Faltan las variables de entorno de Supabase (VITE_SUPABASE_URL y ' +
      'VITE_SUPABASE_PUBLISHABLE_KEY). Configúralas en tu .env local y en Netlify.',
  );
}

// Usamos valores de marcador si faltan para que `createClient` no reviente al
// importar el módulo; igualmente la UI bloqueará el uso con un aviso.
export const supabase = createClient<Database>(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseKey ?? 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);
