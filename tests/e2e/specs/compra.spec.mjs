// Flujo del cliente: catálogo → carrito → checkout → pedido guardado y WhatsApp.

import { test, expect, PRODUCT, USERS, SUPABASE_URL, sb } from '../support.mjs';

const COMPRADOR = {
  nombre: `Cliente SITE2E${process.env.E2E_RUN}`,
  telefono: '4575 2892',
  correo: USERS.comprador,
};

test.describe('Catálogo', () => {
  test('muestra el producto sembrado y usa el Supabase local', async ({ page }) => {
    const peticionLocal = page.waitForRequest((r) => r.url().startsWith(SUPABASE_URL));
    await page.goto('/catalog');
    await peticionLocal; // la aplicación habla con el Supabase local, no con producción
    await expect(page.getByText(PRODUCT.name).first()).toBeVisible();
  });

  test('la búsqueda filtra por código', async ({ page }) => {
    await page.goto('/catalog');
    const buscador = page.getByPlaceholder('Buscar por nombre, marca, código o vehículo...');
    await buscador.fill(PRODUCT.code);
    await expect(page.getByText(PRODUCT.name).first()).toBeVisible();
    await buscador.fill('zzzz-no-existe-xyz');
    await expect(page.getByText(PRODUCT.name)).toHaveCount(0);
  });

  test('un producto se puede marcar como favorito y se conserva al recargar', async ({ page }) => {
    await page.goto('/catalog');
    await expect(page.getByText(PRODUCT.name).first()).toBeVisible();
    await page.getByRole('button', { name: 'Agregar a favoritos' }).first().click();
    await expect(page.getByRole('button', { name: 'Quitar de favoritos' }).first()).toBeVisible();
    await page.reload();
    await expect(page.getByRole('button', { name: 'Quitar de favoritos' }).first()).toBeVisible();
  });
});

test.describe('Compra completa', () => {
  test('carrito → validaciones del checkout → pedido guardado → WhatsApp', async ({ page, context }) => {
    // 1. Agregar al carrito desde la ficha y abrir el carrito (el carrito vive en memoria:
    //    se navega con clics, no recargando).
    await page.goto(`/product/${PRODUCT.id}`);
    await page.getByRole('button', { name: /Agregar al carrito/ }).first().click();
    await page.locator('a[href="/cart"]').first().click();
    await expect(page.getByRole('heading', { name: /Carrito de compras/ })).toBeVisible();
    await expect(page.getByText(PRODUCT.name).first()).toBeVisible();
    await page.getByRole('button', { name: 'Continuar con datos de envío' }).click();

    // 2. Formulario de envío.
    const nombre = page.getByPlaceholder('Ej. Carlos Mendoza');
    const telefono = page.getByPlaceholder('Ej. 4575 2892');
    const correo = page.getByPlaceholder('correo@ejemplo.com');
    await nombre.fill(COMPRADOR.nombre);
    await telefono.fill('123'); // inválido a propósito
    await correo.fill(COMPRADOR.correo);
    await page.getByPlaceholder('Ej. Guatemala').fill('Guatemala');
    await page.getByPlaceholder('Ej. Mixco').fill('Mixco');
    await page.getByPlaceholder('Colonia, calle, avenida y número de casa').fill('Colonia Prueba, 5a avenida 3-45');

    await page.getByRole('button', { name: 'Revisar pedido' }).click();
    await expect(page.getByText('Ingresa un teléfono válido de 8 dígitos')).toBeVisible();

    await telefono.fill(COMPRADOR.telefono);
    await correo.fill('a@b'); // pasa la validación del navegador pero no la de la aplicación
    await page.getByRole('button', { name: 'Revisar pedido' }).click();
    await expect(page.getByText('Ingresa un correo electrónico válido')).toBeVisible();

    await correo.fill(COMPRADOR.correo);
    await page.getByRole('button', { name: 'Revisar pedido' }).click();
    await expect(page.getByRole('heading', { name: /Revisa tu pedido/ })).toBeVisible();

    // 3. Finalizar: se guarda el pedido y se abre WhatsApp en otra pestaña.
    const popupPromise = context.waitForEvent('page');
    await page.getByRole('button', { name: /Finalizar compra/ }).click();
    const popup = await popupPromise;
    await popup.waitForLoadState();

    await expect(page).toHaveURL(/\/order-confirmation/);
    await expect(page.getByRole('heading', { name: /Pedido enviado a WhatsApp/ })).toBeVisible();

    const enlace = new URL(popup.url());
    expect(enlace.hostname).toBe('wa.me');
    expect(enlace.pathname).toBe('/50245752892');
    const mensaje = enlace.searchParams.get('text') ?? '';
    expect(mensaje).toContain(PRODUCT.name);
    expect(mensaje).toContain(COMPRADOR.nombre);
    expect(context.whatsappHits.length).toBeGreaterThan(0);

    // 4. El pedido quedó guardado en la base local con su renglón.
    const nombreCodificado = encodeURIComponent(COMPRADOR.nombre);
    const pedidos = await sb('GET', `/rest/v1/orders?customer_name=eq.${nombreCodificado}&select=id,status,subtotal,shipping,total,address`);
    expect(pedidos.json).toHaveLength(1);
    const pedido = pedidos.json[0];
    expect(pedido.status).toBe('Pending');
    expect(Number(pedido.total)).toBe(PRODUCT.price); // Q250 ≥ Q200: envío gratis
    expect(Number(pedido.shipping)).toBe(0);
    expect(pedido.address).toContain('Mixco');

    const renglones = await sb('GET', `/rest/v1/order_items?order_id=eq.${pedido.id}&select=product_id,quantity,unit_price`);
    expect(renglones.json).toHaveLength(1);
    expect(renglones.json[0].product_id).toBe(PRODUCT.id);
    expect(renglones.json[0].quantity).toBe(1);

    const clientes = await sb('GET', `/rest/v1/customers?email=eq.${encodeURIComponent(COMPRADOR.correo)}&select=id`);
    expect(clientes.json).toHaveLength(1);
  });

  test('con el carrito vacío, /checkout redirige al carrito', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page).toHaveURL(/\/cart/);
    await expect(page.getByText('Tu carrito está vacío')).toBeVisible();
  });
});
