// ============================================================================
// Favoritos del cliente (guardados en el navegador, localStorage).
//
// Guarda los IDs de los productos marcados como favoritos. Coherente con el
// resto del modelo (direcciones, perfil, pedidos del cliente) que persiste en
// el dispositivo. Expone un sistema de suscripción para que todos los
// componentes (tarjetas, panel) se actualicen al instante cuando cambia.
// ============================================================================

const KEY = 'sigo-favorites';

type Listener = (ids: string[]) => void;
const listeners = new Set<Listener>();

export function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function save(ids: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // ignora si el almacenamiento no está disponible
  }
  listeners.forEach((l) => l(ids));
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}

/** Marca o desmarca un producto como favorito. Devuelve el nuevo estado. */
export function toggleFavorite(id: string): boolean {
  const ids = getFavorites();
  const exists = ids.includes(id);
  const next = exists ? ids.filter((x) => x !== id) : [...ids, id];
  save(next);
  return !exists;
}

export function removeFavorite(id: string) {
  save(getFavorites().filter((x) => x !== id));
}

/** Suscribe a cambios en la lista de favoritos. Devuelve la función para cancelar. */
export function subscribeFavorites(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
