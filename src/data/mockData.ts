// Definiciones de tipos compartidos de la aplicación.
//
// Nota: este archivo antes contenía datos de ejemplo ("mock"), pero el sistema
// ahora usa datos reales desde Supabase. Se conservan únicamente los tipos,
// que se importan en toda la app. El nombre del archivo se mantiene para no
// tener que actualizar todas las rutas de importación existentes.

export type ProductStatus = "NEW" | "SALE" | "POPULAR" | "LOW_STOCK" | "OUT_OF_STOCK" | "ACTIVE"
export type OrderStatus = "Pending" | "Confirmed" | "Preparing" | "Shipped" | "Delivered" | "Cancelled"
export type StockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK"

export interface Product {
  id: string
  name: string
  brand: string
  category: string
  code: string
  partNumber: string
  price: number
  salePrice?: number
  stock: number
  minStock: number
  compatibility: string[]
  description: string
  specs: Record<string, string>
  warranty: string
  status: ProductStatus
  image: string
  images: string[]
  active: boolean
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  image: string
  count: number
  active?: boolean
}

export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  orders: number
  totalPurchases: number
  registeredAt: string
  status: "active" | "inactive"
}

export interface OrderItem {
  productId: string
  productName: string
  productCode: string
  quantity: number
  unitPrice: number
  image: string
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  date: string
  items: OrderItem[]
  subtotal: number
  discount: number
  shipping: number
  total: number
  paymentMethod: string
  deliveryMethod: string
  status: OrderStatus
  address: string
}
