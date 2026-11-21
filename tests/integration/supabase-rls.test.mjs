// Pruebas de integración (SIT) de la capa Supabase: RLS, Auth y Storage.
//
// Se ejecutan SOLO contra el Supabase LOCAL (Docker). Insertan y borran datos,
// por eso se niegan a correr si la URL no apunta a 127.0.0.1 / localhost.
//
// Uso (desde la raíz del proyecto, con `supabase start` en marcha):
//   $env:SUPABASE_URL="http://127.0.0.1:54321"
//   $env:SUPABASE_PUBLISHABLE_KEY="<publishable local>"
//   $env:SUPABASE_SECRET_KEY="<secret local>"      # solo para preparar/verificar/limpiar
//   node --test tests/integration
//
// Las claves locales las muestra `supabase start` / `supabase status`.
// NO uses aquí las claves de producción.

import { describe, test, before, after } from 'node:test';
import assert from 'node:assert/strict';

const URL_BASE = (process.env.SUPABASE_URL ?? '').replace(/\/$/, '');
const PUB = process.env.SUPABASE_PUBLISHABLE_KEY ?? '';
const SEC = process.env.SUPABASE_SECRET_KEY ?? '';

const RUN = Date.now().toString(36); // sufijo único por ejecución
const PASSWORD = 'Prueba-Local-' + RUN + '!';

function assertLocalOnly() {
  assert.ok(URL_BASE && PUB && SEC, 'Faltan SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY o SUPABASE_SECRET_KEY');
  const host = new URL(URL_BASE).hostname;
  assert.ok(
    host === '127.0.0.1' || host === 'localhost',
    `Rechazado: ${host} no es local. Estas pruebas escriben datos y solo corren contra Supabase local.`,
  );
}

