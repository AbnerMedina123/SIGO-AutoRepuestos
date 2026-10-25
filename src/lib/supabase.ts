import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

if (!supabaseUrl || !supabaseKey) {
  // Falla temprano y con un mensaje claro si faltan las variables de entorno,
  // en vez de errores confusos más adelante al hacer una consulta.
  throw new Error(
    'Faltan las variables de entorno de Supabase. Define VITE_SUPABASE_URL y ' +
      'VITE_SUPABASE_PUBLISHABLE_KEY en tu archivo .env (local) y en Netlify.',
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
