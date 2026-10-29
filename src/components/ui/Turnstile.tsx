import { useEffect, useRef } from 'react';

// Clave pública del sitio de Cloudflare Turnstile (segura para el navegador).
// Si no está configurada, el widget no se muestra y el CAPTCHA se omite.
export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
export const turnstileEnabled = Boolean(TURNSTILE_SITE_KEY);

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

const SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit';

function ensureScript(onReady: () => void) {
  if (window.turnstile) {
    onReady();
    return;
  }
  const prev = window.onTurnstileLoad;
  window.onTurnstileLoad = () => {
    prev?.();
    onReady();
  };
  if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;
  const s = document.createElement('script');
  s.src = SCRIPT_SRC;
  s.async = true;
  s.defer = true;
  document.head.appendChild(s);
}

/**
 * Widget de Cloudflare Turnstile (CAPTCHA).
 * Se renderiza UNA sola vez y mantiene estable el widget. Llama a `onToken`
 * cuando el usuario pasa la verificación y a `onExpire` cuando caduca.
 *
 * Nota: usamos refs para los callbacks (no como dependencias del efecto) para
 * evitar que el widget se vuelva a montar en cada render — eso causaba el
 * parpadeo "aparece y desaparece".
 */
export function Turnstile({
  onToken,
  onExpire,
}: {
  onToken: (token: string) => void;
  onExpire?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const rendered = useRef(false);

  // Mantiene los callbacks actuales sin re-ejecutar el efecto de montaje.
  const onTokenRef = useRef(onToken);
  const onExpireRef = useRef(onExpire);
  onTokenRef.current = onToken;
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !ref.current) return;
    const container = ref.current;

    ensureScript(() => {
      // Evita el doble render (React StrictMode monta efectos dos veces).
      if (rendered.current || !window.turnstile || !container) return;
      rendered.current = true;
      widgetId.current = window.turnstile.render(container, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: 'dark',
        retry: 'auto',
        'refresh-expired': 'auto',
        callback: (token: string) => onTokenRef.current(token),
        'expired-callback': () => onExpireRef.current?.(),
        'error-callback': () => onExpireRef.current?.(),
      });
    });

    return () => {
      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current);
        } catch {
          // ignora
        }
      }
      widgetId.current = null;
      rendered.current = false;
    };
    // Sin dependencias: se monta y desmonta una sola vez con el componente.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!TURNSTILE_SITE_KEY) return null;
  return <div ref={ref} className="my-2" />;
}
