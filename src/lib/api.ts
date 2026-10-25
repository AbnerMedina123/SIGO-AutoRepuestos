import { supabase } from './supabase';
import type {
  Product,
  Category,
  Customer,
  Order,
  OrderItem,
  ProductStatus,
} from '../data/mockData';
import type { Database } from './database.types';

// Imágenes locales por categoría — se usan cuando un producto/categoría no
// trae una URL de imagen propia, para no depender de fotos externas.
import imgBrakes from '../assets/parts/brakes.svg';
import imgFilter from '../assets/parts/filter.svg';
import imgSparkplug from '../assets/parts/sparkplug.svg';
import imgEngine from '../assets/parts/engine.svg';
import imgSuspension from '../assets/parts/suspension.svg';
import imgElectrical from '../assets/parts/electrical.svg';
import imgOil from '../assets/parts/oil.svg';
import imgTransmission from '../assets/parts/transmission.svg';
import imgHeavyDuty from '../assets/parts/heavy-duty.svg';
import imgAccessories from '../assets/parts/accessories.svg';
import placeholder from '../assets/placeholder-part.svg';

type ProductRow = Database['public']['Tables']['products']['Row'];
type CategoryRow = Database['public']['Tables']['categories']['Row'];
type CustomerRow = Database['public']['Tables']['customers']['Row'];
type OrderRow = Database['public']['Tables']['orders']['Row'];
type OrderItemRow = Database['public']['Tables']['order_items']['Row'];

const categoryImage: Record<string, string> = {
  engine: imgEngine,
  brakes: imgBrakes,
  suspension: imgSuspension,
  transmission: imgTransmission,
  electrical: imgElectrical,
  filters: imgFilter,
  lubricants: imgOil,
  accessories: imgAccessories,
  'heavy-duty': imgHeavyDuty,
};

/** Devuelve la imagen a mostrar: la propia si existe, si no una local por categoría. */
function resolveImage(image: string | null, category: string | null): string {
  if (image && image.trim()) return image;
  if (category && categoryImage[category]) return categoryImage[category];
  if (category === 'engine') return imgSparkplug; // variación para encendido
  return placeholder;
}

// ---------- Mappers: fila de BD (snake_case) -> tipo de la app (camelCase) ----------

function mapProduct(row: ProductRow): Product {
  const image = resolveImage(row.image, row.category);
  const images =
    row.images && row.images.length > 0 ? row.images : [image];
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category ?? '',
    code: row.code,
    partNumber: row.part_number,
    price: Number(row.price),
    salePrice: row.sale_price != null ? Number(row.sale_price) : undefined,
    stock: row.stock,
    minStock: row.min_stock,
    compatibility: row.compatibility ?? [],
    description: row.description,
    specs: (row.specs as Record<string, string>) ?? {},
    warranty: row.warranty,
    status: row.status as ProductStatus,
    image,
    images,
    active: row.active,
  };
}

function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    icon: row.icon,
    image: row.image && row.image.trim() ? row.image : categoryImage[row.id] ?? placeholder,
    count: row.count,
    active: row.active,
  };
}

function mapCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    orders: row.orders,
    totalPurchases: Number(row.total_purchases),
    registeredAt: row.registered_at,
    status: row.status as Customer['status'],
  };
}

function mapOrder(row: OrderRow, items: OrderItemRow[]): Order {
  return {
    id: row.id,
    customerId: row.customer_id ?? '',
    customerName: row.customer_name,
    date: row.date,
    items: items.map(mapOrderItem),
    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    shipping: Number(row.shipping),
    total: Number(row.total),
    paymentMethod: row.payment_method,
    deliveryMethod: row.delivery_method,
    status: row.status as Order['status'],
    address: row.address,
  };
}

function mapOrderItem(row: OrderItemRow): OrderItem {
  return {
    productId: row.product_id ?? '',
    productName: row.product_name,
    productCode: row.product_code,
    quantity: row.quantity,
    unitPrice: Number(row.unit_price),
    image: row.image && row.image.trim() ? row.image : placeholder,
  };
}

// ---------- Lectura (pública) ----------

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapProduct);
}

export async function fetchProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? mapProduct(data) : null;
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) throw error;
  return (data ?? []).map(mapCategory);
}

