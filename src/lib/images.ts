import placeholderPart from '../assets/placeholder-part.svg';

/**
 * Imagen local que se usa cuando una imagen remota falla al cargar.
 * Es un SVG empaquetado por Vite, así que nunca depende de internet.
 */
export const PLACEHOLDER_IMAGE = placeholderPart;

/**
 * Handler `onError` para elementos <img>.
 *
 * Si la imagen remota no carga (URL rota, sin conexión, etc.) la reemplaza
 * por el placeholder local de la marca. Marca el nodo con un flag en
 * `dataset` para evitar un bucle infinito de errores si el propio
 * placeholder fallara por algún motivo.
 *
 * Uso:
 *   <img src={product.image} onError={imgFallback} ... />
 */
export function imgFallback(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const img = e.currentTarget;
  if (img.dataset.fallbackApplied === 'true') return;
  img.dataset.fallbackApplied = 'true';
  img.src = PLACEHOLDER_IMAGE;
}
