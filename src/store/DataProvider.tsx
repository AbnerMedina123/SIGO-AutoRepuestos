import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Product, Category, Order, Customer } from '../data/mockData';
import {
  fetchProducts,
  fetchCategories,
  fetchOrders,
  fetchCustomers,
  createProduct as apiCreateProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
  updateProductStock as apiUpdateStock,
  updateOrderStatus as apiUpdateOrderStatus,
  updateCustomerStatus as apiUpdateCustomerStatus,
  upsertCategory as apiUpsertCategory,
  deleteCategory as apiDeleteCategory,
  type ProductInput,
} from '../lib/api';
import { isCurrentUserAdmin } from '../lib/auth';

interface DataState {
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  loading: boolean;
  error: string | null;

  /** Recarga catálogo (productos + categorías). */
  reloadCatalog: () => Promise<void>;
  /** Recarga los datos del panel admin (pedidos + clientes), si hay sesión admin. */
  reloadAdminData: () => Promise<void>;

  createProduct: (input: ProductInput) => Promise<void>;
  updateProduct: (id: string, input: ProductInput) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateStock: (id: string, stock: number) => Promise<void>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  updateCustomerStatus: (id: string, status: string) => Promise<void>;
  saveCategory: (category: Category) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
}

const DataContext = createContext<DataState | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reloadCatalog = useCallback(async () => {
    const [prods, cats] = await Promise.all([fetchProducts(), fetchCategories()]);
    setProducts(prods);
    setCategories(cats);
  }, []);

  const reloadAdminData = useCallback(async () => {
    // Estas tablas solo son legibles por un admin (según RLS). Si no hay sesión
    // admin, las consultas devolverán vacío, lo cual es correcto.
    const admin = await isCurrentUserAdmin();
    if (!admin) {
      setOrders([]);
      setCustomers([]);
      return;
    }
    const [ords, custs] = await Promise.all([fetchOrders(), fetchCustomers()]);
    setOrders(ords);
    setCustomers(custs);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        await reloadCatalog();
        if (active) await reloadAdminData();
      } catch (e) {
        if (active) {
          console.error(e);
          setError(
            'No se pudieron cargar los datos. Verifica tu conexión e inténtalo de nuevo.',
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [reloadCatalog, reloadAdminData]);

  const createProduct = useCallback(
    async (input: ProductInput) => {
      await apiCreateProduct(input);
      await reloadCatalog();
    },
    [reloadCatalog],
  );

  const updateProduct = useCallback(
    async (id: string, input: ProductInput) => {
      await apiUpdateProduct(id, input);
      await reloadCatalog();
    },
    [reloadCatalog],
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      await apiDeleteProduct(id);
      await reloadCatalog();
    },
    [reloadCatalog],
  );

  const updateStock = useCallback(
    async (id: string, stock: number) => {
      await apiUpdateStock(id, stock);
      await reloadCatalog();
    },
    [reloadCatalog],
  );

  const updateOrderStatus = useCallback(
    async (id: string, status: string) => {
      await apiUpdateOrderStatus(id, status);
      await reloadAdminData();
    },
    [reloadAdminData],
  );

  const updateCustomerStatus = useCallback(
    async (id: string, status: string) => {
      await apiUpdateCustomerStatus(id, status);
      await reloadAdminData();
    },
    [reloadAdminData],
  );

  const saveCategory = useCallback(
    async (category: Category) => {
      await apiUpsertCategory(category);
      await reloadCatalog();
    },
    [reloadCatalog],
  );

  const removeCategory = useCallback(
    async (id: string) => {
      await apiDeleteCategory(id);
      await reloadCatalog();
    },
    [reloadCatalog],
  );

  const value: DataState = {
    products,
    categories,
    orders,
    customers,
    loading,
    error,
    reloadCatalog,
    reloadAdminData,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    updateOrderStatus,
    updateCustomerStatus,
    saveCategory,
    removeCategory,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData debe usarse dentro de <DataProvider>');
  return ctx;
}