/** Petición a la API de Supabase. `as`: 'anon' | 'secret' | token JWT de usuario. */
async function api(method, path, { as = 'anon', body, headers = {}, raw } = {}) {
  const h = { ...headers };
  if (as === 'secret') {
    h.apikey = SEC;
  } else {
    h.apikey = PUB;
    h.Authorization = `Bearer ${as === 'anon' ? PUB : as}`;
  }
  let payload = raw;
  if (body !== undefined) {
    h['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  const res = await fetch(`${URL_BASE}${path}`, { method, headers: h, body: payload });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  return { status: res.status, ok: res.ok, json, text };
}

const insert = (table, row, as = 'anon') =>
  api('POST', `/rest/v1/${table}`, { as, body: row, headers: { Prefer: 'return=minimal' } });

/** Una escritura bloqueada por RLS responde 401/403 con el código 42501 de Postgres. */
function assertRlsDenied(res, msg) {
  assert.ok([401, 403].includes(res.status), `${msg}: esperaba 401/403, llegó ${res.status} ${res.text.slice(0, 120)}`);
  assert.equal(res.json?.code, '42501', `${msg}: esperaba código 42501, llegó ${res.text.slice(0, 120)}`);
}

const orderRow = (id, over = {}) => ({
  id,
  customer_name: 'Cliente de prueba',
  subtotal: 100,
  discount: 0,
  shipping: 15,
  total: 115,
  payment_method: 'Pedido por WhatsApp',
  delivery_method: 'Entrega a domicilio',
  status: 'Pending',
  address: 'Zona 1, Guatemala',
  ...over,
});

const itemRow = (orderId, over = {}) => ({
  order_id: orderId,
  product_name: 'Producto de prueba',
  product_code: 'SIT-001',
  quantity: 1,
  unit_price: 100,
  ...over,
});

const created = { users: [], objects: [] };

async function signUp(label) {
  const email = `sit-${label}-${RUN}@example.test`;
  const res = await api('POST', '/auth/v1/signup', { body: { email, password: PASSWORD } });
  assert.equal(res.status, 200, `signup ${label}: ${res.text.slice(0, 150)}`);
  assert.ok(res.json?.access_token, `signup ${label}: sin access_token (¿confirmación de correo activa?)`);
  created.users.push(res.json.user.id);
  return { id: res.json.user.id, email, token: res.json.access_token };
}

before(() => assertLocalOnly());

after(async () => {
  if (!URL_BASE) return;
  // Limpieza con la clave secreta local: solo filas creadas por estas pruebas.
  await api('DELETE', '/rest/v1/order_items?order_id=like.sit-*', { as: 'secret' });
  await api('DELETE', '/rest/v1/orders?id=like.sit-*', { as: 'secret' });
  await api('DELETE', '/rest/v1/customers?id=like.C-sit*', { as: 'secret' });
  await api('DELETE', '/rest/v1/products?id=like.sit-*', { as: 'secret' });
  for (const path of created.objects) await api('DELETE', `/storage/v1/object/images/${path}`, { as: 'secret' });
  for (const id of created.users) {
    await api('DELETE', `/rest/v1/admins?id=eq.${id}`, { as: 'secret' });
    await api('DELETE', `/auth/v1/admin/users/${id}`, { as: 'secret' });
  }
});

describe('Lectura pública (catálogo)', () => {
  test('anónimo lee categories y products', async () => {
    for (const t of ['categories', 'products']) {
      const r = await api('GET', `/rest/v1/${t}?select=id&limit=1`);
      assert.equal(r.status, 200, `${t}: ${r.text.slice(0, 100)}`);
      assert.ok(Array.isArray(r.json));
    }
  });
});

describe('RLS: datos personales no se leen sin sesión', () => {
  test('anónimo no ve customers ni orders aunque existan filas', async () => {
    const cid = `C-sit-${RUN}-leer`;
    const oid = `sit-${RUN}-leer`;
    const c = await insert('customers', { id: cid, first_name: 'Prueba', last_name: 'SIT', email: 'a@example.test', phone: '55555555' });
    assert.ok(c.ok, `no se pudo crear el cliente de prueba: ${c.text.slice(0, 100)}`);
    const o = await insert('orders', orderRow(oid));
    assert.ok(o.ok, `no se pudo crear el pedido de prueba: ${o.text.slice(0, 100)}`);

    // La fila EXISTE (la ve la clave secreta), pero el anónimo recibe una lista vacía.
    const visto = await api('GET', `/rest/v1/orders?id=eq.${oid}&select=id`, { as: 'secret' });
    assert.equal(visto.json?.length, 1, 'la clave secreta debería ver el pedido');
    const anonO = await api('GET', `/rest/v1/orders?id=eq.${oid}&select=id`);
    assert.deepEqual(anonO.json, [], 'el anónimo no debe ver pedidos');
    const anonC = await api('GET', `/rest/v1/customers?id=eq.${cid}&select=id`);
    assert.deepEqual(anonC.json, [], 'el anónimo no debe ver clientes');
  });
});

describe('RLS: escritura de catálogo', () => {
  test('anónimo no puede escribir products ni categories', async () => {
    assertRlsDenied(await insert('products', { id: `sit-${RUN}-p`, name: 'x' }), 'insert products');
    assertRlsDenied(await insert('categories', { id: `sit-${RUN}-c`, name: 'x' }), 'insert categories');
  });
});

describe('RLS: checkout público (orders / order_items / customers)', () => {
  test('un pedido válido con sus renglones se acepta', async () => {
    const oid = `sit-${RUN}-ok`;
    assert.ok((await insert('orders', orderRow(oid))).ok, 'pedido válido');
    const it = await insert('order_items', itemRow(oid));
    assert.ok(it.ok, `renglón válido: ${it.text.slice(0, 120)}`);
  });

  test('se rechazan pedidos con estado distinto de Pending', async () => {
    assertRlsDenied(await insert('orders', orderRow(`sit-${RUN}-d`, { status: 'Delivered' })), 'status Delivered');
  });

  test('se rechazan descuentos y totales incoherentes', async () => {
    assertRlsDenied(await insert('orders', orderRow(`sit-${RUN}-t`, { total: 1 })), 'total incoherente');
    assertRlsDenied(await insert('orders', orderRow(`sit-${RUN}-s`, { discount: 50, total: 65 })), 'descuento');
    assertRlsDenied(await insert('orders', orderRow(`sit-${RUN}-n`, { subtotal: -5, total: 10 })), 'subtotal negativo');
    assertRlsDenied(await insert('orders', orderRow(`sit-${RUN}-m`, { subtotal: 20000000, total: 20000015 })), 'monto excesivo');
  });

  test('se rechazan textos demasiado largos', async () => {
    assertRlsDenied(await insert('orders', orderRow(`sit-${RUN}-l`, { address: 'x'.repeat(501) })), 'dirección larga');
  });

  test('se rechaza un renglón sobre un pedido inexistente', async () => {
    assertRlsDenied(await insert('order_items', itemRow(`sit-${RUN}-no-existe`)), 'pedido inexistente');
  });

  test('se rechazan renglones con cantidad o precio fuera de rango', async () => {
    const oid = `sit-${RUN}-rng`;
    assert.ok((await insert('orders', orderRow(oid))).ok);
    assertRlsDenied(await insert('order_items', itemRow(oid, { quantity: 0 })), 'cantidad 0');
    assertRlsDenied(await insert('order_items', itemRow(oid, { unit_price: -1 })), 'precio negativo');
  });

  test('un pedido de más de 15 minutos o ya no pendiente no admite renglones', async () => {
    const viejo = `sit-${RUN}-viejo`;
    assert.ok((await insert('orders', orderRow(viejo))).ok);
    const hace1h = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const p = await api('PATCH', `/rest/v1/orders?id=eq.${viejo}`, { as: 'secret', body: { created_at: hace1h }, headers: { Prefer: 'return=minimal' } });
    assert.ok(p.ok, `no se pudo envejecer el pedido: ${p.text.slice(0, 100)}`);
    assertRlsDenied(await insert('order_items', itemRow(viejo)), 'pedido antiguo');

    const enviado = `sit-${RUN}-enviado`;
    assert.ok((await insert('orders', orderRow(enviado))).ok);
    const q = await api('PATCH', `/rest/v1/orders?id=eq.${enviado}`, { as: 'secret', body: { status: 'Shipped' }, headers: { Prefer: 'return=minimal' } });
    assert.ok(q.ok, 'no se pudo cambiar el estado');
    assertRlsDenied(await insert('order_items', itemRow(enviado)), 'pedido no pendiente');
  });

  test('LÍMITE CONOCIDO: cualquiera que conozca el id de un pedido pendiente reciente puede añadirle renglones', async () => {
    // Documenta el comportamiento real del diseño actual (no es un fallo de la prueba):
    // la política no ata el renglón a quien creó el pedido, solo a que sea reciente y pendiente.
    const oid = `sit-${RUN}-ajeno`;
    assert.ok((await insert('orders', orderRow(oid))).ok);
    const intruso = await insert('order_items', itemRow(oid, { product_name: 'Añadido por otro cliente' }));
    assert.ok(intruso.ok, 'si esto falla, el diseño cambió: actualizar la documentación del riesgo');
  });

  test('un cliente solo se crea activo y sin compras precargadas', async () => {
    const base = { first_name: 'A', last_name: 'B', email: 'c@example.test', phone: '1' };
    assert.ok((await insert('customers', { id: `C-sit-${RUN}-ok`, ...base })).ok, 'cliente válido');
    assertRlsDenied(await insert('customers', { id: `C-sit-${RUN}-s`, ...base, status: 'inactive' }), 'status');
    assertRlsDenied(await insert('customers', { id: `C-sit-${RUN}-o`, ...base, orders: 5 }), 'orders precargado');
    assertRlsDenied(await insert('customers', { id: `C-sit-${RUN}-t`, ...base, total_purchases: 999 }), 'compras precargadas');
  });
});

describe('Auth + RLS: roles', () => {
  test('un usuario autenticado sin rol admin no puede escribir el catálogo ni auto-promoverse', async () => {
    const u = await signUp('cliente');
    const esAdmin = await api('POST', '/rest/v1/rpc/is_admin', { as: u.token, body: {} });
    assert.equal(esAdmin.json, false, 'is_admin debe ser false');
    assertRlsDenied(await insert('products', { id: `sit-${RUN}-pc`, name: 'x' }, u.token), 'producto como cliente');
    assertRlsDenied(await insert('admins', { id: u.id, email: u.email }, u.token), 'auto-promoción a admin');
  });

  test('un administrador (en public.admins) sí puede escribir el catálogo', async () => {
    const a = await signUp('admin');
    const alta = await insert('admins', { id: a.id, email: a.email }, 'secret');
    assert.ok(alta.ok, `no se pudo registrar al admin de prueba: ${alta.text.slice(0, 100)}`);
    const esAdmin = await api('POST', '/rest/v1/rpc/is_admin', { as: a.token, body: {} });
    assert.equal(esAdmin.json, true, 'is_admin debe ser true');
    const pid = `sit-${RUN}-pa`;
    const p = await insert('products', { id: pid, name: 'Producto de prueba SIT', price: 10 }, a.token);
    assert.ok(p.ok, `admin no pudo crear producto: ${p.text.slice(0, 120)}`);
    const lectura = await api('GET', `/rest/v1/products?id=eq.${pid}&select=id`);
    assert.equal(lectura.json?.length, 1, 'el producto debe ser visible públicamente');
    const pedidos = await api('GET', `/rest/v1/orders?select=id&limit=1`, { as: a.token });
    assert.equal(pedidos.status, 200, 'el admin debe poder leer pedidos');
    assert.ok((pedidos.json?.length ?? 0) >= 1, 'el admin debería ver los pedidos creados por las pruebas');
  });
});

describe('Storage: bucket images', () => {
  const PNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    'base64',
  );

  test('anónimo no puede subir; un administrador sí; la lectura es pública', async () => {
    const ruta = `sit-${RUN}.png`;
    const anon = await api('POST', `/storage/v1/object/images/${ruta}`, { as: 'anon', raw: PNG, headers: { 'Content-Type': 'image/png' } });
    assert.ok(!anon.ok, `el anónimo no debería poder subir (llegó ${anon.status})`);

    const a = await signUp('admin-storage');
    assert.ok((await insert('admins', { id: a.id, email: a.email }, 'secret')).ok);
    const sube = await api('POST', `/storage/v1/object/images/${ruta}`, { as: a.token, raw: PNG, headers: { 'Content-Type': 'image/png' } });
    assert.ok(sube.ok, `el admin debería poder subir: ${sube.status} ${sube.text.slice(0, 120)}`);
    created.objects.push(ruta);

    const publico = await fetch(`${URL_BASE}/storage/v1/object/public/images/${ruta}`);
    assert.equal(publico.status, 200, 'la lectura pública del bucket debe funcionar');
  });
});
