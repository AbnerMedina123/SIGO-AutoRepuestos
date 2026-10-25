// Tipos de la base de datos de Supabase.
// Reflejan el esquema definido en supabase/schema.sql.
// Si cambias el esquema, actualiza estos tipos (o regenéralos con
// `supabase gen types --linked`).

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: { id: string; email: string; created_at: string };
        Insert: { id: string; email: string; created_at?: string };
        Update: { id?: string; email?: string; created_at?: string };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          image: string;
          count: number;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          description?: string;
          icon?: string;
          image?: string;
          count?: number;
          active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          brand: string;
          category: string | null;
          code: string;
          part_number: string;
          price: number;
          sale_price: number | null;
          stock: number;
          min_stock: number;
          compatibility: string[];
          description: string;
          specs: Json;
          warranty: string;
          status: string;
          image: string;
          images: string[];
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          brand?: string;
          category?: string | null;
          code?: string;
          part_number?: string;
          price?: number;
          sale_price?: number | null;
          stock?: number;
          min_stock?: number;
          compatibility?: string[];
          description?: string;
          specs?: Json;
          warranty?: string;
          status?: string;
          image?: string;
          images?: string[];
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
        Relationships: [];
      };
      customers: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          orders: number;
          total_purchases: number;
          status: string;
          registered_at: string;
          created_at: string;
        };
        Insert: {
          id: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          orders?: number;
          total_purchases?: number;
          status?: string;
          registered_at?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['customers']['Insert']>;
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          customer_id: string | null;
          customer_name: string;
          date: string;
          subtotal: number;
          discount: number;
          shipping: number;
          total: number;
          payment_method: string;
          delivery_method: string;
          status: string;
          address: string;
          created_at: string;
        };
        Insert: {
          id: string;
          customer_id?: string | null;
          customer_name?: string;
          date?: string;
          subtotal?: number;
          discount?: number;
          shipping?: number;
          total?: number;
          payment_method?: string;
          delivery_method?: string;
          status?: string;
          address?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
        Relationships: [];
      };
      order_items: {
        Row: {
          id: number;
          order_id: string;
          product_id: string | null;
          product_name: string;
          product_code: string;
          quantity: number;
          unit_price: number;
          image: string;
        };
        Insert: {
          id?: number;
          order_id: string;
          product_id?: string | null;
          product_name?: string;
          product_code?: string;
          quantity?: number;
          unit_price?: number;
          image?: string;
        };
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
