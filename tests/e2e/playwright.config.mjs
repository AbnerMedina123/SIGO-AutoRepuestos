// Configuración de las pruebas de interfaz (Playwright).
//
// Las pruebas corren la aplicación en modo desarrollo (Vite) contra el
// Supabase LOCAL (Docker). Escriben datos, por eso este archivo se niega a
// ejecutarse si SUPABASE_URL no es local, y las pruebas bloquean además
// cualquier petición a *.supabase.co (producción).
//
// Variables requeridas (las claves locales las muestra `supabase start`):
//   SUPABASE_URL                = http://127.0.0.1:54321
//   SUPABASE_PUBLISHABLE_KEY    = <publishable local>
//   SUPABASE_SECRET_KEY         = <secret local>   (solo para sembrar y limpiar)

import { defineConfig, devices } from '@playwright/test';

const SUPABASE_URL = (process.env.SUPABASE_URL ?? '').replace(/\/$/, '');
const PUB = process.env.SUPABASE_PUBLISHABLE_KEY ?? '';
const SEC = process.env.SUPABASE_SECRET_KEY ?? '';

if (!SUPABASE_URL || !PUB || !SEC) {
  throw new Error('Faltan SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY o SUPABASE_SECRET_KEY.');
}
const host = new URL(SUPABASE_URL).hostname;
if (host !== '127.0.0.1' && host !== 'localhost') {
  throw new Error(`Rechazado: ${host} no es local. Estas pruebas escriben datos y solo corren contra Supabase local.`);
}

const PORT = 4173;

// Sufijo único de esta ejecución: los workers lo heredan del proceso principal.
process.env.E2E_RUN ??= Date.now().toString(36);

export default defineConfig({
  testDir: './specs',
  globalSetup: './global-setup.mjs',
  globalTeardown: './global-teardown.mjs',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  outputDir: 'test-results',
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    locale: 'es-GT',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // Por defecto: servidor de desarrollo (Vite). Con E2E_BUILD=1 se compila la
    // aplicación (como en Netlify) y se prueba el resultado, que es lo que ven los
    // clientes. La compilación va a una carpeta propia: no toca `dist/`.
    command: process.env.E2E_BUILD
      ? 'npx vite build --outDir tests/e2e/.dist-app --emptyOutDir && npx vite preview --outDir tests/e2e/.dist-app --strictPort'
      : 'npm run dev',
    cwd: '../..',
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      PORT: String(PORT),
      // Solo localhost (por defecto Vite escucharía en toda la red).
      FIGMA_DEV_SERVER_HOST: '127.0.0.1',
      // Las variables de entorno tienen prioridad sobre el archivo .env de la raíz.
      VITE_SUPABASE_URL: SUPABASE_URL,
      VITE_SUPABASE_PUBLISHABLE_KEY: PUB,
      // Vacío = el CAPTCHA se omite en esta tanda de pruebas.
      VITE_TURNSTILE_SITE_KEY: '',
    },
  },
});
