// Siembra los datos de prueba en el Supabase LOCAL antes de las pruebas.

import { CATEGORY, PRODUCT, SEEDED_ORDER, USERS, PASSWORD, sb } from './support.mjs';

async function ok(res, que) {
  if (!res.ok) throw new Error(`Sembrado falló (${que}): ${res.status} ${res.text.slice(0, 200)}`);
  return res;
}

async function crearUsuario(email, { admin = false } = {}) {
  const r = await ok(
    await sb('POST', '/auth/v1/admin/users', { body: { email, password: PASSWORD, email_confirm: true } }),
    `usuario ${email}`,
  );
  const id = r.json?.id;
  if (!id) throw new Error(`Sin id para el usuario ${email}: ${r.text.slice(0, 120)}`);
  if (admin) {
    await ok(
      await sb('POST', '/rest/v1/admins', { body: { id, email }, headers: { Prefer: 'return=minimal' } }),
      `admin ${email}`,
    );
  }
  return id;
}

export default async function globalSetup() {
  const min = { Prefer: 'return=minimal' };

  await ok(
    await sb('POST', '/rest/v1/categories', {
      body: { id: CATEGORY.id, name: CATEGORY.name, description: 'Categoría de pruebas E2E', icon: '', active: true },
      headers: min,
    }),
    'categoría',
  );

  await ok(
    await sb('POST', '/rest/v1/products', {
      body: {
        id: PRODUCT.id,
        name: PRODUCT.name,
        brand: PRODUCT.brand,
        category: CATEGORY.id,
        code: PRODUCT.code,
        price: PRODUCT.price,
        stock: 10,
        min_stock: 2,
        status: 'ACTIVE',
        active: true,
        description: 'Producto sembrado para las pruebas E2E.',
      },
      headers: min,
    }),
    'producto',
  );

  await ok(
    await sb('POST', '/rest/v1/orders', {
      body: {
        id: SEEDED_ORDER.id,
        customer_name: SEEDED_ORDER.customer,
        subtotal: PRODUCT.price,
        discount: 0,
        shipping: 0,
        total: PRODUCT.price,
        payment_method: 'Pedido por WhatsApp',
        delivery_method: 'Entrega a domicilio',
        status: 'Pending',
        address: 'Zona 1, Guatemala',
      },
      headers: min,
    }),
    'pedido sembrado',
  );
  await ok(
    await sb('POST', '/rest/v1/order_items', {
      body: {
        order_id: SEEDED_ORDER.id,
        product_id: PRODUCT.id,
        product_name: PRODUCT.name,
        product_code: PRODUCT.code,
        quantity: 1,
        unit_price: PRODUCT.price,
      },
      headers: min,
    }),
    'renglón sembrado',
  );

  await crearUsuario(USERS.admin, { admin: true });
  await crearUsuario(USERS.cliente);
  await crearUsuario(USERS.noAdmin);
}
