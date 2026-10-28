-- ============================================================================
-- SIGO Autorepuestos — Almacenamiento de imágenes (Supabase Storage)
-- ============================================================================
-- Crea un bucket público llamado "images" para guardar imágenes de categorías
-- y productos subidas desde el panel de administrador. Lectura pública (para
-- que se vean en la tienda) y escritura solo para administradores (según la
-- función public.is_admin() creada en schema.sql).
-- ============================================================================

-- Crea el bucket "images" (público para lectura). Si ya existe, no falla.
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- --- Políticas de acceso al bucket -------------------------------------------
-- Limpia políticas previas con el mismo nombre (idempotente).
drop policy if exists "images_public_read" on storage.objects;
drop policy if exists "images_admin_insert" on storage.objects;
drop policy if exists "images_admin_update" on storage.objects;
drop policy if exists "images_admin_delete" on storage.objects;

-- Lectura pública de los archivos del bucket "images".
create policy "images_public_read" on storage.objects
  for select using (bucket_id = 'images');

-- Subir, actualizar y borrar: solo administradores.
create policy "images_admin_insert" on storage.objects
  for insert with check (bucket_id = 'images' and public.is_admin());

create policy "images_admin_update" on storage.objects
  for update using (bucket_id = 'images' and public.is_admin())
  with check (bucket_id = 'images' and public.is_admin());

create policy "images_admin_delete" on storage.objects
  for delete using (bucket_id = 'images' and public.is_admin());
