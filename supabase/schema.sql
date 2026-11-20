-- ============================================================================
-- SIGO Autorepuestos — Esquema de base de datos (Supabase / PostgreSQL)
-- ============================================================================
-- Es idempotente en lo posible: puedes volver a correrlo si necesitas
-- recrear el esquema (las tablas se eliminan y recrean).
-- ============================================================================

-- --- Limpieza (orden inverso por dependencias) --------------------------------
drop table if exists public.order_items cascade;
drop table if exists public.orders cascade;
drop table if exists public.products cascade;
drop table if exists public.categories cascade;
drop table if exists public.customers cascade;
drop table if exists public.admins cascade;

-- ============================================================================
-- TABLAS
-- ============================================================================

-- Administradores: un usuario de Supabase Auth cuyo id esté aquí es admin.
create table public.admins (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

-- Categorías
create table public.categories (
  id text primary key,
  name text not null,
  description text not null default '',
  icon text not null default '',
  image text not null default '',
  count integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Productos
create table public.products (
  id text primary key,
  name text not null,
  brand text not null default '',
  category text references public.categories (id) on delete set null,
  code text not null default '',
  part_number text not null default '',
  price numeric(12, 2) not null default 0,
  sale_price numeric(12, 2),
  stock integer not null default 0,
  min_stock integer not null default 0,
  compatibility text[] not null default '{}',
  description text not null default '',
  specs jsonb not null default '{}'::jsonb,
  warranty text not null default '',
  status text not null default 'ACTIVE',
  image text not null default '',
  images text[] not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Clientes (datos de perfil; independiente de auth para clientes invitados)
create table public.customers (
  id text primary key,
  first_name text not null default '',
  last_name text not null default '',
  email text not null default '',
  phone text not null default '',
  orders integer not null default 0,
  total_purchases numeric(12, 2) not null default 0,
  status text not null default 'active',
  registered_at date not null default current_date,
  created_at timestamptz not null default now()
);

-- Pedidos
create table public.orders (
  id text primary key,
  customer_id text references public.customers (id) on delete set null,
  customer_name text not null default '',
  date date not null default current_date,
  subtotal numeric(12, 2) not null default 0,
  discount numeric(12, 2) not null default 0,
  shipping numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  payment_method text not null default '',
  delivery_method text not null default '',
  status text not null default 'Pending',
  address text not null default '',
  created_at timestamptz not null default now()
);

-- Renglones del pedido
create table public.order_items (
  id bigint generated always as identity primary key,
  order_id text not null references public.orders (id) on delete cascade,
  product_id text references public.products (id) on delete set null,
  product_name text not null default '',
  product_code text not null default '',
  quantity integer not null default 1,
  unit_price numeric(12, 2) not null default 0,
  image text not null default ''
);

-- Índices útiles
create index on public.products (category);
create index on public.products (status);
create index on public.order_items (order_id);

-- ============================================================================
-- FUNCIÓN AUXILIAR: ¿el usuario actual es admin?
-- ============================================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins a where a.id = auth.uid()
  );
$$;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.admins       enable row level security;
alter table public.categories   enable row level security;
alter table public.products     enable row level security;
alter table public.customers    enable row level security;
alter table public.orders       enable row level security;
alter table public.order_items  enable row level security;

-- --- Función auxiliar para order_items (equivale a rls-hardening-2.sql) ------
-- ¿existe un pedido pendiente creado hace pocos minutos? SECURITY DEFINER porque
-- el público no puede leer orders (RLS); solo devuelve un booleano.
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

-- --- admins: solo un admin puede ver la tabla de admins ----------------------
create policy "admins_select_self_or_admin" on public.admins
  for select using (auth.uid() = id or public.is_admin());

-- --- categories: lectura pública, escritura solo admin -----------------------
create policy "categories_public_read" on public.categories
  for select using (true);
create policy "categories_admin_write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

-- --- products: lectura pública, escritura solo admin -------------------------
create policy "products_public_read" on public.products
  for select using (true);
create policy "products_admin_write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- --- customers: solo admin (datos personales) --------------------------------
create policy "customers_admin_read" on public.customers
  for select using (public.is_admin());
-- Permite crear clientes desde el checkout público, CON validaciones de cordura
-- (longitudes máximas; solo como 'active' y sin compras ni pedidos precargados).
-- Editar/borrar: solo admin. Equivale a security-hardening.sql.
create policy "customers_public_insert" on public.customers
  for insert
  with check (
    char_length(id) <= 64
    and char_length(first_name) <= 100
    and char_length(last_name) <= 100
    and char_length(email) <= 200
    and char_length(phone) <= 40
    and status = 'active'
    and orders = 0
    and total_purchases = 0
  );
create policy "customers_admin_update" on public.customers
  for update using (public.is_admin()) with check (public.is_admin());
create policy "customers_admin_delete" on public.customers
  for delete using (public.is_admin());

-- --- orders: el checkout público puede crear; solo admin puede leer/editar ---
create policy "orders_admin_read" on public.orders
  for select using (public.is_admin());
-- Inserción pública con validaciones de negocio (equivale a rls-hardening-2.sql):
-- un pedido nuevo nace pendiente, sin descuento y con total coherente.
create policy "orders_public_insert" on public.orders
  for insert
  with check (
    status = 'Pending'
    and discount = 0
    and subtotal >= 0
    and shipping >= 0
    and shipping <= 1000
    and total >= 0
    and total <= 10000000
    and abs(total - (subtotal - discount + shipping)) <= 0.05
    and char_length(customer_name) <= 200
    and char_length(address) <= 500
    and char_length(id) <= 64
    and char_length(payment_method) <= 100
    and char_length(delivery_method) <= 100
  );
create policy "orders_admin_update" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());
create policy "orders_admin_delete" on public.orders
  for delete using (public.is_admin());

-- --- order_items: igual que orders -------------------------------------------
create policy "order_items_admin_read" on public.order_items
  for select using (public.is_admin());
-- Inserción pública: solo sobre un pedido pendiente creado hace pocos minutos
-- (equivale a rls-hardening-2.sql; usa la función public.order_is_recent).
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
create policy "order_items_admin_update" on public.order_items
  for update using (public.is_admin()) with check (public.is_admin());
create policy "order_items_admin_delete" on public.order_items
  for delete using (public.is_admin());

-- ============================================================================
-- TRIGGER: mantener products.updated_at
-- ============================================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_touch_updated_at
  before update on public.products
  for each row execute function public.touch_updated_at();
