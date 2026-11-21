// Registro e inicio de sesión de clientes (Supabase Auth local).

import { test, expect, USERS, PASSWORD, sb } from '../support.mjs';

async function rellenarRegistro(page, { correo, clave, confirmar }) {
  await page.goto('/register');
  await page.getByPlaceholder('Carlos').fill('Cliente');
  await page.getByPlaceholder('Mendoza').fill('Nuevo SITE2E');
  await page.getByPlaceholder('tu@correo.com').fill(correo);
  await page.getByPlaceholder('+502 4575 2892').fill('45752892');
  const claves = page.getByPlaceholder('••••••••');
  await claves.nth(0).fill(clave);
  await claves.nth(1).fill(confirmar);
  await page.getByRole('checkbox').check();
}

test.describe('Registro', () => {
  test('rechaza contraseñas cortas o que no coinciden', async ({ page }) => {
    await rellenarRegistro(page, { correo: USERS.nuevo, clave: '12345', confirmar: '12345' });
    await page.getByRole('button', { name: 'Crear cuenta' }).click();
    await expect(page.getByText('La contraseña debe tener al menos 6 caracteres.')).toBeVisible();

    await rellenarRegistro(page, { correo: USERS.nuevo, clave: PASSWORD, confirmar: PASSWORD + 'x' });
    await page.getByRole('button', { name: 'Crear cuenta' }).click();
    await expect(page.getByText('Las contraseñas no coinciden.')).toBeVisible();
  });

  test('crea una cuenta real y entra a "Mi cuenta"', async ({ page }) => {
    await rellenarRegistro(page, { correo: USERS.nuevo, clave: PASSWORD, confirmar: PASSWORD });
    await page.getByRole('button', { name: 'Crear cuenta' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: /Mi cuenta/ })).toBeVisible();

    // La cuenta existe de verdad en Auth y el cliente quedó registrado en la tabla.
    const lista = await sb('GET', '/auth/v1/admin/users?per_page=1000');
    expect(lista.json.users.some((u) => u.email === USERS.nuevo)).toBe(true);
    const cliente = await sb('GET', `/rest/v1/customers?email=eq.${encodeURIComponent(USERS.nuevo)}&select=id,status`);
    expect(cliente.json).toHaveLength(1);
    expect(cliente.json[0].status).toBe('active');
  });

  test('no permite registrar dos veces el mismo correo', async ({ page }) => {
    await rellenarRegistro(page, { correo: USERS.cliente, clave: PASSWORD, confirmar: PASSWORD });
    await page.getByRole('button', { name: 'Crear cuenta' }).click();
    await expect(page).not.toHaveURL(/\/dashboard/);
    await expect(page.locator('form').getByText(/Ya existe una cuenta|Ocurrió un error/)).toBeVisible();
  });
});

test.describe('Inicio de sesión', () => {
  test('una contraseña incorrecta no da acceso', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('tu@correo.com').fill(USERS.cliente);
    await page.getByPlaceholder('••••••••').fill('clave-equivocada');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
    await expect(page.getByText('Correo o contraseña incorrectos.')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('credenciales correctas llevan a "Mi cuenta"', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('tu@correo.com').fill(USERS.cliente);
    await page.getByPlaceholder('••••••••').fill(PASSWORD);
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: /Mi cuenta/ })).toBeVisible();
  });

  test('el administrador que entra por /login es llevado al panel', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('tu@correo.com').fill(USERS.admin);
    await page.getByPlaceholder('••••••••').fill(PASSWORD);
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
    await expect(page).toHaveURL(/\/admin/);
  });
});
