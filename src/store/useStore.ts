import { useState, createContext, useContext } from 'react';
import type { Product } from '../data/mockData';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreState {
  cartItems: CartItem[];
  isLoggedIn: boolean;
  isAdmin: boolean;
  user: { name: string; email: string } | null;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  login: (email: string, isAdmin?: boolean) => void;
  logout: () => void;
}

import React from 'react';

const StoreContext = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const addToCart = (product: Product, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty < 1) { removeFromCart(productId); return; }
    setCartItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setCartItems([]);

  const login = (email: string, admin = false) => {
    setIsLoggedIn(true);
    setIsAdmin(admin);
    setUser({ name: admin ? 'Administrador SIGO' : email.split('@')[0], email });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);
  };

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cartItems.reduce((s, i) => s + (i.product.salePrice ?? i.product.price) * i.quantity, 0);

  return React.createElement(StoreContext.Provider, {
    value: { cartItems, isLoggedIn, isAdmin, user, addToCart, removeFromCart, updateQty, clearCart, cartTotal, cartCount, login, logout }
  }, children);
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be inside StoreProvider');
  return ctx;
}
