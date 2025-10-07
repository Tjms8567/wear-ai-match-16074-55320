-- ============================================
-- WearMatch AI Database Schema
-- Run this in Cloud → Database → SQL Editor
-- ============================================

-- Create custom types
create type public.product_type as enum (
  'Crop Top', 'Hoodie', 'Kids Hoodie', 'Kids Long Sleeve',
  'Kids T-Shirt', 'Long Sleeve', 'Socks', 'Sweatshirt',
  'T-Shirt', 'Tank Top'
);

create type public.product_gender as enum ('Unisex', 'Kids', 'Mens');
create type public.product_size as enum ('XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL');
create type public.order_status as enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
create type public.app_role as enum ('admin', 'customer');

-- ============================================
-- PRODUCTS & INVENTORY
-- ============================================

create table public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  product_type product_type not null,
  gender product_gender not null default 'Unisex',
  base_price decimal(10, 2) not null,
  images text[] default array[]::text[],
  svg_design_url text,
  ai_tags text[] default array[]::text[],
  featured boolean default false,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade not null,
  size product_size not null,
  color_name text not null,
  color_hex text not null,
  stock_quantity integer default 0,
  sku text unique,
  created_at timestamptz default now()
);

create table public.color_palettes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  hex_code text not null,
  rgb_values jsonb not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ============================================
-- SNEAKERS & AI MATCHING
-- ============================================

create table public.sneakers (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  model text not null,
  colorway text not null,
  price decimal(10, 2) not null,
  release_year integer,
  image_url text not null,
  primary_color text not null,
  secondary_color text,
  accent_color text,
  styles text[] default array[]::text[],
  featured boolean default false,
  created_at timestamptz default now()
);

create table public.ai_matches (
  id uuid primary key default gen_random_uuid(),
  sneaker_id uuid references public.sneakers(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  match_score decimal(5, 2) not null,
  color_score decimal(5, 2) not null,
  style_score decimal(5, 2) not null,
  created_at timestamptz default now()
);

-- ============================================
-- USER MANAGEMENT
-- ============================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  role app_role not null default 'customer',
  unique (user_id, role)
);

-- ============================================
-- ORDERS & CART
-- ============================================

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  total_amount decimal(10, 2) not null,
  status order_status default 'pending',
  payment_method text,
  shipping_address jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete restrict not null,
  variant_id uuid references public.product_variants(id) on delete restrict not null,
  quantity integer not null check (quantity > 0),
  unit_price decimal(10, 2) not null,
  custom_svg_url text,
  created_at timestamptz default now()
);

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  variant_id uuid references public.product_variants(id) on delete cascade not null,
  quantity integer not null check (quantity > 0),
  custom_svg_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, variant_id)
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.color_palettes enable row level security;
alter table public.sneakers enable row level security;
alter table public.ai_matches enable row level security;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.cart_items enable row level security;

-- Security definer function for role checks
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- Public read policies
create policy "Products viewable by everyone" on public.products for select using (active = true);
create policy "Variants viewable by everyone" on public.product_variants for select using (true);
create policy "Colors viewable by everyone" on public.color_palettes for select using (is_active = true);
create policy "Sneakers viewable by everyone" on public.sneakers for select using (true);
create policy "AI matches viewable by everyone" on public.ai_matches for select using (true);

-- User policies
create policy "Users view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users view own roles" on public.user_roles for select using (auth.uid() = user_id);

-- Order policies
create policy "Users view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users create own orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "Users view own order items" on public.order_items for select using (
  exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);

