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
  window.onTurnstileLoad = onReady;
  if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;
  const s = document.createElement('script');
  s.src = SCRIPT_SRC;
  s.async = true;
  s.defer = true;
  document.head.appendChild(s);
}

/**
 * Widget de Cloudflare Turnstile (CAPTCHA invisible/ligero).
 * Llama a `onToken` con el token cuando el usuario pasa la verificación, y a
 * `onExpire` cuando el token caduca. Si no hay site key, no renderiza nada.
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

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !ref.current) return;
    const container = ref.current;
    let cancelled = false;

    ensureScript(() => {
      if (cancelled || !window.turnstile || !container) return;
      widgetId.current = window.turnstile.render(container, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: 'dark',
        callback: (token: string) => onToken(token),
        'expired-callback': () => onExpire?.(),
        'error-callback': () => onExpire?.(),
      });
    });

    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current);
        } catch {
          // ignora
        }
      }
    };
  }, [onToken, onExpire]);

  if (!TURNSTILE_SITE_KEY) return null;
  return <div ref={ref} className="my-2" />;
}
