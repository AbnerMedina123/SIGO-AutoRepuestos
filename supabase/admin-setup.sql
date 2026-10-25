-- ============================================================================
-- SIGO Autorepuestos — Registrar al administrador
-- ============================================================================
-- Ejecuta este archivo DESPUÉS de haber creado el usuario en:
--   Supabase -> Authentication -> Users -> Add user
--   Email:    admin@sigoautorepuestos.com
--   Password: Amilcar123SIGO
--   (marca "Auto Confirm User" para que quede confirmado sin correo)
--
-- Este script toma el usuario de auth.users por su correo y lo inserta en la
-- tabla public.admins, de modo que las políticas RLS lo reconozcan como admin.
-- Es seguro ejecutarlo varias veces (on conflict do nothing).
-- ============================================================================

insert into public.admins (id, email)
select id, email
from auth.users
where email = 'admin@sigoautorepuestos.com'
on conflict (id) do nothing;

-- Verificación: debe devolver una fila con el correo del admin.
select a.id, a.email, a.created_at
from public.admins a
where a.email = 'admin@sigoautorepuestos.com';
