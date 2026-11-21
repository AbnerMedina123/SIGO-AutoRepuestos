// Limpia del Supabase LOCAL todo lo que crearon las pruebas (siempre se ejecuta,
// aunque alguna prueba falle). Solo toca filas con el sufijo de esta ejecución.

import { RUN, sb } from './support.mjs';

export default async function globalTeardown() {
  const pedidos = `or=(id.like.sit-e2e-${RUN}*,customer_name.like.*SITE2E${RUN}*)`;

  // Los renglones se borran en cascada con su pedido.
  await sb('DELETE', `/rest/v1/orders?${pedidos}`);
  await sb('DELETE', `/rest/v1/customers?email=like.sit-e2e-${RUN}-*`);
  await sb('DELETE', `/rest/v1/products?id=like.sit-e2e-${RUN}*`);
  await sb('DELETE', `/rest/v1/categories?id=like.sit-e2e-${RUN}*`);

  // Usuarios de Auth (la fila de public.admins se borra en cascada).
  const lista = await sb('GET', '/auth/v1/admin/users?per_page=1000');
  const usuarios = lista.json?.users ?? [];
  for (const u of usuarios) {
    if (typeof u.email === 'string' && u.email.startsWith(`sit-e2e-${RUN}-`)) {
      await sb('DELETE', `/auth/v1/admin/users/${u.id}`);
    }
  }
}
