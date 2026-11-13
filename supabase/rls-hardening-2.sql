-- ============================================================================
-- SIGO Autorepuestos — Endurecimiento RLS (segunda ronda)
-- ============================================================================
-- Ejecutar DESPUÉS de security-hardening.sql. Reemplaza las políticas de
-- inserción pública de orders y order_items para cerrar dos huecos:
--   1. Un pedido podía crearse ya marcado como entregado, con descuentos o
--      totales incoherentes, falseando las métricas de ventas del panel.
--   2. Se podían insertar renglones en cualquier pedido existente (los ids
--      son predecibles: ORD-<milisegundos>).
-- El checkout legítimo (src/lib/api.ts -> createOrder) siempre envía
-- status 'Pending' y discount 0, por lo que no se ve afectado.
--
-- Para revertir: volver a ejecutar security-hardening.sql.
-- ============================================================================

-- Función auxiliar: ¿existe un pedido pendiente creado hace pocos minutos?
-- Es SECURITY DEFINER porque el público no puede leer la tabla orders (RLS);
-- solo devuelve un booleano.
create or replace function public.order_is_recent(p_order_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.orders o
    where o.id = p_order_id
      and o.status = 'Pending'
      and o.created_at > now() - interval '15 minutes'
  );
$$;

revoke all on function public.order_is_recent(text) from public;
grant execute on function public.order_is_recent(text) to anon, authenticated;

-- --- orders: inserción pública con validaciones de negocio -------------------
drop policy if exists "orders_public_insert" on public.orders;
create policy "orders_public_insert" on public.orders
  for insert
  with check (
    status = 'Pending'                    -- un pedido nuevo siempre nace pendiente
    and discount = 0                      -- el checkout no aplica descuentos
    and subtotal >= 0
    and shipping >= 0
    and shipping <= 1000
    and total >= 0
    and total <= 10000000
    -- total coherente con subtotal + envío (tolerancia por redondeo)
    and abs(total - (subtotal - discount + shipping)) <= 0.05
    and char_length(customer_name) <= 200
    and char_length(address) <= 500
    and char_length(id) <= 64
    and char_length(payment_method) <= 100
    and char_length(delivery_method) <= 100
  );

-- --- order_items: solo sobre un pedido pendiente recién creado ---------------
drop policy if exists "order_items_public_insert" on public.order_items;
create policy "order_items_public_insert" on public.order_items
  for insert
  with check (
    public.order_is_recent(order_id)
    and quantity > 0
    and quantity <= 100000
    and unit_price >= 0
    and unit_price <= 1000000
    and char_length(product_name) <= 300
    and char_length(product_code) <= 100
  );
