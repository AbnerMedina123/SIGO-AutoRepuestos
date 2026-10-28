-- ============================================================================
-- SIGO Autorepuestos — Limpieza de datos (dejar el sistema "en blanco")
-- ============================================================================
-- Borra productos, pedidos, renglones de pedido y clientes de ejemplo para que
-- el administrador vea datos reales a medida que se registran. CONSERVA las
-- categorías (estructura base de la tienda) y pone sus conteos en 0 para que
-- reflejen el número real de productos.
--
-- NO toca la tabla admins ni la autenticación.
-- ============================================================================

-- Orden por dependencias: primero renglones, luego pedidos, productos, clientes.
delete from public.order_items;
delete from public.orders;
delete from public.products;
delete from public.customers;

-- Conteos de categoría a 0 (se mostrará el número real de productos).
update public.categories set count = 0;

-- Verificación: todo debe quedar en 0 excepto categorías (9).
select
  (select count(*) from public.products)    as productos,
  (select count(*) from public.orders)       as pedidos,
  (select count(*) from public.order_items)  as renglones,
  (select count(*) from public.customers)    as clientes,
  (select count(*) from public.categories)   as categorias;