-- Cart policies
create policy "Users manage own cart" on public.cart_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Admin policies
create policy "Admins manage products" on public.products for all using (public.has_role(auth.uid(), 'admin'));
create policy "Admins manage variants" on public.product_variants for all using (public.has_role(auth.uid(), 'admin'));
create policy "Admins manage sneakers" on public.sneakers for all using (public.has_role(auth.uid(), 'admin'));
create policy "Admins manage colors" on public.color_palettes for all using (public.has_role(auth.uid(), 'admin'));
create policy "Admins manage AI matches" on public.ai_matches for all using (public.has_role(auth.uid(), 'admin'));
create policy "Admins view all orders" on public.orders for select using (public.has_role(auth.uid(), 'admin'));
create policy "Admins update orders" on public.orders for update using (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- TRIGGERS & FUNCTIONS
-- ============================================

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  
  insert into public.user_roles (user_id, role)
  values (new.id, 'customer');
  
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- INDEXES
-- ============================================

create index idx_products_featured on public.products(featured) where featured = true;
create index idx_products_type on public.products(product_type);
create index idx_product_variants_product on public.product_variants(product_id);
create index idx_sneakers_brand on public.sneakers(brand);
create index idx_ai_matches_sneaker on public.ai_matches(sneaker_id);
create index idx_ai_matches_product on public.ai_matches(product_id);
create index idx_orders_user on public.orders(user_id);
create index idx_order_items_order on public.order_items(order_id);
create index idx_cart_items_user on public.cart_items(user_id);

-- ============================================
-- SEED DATA
-- ============================================

insert into public.color_palettes (name, hex_code, rgb_values) values
  ('Black', '#000000', '{"r": 0, "g": 0, "b": 0}'),
  ('White', '#FFFFFF', '{"r": 255, "g": 255, "b": 255}'),
  ('Red', '#FF0000', '{"r": 255, "g": 0, "b": 0}'),
  ('Blue', '#0000FF', '{"r": 0, "g": 0, "b": 255}'),
  ('Green', '#00FF00', '{"r": 0, "g": 255, "b": 0}'),
  ('Yellow', '#FFFF00', '{"r": 255, "g": 255, "b": 0}'),
  ('Purple', '#800080', '{"r": 128, "g": 0, "b": 128}'),
  ('Orange', '#FFA500', '{"r": 255, "g": 165, "b": 0}'),
  ('Pink', '#FFC0CB', '{"r": 255, "g": 192, "b": 203}'),
  ('Gray', '#808080', '{"r": 128, "g": 128, "b": 128}'),
  ('Navy', '#000080', '{"r": 0, "g": 0, "b": 128}'),
  ('Teal', '#008080', '{"r": 0, "g": 128, "b": 128}');

insert into public.sneakers (brand, model, colorway, price, release_year, image_url, primary_color, secondary_color, accent_color, styles, featured) values
  ('Nike', 'Air Jordan 1', 'Chicago', 170.00, 2015, 'https://images.unsplash.com/photo-1556906781-9a412961c28c', 'Red', 'White', 'Black', array['classic', 'sporty', 'streetwear'], true),
  ('Nike', 'Air Force 1', 'Triple White', 110.00, 2007, 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519', 'White', 'White', 'White', array['classic', 'casual', 'minimalist'], true),
  ('Adidas', 'Yeezy Boost 350', 'Zebra', 220.00, 2017, 'https://images.unsplash.com/photo-1543508282-6319a3e2621f', 'White', 'Black', 'Red', array['modern', 'sporty', 'streetwear'], true),
  ('New Balance', '550', 'White Navy', 120.00, 2021, 'https://images.unsplash.com/photo-1605733513597-f73d89860f5a', 'White', 'Navy', 'Gray', array['retro', 'casual', 'minimalist'], true),
  ('Nike', 'Dunk Low', 'Panda', 110.00, 2021, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', 'Black', 'White', 'Black', array['classic', 'casual', 'streetwear'], true),
  ('Adidas', 'Samba', 'Black White', 100.00, 2023, 'https://images.unsplash.com/photo-1514989940723-e8e51635b782', 'Black', 'White', 'Gold', array['retro', 'casual', 'classic'], true);

insert into public.products (title, description, product_type, gender, base_price, images, ai_tags, featured, active) values
  ('Classic Crew Neck T-Shirt', 'Premium cotton t-shirt perfect for everyday wear', 'T-Shirt', 'Unisex', 29.99, array['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'], array['casual', 'minimalist', 'classic'], true, true),
  ('Streetwear Hoodie', 'Comfortable pullover hoodie with modern fit', 'Hoodie', 'Unisex', 59.99, array['https://images.unsplash.com/photo-1556821840-3a63f95609a7'], array['streetwear', 'sporty', 'modern'], true, true),
  ('Vintage Long Sleeve', 'Retro-inspired long sleeve tee', 'Long Sleeve', 'Unisex', 39.99, array['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633'], array['retro', 'casual', 'classic'], true, true),
  ('Crop Top', 'Modern crop top with premium fabric', 'Crop Top', 'Unisex', 34.99, array['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a'], array['modern', 'sporty', 'streetwear'], false, true),
  ('Kids Cotton T-Shirt', 'Soft and comfortable tee for kids', 'Kids T-Shirt', 'Kids', 24.99, array['https://images.unsplash.com/photo-1622445275463-afa2ab738c34'], array['casual', 'classic', 'minimalist'], false, true);

-- Add product variants
do $$
declare
  v_product_id uuid;
begin
  -- T-Shirt variants
  select id into v_product_id from public.products where title = 'Classic Crew Neck T-Shirt';
  insert into public.product_variants (product_id, size, color_name, color_hex, stock_quantity, sku) values
    (v_product_id, 'S', 'Black', '#000000', 50, 'TSH-BLK-S'),
    (v_product_id, 'M', 'Black', '#000000', 75, 'TSH-BLK-M'),
    (v_product_id, 'L', 'Black', '#000000', 60, 'TSH-BLK-L'),
    (v_product_id, 'S', 'White', '#FFFFFF', 45, 'TSH-WHT-S'),
    (v_product_id, 'M', 'White', '#FFFFFF', 80, 'TSH-WHT-M'),
    (v_product_id, 'L', 'White', '#FFFFFF', 55, 'TSH-WHT-L');

  -- Hoodie variants
  select id into v_product_id from public.products where title = 'Streetwear Hoodie';
  insert into public.product_variants (product_id, size, color_name, color_hex, stock_quantity, sku) values
    (v_product_id, 'M', 'Black', '#000000', 40, 'HOD-BLK-M'),
    (v_product_id, 'L', 'Black', '#000000', 35, 'HOD-BLK-L'),
    (v_product_id, 'XL', 'Black', '#000000', 30, 'HOD-BLK-XL'),
    (v_product_id, 'M', 'Gray', '#808080', 42, 'HOD-GRY-M'),
    (v_product_id, 'L', 'Gray', '#808080', 38, 'HOD-GRY-L');

  -- Long Sleeve variants
  select id into v_product_id from public.products where title = 'Vintage Long Sleeve';
  insert into public.product_variants (product_id, size, color_name, color_hex, stock_quantity, sku) values
    (v_product_id, 'S', 'Navy', '#000080', 30, 'LSV-NVY-S'),
    (v_product_id, 'M', 'Navy', '#000080', 45, 'LSV-NVY-M'),
    (v_product_id, 'L', 'Navy', '#000080', 40, 'LSV-NVY-L');
end $$;
