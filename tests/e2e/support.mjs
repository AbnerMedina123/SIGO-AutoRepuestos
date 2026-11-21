// Utilidades compartidas de las pruebas de interfaz.
// Todo el acceso a datos va contra el Supabase LOCAL (ver playwright.config.mjs).

import { test as base, expect } from '@playwright/test';

export const SUPABASE_URL = (process.env.SUPABASE_URL ?? '').replace(/\/$/, '');
const SECRET = process.env.SUPABASE_SECRET_KEY ?? '';

/** Sufijo único de esta ejecución (lo fija playwright.config.mjs). */
export const RUN = process.env.E2E_RUN ?? 'sin-run';
export const PASSWORD = `Prueba-E2E-${RUN}!`;
export const emailOf = (label) => `sit-e2e-${RUN}-${label}@example.test`;

export const CATEGORY = { id: `sit-e2e-${RUN}-cat`, name: `Categoría SITE2E${RUN}` };

export const PRODUCT = {
  id: `sit-e2e-${RUN}-p1`,
  name: `Bomba de agua SITE2E${RUN}`,
  brand: 'MarcaSIT',
  code: `SITE2E-${RUN}`.toUpperCase(),
  price: 250,
};

export const SEEDED_ORDER = {
  id: `sit-e2e-${RUN}-ord`,
  customer: `Cliente Sembrado SITE2E${RUN}`,
};

export const USERS = {
  admin: emailOf('admin'),
  cliente: emailOf('cliente'),
  noAdmin: emailOf('noadmin'),
  nuevo: emailOf('nuevo'),
  comprador: emailOf('comprador'),
};

/** Petición con la clave secreta LOCAL (solo para sembrar, verificar y limpiar). */
export async function sb(method, path, { body, headers = {} } = {}) {
  const h = { apikey: SECRET, ...headers };
  let payload;
  if (body !== undefined) {
    h['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  const res = await fetch(`${SUPABASE_URL}${path}`, { method, headers: h, body: payload });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    /* respuesta sin cuerpo JSON */
  }
  return { status: res.status, ok: res.ok, json, text };
}

/**
 * `test` con red de seguridad:
 *  - bloquea cualquier petición a *.supabase.co (producción) y hace FALLAR la prueba;
 *  - intercepta WhatsApp (no se envía nada) y guarda las URLs en `context.whatsappHits`;
 *  - descarta imágenes y fuentes externas (Unsplash, Google Fonts).
 */
export const test = base.extend({
  context: async ({ context }, use) => {
    const produccion = [];
    context.whatsappHits = [];

    await context.route(/^https?:\/\/[^/]*supabase\.co(\/|$)/, (route) => {
      produccion.push(route.request().url());
      return route.abort();
    });
    await context.route(/^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\//, (route) => {
      context.whatsappHits.push(route.request().url());
      return route.fulfill({ status: 200, contentType: 'text/html', body: '<h1>WhatsApp (bloqueado en pruebas)</h1>' });
    });
    await context.route(/^https?:\/\/(images\.unsplash\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)\//, (route) =>
      route.abort(),
    );

    await use(context);

    expect(produccion, 'La aplicación intentó alcanzar PRODUCCIÓN (*.supabase.co)').toEqual([]);
  },
});

export { expect };
