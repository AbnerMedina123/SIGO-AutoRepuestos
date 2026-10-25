import { supabase } from './supabase';

export interface AdminSession {
  userId: string;
  email: string;
}

/** Inicia sesión con correo y contraseña. Lanza error si las credenciales fallan. */
export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}

/** Devuelve la sesión actual (o null si no hay). */
export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/**
 * Comprueba si el usuario autenticado actual es administrador, usando la
 * función `is_admin()` definida en la base de datos (respaldada por RLS).
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_admin');
  if (error) return false;
  return data === true;
}
