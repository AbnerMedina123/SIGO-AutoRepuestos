import type { Order, Product, Category } from '../data/mockData';

// ============================================================================
// Cálculo de métricas y datos de gráficas a partir de datos REALES.
// Todas las funciones reciben los pedidos/productos/categorías ya cargados
// desde Supabase (vía DataProvider) y devuelven estructuras listas para
// Recharts o las tarjetas del panel.
//
// Criterio de "venta confirmada": un pedido cuenta como ingreso cuando su
// estado NO es Pending ni Cancelled (es decir, el negocio ya lo confirmó).
// ============================================================================

const CONFIRMED = ['Confirmed', 'Preparing', 'Shipped', 'Delivered'];

export function isConfirmed(order: Order): boolean {
  return CONFIRMED.includes(order.status);
}

const MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function parseDate(d: string): Date {
  // Las fechas vienen como 'YYYY-MM-DD'. Se interpreta en local sin desfase.
  const [y, m, day] = d.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, day ?? 1);
}

// ---------- Tendencia de ventas / volumen de pedidos ----------

export interface TrendPoint {
  label: string;
  sales: number;
  orders: number;
}

/** Ventas confirmadas y # de pedidos agrupados por mes (últimos N meses). */
export function salesByMonth(orders: Order[], months = 6): TrendPoint[] {
  const now = new Date();
  const buckets: TrendPoint[] = [];
  const index = new Map<string, TrendPoint>();

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const point: TrendPoint = { label: MONTHS_ES[d.getMonth()], sales: 0, orders: 0 };
    index.set(key, point);
    buckets.push(point);
  }

  for (const o of orders) {
    if (!isConfirmed(o)) continue;
    const d = parseDate(o.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const point = index.get(key);
    if (point) {
      point.sales += o.total;
      point.orders += 1;
    }
  }
  return buckets;
}

/** Ventas y pedidos por día de la semana actual (Lun..Dom). */
export function salesByWeekday(orders: Order[]): TrendPoint[] {
  const order = [1, 2, 3, 4, 5, 6, 0]; // Lun..Dom
  const points: TrendPoint[] = order.map((wd) => ({ label: DAYS_ES[wd], sales: 0, orders: 0 }));
  const now = new Date();
  const weekStart = new Date(now);
  const day = (now.getDay() + 6) % 7; // 0 = lunes
  weekStart.setDate(now.getDate() - day);
  weekStart.setHours(0, 0, 0, 0);

  for (const o of orders) {
    if (!isConfirmed(o)) continue;
    const d = parseDate(o.date);
    if (d < weekStart) continue;
    const idx = (d.getDay() + 6) % 7;
    points[idx].sales += o.total;
    points[idx].orders += 1;
  }
  return points;
}

/** Ventas y pedidos por día (últimos 7 días calendario). */
export function salesByDay(orders: Order[]): TrendPoint[] {
  const now = new Date();
  const points: TrendPoint[] = [];
  const index = new Map<string, TrendPoint>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const key = d.toDateString();
    const point: TrendPoint = { label: DAYS_ES[d.getDay()], sales: 0, orders: 0 };
    index.set(key, point);
    points.push(point);
  }
  for (const o of orders) {
    if (!isConfirmed(o)) continue;
    const key = parseDate(o.date).toDateString();
    const point = index.get(key);
    if (point) {
      point.sales += o.total;
      point.orders += 1;
    }
  }
  return points;
}

// ---------- Pedidos por estado ----------

export interface StatusSlice {
  name: string;
  value: number;
  color: string;
}

const STATUS_META: Record<string, { label: string; color: string }> = {
  Delivered: { label: 'Entregados', color: '#4ADE80' },
  Shipped: { label: 'Enviados', color: '#2DD4BF' },
  Preparing: { label: 'En preparación', color: '#C084FC' },
  Confirmed: { label: 'Confirmados', color: '#60A5FA' },
  Pending: { label: 'Pendientes', color: '#FFAA00' },
  Cancelled: { label: 'Cancelados', color: '#F87171' },
};

export function ordersByStatus(orders: Order[]): StatusSlice[] {
  const counts = new Map<string, number>();
  for (const o of orders) counts.set(o.status, (counts.get(o.status) ?? 0) + 1);
  return Object.entries(STATUS_META)
    .map(([status, meta]) => ({ name: meta.label, value: counts.get(status) ?? 0, color: meta.color }))
    .filter((s) => s.value > 0);
}

// ---------- Productos más vendidos ----------

export interface TopProduct {
  name: string;
  sales: number; // unidades
  revenue: number;
}

export function topProducts(orders: Order[], limit = 5): TopProduct[] {
  const map = new Map<string, TopProduct>();
  for (const o of orders) {
    if (!isConfirmed(o)) continue;
    for (const it of o.items) {
      const key = it.productName;
      const cur = map.get(key) ?? { name: key, sales: 0, revenue: 0 };
      cur.sales += it.quantity;
      cur.revenue += it.unitPrice * it.quantity;
      map.set(key, cur);
    }
  }
  return [...map.values()].sort((a, b) => b.sales - a.sales).slice(0, limit);
}

// ---------- Ventas por categoría ----------

export interface CategorySlice {
  name: string;
  value: number; // porcentaje 0-100
}

export function salesByCategory(orders: Order[], products: Product[], categories: Category[]): CategorySlice[] {
  const productCategory = new Map(products.map((p) => [p.id, p.category]));
  const categoryName = new Map(categories.map((c) => [c.id, c.name]));
  const revenue = new Map<string, number>();

  for (const o of orders) {
    if (!isConfirmed(o)) continue;
    for (const it of o.items) {
      const catId = productCategory.get(it.productId) ?? 'otros';
      revenue.set(catId, (revenue.get(catId) ?? 0) + it.unitPrice * it.quantity);
    }
  }

  const total = [...revenue.values()].reduce((s, v) => s + v, 0);
  if (total === 0) return [];

  return [...revenue.entries()]
    .map(([catId, rev]) => ({
      name: categoryName.get(catId) ?? 'Otros',
      value: Math.round((rev / total) * 100),
    }))
    .sort((a, b) => b.value - a.value);
}

// ---------- Resumen para tarjetas ----------

export interface SalesSummary {
  confirmedRevenue: number;
  confirmedOrders: number;
  avgTicket: number;
  customersCount: number;
}

export function salesSummary(orders: Order[], customersCount: number): SalesSummary {
  const confirmed = orders.filter(isConfirmed);
  const revenue = confirmed.reduce((s, o) => s + o.total, 0);
  return {
    confirmedRevenue: revenue,
    confirmedOrders: confirmed.length,
    avgTicket: confirmed.length ? revenue / confirmed.length : 0,
    customersCount,
  };
}
