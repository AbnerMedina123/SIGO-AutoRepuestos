-- ============================================================================
-- SIGO Autorepuestos — Endurecimiento de seguridad (RLS)
-- ============================================================================
-- Ejecuta en: Supabase -> SQL Editor -> New query -> Run.
-- (Con la traducción del navegador DESACTIVADA: el SQL va en inglés.)
--
-- Las políticas de inserción pública (checkout y registro de cliente) usaban
-- `with check (true)`, lo que permitía insertar registros arbitrarios desde la
-- API pública. Aquí se reemplazan por políticas con validaciones de cordura
-- que limitan el abuso (montos no negativos, longitudes máximas) SIN romper el
-- flujo legítimo del checkout.
-- ============================================================================

-- --- orders: inserción pública con validaciones ------------------------------
drop policy if exists "orders_public_insert" on public.orders;
create policy "orders_public_insert" on public.orders
  for insert
  with check (
    subtotal >= 0
    and discount >= 0
    and shipping >= 0
    and total >= 0
    and total <= 10000000            -- tope de cordura
    and char_length(customer_name) <= 200
    and char_length(address) <= 500
    and char_length(id) <= 64
  );

-- --- order_items: inserción pública con validaciones -------------------------
drop policy if exists "order_items_public_insert" on public.order_items;
create policy "order_items_public_insert" on public.order_items
  for insert
  with check (
    quantity > 0
    and quantity <= 100000
    and unit_price >= 0
    and char_length(product_name) <= 300
    and char_length(product_code) <= 100
  );

-- --- customers: inserción pública con validaciones ---------------------------
drop policy if exists "customers_public_insert" on public.customers;
create policy "customers_public_insert" on public.customers
  for insert
  with check (
    char_length(id) <= 64
    and char_length(first_name) <= 100
    and char_length(last_name) <= 100
    and char_length(email) <= 200
    and char_length(phone) <= 40
    -- El cliente público solo puede crearse como 'active' y sin compras/pedidos
    -- precargados (evita que inyecten métricas falsas).
    and status = 'active'
    and orders = 0
    and total_purchases = 0
  );
