# Despliegue — SIGO Autorepuestos (GitHub + Netlify + Supabase)

## Resumen de la arquitectura

- **Frontend**: React + Vite, se despliega en **Netlify**.
- **Base de datos + autenticación**: **Supabase** (ya configurado).
- **Backend / API**: el frontend habla directo con Supabase usando la
  *publishable key* y las políticas RLS. No se necesita servidor aparte.

## 1. Base de datos (ya hecho)

Los scripts de `supabase/` ya fueron ejecutados en el proyecto Supabase:
`schema.sql`, `seed.sql`, `admin-setup.sql`. El usuario admin es
`admin@sigoautorepuestos.com`.

## 2. Subir el código a GitHub

```bash
git add .
git commit -m "Integración con Supabase: productos, pedidos y login admin reales"
git push origin main
```

El repositorio es: https://github.com/AbnerMedina123/SIGO-AutoRepuestos

> El archivo `.env` NO se sube (está en `.gitignore`). Las claves se configuran
> en Netlify en el paso 4.

## 3. Conectar el repo en Netlify

1. Entra a https://app.netlify.com → **Add new site** → **Import an existing project**.
2. Elige **GitHub** y selecciona el repo `SIGO-AutoRepuestos`.
3. Netlify detecta `netlify.toml`, así que los ajustes de build ya quedan:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 22

## 4. Configurar las variables de entorno en Netlify (IMPORTANTE)

En el sitio de Netlify → **Site configuration** → **Environment variables** →
**Add a variable**, agrega estas dos (los mismos valores de tu `.env` local):

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://ujiyszmsmwoynahifdaf.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_CfZseXMwqICwaijen39rNg_0Cn5mdhP` |

Sin estas variables el sitio compilará pero no podrá conectarse a Supabase.

## 5. Desplegar

Dale **Deploy**. Netlify construye e implementa. Obtendrás una URL pública
tipo `https://tu-sitio.netlify.app` accesible desde cualquier parte del mundo.
Cada `git push` a `main` vuelve a desplegar automáticamente.

## 6. Configurar la URL del sitio en Supabase (para el login admin)

En Supabase → **Authentication** → **URL Configuration**:
- **Site URL**: tu URL de Netlify (`https://tu-sitio.netlify.app`).

Esto asegura que la sesión de administrador funcione correctamente en producción.

## 7. Verificación tras el despliegue

- La tienda carga el catálogo desde Supabase.
- Entra a `/admin/login` con `admin@sigoautorepuestos.com` / tu contraseña.
- Crea un producto en el panel → recarga la página → el producto sigue ahí
  (persistencia real).
- Realiza un pedido de prueba en el checkout → aparece en el panel de Pedidos.

## Dominio propio (opcional)

El `.netlify.app` es gratis y funciona. Si quieres `sigoautorepuestos.com`,
cómpralo y agrégalo en Netlify → **Domain management** (el dominio tiene costo
anual aparte; Netlify da el HTTPS gratis).
