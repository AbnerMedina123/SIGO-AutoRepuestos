// Panel de administración: control de acceso y vistas con datos reales.

import { test, expect, USERS, PASSWORD, PRODUCT, SEEDED_ORDER } from '../support.mjs';

async function entrarAlPanel(page, correo, clave) {
  await page.goto('/admin/login');
  await page.getByPlaceholder('admin@sigoautorepuestos.com').fill(correo);
  await page.getByPlaceholder('••••••••').fill(clave);
  await page.getByRole('button', { name: 'Ingresar al panel' }).click();
}

test.describe('Control de acceso', () => {
  test('sin sesión, /admin redirige al login de administrador', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('sin sesión, las subpáginas del panel también redirigen', async ({ page }) => {
    for (const ruta of ['/admin/products', '/admin/orders', '/admin/customers']) {
      await page.goto(ruta);
      await expect(page, `ruta ${ruta}`).toHaveURL(/\/admin\/login/);
    }
  });

  test('una cuenta sin rol de administrador es rechazada', async ({ page }) => {
    await entrarAlPanel(page, USERS.noAdmin, PASSWORD);
    await expect(page.getByText('Esta cuenta no tiene permisos de administrador.')).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login/);
    // Y tras el rechazo la sesión se cerró: el panel sigue inaccesible.
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('una contraseña incorrecta es rechazada', async ({ page }) => {
    await entrarAlPanel(page, USERS.admin, 'clave-equivocada');
    await expect(page.getByText('Las credenciales de administrador no son válidas.')).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});

test.describe('Panel con sesión de administrador', () => {
  test('el administrador ve productos y pedidos de la base', async ({ page }) => {
    await entrarAlPanel(page, USERS.admin, PASSWORD);
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByText('PANEL ADMINISTRATIVO')).toBeVisible();

    await page.getByRole('link', { name: 'Productos' }).click();
    await expect(page).toHaveURL(/\/admin\/products/);
    await expect(page.getByText(PRODUCT.name).first()).toBeVisible();

    await page.getByRole('link', { name: 'Pedidos' }).click();
    await expect(page).toHaveURL(/\/admin\/orders/);
    await expect(page.getByText(SEEDED_ORDER.customer).first()).toBeVisible();
  });
});
