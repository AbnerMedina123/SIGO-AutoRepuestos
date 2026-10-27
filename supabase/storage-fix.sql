-- ============================================================================
-- SIGO Autorepuestos — CORRECCIÓN de políticas de Storage
-- ============================================================================
-- Ejecuta este archivo en: Supabase -> SQL Editor -> New query -> Run.
-- (Asegúrate de que el navegador NO esté traduciendo la página: el SQL debe
--  quedar en inglés.)
--
-- Reemplaza las políticas del bucket "images" por una versión que comprueba
-- el rol de administrador EN LÍNEA (consultando la tabla public.admins con
-- auth.uid()), en lugar de usar la función is_admin(). Dentro del esquema
-- storage esto es más fiable y evita el error:
--   "new row violates row-level security policy".
-- ============================================================================

-- Elimina las políticas anteriores (si existen).
drop policy if exists "images_public_read" on storage.objects;
drop policy if exists "images_admin_insert" on storage.objects;
drop policy if exists "images_admin_update" on storage.objects;
drop policy if exists "images_admin_delete" on storage.objects;

-- Lectura pública de los archivos del bucket "images".
create policy "images_public_read" on storage.objects
  for select
  using (bucket_id = 'images');

-- Subir: solo usuarios autenticados cuyo id esté en public.admins.
create policy "images_admin_insert" on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'images'
    and exists (select 1 from public.admins a where a.id = auth.uid())
  );

-- Actualizar: solo admins.
create policy "images_admin_update" on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'images'
    and exists (select 1 from public.admins a where a.id = auth.uid())
  )
  with check (
    bucket_id = 'images'
    and exists (select 1 from public.admins a where a.id = auth.uid())
  );

-- Borrar: solo admins.
create policy "images_admin_delete" on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'images'
    and exists (select 1 from public.admins a where a.id = auth.uid())
  );
