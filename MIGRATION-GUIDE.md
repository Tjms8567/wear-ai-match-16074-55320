# Database Migration Guide

## Overview
This guide helps you set up the complete WearMatch AI database with all necessary tables, policies, functions, and seed data.

## Prerequisites
- Lovable Cloud enabled
- Access to Cloud → Database → SQL Editor

## Migration Files (Run in Order)

### 1. Initial Setup (`20240101000000_initial_setup.sql`)
Creates all database tables:
- Products and variants
- Sneakers and AI matches
- User profiles and roles
- Orders and cart
- Indexes for performance

**Run this first!**

### 2. RLS Policies (`20240101000001_rls_policies.sql`)
Sets up Row Level Security:
- Public read access for products/sneakers
- User-specific access for orders/cart
- Admin-only access for management
- Security definer function for role checks

**Run second**

### 3. Triggers & Functions (`20240101000002_triggers_functions.sql`)
Implements automation:
- Auto-create profile on user signup
- Auto-assign customer role
- Update timestamps automatically
- Update stock after orders

**Run third**

### 4. Storage Buckets (`20240101000003_storage_buckets.sql`)
Creates file storage:
- product-images (public)
- sneaker-images (public)
- svg-designs (public)
- user-avatars (private per user)

**Run fourth**

### 5. Seed Data (`20240101000004_seed_data.sql`)
Populates initial data:
- 12 color palettes
- 6 featured sneakers
- 5 products with variants
- Stock quantities

**Run last**

## Quick Start (All-in-One)

If you prefer, you can run the consolidated `database-setup.sql` file which includes all migrations in the correct order.

## Edge Functions

### AI Match Function (`supabase/functions/ai-match`)
- **Purpose**: Match sneakers with clothing based on color and style
- **Endpoint**: `/functions/v1/ai-match`
- **Auth**: Public (no JWT required)
- **Payload**:
```json
{
  "sneakerImage": "base64_or_url",
  "preferences": {
    "style": ["casual", "sporty"]
  }
}
```

### Create Checkout Function (`supabase/functions/create-checkout`)
- **Purpose**: Process cart checkout and create orders
- **Endpoint**: `/functions/v1/create-checkout`
- **Auth**: Required (JWT token)
- **Payload**:
```json
{
  "cartItems": [...],
  "shippingAddress": {
    "name": "John Doe",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001"
  }
}
```

## Verification Queries

After running migrations, verify your setup:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check seed data
SELECT COUNT(*) as product_count FROM products;
SELECT COUNT(*) as sneaker_count FROM sneakers;
SELECT COUNT(*) as variant_count FROM product_variants;
SELECT COUNT(*) as color_count FROM color_palettes;

-- Check storage buckets
SELECT id, name, public 
FROM storage.buckets;
```

## Troubleshooting

### "relation already exists"
- Some tables may already exist from previous runs
- This is safe to ignore - migrations use `ON CONFLICT DO NOTHING` where possible

### "permission denied"
- Make sure you're using the SQL Editor in Cloud (not a regular client)
- Cloud SQL Editor runs with elevated permissions

### "function does not exist"
- Run the migrations in order
- The `has_role` function must be created before RLS policies

### No seed data showing
- Check if you ran `20240101000004_seed_data.sql`
- Verify products are active: `SELECT * FROM products WHERE active = true;`

## Post-Migration Steps

1. **Create Admin Account**:
   - Sign up at `/auth` with `admin@app.com`
   - Run `admin-setup.sql` to assign admin role

2. **Test Data Access**:
   - Browse `/products` to see seeded products
   - Check `/ai-match` for AI matching interface
   - Verify cart functionality

3. **Configure Storage** (Optional):
   - Go to Cloud → Storage
   - Upload sample product images
   - Update product `images` array with storage URLs

4. **Enable Payments** (Optional):
   - Use Lovable's Stripe integration
   - Configure payment methods
   - Test checkout flow

## Additional Resources

- [Cloud Documentation](https://docs.lovable.dev/features/cloud)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Edge Functions](https://supabase.com/docs/guides/functions)
