-- Casos de prueba de las reglas de rls-rules.yaml (se ejecutan con
-- `semgrep --test semgrep-rules`). NO es un script real: contiene a propósito
-- ejemplos inseguros. El escaneo normal lo excluye con --exclude semgrep-rules (ver el workflow).
-- Las anotaciones usan "//" porque es el estilo que Semgrep reconoce en modo generic (no reconoce "--"). "ruleid" = la regla DEBE marcar la línea siguiente; "ok" = NO debe marcarla.

// ruleid: sigo-rls-insert-policy-with-check-true
create policy "t1" on public.orders
  for insert with check (true);

// ok: sigo-rls-insert-policy-with-check-true
create policy "t2" on public.orders
  for insert with check (total >= 0 and status = 'Pending');

// ruleid: sigo-rls-write-policy-using-true
create policy "t3" on public.products
  for all using (true) with check (true);

// ruleid: sigo-rls-write-policy-using-true
create policy "t4" on public.products
  for delete using (true);

// ok: sigo-rls-write-policy-using-true
create policy "t5" on public.products
  for select using (true);

// ok: sigo-rls-write-policy-using-true
create policy "t6" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

// ruleid: sigo-sql-security-definer-without-search-path
create or replace function public.t7()
returns boolean
language sql
security definer
as $$ select true; $$;

// ok: sigo-sql-security-definer-without-search-path
create or replace function public.t8()
returns boolean
language sql
stable
security definer
set search_path = public
as $$ select true; $$;

// ok: sigo-sql-security-definer-without-search-path
create or replace function public.t9()
returns boolean
language sql
as $$ select true; $$;

// ruleid: sigo-rls-disabled-or-table-grant-to-anon
alter table public.orders disable row level security;

// ruleid: sigo-rls-disabled-or-table-grant-to-anon
grant all on public.orders to anon;

// ok: sigo-rls-disabled-or-table-grant-to-anon
grant execute on function public.t8(text) to anon, authenticated;
