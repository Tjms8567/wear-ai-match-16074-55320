// WearMatch AI Database Types
// These types match the new database schema

export type ProductType = 
  | 'Crop Top' 
  | 'Hoodie' 
  | "Kid's Hoodie" 
  | "Kid's Long Sleeve"
  | "Kid's T-Shirt" 
  | 'Long Sleeve' 
  | 'Socks' 
  | 'Sweatshirt'
  | 'T-Shirt' 
  | 'Tank Top';

export type ProductGender = 'unisex' | 'mens' | 'kids';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL' | '4XL' | '5XL';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Product {
  id: string;
  title: string;
  product_type: ProductType;
  gender: ProductGender;
  base_price: number;
  description: string | null;
  images: string[];
  svg_designs: string[];
  ai_tags: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: ProductSize;
  color_name: string;
  color_hex: string;
  stock: number;
  price_adjustment: number;
  sku: string | null;
  created_at: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  hex_code: string;
  rgb_values: string | null;
  category: string | null;
  created_at: string;
}

export interface Sneaker {
  id: string;
  brand: string;
  model: string;
  colorway: string | null;
  dominant_colors: string[];
  style_tags: string[];
  image_url: string | null;
  release_year: number | null;
  featured: boolean;
  created_at: string;
}

export interface AIMatch {
  id: string;
  sneaker_id: string;
  product_id: string;
  match_score: number;
  color_score: number;
  style_score: number;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  shipping_address: any;
  payment_method: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  price_at_purchase: number;
  custom_svg: string | null;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  custom_svg: string | null;
  created_at: string;
  updated_at: string;
}

// Extended types with relations
export interface CartItemWithDetails extends CartItem {
  product: Product;
  variant: ProductVariant;
}
