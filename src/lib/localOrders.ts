import type { Order } from '../data/mockData';

// ============================================================================
// Pedidos del cliente guardados en el navegador (localStorage).
//
// Los pedidos SÍ se guardan en Supabase (para el administrador), pero las
// políticas RLS solo permiten al admin leerlos. Como el login de cliente es
// simulado (no hay sesión real por cliente), guardamos una copia del pedido en
// el navegador del cliente para que pueda ver su historial en "Mis pedidos".
// Cada cliente ve solo lo suyo, en su propio dispositivo.
// ============================================================================

const key = (email?: string) => `sigo-orders:${email ?? 'guest'}`;

export function loadLocalOrders(email?: string): Order[] {
  try {
    const raw = localStorage.getItem(key(email));
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

/** Agrega un pedido al historial local del cliente (el más reciente primero). */
export function addLocalOrder(email: string | undefined, order: Order) {
  try {
    const list = loadLocalOrders(email);
    localStorage.setItem(key(email), JSON.stringify([order, ...list]));
  } catch {
    // Ignora si el almacenamiento no está disponible.
  }
}