// ---------- Lectura (solo admin, según RLS) ----------

export async function fetchCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase.from('customers').select('*').order('registered_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapCustomer);
}

export async function fetchOrders(): Promise<Order[]> {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('date', { ascending: false });
  if (error) throw error;

  const { data: items, error: itemsError } = await supabase.from('order_items').select('*');
  if (itemsError) throw itemsError;

  const itemsByOrder = new Map<string, OrderItemRow[]>();
  for (const it of items ?? []) {
    const list = itemsByOrder.get(it.order_id) ?? [];
    list.push(it);
    itemsByOrder.set(it.order_id, list);
  }

  return (orders ?? []).map(o => mapOrder(o, itemsByOrder.get(o.id) ?? []));
}

// ---------- Escritura de productos (solo admin, según RLS) ----------

export interface ProductInput {
  id?: string;
  name: string;
  brand: string;
  category: string;
  code: string;
  partNumber: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  minStock: number;
  compatibility: string[];
  description: string;
  specs?: Record<string, string>;
  warranty: string;
  status: string;
  image?: string;
  images?: string[];
  active?: boolean;
}

function toProductRow(input: ProductInput) {
  return {
    name: input.name,
    brand: input.brand,
    category: input.category || null,
    code: input.code,
    part_number: input.partNumber,
    price: input.price,
    sale_price: input.salePrice ?? null,
    stock: input.stock,
    min_stock: input.minStock,
    compatibility: input.compatibility,
    description: input.description,
    specs: input.specs ?? {},
    warranty: input.warranty,
    status: input.status,
    image: input.image ?? '',
    images: input.images ?? [],
    active: input.active ?? true,
  };
}

/** Genera un id tipo P0137 a partir del máximo existente. */
async function nextProductId(): Promise<string> {
  const { data } = await supabase.from('products').select('id').order('id', { ascending: false }).limit(1);
  const last = data?.[0]?.id ?? 'P000';
  const n = parseInt(last.replace(/\D/g, ''), 10) || 0;
  return `P${String(n + 1).padStart(3, '0')}`;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const id = input.id ?? (await nextProductId());
  const { data, error } = await supabase
    .from('products')
    .insert({ id, ...toProductRow(input) })
    .select('*')
    .single();
  if (error) throw error;
  return mapProduct(data);
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update(toProductRow(input))
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return mapProduct(data);
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function updateProductStock(id: string, stock: number): Promise<void> {
  const { error } = await supabase.from('products').update({ stock }).eq('id', id);
  if (error) throw error;
}

// ---------- Escritura de pedidos (solo admin) ----------

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function updateCustomerStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase.from('customers').update({ status }).eq('id', id);
  if (error) throw error;
}

// ---------- Escritura de categorías (solo admin) ----------

export async function upsertCategory(category: Category): Promise<void> {
  const { error } = await supabase.from('categories').upsert({
    id: category.id,
    name: category.name,
    description: category.description,
    icon: category.icon,
    image: '',
    count: category.count,
    active: category.active ?? true,
  });
  if (error) throw error;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

// ---------- Pedidos (creación pública desde el checkout) ----------

export interface NewOrderItem {
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
}

export interface NewOrder {
  id: string;
  customerName: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  deliveryMethod: string;
  address: string;
  items: NewOrderItem[];
}

export async function createOrder(order: NewOrder): Promise<void> {
  const { error: orderError } = await supabase.from('orders').insert({
    id: order.id,
    customer_name: order.customerName,
    subtotal: order.subtotal,
    discount: order.discount,
    shipping: order.shipping,
    total: order.total,
    payment_method: order.paymentMethod,
    delivery_method: order.deliveryMethod,
    status: 'Pending',
    address: order.address,
  });
  if (orderError) throw orderError;

  if (order.items.length > 0) {
    const { error: itemsError } = await supabase.from('order_items').insert(
      order.items.map(it => ({
        order_id: order.id,
        product_id: it.productId,
        product_name: it.productName,
        product_code: it.productCode,
        quantity: it.quantity,
        unit_price: it.unitPrice,
      })),
    );
    if (itemsError) throw itemsError;
  }
}
