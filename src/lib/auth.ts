import { supabase } from './supabase';

export interface AdminSession {
  userId: string;
  email: string;
}

/** Inicia sesión con correo y contraseña. Lanza error si las credenciales fallan. */
export async function signInWithPassword(email: string, password: string, captchaToken?: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: captchaToken ? { captchaToken } : undefined,
  });
  if (error) throw error;
  return data;
}

/**
 * Registra una cuenta nueva de cliente en Supabase Auth.
 * Supabase valida el formato del correo y guarda la contraseña cifrada.
 * `metadata` se guarda en el perfil del usuario (nombre, teléfono).
 */
export async function signUpWithPassword(
  email: string,
  password: string,
  metadata?: Record<string, string>,
  captchaToken?: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata, captchaToken },
  });
  if (error) throw error;
  return data;
}

/** Traduce los errores de Supabase Auth a mensajes claros en español. */
export function authErrorMessage(error: unknown): string {
  const msg = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  if (msg.includes('invalid login credentials')) return 'Correo o contraseña incorrectos.';
  if (msg.includes('email not confirmed')) return 'Debes confirmar tu correo antes de iniciar sesión.';
  if (msg.includes('user already registered') || msg.includes('already registered'))
    return 'Ya existe una cuenta con ese correo. Inicia sesión.';
  if (msg.includes('password should be at least') || msg.includes('password'))
    return 'La contraseña debe tener al menos 6 caracteres.';
  if (msg.includes('unable to validate email') || msg.includes('invalid email') || msg.includes('email'))
    return 'Ingresa un correo electrónico válido.';
  if (msg.includes('rate limit')) return 'Demasiados intentos. Espera un momento e inténtalo de nuevo.';
  return 'Ocurrió un error. Verifica tus datos e inténtalo de nuevo.';
}

export async function signOut() {
  await supabase.auth.signOut();
}

/**
 * Inicia sesión con Google (OAuth). Redirige al usuario a Google y, al volver,
 * regresa a `/dashboard` ya autenticado. Requiere que el proveedor Google esté
 * configurado en Supabase (Authentication -> Providers -> Google).
 */
export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
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
